import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SearchPanel } from '../components/SearchPanel';
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

const defaultProps = {
  events: mockEvents,
  onEventClick: vi.fn(),
  isOpen: true,
  onClose: vi.fn(),
};

describe('SearchPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders search input', () => {
      render(<SearchPanel {...defaultProps} />);
      expect(screen.getByPlaceholderText('Etkinlik ara...')).toBeInTheDocument();
    });

    it('renders date range inputs', () => {
      render(<SearchPanel {...defaultProps} />);
      expect(screen.getByLabelText('Başlangıç Tarihi')).toBeInTheDocument();
      expect(screen.getByLabelText('Bitiş Tarihi')).toBeInTheDocument();
    });

    it('renders close button', () => {
      render(<SearchPanel {...defaultProps} />);
      expect(screen.getByLabelText('Kapat')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('filters events by search query', () => {
      render(<SearchPanel {...defaultProps} />);
      const searchInput = screen.getByPlaceholderText('Etkinlik ara...');
      
      fireEvent.change(searchInput, { target: { value: 'Toplantı' } });
      
      expect(screen.getByText('Toplantı: Tasarım Revizyonu')).toBeInTheDocument();
      expect(screen.queryByText('Öğle Yemeği')).not.toBeInTheDocument();
    });

    it('shows no results message when search returns empty', () => {
      render(<SearchPanel {...defaultProps} />);
      const searchInput = screen.getByPlaceholderText('Etkinlik ara...');
      
      fireEvent.change(searchInput, { target: { value: 'Olmayan Etkinlik' } });
      
      expect(screen.getByText('Sonuç Bulunamadı')).toBeInTheDocument();
      expect(screen.getByText('Arama kriterlerinize uygun etkinlik bulunamadı.')).toBeInTheDocument();
    });

    it('displays Turkish no results message correctly', () => {
      render(<SearchPanel {...defaultProps} />);
      const searchInput = screen.getByPlaceholderText('Etkinlik ara...');
      
      fireEvent.change(searchInput, { target: { value: 'XYZ123' } });
      
      const message = screen.getByText(/Arama kriterlerinize uygun etkinlik bulunamadı/);
      expect(message).toBeInTheDocument();
    });
  });

  describe('Event Selection', () => {
    it('calls onEventClick when event is clicked', () => {
      render(<SearchPanel {...defaultProps} />);
      const searchInput = screen.getByPlaceholderText('Etkinlik ara...');
      
      fireEvent.change(searchInput, { target: { value: 'Toplantı' } });
      
      const eventButton = screen.getByText('Toplantı: Tasarım Revizyonu').closest('button');
      if (eventButton) {
        fireEvent.click(eventButton);
        expect(defaultProps.onEventClick).toHaveBeenCalledWith(mockEvents[0]);
        expect(defaultProps.onClose).toHaveBeenCalled();
      }
    });
  });
});
