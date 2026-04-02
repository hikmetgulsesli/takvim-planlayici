import { useState, type DragEvent } from 'react';
import type { CalendarEvent } from '../types';

interface DailyViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (date: string, time: string) => void;
  onEventDrop?: (eventId: string, newDate: string, newStartTime?: string) => void;
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
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${day}`;
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

export function DailyView({
  date,
  events,
  onEventClick,
  onTimeSlotClick,
  onEventDrop,
  onPreviousDay,
  onNextDay,
  onToday,
}: DailyViewProps) {
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);
  const [dragOverHour, setDragOverHour] = useState<number | null>(null);

  const currentTimePosition = isToday(date) ? getCurrentTimePosition() : null;
  const currentTimePercent = currentTimePosition ? (currentTimePosition / 1440) * 100 : null;

  const handleTimeSlotClick = (hour: number) => {
    const timeString = `${hour.toString().padStart(2, '0')}:00`;
    onTimeSlotClick(formatShortDate(date), timeString);
  };

  const handleDragStart = (e: DragEvent, eventId: string) => {
    setDraggedEventId(eventId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', eventId);
  };

  const handleDragEnd = () => {
    setDraggedEventId(null);
    setDragOverHour(null);
  };

  const handleDragOver = (e: DragEvent, hour: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverHour(hour);
  };

  const handleDragLeave = () => {
    setDragOverHour(null);
  };

  const handleDrop = (e: DragEvent, hour: number) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData('text/plain');
    if (eventId && onEventDrop) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      onEventDrop(eventId, formatShortDate(date), timeString);
    }
    setDraggedEventId(null);
    setDragOverHour(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-4">
        <div>
          <h2 className="font-headline text-3xl font-bold tracking-tight text-[#dae2fd]">
            {formatTurkishDate(date)}
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
              onClick={onPreviousDay}
              className="p-2 rounded-xl text-[#c0c1ff] hover:bg-white/5 transition-all"
              aria-label="Önceki gün"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={onNextDay}
              className="p-2 rounded-xl text-[#c0c1ff] hover:bg-white/5 transition-all"
              aria-label="Sonraki gün"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Daily Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <div className="relative min-h-[1440px]">
          {/* Time Grid */}
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="absolute w-full flex"
              style={{ top: `${(hour / 24) * 100}%`, height: `${100 / 24}%` }}
            >
              {/* Time Label */}
              <div className="w-16 flex-shrink-0 text-right pr-4">
                <span className="text-xs text-[#908fa0] font-medium">
                  {formatHour(hour)}
                </span>
              </div>
              
              {/* Hour Cell */}
              <button
                onClick={() => handleTimeSlotClick(hour)}
                onDragOver={(e) => handleDragOver(e, hour)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, hour)}
                className={`
                  flex-1 border-t border-[#464554]/30 transition-colors cursor-pointer text-left
                  ${dragOverHour === hour ? 'bg-[#c0c1ff]/20' : 'hover:bg-white/5'}
                `}
                aria-label={`${formatHour(hour)} - Etkinlik ekle`}
              />
            </div>
          ))}

          {/* Current Time Indicator */}
          {currentTimePercent !== null && (
            <div
              className="absolute left-16 right-0 flex items-center pointer-events-none z-10"
              style={{ top: `${currentTimePercent}%` }}
            >
              <div className="w-2 h-2 rounded-full bg-[#ffb783] -ml-1" />
              <div className="flex-1 h-px bg-[#ffb783]/50" />
            </div>
          )}

          {/* Events */}
          {events.map((event) => {
            const { top, height } = getEventPosition(event.startTime, event.endTime);
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
                  absolute left-16 right-4 ${colorClasses.bg} border-l-2 ${colorClasses.border} ${colorClasses.text} 
                  rounded-lg p-3 text-left hover:brightness-110 transition-all cursor-move overflow-hidden
                  ${isDragging ? 'opacity-50 shadow-lg scale-[1.02]' : ''}
                `}
                style={{
                  top: `${top}%`,
                  height: `${Math.max(height, 4)}%`,
                }}
              >
                <div className="font-semibold text-sm truncate">{event.title}</div>
                <div className="text-xs opacity-80 mt-0.5">
                  {event.startTime} - {event.endTime}
                </div>
                {height > 6 && event.description && (
                  <div className="text-xs opacity-70 mt-1 line-clamp-2">
                    {event.description}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
