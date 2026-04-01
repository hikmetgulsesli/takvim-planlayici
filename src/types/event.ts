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
