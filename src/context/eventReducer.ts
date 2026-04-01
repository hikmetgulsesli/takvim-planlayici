import type { CalendarEvent } from '../types/event';

export type EventAction =
  | { type: 'SET_EVENTS'; payload: CalendarEvent[] }
  | { type: 'ADD_EVENT'; payload: CalendarEvent }
  | { type: 'UPDATE_EVENT'; payload: CalendarEvent }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'CLEAR_EVENTS' };

export interface EventState {
  events: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
}

export const initialEventState: EventState = {
  events: [],
  isLoading: false,
  error: null,
};

export function eventReducer(state: EventState, action: EventAction): EventState {
  switch (action.type) {
    case 'SET_EVENTS':
      return {
        ...state,
        events: action.payload,
        isLoading: false,
        error: null,
      };
    case 'ADD_EVENT':
      return {
        ...state,
        events: [...state.events, action.payload],
        error: null,
      };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        ),
        error: null,
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload),
        error: null,
      };
    case 'CLEAR_EVENTS':
      return {
        ...state,
        events: [],
        error: null,
      };
    default:
      return state;
  }
}
