import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { CalendarEvent, EventFormData } from '../types';

interface EventContextType {
  events: CalendarEvent[];
  createEvent: (data: EventFormData) => CalendarEvent;
  updateEvent: (id: string, data: Partial<EventFormData>) => void;
  deleteEvent: (id: string) => void;
  getEventsByDate: (date: string) => CalendarEvent[];
  invalidateNotifications: (eventId: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const STORAGE_KEY = 'takvim-events';
const NOTIFICATION_KEY = 'takvim-notifications';

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  // Persist events to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const invalidateNotifications = useCallback((eventId: string) => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(NOTIFICATION_KEY);
      if (stored) {
        const notifications = JSON.parse(stored);
        delete notifications[eventId];
        localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(notifications));
      }
    } catch {
      // Ignore storage errors to keep the UI responsive
    }
  }, []);

  const createEvent = useCallback((data: EventFormData): CalendarEvent => {
    const newEvent: CalendarEvent = {
      id: crypto.randomUUID(),
      ...data,
    };
    setEvents((prev) => [...prev, newEvent]);
    return newEvent;
  }, []);

  const updateEvent = useCallback((id: string, data: Partial<EventFormData>) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id === id) {
          const updated = { ...event, ...data };
          // Invalidate notifications if time-related fields changed
          if (data.date !== undefined || data.startTime !== undefined || data.endTime !== undefined) {
            invalidateNotifications(id);
          }
          return updated;
        }
        return event;
      })
    );
  }, [invalidateNotifications]);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
    invalidateNotifications(id);
  }, [invalidateNotifications]);

  const getEventsByDate = useCallback((date: string) => {
    return events.filter((event) => event.date === date);
  }, [events]);

  return (
    <EventContext.Provider
      value={{ events, createEvent, updateEvent, deleteEvent, getEventsByDate, invalidateNotifications }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
