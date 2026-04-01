import { describe, it, expect } from 'vitest';
import {
  getMonthGrid,
  getWeekDays,
  getDayHours,
  isSameDay,
  isSameMonth,
  isToday,
  formatDate,
  formatDateFull,
  formatMonthYear,
  getPreviousMonth,
  getNextMonth,
  getPreviousWeek,
  getNextWeek,
  getPreviousDay,
  getNextDay,
  calculateEventTop,
  calculateEventHeight,
  getDayNames,
  getDayNamesFull,
} from './dateUtils';

describe('getMonthGrid', () => {
  it('returns correct 6x7 grid for any month', () => {
    const grid = getMonthGrid(new Date(2026, 2, 15)); // March 2026
    expect(grid).toHaveLength(6);
    grid.forEach(week => {
      expect(week).toHaveLength(7);
    });
  });

  it('marks days outside current month correctly', () => {
    const grid = getMonthGrid(new Date(2026, 2, 15)); // March 2026
    const allDays = grid.flat();
    const marchDays = allDays.filter(day => day?.isCurrentMonth);
    expect(marchDays.length).toBeGreaterThanOrEqual(28);
    expect(marchDays.length).toBeLessThanOrEqual(31);
  });
});

describe('getWeekDays', () => {
  it('returns 7 days starting from provided date', () => {
    const days = getWeekDays(new Date(2026, 2, 15));
    expect(days).toHaveLength(7);
  });

  it('week starts on Monday per Turkish convention', () => {
    const days = getWeekDays(new Date(2026, 2, 15)); // March 15, 2026 is Sunday
    // Week should start on March 9, 2026 (Monday)
    expect(days[0]?.date.getDay()).toBe(1); // Monday
  });
});

describe('getDayHours', () => {
  it('returns 24 hour labels', () => {
    const hours = getDayHours();
    expect(hours).toHaveLength(24);
    expect(hours[0]).toBe('00:00');
    expect(hours[23]).toBe('23:00');
  });
});

describe('isSameDay', () => {
  it('returns true only for same calendar day', () => {
    const date1 = new Date(2026, 2, 15, 10, 30);
    const date2 = new Date(2026, 2, 15, 14, 45);
    const date3 = new Date(2026, 2, 16, 10, 30);

    expect(isSameDay(date1, date2)).toBe(true);
    expect(isSameDay(date1, date3)).toBe(false);
  });
});

describe('isSameMonth', () => {
  it('returns true only for same month', () => {
    const date1 = new Date(2026, 2, 15);
    const date2 = new Date(2026, 2, 20);
    const date3 = new Date(2026, 3, 15);

    expect(isSameMonth(date1, date2)).toBe(true);
    expect(isSameMonth(date1, date3)).toBe(false);
  });
});

describe('isToday', () => {
  it('returns true for current date', () => {
    const today = new Date();
    expect(isToday(today)).toBe(true);
  });

  it('returns false for other dates', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isToday(yesterday)).toBe(false);
  });
});

describe('formatDate', () => {
  it('formats date in Turkish locale', () => {
    const date = new Date(2026, 2, 14);
    const formatted = formatDate(date);
    expect(formatted).toBe('14 Mar 2026');
  });
});

describe('formatDateFull', () => {
  it('formats date with full month name in Turkish', () => {
    const date = new Date(2026, 2, 14);
    const formatted = formatDateFull(date);
    expect(formatted).toBe('14 Mart 2026');
  });
});

describe('formatMonthYear', () => {
  it('formats month and year in Turkish', () => {
    const date = new Date(2026, 2, 14);
    const formatted = formatMonthYear(date);
    expect(formatted).toBe('Mart 2026');
  });
});

describe('navigation functions', () => {
  it('getPreviousMonth returns previous month', () => {
    const date = new Date(2026, 2, 15);
    const prev = getPreviousMonth(date);
    expect(prev.getMonth()).toBe(1); // February
  });

  it('getNextMonth returns next month', () => {
    const date = new Date(2026, 2, 15);
    const next = getNextMonth(date);
    expect(next.getMonth()).toBe(3); // April
  });

  it('getPreviousWeek returns previous week', () => {
    const date = new Date(2026, 2, 15);
    const prev = getPreviousWeek(date);
    expect(prev.getDate()).toBe(8);
  });

  it('getNextWeek returns next week', () => {
    const date = new Date(2026, 2, 15);
    const next = getNextWeek(date);
    expect(next.getDate()).toBe(22);
  });

  it('getPreviousDay returns previous day', () => {
    const date = new Date(2026, 2, 15);
    const prev = getPreviousDay(date);
    expect(prev.getDate()).toBe(14);
  });

  it('getNextDay returns next day', () => {
    const date = new Date(2026, 2, 15);
    const next = getNextDay(date);
    expect(next.getDate()).toBe(16);
  });
});

describe('calculateEventTop', () => {
  it('calculates correct top position for 00:00', () => {
    const startTime = new Date(2026, 2, 15, 0, 0);
    const top = calculateEventTop(startTime);
    expect(top).toBe(0);
  });

  it('calculates correct top position for 12:00', () => {
    const startTime = new Date(2026, 2, 15, 12, 0);
    const top = calculateEventTop(startTime);
    expect(top).toBe(50); // 12 * 60 / 1440 * 100 = 50%
  });

  it('calculates correct top position for 06:30', () => {
    const startTime = new Date(2026, 2, 15, 6, 30);
    const top = calculateEventTop(startTime);
    expect(top).toBeCloseTo(27.08, 2); // (6 * 60 + 30) / 1440 * 100
  });
});

describe('calculateEventHeight', () => {
  it('calculates correct height for 1 hour event', () => {
    const startTime = new Date(2026, 2, 15, 10, 0);
    const endTime = new Date(2026, 2, 15, 11, 0);
    const height = calculateEventHeight(startTime, endTime);
    expect(height).toBeCloseTo(4.17, 2); // 60 / 1440 * 100
  });

  it('calculates correct height for 2 hour event', () => {
    const startTime = new Date(2026, 2, 15, 10, 0);
    const endTime = new Date(2026, 2, 15, 12, 0);
    const height = calculateEventHeight(startTime, endTime);
    expect(height).toBeCloseTo(8.33, 2); // 120 / 1440 * 100
  });

  it('calculates correct height for 30 minute event', () => {
    const startTime = new Date(2026, 2, 15, 10, 0);
    const endTime = new Date(2026, 2, 15, 10, 30);
    const height = calculateEventHeight(startTime, endTime);
    expect(height).toBeCloseTo(2.08, 2); // 30 / 1440 * 100
  });
});

describe('getDayNames', () => {
  it('returns 7 Turkish day abbreviations starting with Monday', () => {
    const names = getDayNames();
    expect(names).toHaveLength(7);
    expect(names[0]).toBe('Pzt');
    expect(names[6]).toBe('Paz');
  });
});

describe('getDayNamesFull', () => {
  it('returns 7 full Turkish day names starting with Monday', () => {
    const names = getDayNamesFull();
    expect(names).toHaveLength(7);
    expect(names[0]).toBe('Pazartesi');
    expect(names[6]).toBe('Pazar');
  });
});
