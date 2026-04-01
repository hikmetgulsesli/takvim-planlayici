export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
  color: string;
  reminder: ReminderType;
}

export type ReminderType = 
  | 'none'
  | '5min'
  | '15min'
  | '30min'
  | '1hour'
  | '1day';

export interface EventFormData {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  color: string;
  reminder: ReminderType;
}

export const REMINDER_OPTIONS: { value: ReminderType; label: string }[] = [
  { value: 'none', label: 'Yok' },
  { value: '5min', label: '5 dakika önce' },
  { value: '15min', label: '15 dakika önce' },
  { value: '30min', label: '30 dakika önce' },
  { value: '1hour', label: '1 saat önce' },
  { value: '1day', label: '1 gün önce' },
];

export const COLOR_OPTIONS: { value: string; name: string }[] = [
  { value: '#c0c1ff', name: 'primary' },
  { value: '#ffb783', name: 'tertiary' },
  { value: '#ffb4ab', name: 'error' },
  { value: '#8083ff', name: 'primary-container' },
  { value: '#31394d', name: 'surface-bright' },
  { value: '#d97721', name: 'tertiary-container' },
  { value: '#34d399', name: 'emerald' },
  { value: '#5eead4', name: 'teal' },
];
