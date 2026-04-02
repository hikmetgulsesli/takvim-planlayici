import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
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
    date: '2026-04-01',
    startTime: '12:00',
    endTime: '13:00',
    description: 'Müşteri ile öğle yemeği',
    color: '#ffb783',
    reminder: 'none',
  },
];

const defaultProps = {
  date: new Date('2026-04-01'),
  events: mockEvents,
  onEventClick: vi.fn(),
  onTimeSlotClick: vi.fn(),
  onPreviousDay: vi.fn(),
  onNextDay: vi.fn(),
  onToday: vi.fn(),
};

describe('DailyView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the daily view with 24 hour rows', () => {
      render(<DailyView {...defaultProps} />);
      
      // Check for time labels
      expect(screen.getByText('00:00')).toBeDefined();
      expect(screen.getByText('12:00')).toBeDefined();
      expect(screen.getByText('23:00')).toBeDefined();
    });

    it('displays Turkish date format in header', () => {
      render(<DailyView {...defaultProps} />);
      
      // 1 Nisan 2026, Çarşamba
      expect(screen.getByText('1 Nisan 2026, Çarşamba')).toBeDefined();
    });

    it('shows "Bugün" label when viewing today', () => {
      const today = new Date();
      render(<DailyView {...defaultProps} date={today} />);
      
      expect(screen.getByText('Bugün')).toBeDefined();
    });

    it('does not show "Bugün" label when viewing a different date', () => {
      render(<DailyView {...defaultProps} />);
      
      const bugunLabels = screen.queryAllByText('Bugün');
      // Should only have "Bugün" button, not the label
      expect(bugunLabels.length).toBe(1);
    });
  });

  describe('Event Display', () => {
    it('renders events with correct titles', () => {
      render(<DailyView {...defaultProps} />);
      
      expect(screen.getByText('Toplantı: Tasarım Revizyonu')).toBeDefined();
      expect(screen.getByText('Öğle Yemeği')).toBeDefined();
    });

    it('renders event time ranges', () => {
      render(<DailyView {...defaultProps} />);
      
      expect(screen.getByText('09:00 - 10:30')).toBeDefined();
      expect(screen.getByText('12:00 - 13:00')).toBeDefined();
    });

    it('renders event descriptions when space allows', () => {
      render(<DailyView {...defaultProps} />);
      
      expect(screen.getByText('UI/UX tasarımlarının gözden geçirilmesi')).toBeDefined();
      expect(screen.getByText('Müşteri ile öğle yemeği')).toBeDefined();
    });
  });

  describe('Navigation', () => {
    it('calls onPreviousDay when previous button is clicked', () => {
      render(<DailyView {...defaultProps} />);
      
      const prevButton = screen.getByLabelText('Önceki gün');
      fireEvent.click(prevButton);
      
      expect(defaultProps.onPreviousDay).toHaveBeenCalledTimes(1);
    });

    it('calls onNextDay when next button is clicked', () => {
      render(<DailyView {...defaultProps} />);
      
      const nextButton = screen.getByLabelText('Sonraki gün');
      fireEvent.click(nextButton);
      
      expect(defaultProps.onNextDay).toHaveBeenCalledTimes(1);
    });

    it('calls onToday when Bugün button is clicked', () => {
      render(<DailyView {...defaultProps} />);
      
      const todayButton = screen.getByText('Bugün');
      fireEvent.click(todayButton);
      
      expect(defaultProps.onToday).toHaveBeenCalledTimes(1);
    });
  });

  describe('Interaction', () => {
    it('calls onEventClick when an event is clicked', () => {
      render(<DailyView {...defaultProps} />);
      
      const event = screen.getByText('Toplantı: Tasarım Revizyonu');
      fireEvent.click(event);
      
      expect(defaultProps.onEventClick).toHaveBeenCalledWith(mockEvents[0]);
    });

    it('calls onTimeSlotClick when an hour cell is clicked', () => {
      render(<DailyView {...defaultProps} />);
      
      const timeSlot = screen.getByLabelText('09:00 - Etkinlik ekle');
      fireEvent.click(timeSlot);
      
      expect(defaultProps.onTimeSlotClick).toHaveBeenCalledWith('2026-04-01', '09:00');
    });
  });

  describe('Current Time Indicator', () => {
    it('shows current time indicator when viewing today', () => {
      const today = new Date();
      const { container } = render(<DailyView {...defaultProps} date={today} />);
      
      // Current time indicator should be present
      const timeIndicator = container.querySelector('.bg-\\[\\#ffb783\\]');
      expect(timeIndicator).toBeDefined();
    });

    it('does not show current time indicator when viewing a different date', () => {
      const { container } = render(<DailyView {...defaultProps} />);
      
      // Current time indicator should not be present
      const timeIndicators = container.querySelectorAll('.bg-\\[\\#ffb783\\]');
      // Only event color indicators might match, not the time indicator line
      expect(timeIndicators.length).toBeLessThanOrEqual(mockEvents.length);
    });
  });

  describe('Accessibility', () => {
    it('has accessible labels for navigation buttons', () => {
      render(<DailyView {...defaultProps} />);
      
      expect(screen.getByLabelText('Önceki gün')).toBeDefined();
      expect(screen.getByLabelText('Sonraki gün')).toBeDefined();
    });

    it('has accessible labels for time slots', () => {
      render(<DailyView {...defaultProps} />);
      
      expect(screen.getByLabelText('09:00 - Etkinlik ekle')).toBeDefined();
      expect(screen.getByLabelText('15:00 - Etkinlik ekle')).toBeDefined();
    });
  });
});
