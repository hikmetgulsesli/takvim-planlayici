import { useMemo } from 'react';
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

const TURKISH_DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

export function WeeklyView({
  date,
  events,
  onEventClick,
  onTimeSlotClick,
  onPreviousWeek,
  onNextWeek,
  onToday,
}: WeeklyViewProps) {
  const { weekDays, weekStart, weekEnd } = useMemo(() => {
    const currentDay = date.getDay();
    const diff = date.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    const weekStart = new Date(date.setDate(diff));
    
    const weekDays: Array<{ date: Date; dateStr: string; dayName: string; dayNum: number }> = [];
    
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + i);
      weekDays.push({
        date: dayDate,
        dateStr: dayDate.toISOString().split('T')[0] ?? '',
        dayName: TURKISH_DAYS[i],
        dayNum: dayDate.getDate(),
      });
    }
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    return { weekDays, weekStart, weekEnd };
  }, [date]);

  const isToday = (checkDate: Date): boolean => {
    const today = new Date();
    return (
      checkDate.getDate() === today.getDate() &&
      checkDate.getMonth() === today.getMonth() &&
      checkDate.getFullYear() === today.getFullYear()
    );
  };

  const getEventsForDay = (dateStr: string): CalendarEvent[] => {
    return events.filter((event) => event.date === dateStr);
  };

  const formatWeekRange = (): string => {
    const startMonth = TURKISH_MONTHS[weekStart.getMonth()];
    const endMonth = TURKISH_MONTHS[weekEnd.getMonth()];
    const startDay = weekStart.getDate();
    const endDay = weekEnd.getDate();
    const year = weekStart.getFullYear();
    
    if (startMonth === endMonth) {
      return `${startDay} - ${endDay} ${startMonth} ${year}`;
    }
    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-headline text-5xl font-bold tracking-tight text-on-surface">
            {formatWeekRange()}
          </h1>
          <p className="text-primary font-medium mt-2">Haftalık görünüm</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPreviousWeek}
            className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all duration-200"
            aria-label="Önceki hafta"
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
            onClick={onNextWeek}
            className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all duration-200"
            aria-label="Sonraki hafta"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map(({ dateStr, dayName, dayNum }, index) => {
          const dayEvents = getEventsForDay(dateStr);
          const today = isToday(new Date(dateStr));
          
          return (
            <div
              key={index}
              onClick={() => onTimeSlotClick(dateStr, '09:00')}
              className={`
                bg-surface-container-low rounded-2xl p-4 min-h-[400px] cursor-pointer
                hover:bg-surface-container transition-colors duration-200
                ${today ? 'ring-2 ring-primary/30 bg-surface-container' : ''}
              `}
            >
              {/* Day header */}
              <div className="text-center mb-4 pb-4 border-b border-outline-variant/20">
                <div className={`font-headline text-sm font-medium ${today ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {dayName}
                </div>
                <div className={`font-headline text-3xl font-bold mt-1 ${today ? 'text-primary' : 'text-on-surface'}`}>
                  {dayNum}
                </div>
                {today && <div className="w-1.5 h-1.5 rounded-full bg-primary mx-auto mt-2"></div>}
              </div>
              
              {/* Events */}
              <div className="space-y-2">
                {dayEvents.length === 0 ? (
                  <div className="text-center py-8 text-on-surface-variant/50 text-sm">
                    <span className="material-symbols-outlined text-2xl mb-2 block">event_available</span>
                    Boş
                  </div>
                ) : (
                  dayEvents.map((event) => {
                    const colorClasses = getColorClasses(event.color);
                    return (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        className={`
                          p-3 rounded-xl cursor-pointer
                          ${colorClasses.bg} ${colorClasses.text}
                          border-l-2 ${colorClasses.border}
                          hover:brightness-110 transition-all duration-200
                        `}
                      >
                        <div className="font-semibold text-sm truncate">{event.title}</div>
                        <div className="text-xs opacity-80 mt-1">
                          {event.startTime} - {event.endTime}
                        </div>
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
