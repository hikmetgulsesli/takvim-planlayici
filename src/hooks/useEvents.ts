import { useCallback } from 'react';
import type { Event } from '../types';

const STORAGE_KEY = 'chronos_events';

export function useEvents() {
  const getEvents = useCallback((): Event[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  const saveEvents = useCallback((events: Event[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (error) {
      console.error('Failed to save events to localStorage:', error);
    }
  }, []);

  const addEvent = useCallback((event: Event) => {
    const events = getEvents();
    events.push(event);
    saveEvents(events);
  }, [getEvents, saveEvents]);

  const importEvents = useCallback((newEvents: Event[]): number => {
    const existing = getEvents();
    const existingIds = new Set(existing.map(e => e.id));
    const uniqueNewEvents = newEvents.filter(e => !existingIds.has(e.id));
    const merged = [...existing, ...uniqueNewEvents];
    saveEvents(merged);
    return uniqueNewEvents.length;
  }, [getEvents, saveEvents]);

  const exportEvents = useCallback((): string => {
    const events = getEvents();
    return JSON.stringify(events, null, 2);
  }, [getEvents]);

  const clearEvents = useCallback(() => {
    saveEvents([]);
  }, [saveEvents]);

  return {
    getEvents,
    saveEvents,
    addEvent,
    importEvents,
    exportEvents,
    clearEvents,
  };
}
