import type { FC } from 'react';
import type { CalendarEvent } from '../types';

interface WeeklyViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (date: string, time: string) => void;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const COLOR_MAP: Record<string, { bg: string; border: string; text: string }> = {
  '#c0c1ff': { bg: 'bg-[#c0c1ff]/10', border: 'border-[#c0c1ff]', text: 'text-[#c0c1ff]' },
  '#ffb783': { bg: 'bg-[#ffb783]/10', border: 'border-[#ffb783]', text: 'text-[#ffb783]' },
  '#ffb4ab': { bg: 'bg-[#ffb4ab]/10', border: 'border-[#ffb4ab]', text: 'text-[#ffb4ab]' },
  '#8083ff': { bg: 'bg-[#8083ff]/10', border: 'border-[#8083ff]', text: 'text-[#8083ff]' },
  '#31394d': { bg: 'bg-[#31394d]/50', border: 'border-[#31394d]', text: 'text-[#dae2fd]' },
  '#d97721': { bg: 'bg-[#d97721]/10', border: 'border-[#d97721]', text: 'text-[#ffb783]' },
  '#10b981': { bg: 'bg-emerald-400/10', border: 'border-emerald-400', text: 'text-emerald-400' },
  '#14b8a6': { bg: 'bg-teal-300/10', border: 'border-teal-300', text: 'text-teal-300' },
};

const getColorClasses = (color: string): { bg: string; border: string; text: string } => {
  return COLOR_MAP[color] ?? { bg: 'bg-[#c0c1ff]/10', border: 'border-[#c0c1ff]', text: 'text-[#c0c1ff]' };
};

const formatHour = (hour: number): string => {
  return `${hour.toString().padStart(2, '0')}:00`;
};

const formatTurkishDate = (date: Date): string => {
  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const dayOfWeek = days[date.getDay()];
  
  return `${day} ${month}, ${dayOfWeek}`;
};

const formatShortDate = (date: Date): string => {
  return date.toISOString().split('T')[0] ?? '';
};

const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

const getWeekDays = (date: Date): Date[] => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
  const monday = new Date(date);
  monday.setDate(diff);
  
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
};

export const WeeklyView: FC<WeeklyViewProps> = ({
  date,
  events,
  onEventClick,
  onTimeSlotClick,
  onPreviousWeek,
  onNextWeek,
  onToday,
}) => {
  const weekDays = getWeekDays(date);
  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];

  const formatWeekRange = (): string => {
    const startMonth = weekStart.getMonth();
    const endMonth = weekEnd.getMonth();
    const months = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    
    if (startMonth === endMonth) {
      return `${weekStart.getDate()} - ${weekEnd.getDate()} ${months[startMonth]} ${weekStart.getFullYear()}`;
    }
    return `${weekStart.getDate()} ${months[startMonth]} - ${weekEnd.getDate()} ${months[endMonth]} ${weekStart.getFullYear()}`;
  };

  const getEventsForDay = (dateStr: string): CalendarEvent[] => {
    return events.filter((e) => e.date === dateStr);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-headline font-bold text-[var(--color-on-surface)]">
          {formatWeekRange()}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onPreviousWeek}
            className="p-2 rounded-lg text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-all duration-200"
            aria-label="Önceki hafta"
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
            onClick={onNextWeek}
            className="p-2 rounded-lg text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-all duration-200"
            aria-label="Sonraki hafta"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Empty state for no events */}
      {events.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 blur-[60px] bg-[var(--color-primary)]/10 rounded-full scale-150"></div>
            <div className="relative w-32 h-32 flex items-center justify-center rounded-full border border-[var(--color-primary)]/20 glass-morphism">
              <span className="material-symbols-outlined text-6xl text-[var(--color-primary)]" style={{ textShadow: '0 0 15px rgba(168, 232, 255, 0.4)' }}>
                date_range
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

      {/* Week grid */}
      {events.length > 0 && (
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Day headers */}
            <div className="grid grid-cols-8 gap-1 mb-2">
              <div className="w-16"></div>
              {weekDays.map((day, index) => {
                const isTodayDate = isToday(day);
                return (
                  <div
                    key={index}
                    className={`
                      text-center py-2 rounded-lg
                      ${isTodayDate ? 'bg-[var(--color-primary-container)]/20' : ''}
                    `}
                  >
                    <div className={`
                      text-sm font-medium
                      ${isTodayDate ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'}
                    `}>
                      {formatTurkishDate(day)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time grid */}
            <div className="space-y-0">
              {HOURS.map((hour) => (
                <div key={hour} className="grid grid-cols-8 gap-1 min-h-[60px]">
                  <div className="w-16 py-2 text-sm text-[var(--color-on-surface-variant)] font-medium">
                    {formatHour(hour)}
                  </div>
                  {weekDays.map((day, dayIndex) => {
                    const dateStr = formatShortDate(day);
                    const dayEvents = getEventsForDay(dateStr).filter((e) => {
                      const startHour = parseInt(e.startTime.split(':')[0] ?? '0', 10);
                      return startHour === hour;
                    });

                    return (
                      <div
                        key={dayIndex}
                        className="border border-[var(--color-outline-variant)]/10 rounded-lg p-1 hover:bg-[var(--color-surface-container)]/30 transition-colors cursor-pointer"
                        onClick={() => onTimeSlotClick(dateStr, formatHour(hour))}
                      >
                        {dayEvents.map((event) => {
                          const colorClasses = getColorClasses(event.color);
                          return (
                            <button
                              key={event.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onEventClick(event);
                              }}
                              className={`
                                w-full text-left rounded px-1 py-0.5 mb-0.5 text-xs truncate
                                ${colorClasses.bg} ${colorClasses.text}
                                hover:brightness-110 transition-all duration-200
                              `}
                            >
                              {event.title}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
