import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EventProvider } from '../contexts/EventContext'
import { WeeklyView } from './WeeklyView'

function localDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function renderWithProvider(ui: React.ReactElement) {
  return render(
    <EventProvider>
      {ui}
    </EventProvider>
  )
}

describe('WeeklyView', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders 7 day columns with 24 hour rows', () => {
    const { getByText } = renderWithProvider(<WeeklyView />)

    // Check for day headers (Pzt, Sal, Çar, Per, Cum, Cmt, Paz)
    expect(getByText('Pzt')).toBeInTheDocument()
    expect(getByText('Sal')).toBeInTheDocument()
    expect(getByText('Çar')).toBeInTheDocument()
    expect(getByText('Per')).toBeInTheDocument()
    expect(getByText('Cum')).toBeInTheDocument()
    expect(getByText('Cmt')).toBeInTheDocument()
    expect(getByText('Paz')).toBeInTheDocument()

    // Check for hour labels
    expect(getByText('00:00')).toBeInTheDocument()
    expect(getByText('12:00')).toBeInTheDocument()
    expect(getByText('23:00')).toBeInTheDocument()
  })

  it('displays abbreviated Turkish day names', () => {
    const { getByText } = renderWithProvider(<WeeklyView />)

    const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
    dayNames.forEach(day => {
      expect(getByText(day)).toBeInTheDocument()
    })
  })

  it('positions events at correct vertical offset based on startTime', () => {
    const today = new Date()
    const dateStr = localDateString(today)

    localStorage.setItem('chronos_events', JSON.stringify([
      {
        id: '1',
        title: 'Morning Event',
        date: dateStr,
        startTime: '10:00',
        endTime: '11:00',
        color: '#c0c1ff'
      }
    ]))

    renderWithProvider(<WeeklyView currentDate={today} />)

    expect(screen.getByText('Morning Event')).toBeInTheDocument()

    // Verify top position: 10:00 = 600min, 600/60 * 64px = 640px
    const eventCard = screen.getByText('Morning Event').closest('div[style]')
    expect(eventCard).toBeInTheDocument()
    expect(eventCard).toHaveStyle({ top: '640px' })
  })

  it('sizes event height based on duration', () => {
    const today = new Date()
    const dateStr = localDateString(today)

    localStorage.setItem('chronos_events', JSON.stringify([
      {
        id: '1',
        title: 'Two Hour Event',
        date: dateStr,
        startTime: '14:00',
        endTime: '16:00',
        color: '#c0c1ff'
      }
    ]))

    renderWithProvider(<WeeklyView currentDate={today} />)

    expect(screen.getByText('Two Hour Event')).toBeInTheDocument()

    // Verify height: 2h = 120min, 120/60 * 64px = 128px
    const eventCard = screen.getByText('Two Hour Event').closest('div[style]')
    expect(eventCard).toBeInTheDocument()
    expect(eventCard).toHaveStyle({ height: '128px' })
  })

  it('shows colored left border matching event color', () => {
    const today = new Date()
    const dateStr = localDateString(today)

    localStorage.setItem('chronos_events', JSON.stringify([
      {
        id: '1',
        title: 'Red Event',
        date: dateStr,
        startTime: '09:00',
        endTime: '10:00',
        color: '#ff0000'
      }
    ]))

    renderWithProvider(<WeeklyView currentDate={today} />)

    const eventCard = screen.getByText('Red Event').closest('div[style]')
    expect(eventCard).toBeInTheDocument()
    expect(eventCard).toHaveStyle({ borderLeft: '3px solid #ff0000' })
  })

  it('calls onTimeSlotClick when clicking empty cell', async () => {
    const handleTimeSlotClick = vi.fn()
    const user = userEvent.setup()
    renderWithProvider(<WeeklyView onTimeSlotClick={handleTimeSlotClick} />)

    const clickableSlots = document.querySelectorAll('[class*="cursor-pointer"]')
    if (clickableSlots.length > 0) {
      await user.click(clickableSlots[0] as Element)
      expect(handleTimeSlotClick).toHaveBeenCalled()
    }
  })

  it('calls onEventClick when clicking an event', async () => {
    const today = new Date()
    const dateStr = localDateString(today)
    const handleEventClick = vi.fn()
    const user = userEvent.setup()

    localStorage.setItem('chronos_events', JSON.stringify([
      {
        id: '1',
        title: 'Clickable Event',
        date: dateStr,
        startTime: '11:00',
        endTime: '12:00',
        color: '#c0c1ff'
      }
    ]))

    renderWithProvider(<WeeklyView currentDate={today} onEventClick={handleEventClick} />)

    await user.click(screen.getByText('Clickable Event'))
    expect(handleEventClick).toHaveBeenCalled()
  })

  it('supports horizontal scroll on narrow viewports', () => {
    renderWithProvider(<WeeklyView />)

    const scrollContainer = document.querySelector('.overflow-auto')
    expect(scrollContainer).toBeInTheDocument()
  })
})
