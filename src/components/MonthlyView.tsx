import { useState, useCallback, useMemo } from 'react';
import { useEventContext } from '../context/EventContext';
import type { Event } from '../types';

interface MonthlyViewProps {
  onDayClick?: (date: Date) => void;
  onEventClick?: (event: Event) => void;
}

const DAYS_OF_WEEK = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

export function MonthlyView({ onDayClick, onEventClick }: MonthlyViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { getEventsByDate } = useEventContext();

  const today = useMemo(() => new Date(), []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthYearLabel = useMemo(() => {
    return `${MONTH_NAMES[month]} ${year}`;
  }, [month, year]);

  const todayLabel = useMemo(() => {
    const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    return `Bugün, ${today.getDate()} ${MONTH_NAMES[today.getMonth()]} ${dayNames[today.getDay()] || 'Pazar'}`;
  }, [today]);

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
    let firstDayOfWeek = firstDayOfMonth.getDay();
    // Convert to Monday-based (0 = Monday, 6 = Sunday)
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const days: Array<{ date: number; isCurrentMonth: boolean; fullDate: Date }> = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = prevMonthLastDay - i;
      days.push({
        date,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, date)
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
        fullDate: new Date(year, month, i)
      });
    }

    // Next month days to fill 6 rows (42 cells)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, i)
      });
    }

    return days;
  }, [year, month]);

  const navigatePreviousMonth = useCallback(() => {
    setCurrentDate(new Date(year, month - 1, 1));
  }, [year, month]);

  const navigateNextMonth = useCallback(() => {
    setCurrentDate(new Date(year, month + 1, 1));
  }, [year, month]);

  const navigateToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const isToday = useCallback((date: Date): boolean => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }, [today]);

  const formatDateKey = useCallback((date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  const handleDayClick = useCallback((fullDate: Date) => {
    onDayClick?.(fullDate);
  }, [onDayClick]);

  const handleEventClick = useCallback((e: React.MouseEvent, event: Event) => {
    e.stopPropagation();
    onEventClick?.(event);
  }, [onEventClick]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-headline text-5xl font-bold tracking-tight text-on-surface">
            {monthYearLabel}
          </h1>
          <p className="text-primary font-medium mt-2">{todayLabel}</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={navigatePreviousMonth}
              className="p-2 text-primary hover:bg-white/5 rounded-xl transition-all duration-300"
              aria-label="Önceki ay"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={navigateToToday}
              className="px-4 py-2 text-primary font-semibold hover:bg-white/5 rounded-xl transition-all duration-300"
            >
              Bugün
            </button>
            <button
              onClick={navigateNextMonth}
              className="p-2 text-primary hover:bg-white/5 rounded-xl transition-all duration-300"
              aria-label="Sonraki ay"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-surface-container-highest/20 rounded-2xl overflow-hidden border border-outline-variant/15">
        {/* Day Headers */}
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="bg-surface-container-high p-4 text-center">
            <span className="font-headline font-bold text-sm text-on-surface-variant">{day}</span>
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((day, index) => {
          const dateKey = formatDateKey(day.fullDate);
          const dayEvents = getEventsByDate(dateKey);
          const todayFlag = isToday(day.fullDate);
          const maxVisibleEvents = 3;
          const visibleEvents = dayEvents.slice(0, maxVisibleEvents);
          const overflowCount = dayEvents.length - maxVisibleEvents;

          return (
            <div
              key={index}
              onClick={() => handleDayClick(day.fullDate)}
              className={`
                bg-surface-container-low p-4 h-48 group transition-colors cursor-pointer
                ${day.isCurrentMonth ? 'hover:bg-surface-container' : 'opacity-40'}
                ${todayFlag ? 'border-2 border-primary/30 bg-surface-container' : ''}
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`font-headline text-2xl font-bold ${
                    todayFlag ? 'text-primary' : day.isCurrentMonth ? 'text-slate-600' : 'text-slate-600/50'
                  }`}
                >
                  {day.date}
                </span>
                {todayFlag && <div className="w-2 h-2 rounded-full bg-primary"></div>}
              </div>

              {/* Events */}
              <div className="space-y-1">
                {visibleEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => handleEventClick(e, event)}
                    className="text-xs font-medium truncate px-2 py-1 rounded border-l-2 cursor-pointer hover:brightness-110 transition-all"
                    style={{
                      backgroundColor: `${event.color}20`,
                      borderLeftColor: event.color,
                      color: event.color
                    }}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {overflowCount > 0 && (
                  <div className="text-xs text-on-surface-variant px-2 py-1">
                    +{overflowCount} etkinlik
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
