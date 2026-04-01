export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  color: string;
  reminder: string;
}

export interface EventFormData {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  color: string;
  reminder: string;
}

export type ViewMode = 'month' | 'week' | 'day';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

export type EventColor = '#c0c1ff' | '#ffb783' | '#ffb4ab' | '#8083ff' | '#31394d' | '#d97721' | '#10b981' | '#14b8a6';

// Alias for backward compatibility
export type Event = CalendarEvent;
