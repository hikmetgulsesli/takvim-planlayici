import type { ReactNode } from 'react';
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { CalendarEvent } from '../types/event';
import { eventReducer, initialEventState, type EventAction } from './eventReducer';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { createEvent as createEventHelper, updateEvent as updateEventHelper } from '../utils/eventHelpers';
import type { EventColor, ReminderType } from '../types/event';

interface EventContextType {
  events: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
  dispatch: React.Dispatch<EventAction>;
  createEvent: (
    title: string,
    startDate: Date,
    endDate: Date,
    options?: {
      description?: string;
      allDay?: boolean;
      color?: EventColor;
      reminder?: ReminderType;
      location?: string;
    }
  ) => void;
  updateEvent: (id: string, updates: Partial<Omit<CalendarEvent, 'id' | 'createdAt'>>) => void;
  deleteEvent: (id: string) => void;
  getEventById: (id: string) => CalendarEvent | undefined;
  getEventsByDateRange: (start: Date, end: Date) => CalendarEvent[];
}

const EventContext = createContext<EventContextType | null>(null);

const STORAGE_KEY = 'takvim-planlayici-events';

interface EventProviderProps {
  children: ReactNode;
}

export function EventProvider({ children }: EventProviderProps) {
  const [state, dispatch] = useReducer(eventReducer, initialEventState);
  const { value: storedEvents, setValue: setStoredEvents, isLoading: storageLoading, error: storageError } = 
    useLocalStorage<CalendarEvent[]>(STORAGE_KEY, []);

  // Sync stored events to state when loaded
  useEffect(() => {
    if (!storageLoading && storedEvents.length > 0 && state.events.length === 0) {
      // Parse dates back from JSON
      const parsedEvents = storedEvents.map((event) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
      }));
      dispatch({ type: 'SET_EVENTS', payload: parsedEvents });
    }
  }, [storageLoading, storedEvents, state.events.length]);

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (!storageLoading && state.events.length > 0) {
      setStoredEvents(state.events);
    }
  }, [state.events, storageLoading, setStoredEvents]);

  const createEvent = useCallback((
    title: string,
    startDate: Date,
    endDate: Date,
    options?: {
      description?: string;
      allDay?: boolean;
      color?: EventColor;
      reminder?: ReminderType;
      location?: string;
    }
  ) => {
    const newEvent = createEventHelper(title, startDate, endDate, options);
    dispatch({ type: 'ADD_EVENT', payload: newEvent });
  }, []);

  const updateEvent = useCallback((
    id: string,
    updates: Partial<Omit<CalendarEvent, 'id' | 'createdAt'>>
  ) => {
    const event = state.events.find((e) => e.id === id);
    if (event) {
      const updatedEvent = updateEventHelper(event, updates);
      dispatch({ type: 'UPDATE_EVENT', payload: updatedEvent });
    }
  }, [state.events]);

  const deleteEvent = useCallback((id: string) => {
    dispatch({ type: 'DELETE_EVENT', payload: id });
  }, []);

  const getEventById = useCallback((id: string) => {
    return state.events.find((event) => event.id === id);
  }, [state.events]);

  const getEventsByDateRange = useCallback((start: Date, end: Date) => {
    return state.events.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return eventStart <= end && eventEnd >= start;
    });
  }, [state.events]);

  const value: EventContextType = {
    events: state.events,
    isLoading: storageLoading,
    error: storageError,
    dispatch,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getEventsByDateRange,
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
