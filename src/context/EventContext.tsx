import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback } from 'react';
import type { CalendarEvent, EventFormData } from '../types';

interface EventContextType {
  events: CalendarEvent[];
  createEvent: (data: EventFormData) => CalendarEvent;
  updateEvent: (id: string, data: Partial<EventFormData>) => void;
  deleteEvent: (id: string) => void;
  getEventsByDate: (date: string) => CalendarEvent[];
  getEventById: (id: string) => CalendarEvent | undefined;
}

const EventContext = createContext<EventContextType | null>(null);

const STORAGE_KEY = 'takvim-events';

interface EventProviderProps {
  children: ReactNode;
}

export function EventProvider({ children }: EventProviderProps) {
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

  const createEvent = useCallback((data: EventFormData): CalendarEvent => {
    const newEvent: CalendarEvent = {
      id: crypto.randomUUID(),
      ...data,
    };
    setEvents((prev) => {
      const updated = [...prev, newEvent];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
    return newEvent;
  }, []);

  const updateEvent = useCallback((id: string, data: Partial<EventFormData>) => {
    setEvents((prev) => {
      const updated = prev.map((event) => {
        if (event.id === id) {
          return { ...event, ...data };
        }
        return event;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => {
      const updated = prev.filter((event) => event.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const getEventsByDate = useCallback((date: string) => {
    return events.filter((event) => event.date === date);
  }, [events]);

  const getEventById = useCallback((id: string) => {
    return events.find((event) => event.id === id);
  }, [events]);

  const value: EventContextType = {
    events,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsByDate,
    getEventById,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents(): EventContextType {
  const context = useContext(EventContext);
  if (context === null) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
