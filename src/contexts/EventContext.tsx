import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Event } from '../types'

interface EventContextType {
  events: Event[]
  addEvent: (event: Event) => void
  updateEvent: (event: Event) => void
  deleteEvent: (id: string) => void
  getEventsByDate: (date: string) => Event[]
  getEventsByMonth: (year: number, month: number) => Event[]
  getEventsByWeek: (startDate: Date) => Event[]
}

const EventContext = createContext<EventContextType | undefined>(undefined)

const STORAGE_KEY = 'chronos_events'

// Helper to format a Date as local YYYY-MM-DD
function localDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Helper to get week dates as local date strings
function getWeekDates(startDate: Date): string[] {
  const dates: string[] = []
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)

  // Adjust to Monday (Turkish week starts Monday)
  const day = start.getDay()
  const diff = start.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(start)
  monday.setDate(diff)

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    dates.push(localDateString(date))
  }
  return dates
}

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored) as Event[]
      }
    } catch {
      // Storage error, use demo data
    }
    // Demo events
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(today)
    monday.setDate(today.getDate() + diff)

    return [
      {
        id: '1',
        title: 'Editoryal Toplantı',
        date: localDateString(monday),
        startTime: '10:00',
        endTime: '11:30',
        color: '#c0c1ff',
        description: 'Haftalık editoryal planlama toplantısı'
      },
      {
        id: '2',
        title: 'Lansman Hazırlığı',
        date: localDateString(new Date(monday.getTime() + 2 * 24 * 60 * 60 * 1000)),
        startTime: '14:00',
        endTime: '16:00',
        color: '#ffb783',
        description: 'Yeni ürün lansmanı hazırlıkları'
      },
      {
        id: '3',
        title: 'Tasarım Revizyonu',
        date: localDateString(today),
        startTime: '14:30',
        endTime: '15:30',
        color: '#8083ff',
        description: 'UI/UX tasarım revizyonu'
      }
    ]
  })

  const saveEvents = useCallback((newEvents: Event[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents))
    } catch {
      // Storage error
    }
  }, [])

  const addEvent = useCallback((event: Event) => {
    setEvents((prev) => {
      const newEvents = [...prev, event]
      saveEvents(newEvents)
      return newEvents
    })
  }, [saveEvents])

  const updateEvent = useCallback((event: Event) => {
    setEvents((prev) => {
      const newEvents = prev.map((e) => (e.id === event.id ? event : e))
      saveEvents(newEvents)
      return newEvents
    })
  }, [saveEvents])

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => {
      const newEvents = prev.filter((e) => e.id !== id)
      saveEvents(newEvents)
      return newEvents
    })
  }, [saveEvents])

  const getEventsByDate = useCallback((date: string): Event[] => {
    return events.filter((e) => e.date === date)
  }, [events])

  const getEventsByMonth = useCallback((year: number, month: number): Event[] => {
    return events.filter((e) => {
      const [ey, em] = e.date.split('-').map(Number)
      return ey === year && em === month + 1
    })
  }, [events])

  const getEventsByWeek = useCallback((startDate: Date): Event[] => {
    const weekDates = getWeekDates(startDate)
    return events.filter((e) => weekDates.includes(e.date))
  }, [events])

  return (
    <EventContext.Provider
      value={{ events, addEvent, updateEvent, deleteEvent, getEventsByDate, getEventsByMonth, getEventsByWeek }}
    >
      {children}
    </EventContext.Provider>
  )
}

export function useEventContext() {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error('useEventContext must be used within EventProvider')
  }
  return context
}
