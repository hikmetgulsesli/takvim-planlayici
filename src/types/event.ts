export type ReminderType = 'none' | '5min' | '15min' | '30min' | '1hour' | '1day';

export type EventColor = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  color: EventColor;
  reminder: ReminderType;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

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

// Form data interface for creating/editing events (uses strings for form inputs)
export interface EventFormData {
  title: string;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  description: string;
  color: string;
  reminder: string;
}
