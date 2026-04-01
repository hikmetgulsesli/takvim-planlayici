import { useMemo } from 'react';
import type { CalendarEvent } from '../types';

interface DailyViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (date: string, time: string) => void;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
}

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

const TURKISH_MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const TURKISH_DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function DailyView({
  date,
  events,
  onEventClick,
  onTimeSlotClick,
  onPreviousDay,
  onNextDay,
  onToday,
}: DailyViewProps) {
  const dateStr = useMemo(() => date.toISOString().split('T')[0] ?? '', [date]);
  
  const dayEvents = useMemo(() => {
    return events.filter((event) => event.date === dateStr);
  }, [events, dateStr]);

  const isToday = (): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const formatDate = (): string => {
    const day = date.getDate();
    const month = TURKISH_MONTHS[date.getMonth()];
    const year = date.getFullYear();
    const dayOfWeek = TURKISH_DAYS[date.getDay()];
    return `${day} ${month} ${year}, ${dayOfWeek}`;
  };

  const getEventsForHour = (hour: number): CalendarEvent[] => {
    const hourStr = `${hour.toString().padStart(2, '0')}:00`;
    return dayEvents.filter((event) => {
      const eventHour = parseInt(event.startTime.split(':')[0] ?? '0', 10);
      return eventHour === hour;
    });
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-headline text-5xl font-bold tracking-tight text-on-surface">
            {formatDate()}
          </h1>
          <p className="text-primary font-medium mt-2">
            {isToday() ? 'Bugün' : `${dayEvents.length} etkinlik`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPreviousDay}
            className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all duration-200"
            aria-label="Önceki gün"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            onClick={onToday}
            className="px-4 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all duration-200 font-medium"
          >
            Bugün
          </button>
          <button
            onClick={onNextDay}
            className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all duration-200"
            aria-label="Sonraki gün"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Time slots */}
      <div className="space-y-2">
        {HOURS.map((hour) => {
          const hourEvents = getEventsForHour(hour);
          const hourStr = `${hour.toString().padStart(2, '0')}:00`;
          
          return (
            <div
              key={hour}
              onClick={() => onTimeSlotClick(dateStr, hourStr)}
              className="flex gap-4 p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors duration-200 cursor-pointer group"
            >
              {/* Time label */}
              <div className="w-16 flex-shrink-0 text-right">
                <span className="font-headline text-sm font-medium text-on-surface-variant">
                  {hourStr}
                </span>
              </div>
              
              {/* Events */}
              <div className="flex-1 flex gap-2 flex-wrap">
                {hourEvents.length === 0 ? (
                  <div className="h-8 flex items-center text-on-surface-variant/30 text-sm group-hover:text-on-surface-variant/50 transition-colors">
                    <span className="material-symbols-outlined text-lg mr-2">add</span>
                    Etkinlik ekle
                  </div>
                ) : (
                  hourEvents.map((event) => {
                    const colorClasses = getColorClasses(event.color);
                    return (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        className={`
                          flex-1 min-w-[200px] p-3 rounded-xl cursor-pointer
                          ${colorClasses.bg} ${colorClasses.text}
                          border-l-2 ${colorClasses.border}
                          hover:brightness-110 transition-all duration-200
                        `}
                      >
                        <div className="font-semibold text-sm">{event.title}</div>
                        <div className="text-xs opacity-80 mt-1">
                          {event.startTime} - {event.endTime}
                        </div>
                        {event.description && (
                          <div className="text-xs opacity-60 mt-2 line-clamp-2">
                            {event.description}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
