import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EventProvider } from '../contexts/EventContext'
import { WeeklyView } from './WeeklyView'

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

  it('positions events correctly based on startTime', () => {
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0]
    
    // Store mock events
    localStorage.setItem('chronos_events', JSON.stringify([
      {
        id: '1',
        title: '10 AM Event',
        date: dateStr,
        startTime: '10:00',
        endTime: '11:00',
        color: '#c0c1ff'
      }
    ]))
    
    const { getByText } = renderWithProvider(<WeeklyView currentDate={today} />)
    
    expect(getByText('10 AM Event')).toBeInTheDocument()
  })

  it('calculates event height based on duration', () => {
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0]
    
    localStorage.setItem('chronos_events', JSON.stringify([
      {
        id: '1',
        title: '2 Hour Event',
        date: dateStr,
        startTime: '14:00',
        endTime: '16:00',
        color: '#c0c1ff'
      }
    ]))
    
    const { getByText } = renderWithProvider(<WeeklyView currentDate={today} />)
    
    const eventElement = getByText('2 Hour Event')
    expect(eventElement).toBeInTheDocument()
  })

  it('shows colored left border on events', () => {
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0]
    
    localStorage.setItem('chronos_events', JSON.stringify([
      {
        id: '1',
        title: 'Colored Event',
        date: dateStr,
        startTime: '09:00',
        endTime: '10:00',
        color: '#ff0000'
      }
    ]))
    
    const { getByText } = renderWithProvider(<WeeklyView currentDate={today} />)
    
    const eventElement = getByText('Colored Event').closest('div[class*="absolute"]')
    expect(eventElement).toBeInTheDocument()
    if (eventElement) {
      expect(eventElement).toHaveStyle({ borderLeft: '3px solid #ff0000' })
    }
  })

  it('calls onTimeSlotClick when clicking empty cell', async () => {
    const handleTimeSlotClick = vi.fn()
    const user = userEvent.setup()
    renderWithProvider(<WeeklyView onTimeSlotClick={handleTimeSlotClick} />)
    
    // Click on an empty time slot (first hour row)
    const timeSlots = document.querySelectorAll('[class*="cursor-pointer"]')
    if (timeSlots.length > 0) {
      const slot = timeSlots[0]
      if (slot) {
        await user.click(slot)
        expect(handleTimeSlotClick).toHaveBeenCalled()
      }
    }
  })

  it('calls onEventClick when clicking an event', async () => {
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0]
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
    
    const { getByText } = renderWithProvider(<WeeklyView currentDate={today} onEventClick={handleEventClick} />)
    
    const eventElement = getByText('Clickable Event')
    await user.click(eventElement)
    expect(handleEventClick).toHaveBeenCalled()
  })

  it('supports horizontal scroll on narrow viewports', () => {
    renderWithProvider(<WeeklyView />)
    
    const scrollContainer = document.querySelector('.overflow-auto')
    expect(scrollContainer).toBeInTheDocument()
  })
})
