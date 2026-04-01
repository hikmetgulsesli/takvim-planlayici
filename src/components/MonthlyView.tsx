import { useMemo } from 'react';
import type { CalendarEvent } from '../types';

interface MonthlyViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (date: string, time: string) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
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

const TURKISH_DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

export function MonthlyView({
  date,
  events,
  onEventClick,
  onTimeSlotClick,
  onPreviousMonth,
  onNextMonth,
  onToday,
}: MonthlyViewProps) {
  const { year, month, days } = useMemo(() => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Adjust for Monday as first day (0 = Monday, 6 = Sunday)
    let firstDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (firstDayOfWeek < 0) firstDayOfWeek = 6;
    
    const days: Array<{ day: number; isCurrentMonth: boolean; dateStr: string }> = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      days.push({
        day,
        isCurrentMonth: false,
        dateStr: `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        dateStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      });
    }
    
    // Next month days to fill the grid
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      days.push({
        day: i,
        isCurrentMonth: false,
        dateStr: `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      });
    }
    
    return { year, month, days };
  }, [date]);

  const isToday = (dateStr: string): boolean => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return dateStr === todayStr;
  };

  const getEventsForDay = (dateStr: string): CalendarEvent[] => {
    return events.filter((event) => event.date === dateStr);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-headline text-5xl font-bold tracking-tight text-on-surface">
            {TURKISH_MONTHS[month]} {year}
          </h1>
          <p className="text-primary font-medium mt-2">
            {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPreviousMonth}
            className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all duration-200"
            aria-label="Önceki ay"
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
            onClick={onNextMonth}
            className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all duration-200"
            aria-label="Sonraki ay"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-surface-container-highest/20 rounded-2xl overflow-hidden border border-outline-variant/15">
        {/* Day headers */}
        {TURKISH_DAYS.map((day) => (
          <div key={day} className="bg-surface-container-high p-4 text-center">
            <span className="font-headline font-bold text-sm text-on-surface-variant">{day}</span>
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map(({ day, isCurrentMonth, dateStr }, index) => {
          const dayEvents = getEventsForDay(dateStr);
          const today = isToday(dateStr);
          
          return (
            <div
              key={index}
              onClick={() => onTimeSlotClick(dateStr, '09:00')}
              className={`
                bg-surface-container-low p-4 min-h-[120px] group cursor-pointer
                hover:bg-surface-container transition-colors duration-200
                ${!isCurrentMonth ? 'opacity-40' : ''}
                ${today ? 'bg-surface-container border-2 border-primary/30' : ''}
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`
                    font-headline text-lg font-bold
                    ${today ? 'text-primary' : 'text-on-surface'}
                    ${!isCurrentMonth ? 'text-on-surface-variant' : ''}
                  `}
                >
                  {day}
                </span>
                {today && <div className="w-2 h-2 rounded-full bg-primary"></div>}
              </div>
              
              {/* Events */}
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => {
                  const colorClasses = getColorClasses(event.color);
                  return (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className={`
                        text-left text-xs px-2 py-1 rounded truncate cursor-pointer
                        ${colorClasses.bg} ${colorClasses.text} ${colorClasses.border}
                        border-l-2 hover:brightness-110 transition-all duration-200
                      `}
                    >
                      {event.title}
                    </div>
                  );
                })}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-on-surface-variant px-2">
                    +{dayEvents.length - 3} daha
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
