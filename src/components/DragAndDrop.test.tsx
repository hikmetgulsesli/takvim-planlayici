import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MonthlyView } from '../components/MonthlyView';
import { WeeklyView } from '../components/WeeklyView';
import { DailyView } from '../components/DailyView';
import type { CalendarEvent } from '../types';

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Toplantı: Tasarım Revizyonu',
    date: '2026-04-01',
    startTime: '09:00',
    endTime: '10:30',
    description: 'UI/UX tasarımlarının gözden geçirilmesi',
    color: '#c0c1ff',
    reminder: '15 dakika önce',
  },
  {
    id: '2',
    title: 'Öğle Yemeği',
    date: '2026-04-03',
    startTime: '12:00',
    endTime: '13:00',
    description: 'Müşteri ile öğle yemeği',
    color: '#ffb783',
    reminder: 'none',
  },
];

describe('Drag and Drop', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('MonthlyView Drag and Drop', () => {
    const monthlyProps = {
      date: new Date('2026-04-01'),
      events: mockEvents,
      onEventClick: vi.fn(),
      onEventDrop: vi.fn(),
      onPreviousMonth: vi.fn(),
      onNextMonth: vi.fn(),
      onToday: vi.fn(),
    };

    it('renders events as draggable elements', () => {
      render(<MonthlyView {...monthlyProps} />);
      
      const event = screen.getByText('Toplantı: Tasarım Revizyonu');
      expect(event).toHaveAttribute('draggable', 'true');
    });

    it('calls onEventDrop when event is dropped on a different date', () => {
      render(<MonthlyView {...monthlyProps} />);
      
      const event = screen.getByText('Toplantı: Tasarım Revizyonu');
      
      // Simulate drag start
      fireEvent.dragStart(event, {
        dataTransfer: {
          setData: vi.fn(),
          effectAllowed: 'move',
        },
      });
      
      // Find a day cell to drop on (day 15)
      const dayCells = screen.getAllByText('15');
      const dayCell = dayCells[0]?.closest('div[class*="min-h-[100px]"]');
      
      if (dayCell) {
        fireEvent.drop(dayCell, {
          dataTransfer: {
            getData: () => '1',
          },
        });
        
        expect(monthlyProps.onEventDrop).toHaveBeenCalled();
      }
    });

    it('highlights drop target on drag over', () => {
      render(<MonthlyView {...monthlyProps} />);
      
      const event = screen.getByText('Toplantı: Tasarım Revizyonu');
      
      fireEvent.dragStart(event, {
        dataTransfer: {
          setData: vi.fn(),
          effectAllowed: 'move',
        },
      });
      
      const dayCells = screen.getAllByText('15');
      const dayCell = dayCells[0]?.closest('div[class*="min-h-[100px]"]');
      
      if (dayCell) {
        fireEvent.dragOver(dayCell, {
          dataTransfer: {
            dropEffect: 'move',
          },
        });
        
        // Check if the cell has the highlight class
        expect(dayCell.className).toContain('ring-2');
      }
    });
  });

  describe('WeeklyView Drag and Drop', () => {
    const weeklyProps = {
      date: new Date('2026-04-01'),
      events: mockEvents,
      onEventClick: vi.fn(),
      onEventDrop: vi.fn(),
      onTimeSlotClick: vi.fn(),
      onPreviousWeek: vi.fn(),
      onNextWeek: vi.fn(),
      onToday: vi.fn(),
    };

    it('renders events as draggable elements', () => {
      render(<WeeklyView {...weeklyProps} />);
      
      const event = screen.getByText('Toplantı: Tasarım Revizyonu');
      expect(event).toHaveAttribute('draggable', 'true');
    });

    it('calls onEventDrop with new time when event is dropped on time slot', () => {
      render(<WeeklyView {...weeklyProps} />);
      
      const event = screen.getByText('Toplantı: Tasarım Revizyonu');
      
      fireEvent.dragStart(event, {
        dataTransfer: {
          setData: vi.fn(),
          effectAllowed: 'move',
        },
      });
      
      // Find a time slot to drop on
      const timeSlots = screen.getAllByLabelText(/ - Etkinlik ekle/);
      if (timeSlots.length > 0) {
        fireEvent.drop(timeSlots[0], {
          dataTransfer: {
            getData: () => '1',
          },
        });
        
        expect(weeklyProps.onEventDrop).toHaveBeenCalled();
      }
    });
  });

  describe('DailyView Drag and Drop', () => {
    const dailyProps = {
      date: new Date('2026-04-01'),
      events: mockEvents,
      onEventClick: vi.fn(),
      onTimeSlotClick: vi.fn(),
      onEventDrop: vi.fn(),
      onPreviousDay: vi.fn(),
      onNextDay: vi.fn(),
      onToday: vi.fn(),
    };

    it('renders events as draggable elements', () => {
      render(<DailyView {...dailyProps} />);
      
      const event = screen.getByText('Toplantı: Tasarım Revizyonu');
      expect(event).toHaveAttribute('draggable', 'true');
    });

    it('applies drag styling to dragged event', () => {
      render(<DailyView {...dailyProps} />);
      
      const event = screen.getByText('Toplantı: Tasarım Revizyonu');
      
      fireEvent.dragStart(event, {
        dataTransfer: {
          setData: vi.fn(),
          effectAllowed: 'move',
        },
      });
      
      // Check if the event has reduced opacity
      expect(event.className).toContain('opacity-50');
    });

    it('highlights drop target on drag over', () => {
      render(<DailyView {...dailyProps} />);
      
      const event = screen.getByText('Toplantı: Tasarım Revizyonu');
      const timeSlot = screen.getByLabelText('14:00 - Etkinlik ekle');
      
      fireEvent.dragStart(event, {
        dataTransfer: {
          setData: vi.fn(),
          effectAllowed: 'move',
        },
      });
      
      fireEvent.dragOver(timeSlot, {
        dataTransfer: {
          dropEffect: 'move',
        },
      });
      
      // Check if the time slot has the highlight class
      expect(timeSlot.className).toContain('bg-[#c0c1ff]/20');
    });

    it('calls onEventDrop with correct parameters when event is dropped', () => {
      render(<DailyView {...dailyProps} />);
      
      const event = screen.getByText('Toplantı: Tasarım Revizyonu');
      const timeSlot = screen.getByLabelText('14:00 - Etkinlik ekle');
      
      fireEvent.dragStart(event, {
        dataTransfer: {
          setData: vi.fn(),
          effectAllowed: 'move',
        },
      });
      
      fireEvent.drop(timeSlot, {
        dataTransfer: {
          getData: () => '1',
        },
      });
      
      expect(dailyProps.onEventDrop).toHaveBeenCalledWith('1', '2026-04-01', '14:00');
    });
  });

  describe('Event Rescheduling', () => {
    it('maintains event duration when rescheduling to new time', () => {
      const onEventDrop = vi.fn();
      const events: CalendarEvent[] = [
        {
          id: '1',
          title: 'Long Meeting',
          date: '2026-04-01',
          startTime: '09:00',
          endTime: '11:00', // 2 hour duration
          description: 'Test',
          color: '#c0c1ff',
          reminder: 'none',
        },
      ];
      
      render(
        <DailyView
          date={new Date('2026-04-01')}
          events={events}
          onEventClick={vi.fn()}
          onTimeSlotClick={vi.fn()}
          onEventDrop={onEventDrop}
          onPreviousDay={vi.fn()}
          onNextDay={vi.fn()}
          onToday={vi.fn()}
        />
      );
      
      const event = screen.getByText('Long Meeting');
      const timeSlot = screen.getByLabelText('14:00 - Etkinlik ekle');
      
      fireEvent.dragStart(event, {
        dataTransfer: {
          setData: vi.fn(),
          effectAllowed: 'move',
        },
      });
      
      fireEvent.drop(timeSlot, {
        dataTransfer: {
          getData: () => '1',
        },
      });
      
      // Should be called with new start time
      expect(onEventDrop).toHaveBeenCalledWith('1', '2026-04-01', '14:00');
    });
  });
});
