import { describe, it, expect } from 'vitest';
import { eventReducer, initialEventState, type EventAction } from './eventReducer';
import type { CalendarEvent } from '../types/event';

const mockEvent: CalendarEvent = {
  id: 'test-uuid-1',
  title: 'Test Etkinlik',
  description: 'Test açıklama',
  startDate: new Date('2026-04-01T10:00:00'),
  endDate: new Date('2026-04-01T11:00:00'),
  allDay: false,
  color: 'blue',
  reminder: '15min',
  location: 'İstanbul',
  createdAt: new Date('2026-04-01T09:00:00Z'),
  updatedAt: new Date('2026-04-01T09:00:00Z'),
};

const mockEvent2: CalendarEvent = {
  id: 'test-uuid-2',
  title: 'İkinci Etkinlik',
  description: '',
  startDate: new Date('2026-04-02T14:00:00'),
  endDate: new Date('2026-04-02T15:00:00'),
  allDay: true,
  color: 'purple',
  reminder: 'none',
  location: '',
  createdAt: new Date('2026-04-01T10:00:00Z'),
  updatedAt: new Date('2026-04-01T10:00:00Z'),
};

describe('eventReducer', () => {
  it('should return initial state', () => {
    const state = eventReducer(initialEventState, { type: 'SET_EVENTS', payload: [] });
    expect(state.events).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle SET_EVENTS', () => {
    const action: EventAction = { type: 'SET_EVENTS', payload: [mockEvent, mockEvent2] };
    const state = eventReducer(initialEventState, action);
    
    expect(state.events).toHaveLength(2);
    expect(state.events[0]!.id).toBe('test-uuid-1');
    expect(state.events[1]!.id).toBe('test-uuid-2');
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle ADD_EVENT', () => {
    const state1 = eventReducer(initialEventState, { type: 'ADD_EVENT', payload: mockEvent });
    expect(state1.events).toHaveLength(1);
    expect(state1.events[0]!.id).toBe('test-uuid-1');

    const state2 = eventReducer(state1, { type: 'ADD_EVENT', payload: mockEvent2 });
    expect(state2.events).toHaveLength(2);
    expect(state2.events[1]!.id).toBe('test-uuid-2');
  });

  it('should handle UPDATE_EVENT', () => {
    const initialState = {
      ...initialEventState,
      events: [mockEvent, mockEvent2],
    };

    const updatedEvent: CalendarEvent = {
      ...mockEvent,
      title: 'Güncellenmiş Etkinlik',
      description: 'Güncellenmiş açıklama',
    };

    const action: EventAction = { type: 'UPDATE_EVENT', payload: updatedEvent };
    const state = eventReducer(initialState, action);

    expect(state.events).toHaveLength(2);
    expect(state.events[0]!.title).toBe('Güncellenmiş Etkinlik');
    expect(state.events[0]!.description).toBe('Güncellenmiş açıklama');
    expect(state.events[1]).toEqual(mockEvent2);
  });

  it('should not change events when UPDATE_EVENT has non-existent id', () => {
    const initialState = {
      ...initialEventState,
      events: [mockEvent],
    };

    const nonExistentEvent: CalendarEvent = {
      ...mockEvent,
      id: 'non-existent-id',
      title: 'Olmayan Etkinlik',
    };

    const action: EventAction = { type: 'UPDATE_EVENT', payload: nonExistentEvent };
    const state = eventReducer(initialState, action);

    expect(state.events).toHaveLength(1);
    expect(state.events[0]!.title).toBe('Test Etkinlik');
  });

  it('should handle DELETE_EVENT', () => {
    const initialState = {
      ...initialEventState,
      events: [mockEvent, mockEvent2],
    };

    const action: EventAction = { type: 'DELETE_EVENT', payload: 'test-uuid-1' };
    const state = eventReducer(initialState, action);

    expect(state.events).toHaveLength(1);
    expect(state.events[0]!.id).toBe('test-uuid-2');
  });

  it('should not change events when DELETE_EVENT has non-existent id', () => {
    const initialState = {
      ...initialEventState,
      events: [mockEvent],
    };

    const action: EventAction = { type: 'DELETE_EVENT', payload: 'non-existent-id' };
    const state = eventReducer(initialState, action);

    expect(state.events).toHaveLength(1);
    expect(state.events[0]!.id).toBe('test-uuid-1');
  });

  it('should handle CLEAR_EVENTS', () => {
    const initialState = {
      ...initialEventState,
      events: [mockEvent, mockEvent2],
    };

    const action: EventAction = { type: 'CLEAR_EVENTS' };
    const state = eventReducer(initialState, action);

    expect(state.events).toHaveLength(0);
    expect(state.error).toBeNull();
  });

  it('should return same state for unknown action types', () => {
    const initialState = {
      ...initialEventState,
      events: [mockEvent],
    };

    // @ts-expect-error Testing unknown action type
    const state = eventReducer(initialState, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual(initialState);
  });
});
