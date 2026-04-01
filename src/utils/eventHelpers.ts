import type { CalendarEvent, EventColor, ReminderType } from '../types/event';

// Generate a UUID v4
export function generateUUID(): string {
  return crypto.randomUUID();
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

    let invalidCount = 0;

    const importedEvents: CalendarEvent[] = parsed.reduce(
      (acc: CalendarEvent[], item: Record<string, unknown>) => {
        const startDate = new Date(item.startDate as string);
        const endDate = new Date(item.endDate as string);

        // Validate required date fields: startDate and endDate must be parseable
        if (
          !item.startDate ||
          !item.endDate ||
          isNaN(startDate.getTime()) ||
          isNaN(endDate.getTime())
        ) {
          invalidCount += 1;
          return acc;
        }

        const rawCreatedAt = item.createdAt ? new Date(item.createdAt as string) : new Date();
        const createdAt = isNaN(rawCreatedAt.getTime()) ? new Date() : rawCreatedAt;

        acc.push({
          id: (item.id as string) ?? generateUUID(),
          title: (item.title as string) ?? 'İsimsiz Etkinlik',
          description: (item.description as string) ?? '',
          startDate,
          endDate,
          allDay: (item.allDay as boolean) ?? false,
          color: (item.color as CalendarEvent['color']) ?? 'blue',
          reminder: (item.reminder as CalendarEvent['reminder']) ?? 'none',
          location: (item.location as string) ?? '',
          createdAt,
          updatedAt: new Date(item.updatedAt as string | number ?? Date.now()),
        });

        return acc;
      },
      [] as CalendarEvent[]
    );

    const error =
      invalidCount > 0
        ? `${invalidCount} geçersiz etkinlik içe aktarılamadı (geçersiz başlangıç/bitiş tarihi).`
        : null;

    return { events: importedEvents, error };
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
