import { describe, it, expect } from 'vitest';
import { 
  generateUUID, 
  createEvent, 
  updateEvent, 
  exportEventsToJSON, 
  importEventsFromJSON,
  mergeEvents 
} from './eventHelpers';
import type { CalendarEvent } from '../types/event';

describe('eventHelpers', () => {
  describe('generateUUID', () => {
    it('should generate a valid UUID format', () => {
      const uuid = generateUUID();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('createEvent', () => {
    it('should create an event with required fields', () => {
      const startDate = new Date('2026-04-01T10:00:00');
      const endDate = new Date('2026-04-01T11:00:00');
      const event = createEvent('Toplantı', startDate, endDate);

      expect(event.title).toBe('Toplantı');
      expect(event.startDate).toEqual(startDate);
      expect(event.endDate).toEqual(endDate);
      expect(event.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
      expect(event.allDay).toBe(false);
      expect(event.color).toBe('blue');
      expect(event.reminder).toBe('none');
      expect(event.createdAt).toBeInstanceOf(Date);
      expect(event.updatedAt).toBeInstanceOf(Date);
    });

    it('should create an event with optional fields', () => {
      const startDate = new Date('2026-04-01T10:00:00');
      const endDate = new Date('2026-04-01T11:00:00');
      const event = createEvent('Toplantı', startDate, endDate, {
        description: 'Önemli toplantı',
        allDay: true,
        color: 'purple',
        reminder: '15min',
        location: 'İstanbul',
      });

      expect(event.description).toBe('Önemli toplantı');
      expect(event.allDay).toBe(true);
      expect(event.color).toBe('purple');
      expect(event.reminder).toBe('15min');
      expect(event.location).toBe('İstanbul');
    });

    it('should generate Date timestamps', () => {
      const startDate = new Date('2026-04-01T10:00:00');
      const endDate = new Date('2026-04-01T11:00:00');
      const event = createEvent('Toplantı', startDate, endDate);

      expect(event.createdAt).toBeInstanceOf(Date);
      expect(event.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('updateEvent', () => {
    it('should update event fields and update timestamp', () => {
      const originalDate = new Date('2026-04-01T09:00:00Z');
      const event: CalendarEvent = {
        id: 'test-id',
        title: 'Eski Başlık',
        description: 'Eski açıklama',
        startDate: new Date('2026-04-01T10:00:00'),
        endDate: new Date('2026-04-01T11:00:00'),
        allDay: false,
        color: 'blue',
        reminder: 'none',
        location: '',
        createdAt: originalDate,
        updatedAt: originalDate,
      };

      const updated = updateEvent(event, { title: 'Yeni Başlık' });

      expect(updated.title).toBe('Yeni Başlık');
      expect(updated.description).toBe('Eski açıklama');
      expect(updated.id).toBe('test-id');
      expect(updated.createdAt).toBe(originalDate);
      expect(updated.updatedAt.getTime()).toBeGreaterThan(originalDate.getTime());
    });
  });

  describe('exportEventsToJSON', () => {
    it('should export events to valid JSON string', () => {
      const events: CalendarEvent[] = [
        {
          id: 'test-1',
          title: 'Etkinlik 1',
          description: '',
          startDate: new Date('2026-04-01T10:00:00'),
          endDate: new Date('2026-04-01T11:00:00'),
          allDay: false,
          color: 'blue',
          reminder: 'none',
          location: '',
          createdAt: new Date('2026-04-01T09:00:00Z'),
          updatedAt: new Date('2026-04-01T09:00:00Z'),
        },
      ];

      const json = exportEventsToJSON(events);
      const parsed = JSON.parse(json);

      expect(parsed).toHaveLength(1);
      expect(parsed[0].title).toBe('Etkinlik 1');
    });
  });

  describe('importEventsFromJSON', () => {
    it('should import valid JSON events', () => {
      const json = JSON.stringify([
        {
          id: 'test-1',
          title: 'İçe Aktarılan Etkinlik',
          startDate: '2026-04-01T10:00:00.000Z',
          endDate: '2026-04-01T11:00:00.000Z',
          allDay: false,
          color: 'purple',
          reminder: '15min',
        },
      ]);

      const { events, error } = importEventsFromJSON(json);

      expect(error).toBeNull();
      expect(events).toHaveLength(1);
      expect(events[0]!.title).toBe('İçe Aktarılan Etkinlik');
      expect(events[0]!.startDate).toBeInstanceOf(Date);
    });

    it('should handle invalid JSON', () => {
      const { events, error } = importEventsFromJSON('invalid json');

      expect(error).toContain('JSON ayrıştırma hatası');
      expect(events).toHaveLength(0);
    });

    it('should handle non-array JSON', () => {
      const { events, error } = importEventsFromJSON('{"key": "value"}');

      expect(error).toContain('Geçersiz format');
      expect(events).toHaveLength(0);
    });
  });

  describe('mergeEvents', () => {
    it('should merge events without duplicates', () => {
      const existing: CalendarEvent[] = [
        {
          id: 'id-1',
          title: 'Mevcut Etkinlik',
          description: '',
          startDate: new Date('2026-04-01T10:00:00'),
          endDate: new Date('2026-04-01T11:00:00'),
          allDay: false,
          color: 'blue',
          reminder: 'none',
          location: '',
          createdAt: new Date('2026-04-01T09:00:00Z'),
          updatedAt: new Date('2026-04-01T09:00:00Z'),
        },
      ];

      const imported: CalendarEvent[] = [
        {
          id: 'id-2',
          title: 'Yeni Etkinlik',
          description: '',
          startDate: new Date('2026-04-02T10:00:00'),
          endDate: new Date('2026-04-02T11:00:00'),
          allDay: false,
          color: 'purple',
          reminder: 'none',
          location: '',
          createdAt: new Date('2026-04-02T09:00:00Z'),
          updatedAt: new Date('2026-04-02T09:00:00Z'),
        },
      ];

      const merged = mergeEvents(existing, imported);

      expect(merged).toHaveLength(2);
    });

    it('should prefer imported events on ID conflict', () => {
      const existing: CalendarEvent[] = [
        {
          id: 'id-1',
          title: 'Eski Başlık',
          description: '',
          startDate: new Date('2026-04-01T10:00:00'),
          endDate: new Date('2026-04-01T11:00:00'),
          allDay: false,
          color: 'blue',
          reminder: 'none',
          location: '',
          createdAt: new Date('2026-04-01T09:00:00Z'),
          updatedAt: new Date('2026-04-01T09:00:00Z'),
        },
      ];

      const imported: CalendarEvent[] = [
        {
          id: 'id-1',
          title: 'Yeni Başlık',
          description: '',
          startDate: new Date('2026-04-01T10:00:00'),
          endDate: new Date('2026-04-01T11:00:00'),
          allDay: false,
          color: 'purple',
          reminder: 'none',
          location: '',
          createdAt: new Date('2026-04-01T09:00:00Z'),
          updatedAt: new Date('2026-04-02T09:00:00Z'),
        },
      ];

      const merged = mergeEvents(existing, imported);

      expect(merged).toHaveLength(1);
      expect(merged[0]!.title).toBe('Yeni Başlık');
      expect(merged[0]!.color).toBe('purple');
    });
  });
});
