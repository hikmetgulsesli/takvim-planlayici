import { useMemo } from 'react'
import { useEventContext } from '../contexts/EventContext'
import type { Event } from '../types'

interface WeeklyViewProps {
  currentDate?: Date
  onEventClick?: (event: Event) => void
  onTimeSlotClick?: (date: string, time: string) => void
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

function localDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  )
}

export function WeeklyView({ currentDate = new Date(), onEventClick, onTimeSlotClick }: WeeklyViewProps) {
  const { getEventsByWeek } = useEventContext()

  const weekData = useMemo(() => {
    const start = new Date(currentDate)
    start.setHours(0, 0, 0, 0)

    // Adjust to Monday (Turkish week starts Monday)
    const day = start.getDay()
    const diff = start.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(start)
    monday.setDate(diff)

    const weekDates: Date[] = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      weekDates.push(date)
    }

    const weekEvents = getEventsByWeek(monday)

    // Check if current week contains today
    const today = new Date()
    const isCurrentWeek = weekDates.some(d => isSameDay(d, today))

    return { weekDates, weekEvents, isCurrentWeek, today }
  }, [currentDate, getEventsByWeek])

  const { weekDates, weekEvents, isCurrentWeek, today } = weekData

  // Calculate current time indicator position
  const currentTimePosition = useMemo(() => {
    if (!isCurrentWeek) return null
    const now = new Date()
    const currentDayIndex = weekDates.findIndex(d => isSameDay(d, now))
    if (currentDayIndex === -1) return null

    const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes()
    return { dayIndex: currentDayIndex, minutes: minutesSinceMidnight }
  }, [isCurrentWeek, weekDates])

  const getEventPosition = (event: Event) => {
    const [startH, startM] = (event.startTime ?? '00:00').split(':').map(Number)
    const [endH, endM] = (event.endTime ?? '00:00').split(':').map(Number)

    const startMinutes = (startH ?? 0) * 60 + (startM ?? 0)
    const endMinutesTotal = (endH ?? 0) * 60 + (endM ?? 0)
    const duration = endMinutesTotal - startMinutes

    const top = (startMinutes / 60) * 64 // 64px per hour
    const height = (duration / 60) * 64

    return { top, height }
  }

  const formatHour = (hour: number) => {
    return `${String(hour).padStart(2, '0')}:00`
  }

  const handleTimeSlotClick = (date: Date, hour: number) => {
    if (onTimeSlotClick) {
      const dateStr = localDateString(date)
      const timeStr = `${String(hour).padStart(2, '0')}:00`
      onTimeSlotClick(dateStr, timeStr)
    }
  }

  return (
    <div className="flex flex-col h-full bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/15">
      {/* Header */}
      <div className="flex border-b border-outline-variant/15 bg-surface-container">
        {/* Time column header */}
        <div className="w-16 flex-shrink-0 border-r border-outline-variant/15 p-3 bg-surface-container-low">
          <span className="text-xs font-label uppercase tracking-wider text-outline">Saat</span>
        </div>
        {/* Day headers */}
        <div className="flex flex-1">
          {weekDates.map((date, index) => {
            const isToday = isSameDay(date, today)
            return (
              <div
                key={index}
                className={`flex-1 p-3 text-center border-r border-outline-variant/15 last:border-r-0 ${
                  isToday ? 'bg-primary/5' : ''
                }`}
              >
                <div className={`font-headline font-bold text-sm ${isToday ? 'text-primary' : 'text-on-surface'}`}>
                  {DAYS[index]}
                </div>
                <div className={`text-xs mt-1 ${isToday ? 'text-primary' : 'text-outline'}`}>
                  {date.getDate()}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto">
        <div className="flex min-w-[800px]">
          {/* Time labels column */}
          <div className="w-16 flex-shrink-0 bg-surface-container-low border-r border-outline-variant/15">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="h-16 border-b border-outline-variant/10 flex items-start justify-center pt-1"
              >
                <span className="text-xs text-outline font-medium">{formatHour(hour)}</span>
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="flex flex-1 relative">
            {weekDates.map((date, dayIndex) => {
              const dateStr = localDateString(date)
              const dayEvents = weekEvents.filter(e => e.date === dateStr)
              const isToday = isSameDay(date, today)

              return (
                <div
                  key={dayIndex}
                  className={`flex-1 border-r border-outline-variant/15 last:border-r-0 relative ${
                    isToday ? 'bg-primary/5' : ''
                  }`}
                >
                  {/* Hour grid lines */}
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="h-16 border-b border-outline-variant/10 cursor-pointer hover:bg-white/5 transition-colors"
                      onClick={() => handleTimeSlotClick(date, hour)}
                    />
                  ))}

                  {/* Events */}
                  {dayEvents.map((event) => {
                    const { top, height } = getEventPosition(event)
                    return (
                      <div
                        key={event.id}
                        className="absolute left-1 right-1 rounded-lg p-2 cursor-pointer hover:brightness-110 transition-all hover:scale-[1.02] overflow-hidden"
                        style={{
                          top: `${top}px`,
                          height: `${Math.max(height, 32)}px`,
                          backgroundColor: `${event.color}20`,
                          borderLeft: `3px solid ${event.color}`
                        }}
                        onClick={() => onEventClick?.(event)}
                      >
                        <div className="text-xs font-semibold text-on-surface truncate">
                          {event.title}
                        </div>
                        <div className="text-[10px] text-on-surface-variant">
                          {event.startTime} - {event.endTime}
                        </div>
                      </div>
                    )
                  })}

                  {/* Current time indicator */}
                  {currentTimePosition && currentTimePosition.dayIndex === dayIndex && (
                    <div
                      className="absolute left-0 right-0 border-t-2 border-error z-10 pointer-events-none"
                      style={{ top: `${(currentTimePosition.minutes / 60) * 64}px` }}
                    >
                      <div className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-error" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
