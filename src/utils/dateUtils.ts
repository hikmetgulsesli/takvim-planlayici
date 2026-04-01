import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addDays,
  addMonths,
  addWeeks,
  subMonths,
  subWeeks,
  subDays,
  isSameDay as dateFnsIsSameDay,
  isSameMonth as dateFnsIsSameMonth,
  isToday as dateFnsIsToday,
  format,
  getHours,
  getMinutes,
  differenceInMinutes,
} from 'date-fns';
import { tr } from 'date-fns/locale';

export type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
};

export type MonthGrid = CalendarDay[][];

/**
 * Returns a 6x7 grid of days for a monthly calendar view
 * Week starts on Monday per Turkish convention
 */
export function getMonthGrid(date: Date): MonthGrid {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Ensure we have exactly 42 days (6 weeks x 7 days)
  const targetDays = 42;
  const lastDay = days[days.length - 1] ?? calendarEnd;
  const paddedDays = days.length < targetDays
    ? [...days, ...Array.from({ length: targetDays - days.length }, (_, i) => addDays(lastDay, i + 1))]
    : days.slice(0, targetDays);

  // Split into 6 rows of 7 days each
  const grid: MonthGrid = [];
  for (let week = 0; week < 6; week++) {
    const weekDays: CalendarDay[] = [];
    for (let day = 0; day < 7; day++) {
      const index = week * 7 + day;
      const currentDate = paddedDays[index];
      if (currentDate) {
        weekDays.push({
          date: currentDate,
          isCurrentMonth: dateFnsIsSameMonth(currentDate, date),
          isToday: dateFnsIsToday(currentDate),
        });
      }
    }
    grid.push(weekDays);
  }

  return grid;
}

/**
 * Returns an array of 7 days starting from the provided date
 * Week starts on Monday per Turkish convention
 */
export function getWeekDays(date: Date): CalendarDay[] {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const days: CalendarDay[] = [];

  for (let i = 0; i < 7; i++) {
    const currentDate = addDays(weekStart, i);
    days.push({
      date: currentDate,
      isCurrentMonth: dateFnsIsSameMonth(currentDate, date),
      isToday: dateFnsIsToday(currentDate),
    });
  }

  return days;
}

/**
 * Returns 24 hour labels for daily view
 */
export function getDayHours(): string[] {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });
}

/**
 * Returns true only if two dates are the same calendar day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return dateFnsIsSameDay(date1, date2);
}

/**
 * Returns true only if two dates are in the same month
 */
export function isSameMonth(date1: Date, date2: Date): boolean {
  return dateFnsIsSameMonth(date1, date2);
}

/**
 * Returns true if the date is today
 */
export function isToday(date: Date): boolean {
  return dateFnsIsToday(date);
}

/**
 * Formats a date for display in Turkish locale
 * Example: '14 Mar 2026'
 */
export function formatDate(date: Date, formatStr: string = 'd MMM yyyy'): string {
  return format(date, formatStr, { locale: tr });
}

/**
 * Formats a date with full month name in Turkish
 * Example: '14 Mart 2026'
 */
export function formatDateFull(date: Date): string {
  return format(date, 'd MMMM yyyy', { locale: tr });
}

/**
 * Formats a date for month/year display
 * Example: 'Mart 2026'
 */
export function formatMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy', { locale: tr });
}

/**
 * Returns the previous month
 */
export function getPreviousMonth(date: Date): Date {
  return subMonths(date, 1);
}

/**
 * Returns the next month
 */
export function getNextMonth(date: Date): Date {
  return addMonths(date, 1);
}

/**
 * Returns the previous week
 */
export function getPreviousWeek(date: Date): Date {
  return subWeeks(date, 1);
}

/**
 * Returns the next week
 */
export function getNextWeek(date: Date): Date {
  return addWeeks(date, 1);
}

/**
 * Returns the previous day
 */
export function getPreviousDay(date: Date): Date {
  return subDays(date, 1);
}

/**
 * Returns the next day
 */
export function getNextDay(date: Date): Date {
  return addDays(date, 1);
}

/**
 * Calculates the top position percentage for an event in weekly/daily views
 * Formula: top = (hour * 60 + minute) / 1440 * 100%
 */
export function calculateEventTop(startTime: Date): number {
  const hours = getHours(startTime);
  const minutes = getMinutes(startTime);
  return ((hours * 60 + minutes) / 1440) * 100;
}

/**
 * Calculates the height percentage for an event in weekly/daily views
 * Formula: height = (duration minutes) / 1440 * 100%
 */
export function calculateEventHeight(startTime: Date, endTime: Date): number {
  const durationMinutes = differenceInMinutes(endTime, startTime);
  return (durationMinutes / 1440) * 100;
}

/**
 * Returns Turkish day names (Monday first)
 */
export function getDayNames(): string[] {
  return ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
}

/**
 * Returns full Turkish day names (Monday first)
 */
export function getDayNamesFull(): string[] {
  return ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
}
