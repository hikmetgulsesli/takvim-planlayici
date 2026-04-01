import type { CalendarEvent, EventColor, ReminderType } from '../types/event';

// Generate a UUID v4
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Create a new event with generated ID and timestamps
export function createEvent(
  title: string,
  startDate: Date,
  endDate: Date,
  options: {
    description?: string;
    allDay?: boolean;
    color?: EventColor;
    reminder?: ReminderType;
    location?: string;
  } = {}
): CalendarEvent {
  const now = new Date();
  return {
    id: generateUUID(),
    title,
    description: options.description ?? '',
    startDate,
    endDate,
    allDay: options.allDay ?? false,
    color: options.color ?? 'blue',
    reminder: options.reminder ?? 'none',
    location: options.location ?? '',
    createdAt: now,
    updatedAt: now,
  };
}

// Update an existing event
export function updateEvent(
  event: CalendarEvent,
  updates: Partial<Omit<CalendarEvent, 'id' | 'createdAt'>>
): CalendarEvent {
  return {
    ...event,
    ...updates,
    updatedAt: new Date(),
  };
}

// Export events to JSON string
export function exportEventsToJSON(events: CalendarEvent[]): string {
  return JSON.stringify(events, null, 2);
}

// Import events from JSON string
export function importEventsFromJSON(
  jsonString: string
): { events: CalendarEvent[]; error: string | null } {
  try {
    const parsed = JSON.parse(jsonString);
    
    if (!Array.isArray(parsed)) {
      return { events: [], error: 'Geçersiz format: Etkinlik listesi bekleniyor' };
    }

    const importedEvents: CalendarEvent[] = parsed.map((item) => ({
      id: item.id ?? generateUUID(),
      title: item.title ?? 'İsimsiz Etkinlik',
      description: item.description ?? '',
      startDate: new Date(item.startDate),
      endDate: new Date(item.endDate),
      allDay: item.allDay ?? false,
      color: item.color ?? 'blue',
      reminder: item.reminder ?? 'none',
      location: item.location ?? '',
      createdAt: new Date(item.createdAt ?? Date.now()),
      updatedAt: new Date(),
    }));

    return { events: importedEvents, error: null };
  } catch (error) {
    return { 
      events: [], 
      error: `JSON ayrıştırma hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}` 
    };
  }
}

// Merge imported events with existing events
export function mergeEvents(
  existingEvents: CalendarEvent[],
  importedEvents: CalendarEvent[]
): CalendarEvent[] {
  const eventMap = new Map<string, CalendarEvent>();
  
  // Add existing events to map
  existingEvents.forEach((event) => {
    eventMap.set(event.id, event);
  });
  
  // Merge imported events (imported events take precedence on ID conflict)
  importedEvents.forEach((event) => {
    eventMap.set(event.id, event);
  });
  
  return Array.from(eventMap.values());
}
