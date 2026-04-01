// Event types for the calendar application

export interface Event {
  id: string
  title: string
  date: string // YYYY-MM-DD format (local)
  startTime: string // HH:mm format
  endTime: string // HH:mm format
  description?: string
  color: string
  reminder?: string
}

export type ViewMode = 'month' | 'week' | 'day'
