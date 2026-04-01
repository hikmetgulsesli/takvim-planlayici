import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Event } from '../types';

interface EventContextType {
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  getEventsByDate: (date: string) => Event[];
  getEventsByMonth: (year: number, month: number) => Event[];
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const STORAGE_KEY = 'chronos_events';

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveEvents = useCallback((newEvents: Event[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
    } catch {
      // Storage error
    }
  }, []);

  const addEvent = useCallback((event: Event) => {
    setEvents((prev) => {
      const newEvents = [...prev, event];
      saveEvents(newEvents);
      return newEvents;
    });
  }, [saveEvents]);

  const updateEvent = useCallback((event: Event) => {
    setEvents((prev) => {
      const newEvents = prev.map((e) => (e.id === event.id ? event : e));
      saveEvents(newEvents);
      return newEvents;
    });
  }, [saveEvents]);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => {
      const newEvents = prev.filter((e) => e.id !== id);
      saveEvents(newEvents);
      return newEvents;
    });
  }, [saveEvents]);

  const getEventsByDate = useCallback((date: string): Event[] => {
    return events.filter((e) => e.date === date);
  }, [events]);

  const getEventsByMonth = useCallback((year: number, month: number): Event[] => {
    return events.filter((e) => {
      const eventDate = new Date(e.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  }, [events]);

  return (
    <EventContext.Provider
      value={{ events, addEvent, updateEvent, deleteEvent, getEventsByDate, getEventsByMonth }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEventContext() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within EventProvider');
  }
  return context;
}
