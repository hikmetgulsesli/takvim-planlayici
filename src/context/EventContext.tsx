import React, { createContext, useContext, useState, useCallback } from 'react';
import type { CalendarEvent, EventFormData } from '../types';

interface EventContextType {
  events: CalendarEvent[];
  createEvent: (data: EventFormData) => CalendarEvent;
  updateEvent: (id: string, data: Partial<EventFormData>) => void;
  deleteEvent: (id: string) => void;
  getEventsByDate: (date: string) => CalendarEvent[];
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

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
      prev.map((event) =>
        event.id === id ? { ...event, ...data } : event
      )
    );
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  }, []);

  const getEventsByDate = useCallback((date: string) => {
    return events.filter((event) => event.date === date);
  }, [events]);

  return (
    <EventContext.Provider
      value={{ events, createEvent, updateEvent, deleteEvent, getEventsByDate }}
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
