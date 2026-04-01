export type ReminderType = 'none' | '5min' | '15min' | '30min' | '1hour' | '1day';

export type EventColor = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink';

// Hex color values for event colors
export const EVENT_COLOR_VALUES: Record<EventColor, string> = {
  blue: '#c0c1ff',
  purple: '#8083ff',
  green: '#10b981',
  orange: '#ffb783',
  red: '#ffb4ab',
  pink: '#ffacbe',
};

// Legacy interface for components using string dates
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  color: string; // Hex color value
  reminder: string;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  color: string;
  reminder: string;
}

export type ViewMode = 'month' | 'week' | 'day';

export interface Calendar {
  id: string;
  name: string;
  color: EventColor;
  isDefault: boolean;
  isShared: boolean;
  ownerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}
