export function formatShortDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

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
