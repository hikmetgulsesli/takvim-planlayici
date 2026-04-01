import type { FC } from 'react';
import type { CalendarEvent } from '../types';

interface MonthlyViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  '#c0c1ff': { bg: 'bg-[#c0c1ff]/20', text: 'text-[#c0c1ff]' },
  '#ffb783': { bg: 'bg-[#ffb783]/20', text: 'text-[#ffb783]' },
  '#ffb4ab': { bg: 'bg-[#ffb4ab]/20', text: 'text-[#ffb4ab]' },
  '#8083ff': { bg: 'bg-[#8083ff]/20', text: 'text-[#8083ff]' },
  '#31394d': { bg: 'bg-[#31394d]/50', text: 'text-[#dae2fd]' },
  '#d97721': { bg: 'bg-[#d97721]/20', text: 'text-[#ffb783]' },
  '#10b981': { bg: 'bg-emerald-400/20', text: 'text-emerald-400' },
  '#14b8a6': { bg: 'bg-teal-300/20', text: 'text-teal-300' },
};

const getColorClasses = (color: string): { bg: string; text: string } => {
  return COLOR_MAP[color] ?? { bg: 'bg-[#c0c1ff]/20', text: 'text-[#c0c1ff]' };
};

const formatTurkishMonth = (date: Date): string => {
  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  // 0 = Sunday, 1 = Monday, etc. Convert to Monday = 0
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

const isToday = (date: Date, day: number): boolean => {
  const today = new Date();
  return (
    today.getDate() === day &&
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear()
  );
};

const formatDateStr = (date: Date, day: number): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const dayStr = day.toString().padStart(2, '0');
  return `${year}-${month}-${dayStr}`;
};

export const MonthlyView: FC<MonthlyViewProps> = ({
  date,
  events,
  onEventClick,
  onPreviousMonth,
  onNextMonth,
  onToday,
}) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days: Array<{ day: number | null; dateStr: string | null }> = [];
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push({ day: null, dateStr: null });
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({ day, dateStr: formatDateStr(date, day) });
  }

  const getEventsForDay = (dateStr: string | null): CalendarEvent[] => {
    if (!dateStr) return [];
    return events.filter((e) => e.date === dateStr);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-headline font-bold text-[var(--color-on-surface)]">
          {formatTurkishMonth(date)}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onPreviousMonth}
            className="p-2 rounded-lg text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-all duration-200"
            aria-label="Önceki ay"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            onClick={onToday}
            className="px-4 py-2 rounded-lg text-[var(--color-on-surface)] bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] transition-all duration-200 font-medium"
          >
            Bugün
          </button>
          <button
            onClick={onNextMonth}
            className="p-2 rounded-lg text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-all duration-200"
            aria-label="Sonraki ay"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Empty state for no events in the entire calendar */}
      {events.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center mb-8">
          <div className="relative mb-8">
            <div className="absolute inset-0 blur-[60px] bg-[var(--color-primary)]/10 rounded-full scale-150"></div>
            <div className="relative w-32 h-32 flex items-center justify-center rounded-full border border-[var(--color-primary)]/20 glass-morphism">
              <span className="material-symbols-outlined text-6xl text-[var(--color-primary)]" style={{ textShadow: '0 0 15px rgba(168, 232, 255, 0.4)' }}>
                calendar_month
              </span>
            </div>
          </div>
          <h3 className="font-headline text-2xl font-bold text-[var(--color-on-surface)] mb-3">
            Henüz etkinlik yok
          </h3>
          <p className="text-[var(--color-on-surface-variant)] max-w-sm mb-8 leading-relaxed">
            Henüz etkinlik eklemediniz. Yeni etkinlik eklemek için + butonuna tıklayın.
          </p>
        </div>
      )}

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {DAYS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-sm font-medium text-[var(--color-on-surface-variant)]"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((dayInfo, index) => {
          const dayEvents = getEventsForDay(dayInfo.dateStr);
          const isTodayDate = dayInfo.day !== null && isToday(date, dayInfo.day);

          return (
            <div
              key={index}
              className={`
                min-h-[100px] p-2 border border-[var(--color-outline-variant)]/10 rounded-lg
                ${dayInfo.day !== null ? 'bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)]' : ''}
                transition-all duration-200
              `}
            >
              {dayInfo.day !== null && (
                <>
                  <div className={`
                    w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1
                    ${isTodayDate ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]' : 'text-[var(--color-on-surface)]'}
                  `}>
                    {dayInfo.day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => {
                      const colorClasses = getColorClasses(event.color);
                      return (
                        <button
                          key={event.id}
                          onClick={() => onEventClick(event)}
                          className={`
                            w-full text-left text-xs px-2 py-1 rounded truncate
                            ${colorClasses.bg} ${colorClasses.text}
                            hover:brightness-110 transition-all duration-200
                          `}
                        >
                          {event.title}
                        </button>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-[var(--color-on-surface-variant)] px-2">
                        +{dayEvents.length - 3} daha
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
