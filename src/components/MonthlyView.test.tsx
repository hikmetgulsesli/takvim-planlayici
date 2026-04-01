import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MonthlyView } from './MonthlyView';
import { EventProvider } from '../context/EventContext';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('MonthlyView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('[]');
  });

  it('renders 6 rows x 7 columns grid (42 cells)', () => {
    render(
      <EventProvider>
        <MonthlyView />
      </EventProvider>
    );

    // 7 day headers + 42 calendar cells = 49 cells total
    const cells = screen.getAllByText(/^(Pzt|Sal|Çar|Per|Cum|Cmt|Paz|\d+)$/);
    expect(cells.length).toBeGreaterThanOrEqual(49);
  });

  it('displays day headers correctly', () => {
    render(
      <EventProvider>
        <MonthlyView />
      </EventProvider>
    );

    expect(screen.getByText('Pzt')).toBeDefined();
    expect(screen.getByText('Sal')).toBeDefined();
    expect(screen.getByText('Çar')).toBeDefined();
    expect(screen.getByText('Per')).toBeDefined();
    expect(screen.getByText('Cum')).toBeDefined();
    expect(screen.getByText('Cmt')).toBeDefined();
    expect(screen.getByText('Paz')).toBeDefined();
  });

  it('shows month and year in header', () => {
    render(
      <EventProvider>
        <MonthlyView />
      </EventProvider>
    );

    const now = new Date();
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    const expectedMonth = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    
    expect(screen.getByText(expectedMonth)).toBeDefined();
  });

  it('shows "Bugün" label in header', () => {
    render(
      <EventProvider>
        <MonthlyView />
      </EventProvider>
    );

    expect(screen.getByText(/Bugün,/)).toBeDefined();
  });

  it('has navigation buttons', () => {
    render(
      <EventProvider>
        <MonthlyView />
      </EventProvider>
    );

    expect(screen.getByLabelText('Önceki ay')).toBeDefined();
    expect(screen.getByLabelText('Sonraki ay')).toBeDefined();
    expect(screen.getByText('Bugün')).toBeDefined();
  });

  it('calls onDayClick when a day cell is clicked', () => {
    const onDayClick = vi.fn();
    render(
      <EventProvider>
        <MonthlyView onDayClick={onDayClick} />
      </EventProvider>
    );

    // Find a day cell and click it
    const dayCells = screen.getAllByText(/^(\d+)$/);
    if (dayCells.length > 0) {
      fireEvent.click(dayCells[0]!);
      expect(onDayClick).toHaveBeenCalled();
    }
  });

  it('displays events when they exist', () => {
    const mockEvents = [
      {
        id: '1',
        title: 'Test Event',
        date: new Date().toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '11:00',
        description: 'Test',
        color: '#c0c1ff',
        reminder: '15 dakika önce'
      }
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockEvents));

    render(
      <EventProvider>
        <MonthlyView />
      </EventProvider>
    );

    expect(screen.getByText('Test Event')).toBeDefined();
  });

  it('shows overflow indicator when more than 3 events', () => {
    const today = new Date().toISOString().split('T')[0];
    const mockEvents = [
      { id: '1', title: 'Event 1', date: today, startTime: '10:00', endTime: '11:00', description: '', color: '#c0c1ff', reminder: '' },
      { id: '2', title: 'Event 2', date: today, startTime: '11:00', endTime: '12:00', description: '', color: '#ffb783', reminder: '' },
      { id: '3', title: 'Event 3', date: today, startTime: '12:00', endTime: '13:00', description: '', color: '#8083ff', reminder: '' },
      { id: '4', title: 'Event 4', date: today, startTime: '13:00', endTime: '14:00', description: '', color: '#ffb4ab', reminder: '' },
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockEvents));

    render(
      <EventProvider>
        <MonthlyView />
      </EventProvider>
    );

    expect(screen.getByText('+1 etkinlik')).toBeDefined();
  });

  it('calls onEventClick when an event is clicked', () => {
    const onEventClick = vi.fn();
    const today = new Date().toISOString().split('T')[0];
    const mockEvents = [
      { id: '1', title: 'Clickable Event', date: today, startTime: '10:00', endTime: '11:00', description: '', color: '#c0c1ff', reminder: '' },
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockEvents));

    render(
      <EventProvider>
        <MonthlyView onEventClick={onEventClick} />
      </EventProvider>
    );

    const eventElement = screen.getByText('Clickable Event');
    fireEvent.click(eventElement);
    expect(onEventClick).toHaveBeenCalled();
  });

  it('navigates to previous month when left arrow is clicked', () => {
    render(
      <EventProvider>
        <MonthlyView />
      </EventProvider>
    );

    const prevButton = screen.getByLabelText('Önceki ay');
    fireEvent.click(prevButton);

    // The month should have changed
    const now = new Date();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    const expectedMonth = `${monthNames[prevMonth.getMonth()]} ${prevMonth.getFullYear()}`;
    
    expect(screen.getByText(expectedMonth)).toBeDefined();
  });

  it('navigates to next month when right arrow is clicked', () => {
    render(
      <EventProvider>
        <MonthlyView />
      </EventProvider>
    );

    const nextButton = screen.getByLabelText('Sonraki ay');
    fireEvent.click(nextButton);

    // The month should have changed
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    const expectedMonth = `${monthNames[nextMonth.getMonth()]} ${nextMonth.getFullYear()}`;
    
    expect(screen.getByText(expectedMonth)).toBeDefined();
  });
});
