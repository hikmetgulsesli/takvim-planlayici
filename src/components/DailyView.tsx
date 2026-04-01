import type { FC } from 'react';
import type { CalendarEvent } from '../types/index';

interface DailyViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (date: string, time: string) => void;
  onPreviousDay: () => void;
  onNextDay: () => void;
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
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const dayOfWeek = days[date.getDay()];
  
  return `${day} ${month} ${year}, ${dayOfWeek}`;
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

const getCurrentTimePosition = (): number => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

export const DailyView: FC<DailyViewProps> = ({
  date,
  events,
  onEventClick,
  onTimeSlotClick,
  onPreviousDay,
  onNextDay,
  onToday,
}) => {
  const dateStr = formatShortDate(date);
  const today = isToday(date);
  const currentTimePosition = today ? getCurrentTimePosition() : null;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-headline font-bold text-[var(--color-on-surface)]">
            {formatTurkishDate(date)}
          </h2>
          {today && (
            <span className="px-3 py-1 rounded-full bg-[var(--color-primary-container)]/20 text-[var(--color-primary)] text-sm font-medium">
              Bugün
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPreviousDay}
            className="p-2 rounded-lg text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-all duration-200"
            aria-label="Önceki gün"
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
            onClick={onNextDay}
            className="p-2 rounded-lg text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-all duration-200"
            aria-label="Sonraki gün"
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
                calendar_today
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

      {/* Time grid */}
      {events.length > 0 && (
        <div className="relative">
          {/* Current time indicator */}
          {currentTimePosition !== null && (
            <div
              className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
              style={{ top: `${(currentTimePosition / 1440) * 100}%` }}
            >
              <div className="w-3 h-3 rounded-full bg-[var(--color-error)] -ml-1.5"></div>
              <div className="flex-1 h-0.5 bg-[var(--color-error)]"></div>
            </div>
          )}

          <div className="space-y-0">
            {HOURS.map((hour) => {
              const hourEvents = events.filter((e) => {
                const startHour = parseInt(e.startTime.split(':')[0] ?? '0', 10);
                return startHour === hour;
              });

              return (
                <div
                  key={hour}
                  className="flex min-h-[80px] border-b border-[var(--color-outline-variant)]/20 hover:bg-[var(--color-surface-container)]/30 transition-colors cursor-pointer"
                  onClick={() => onTimeSlotClick(dateStr, formatHour(hour))}
                >
                  <div className="w-16 py-3 text-sm text-[var(--color-on-surface-variant)] font-medium">
                    {formatHour(hour)}
                  </div>
                  <div className="flex-1 py-1 px-2 relative">
                    {hourEvents.map((event) => {
                      const colorClasses = getColorClasses(event.color);
                      return (
                        <button
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick(event);
                          }}
                          className={`
                            w-full text-left rounded-md p-2 mb-1
                            ${colorClasses.bg} border-l-2 ${colorClasses.border} ${colorClasses.text}
                            hover:brightness-110 transition-all duration-200
                          `}
                        >
                          <div className="font-semibold text-sm truncate">{event.title}</div>
                          <div className="text-xs opacity-80">
                            {event.startTime} - {event.endTime}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
