import { useState, useCallback } from 'react';
import type { CalendarEvent } from '../types';

interface WeeklyViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onEventDrop: (eventId: string, newDate: string, newStartTime?: string) => void;
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

const parseTimeToMinutes = (time: string): number => {
  const parts = time.split(':');
  const hours = parseInt(parts[0] ?? '0', 10);
  const minutes = parseInt(parts[1] ?? '0', 10);
  return hours * 60 + minutes;
};

const getEventPosition = (startTime: string, endTime: string): { top: number; height: number } => {
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);
  const top = (startMinutes / 1440) * 100;
  const height = ((endMinutes - startMinutes) / 1440) * 100;
  return { top, height };
};

export function WeeklyView({
  date,
  events,
  onEventClick,
  onEventDrop,
  onTimeSlotClick,
  onPreviousWeek,
  onNextWeek,
  onToday,
}: WeeklyViewProps) {
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<{ date: string; hour: number } | null>(null);

  // Get the start of the week (Monday)
  const getWeekStart = (d: Date): Date => {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const weekStart = getWeekStart(new Date(date));
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const weekEnd = weekDays[6] ?? weekStart;
  const isCurrentWeek = weekDays.some(day => isToday(day));

  const getEventsForDate = useCallback((dateStr: string) => {
    return events.filter((event) => event.date === dateStr);
  }, [events]);

  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    setDraggedEventId(eventId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', eventId);
  };

  const handleDragEnd = () => {
    setDraggedEventId(null);
    setDragOverSlot(null);
  };

  const handleDragOver = (e: React.DragEvent, dateStr: string, hour: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSlot({ date: dateStr, hour });
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (e: React.DragEvent, dateStr: string, hour: number) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData('text/plain');
    if (eventId) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      onEventDrop(eventId, dateStr, timeString);
    }
    setDraggedEventId(null);
    setDragOverSlot(null);
  };

  const handleTimeSlotClick = (dateStr: string, hour: number) => {
    const timeString = `${hour.toString().padStart(2, '0')}:00`;
    onTimeSlotClick(dateStr, timeString);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-4">
        <div>
          <h2 className="font-headline text-3xl font-bold tracking-tight text-[#dae2fd]">
            {weekStart.getDate()} {MONTHS[weekStart.getMonth()]} - {weekEnd.getDate()} {MONTHS[weekEnd.getMonth()]} {weekEnd.getFullYear()}
          </h2>
          {isCurrentWeek && (
            <p className="text-[#c0c1ff] font-medium mt-1">Bu hafta</p>
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
              onClick={onPreviousWeek}
              className="p-2 rounded-xl text-[#c0c1ff] hover:bg-white/5 transition-all"
              aria-label="Önceki hafta"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={onNextWeek}
              className="p-2 rounded-xl text-[#c0c1ff] hover:bg-white/5 transition-all"
              aria-label="Sonraki hafta"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Week Grid */}
      <div className="flex-1 overflow-auto px-4 pb-8">
        <div className="min-w-[800px]">
          {/* Day Headers */}
          <div className="grid grid-cols-8 border-b border-[#464554]/30">
            <div className="p-3"></div> {/* Empty corner */}
            {weekDays.map((day, index) => {
              const isTodayDate = isToday(day);
              return (
                <div
                  key={index}
                  className={`
                    p-3 text-center
                    ${isTodayDate ? 'bg-[#c0c1ff]/10' : ''}
                  `}
                >
                  <div className="text-sm text-[#908fa0]">{DAYS[index]}</div>
                  <div className={`
                    text-lg font-semibold
                    ${isTodayDate ? 'text-[#c0c1ff]' : 'text-[#dae2fd]'}
                  `}>
                    {day.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Grid */}
          <div className="relative">
            {HOURS.map((hour) => (
              <div key={hour} className="grid grid-cols-8 border-b border-[#464554]/10">
                {/* Time Label */}
                <div className="p-2 text-right text-xs text-[#908fa0]">
                  {formatHour(hour)}
                </div>
                
                {/* Day Columns */}
                {weekDays.map((day, dayIndex) => {
                  const dateStr = day.toISOString().split('T')[0] ?? '';
                  const isDragOver = dragOverSlot?.date === dateStr && dragOverSlot?.hour === hour;
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`
                        relative h-16 border-l border-[#464554]/10
                        ${isDragOver ? 'bg-[#c0c1ff]/20' : 'hover:bg-white/5'}
                        transition-colors cursor-pointer
                      `}
                      onDragOver={(e) => handleDragOver(e, dateStr, hour)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, dateStr, hour)}
                      onClick={() => handleTimeSlotClick(dateStr, hour)}
                    />
                  );
                })}
              </div>
            ))}

            {/* Events Overlay */}
            {weekDays.map((day, dayIndex) => {
              const dateStr = day.toISOString().split('T')[0] ?? '';
              const dayEvents = getEventsForDate(dateStr);
              
              return dayEvents.map((event) => {
                const { top, height } = getEventPosition(event.startTime, event.endTime);
                const colorClasses = getColorClasses(event.color);
                const isDragging = draggedEventId === event.id;
                
                return (
                  <button
                    key={event.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, event.id)}
                    onDragEnd={handleDragEnd}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className={`
                      absolute text-left rounded-lg p-2 overflow-hidden
                      ${colorClasses.bg} border-l-2 ${colorClasses.border} ${colorClasses.text}
                      hover:brightness-110 transition-all cursor-move
                      ${isDragging ? 'opacity-50 shadow-lg scale-105' : ''}
                    `}
                    style={{
                      left: `${(dayIndex + 1) * 12.5}%`,
                      top: `${top}%`,
                      width: '11.5%',
                      height: `${Math.max(height, 3)}%`,
                    }}
                  >
                    <div className="font-semibold text-xs truncate">{event.title}</div>
                    <div className="text-xs opacity-80">
                      {event.startTime} - {event.endTime}
                    </div>
                  </button>
                );
              });
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
