import { useState, useCallback, type DragEvent } from 'react';
import type { CalendarEvent } from '../types';

interface MonthlyViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onEventDrop: (eventId: string, newDate: string) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

const COLOR_MAP: Record<string, { bg: string; border: string; text: string }> = {
  '#c0c1ff': { bg: 'bg-[#c0c1ff]/20', border: 'border-[#c0c1ff]', text: 'text-[#c0c1ff]' },
  '#ffb783': { bg: 'bg-[#ffb783]/20', border: 'border-[#ffb783]', text: 'text-[#ffb783]' },
  '#ffb4ab': { bg: 'bg-[#ffb4ab]/20', border: 'border-[#ffb4ab]', text: 'text-[#ffb4ab]' },
  '#8083ff': { bg: 'bg-[#8083ff]/20', border: 'border-[#8083ff]', text: 'text-[#8083ff]' },
  '#31394d': { bg: 'bg-[#31394d]/50', border: 'border-[#31394d]', text: 'text-[#dae2fd]' },
  '#d97721': { bg: 'bg-[#d97721]/20', border: 'border-[#d97721]', text: 'text-[#ffb783]' },
  '#10b981': { bg: 'bg-emerald-400/20', border: 'border-emerald-400', text: 'text-emerald-400' },
  '#14b8a6': { bg: 'bg-teal-300/20', border: 'border-teal-300', text: 'text-teal-300' },
};

const getColorClasses = (color: string): { bg: string; border: string; text: string } => {
  return COLOR_MAP[color] ?? { bg: 'bg-[#c0c1ff]/20', border: 'border-[#c0c1ff]', text: 'text-[#c0c1ff]' };
};

const formatLocalDate = (d: Date): string => {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};



export function MonthlyView({
  date,
  events,
  onEventClick,
  onEventDrop,
  onPreviousMonth,
  onNextMonth,
  onToday,
}: MonthlyViewProps) {
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  const year = date.getFullYear();
  const month = date.getMonth();

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Adjust for Monday start (0 = Monday)
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  
  // Get number of days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Get days from previous month
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Generate calendar days
  const calendarDays: Array<{ date: Date; dateStr: string; isCurrentMonth: boolean }> = [];
  
  // Previous month days
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, daysInPrevMonth - i);
    const dateStr = formatLocalDate(d);
    calendarDays.push({ date: d, dateStr: dateStr ?? '', isCurrentMonth: false });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    const dateStr = formatLocalDate(d);
    calendarDays.push({ date: d, dateStr: dateStr ?? '', isCurrentMonth: true });
  }
  
  // Next month days to fill the grid (6 rows * 7 cols = 42 cells)
  const remainingCells = 42 - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    const d = new Date(year, month + 1, i);
    const dateStr = formatLocalDate(d);
    calendarDays.push({ date: d, dateStr: dateStr ?? '', isCurrentMonth: false });
  }

  const getEventsForDate = useCallback((dateStr: string) => {
    return events.filter((event) => event.date === dateStr);
  }, [events]);

  const handleDragStart = (e: DragEvent, eventId: string) => {
    setDraggedEventId(eventId);
    e.dataTransfer.effectAllowed = 'move';
    // Set drag image offset
    e.dataTransfer.setData('text/plain', eventId);
  };

  const handleDragEnd = () => {
    setDraggedEventId(null);
    setDragOverDate(null);
  };

  const handleDragOver = (e: DragEvent, dateStr: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDate(dateStr);
  };

  const handleDragLeave = () => {
    setDragOverDate(null);
  };

  const handleDrop = (e: DragEvent, dateStr: string) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData('text/plain');
    if (eventId && eventId !== draggedEventId) {
      onEventDrop(eventId, dateStr);
    }
    setDraggedEventId(null);
    setDragOverDate(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-4">
        <div>
          <h2 className="font-headline text-3xl font-bold tracking-tight text-[#dae2fd]">
            {MONTHS[month]} {year}
          </h2>
          {isToday(date) && (
            <p className="text-[#c0c1ff] font-medium mt-1">Bugün</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onToday}
            className="px-4 py-2 rounded-xl font-semibold text-[#c0c1ff] hover:bg-white/5 transition-all text-sm"
          >
            Bugün
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={onPreviousMonth}
              className="p-2 rounded-xl text-[#c0c1ff] hover:bg-white/5 transition-all"
              aria-label="Önceki ay"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={onNextMonth}
              className="p-2 rounded-xl text-[#c0c1ff] hover:bg-white/5 transition-all"
              aria-label="Sonraki ay"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 px-4 pb-8">
        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((day) => (
            <div key={day} className="text-center py-2 text-sm font-medium text-[#908fa0]">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(({ date: dayDate, dateStr, isCurrentMonth }, index) => {
            const dayEvents = getEventsForDate(dateStr);
            const isTodayDate = isToday(dayDate);
            const isDragOver = dragOverDate === dateStr;

            return (
              <div
                key={index}
                className={`
                  min-h-[100px] p-2 rounded-lg transition-all
                  ${isCurrentMonth ? 'bg-[#131b2e]' : 'bg-[#131b2e]/50'}
                  ${isTodayDate ? 'ring-2 ring-[#c0c1ff]' : ''}
                  ${isDragOver ? 'bg-[#c0c1ff]/20 ring-2 ring-[#c0c1ff]' : ''}
                `}
                onDragOver={(e) => handleDragOver(e, dateStr)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, dateStr)}
              >
                <div className={`
                  text-sm font-medium mb-1
                  ${isCurrentMonth ? 'text-[#dae2fd]' : 'text-[#908fa0]'}
                  ${isTodayDate ? 'text-[#c0c1ff]' : ''}
                `}>
                  {dayDate.getDate()}
                </div>
                <div className="flex flex-col gap-1">
                  {dayEvents.slice(0, 3).map((event) => {
                    const colorClasses = getColorClasses(event.color);
                    const isDragging = draggedEventId === event.id;
                    
                    return (
                      <button
                        key={event.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, event.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onEventClick(event)}
                        className={`
                          text-left text-xs px-2 py-1 rounded truncate
                          ${colorClasses.bg} ${colorClasses.text} ${colorClasses.border}
                          border-l-2 hover:brightness-110 transition-all cursor-move
                          ${isDragging ? 'opacity-50 shadow-lg' : ''}
                        `}
                      >
                        {event.title}
                      </button>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-[#908fa0] px-2">
                      +{dayEvents.length - 3} daha
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
