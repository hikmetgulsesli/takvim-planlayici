import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar } from '../components/SearchBar';
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
  {
    id: '3',
    title: 'Proje Sunumu',
    date: '2026-04-05',
    startTime: '14:00',
    endTime: '15:30',
    description: 'Yeni proje sunumu',
    color: '#8083ff',
    reminder: '30 dakika önce',
  },
];

const defaultProps = {
  events: mockEvents,
  onEventClick: vi.fn(),
  searchQuery: '',
  onSearchChange: vi.fn(),
  startDate: '',
  endDate: '',
  onStartDateChange: vi.fn(),
  onEndDateChange: vi.fn(),
  onClearFilters: vi.fn(),
};

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders search input with correct placeholder', () => {
      render(<SearchBar {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Etkinlik ara...');
      expect(input).toBeDefined();
    });

    it('renders filter button', () => {
      render(<SearchBar {...defaultProps} />);
      
      const filterButton = screen.getByLabelText('Filtrele');
      expect(filterButton).toBeDefined();
    });

    it('renders search icon', () => {
      render(<SearchBar {...defaultProps} />);
      
      expect(screen.getByText('search')).toBeDefined();
    });
  });

  describe('Search Input', () => {
    it('calls onSearchChange when typing', () => {
      render(<SearchBar {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Etkinlik ara...');
      fireEvent.change(input, { target: { value: 'toplantı' } });
      
      expect(defaultProps.onSearchChange).toHaveBeenCalledWith('toplantı');
    });

    it('shows clear button when search query is not empty', () => {
      render(<SearchBar {...defaultProps} searchQuery="toplantı" />);
      
      const clearButton = screen.getByLabelText('Aramayı temizle');
      expect(clearButton).toBeDefined();
    });

    it('calls onSearchChange with empty string when clear button is clicked', () => {
      render(<SearchBar {...defaultProps} searchQuery="toplantı" />);
      
      const clearButton = screen.getByLabelText('Aramayı temizle');
      fireEvent.click(clearButton);
      
      expect(defaultProps.onSearchChange).toHaveBeenCalledWith('');
    });
  });

  describe('Search Results Dropdown', () => {
    it('shows dropdown with matching events when search query is entered', async () => {
      render(<SearchBar {...defaultProps} searchQuery="toplantı" />);
      
      const input = screen.getByPlaceholderText('Etkinlik ara...');
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(screen.getByText('Toplantı: Tasarım Revizyonu')).toBeDefined();
      });
    });

    it('shows correct number of results', async () => {
      render(<SearchBar {...defaultProps} searchQuery="toplantı" />);
      
      const input = screen.getByPlaceholderText('Etkinlik ara...');
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(screen.getByText('1 sonuç bulundu')).toBeDefined();
      });
    });

    it('filters events case-insensitively', async () => {
      render(<SearchBar {...defaultProps} searchQuery="TOPLANTI" />);
      
      const input = screen.getByPlaceholderText('Etkinlik ara...');
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(screen.getByText('Toplantı: Tasarım Revizyonu')).toBeDefined();
      });
    });

    it('shows partial match results', async () => {
      render(<SearchBar {...defaultProps} searchQuery="tasar" />);
      
      const input = screen.getByPlaceholderText('Etkinlik ara...');
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(screen.getByText('Toplantı: Tasarım Revizyonu')).toBeDefined();
      });
    });

    it('calls onEventClick when a result is clicked', async () => {
      render(<SearchBar {...defaultProps} searchQuery="toplantı" />);
      
      const input = screen.getByPlaceholderText('Etkinlik ara...');
      fireEvent.focus(input);
      
      await waitFor(() => {
        const result = screen.getByText('Toplantı: Tasarım Revizyonu');
        fireEvent.click(result);
      });
      
      expect(defaultProps.onEventClick).toHaveBeenCalledWith(mockEvents[0]);
    });

    it('shows no results message when no events match', async () => {
      render(<SearchBar {...defaultProps} searchQuery="xyz123" />);
      
      const input = screen.getByPlaceholderText('Etkinlik ara...');
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(screen.getByText('Sonuç bulunamadı')).toBeDefined();
      });
    });

    it('displays event date and time in results', async () => {
      render(<SearchBar {...defaultProps} searchQuery="toplantı" />);
      
      const input = screen.getByPlaceholderText('Etkinlik ara...');
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(screen.getByText(/1 Nisan 2026/)).toBeDefined();
        expect(screen.getByText(/09:00 - 10:30/)).toBeDefined();
      });
    });
  });

  describe('Date Filter Panel', () => {
    it('opens filter panel when filter button is clicked', () => {
      render(<SearchBar {...defaultProps} />);
      
      const filterButton = screen.getByLabelText('Filtrele');
      fireEvent.click(filterButton);
      
      expect(screen.getByText('Tarih Filtresi')).toBeDefined();
    });

    it('shows date inputs in filter panel', () => {
      render(<SearchBar {...defaultProps} />);
      
      const filterButton = screen.getByLabelText('Filtrele');
      fireEvent.click(filterButton);
      
      expect(screen.getByText('Başlangıç Tarihi')).toBeDefined();
      expect(screen.getByText('Bitiş Tarihi')).toBeDefined();
    });

    it('calls onStartDateChange when start date is selected', () => {
      render(<SearchBar {...defaultProps} />);
      
      const filterButton = screen.getByLabelText('Filtrele');
      fireEvent.click(filterButton);
      
      const startDateInput = screen.getLabelText?.('Başlangıç Tarihi')?.nextElementSibling as HTMLInputElement;
      if (startDateInput) {
        fireEvent.change(startDateInput, { target: { value: '2026-04-01' } });
        expect(defaultProps.onStartDateChange).toHaveBeenCalledWith('2026-04-01');
      }
    });

    it('calls onEndDateChange when end date is selected', () => {
      render(<SearchBar {...defaultProps} />);
      
      const filterButton = screen.getByLabelText('Filtrele');
      fireEvent.click(filterButton);
      
      const endDateInput = screen.getLabelText?.('Bitiş Tarihi')?.nextElementSibling as HTMLInputElement;
      if (endDateInput) {
        fireEvent.change(endDateInput, { target: { value: '2026-04-30' } });
        expect(defaultProps.onEndDateChange).toHaveBeenCalledWith('2026-04-30');
      }
    });

    it('shows clear date filter button when dates are set', () => {
      render(<SearchBar {...defaultProps} startDate="2026-04-01" />);
      
      const filterButton = screen.getByLabelText('Filtrele');
      fireEvent.click(filterButton);
      
      expect(screen.getByText('Tarih filtresini temizle')).toBeDefined();
    });
  });

  describe('Clear Filters', () => {
    it('shows clear all button when filters are active', () => {
      render(<SearchBar {...defaultProps} searchQuery="toplantı" />);
      
      expect(screen.getByText('Temizle')).toBeDefined();
    });

    it('calls onClearFilters when clear all button is clicked', () => {
      render(<SearchBar {...defaultProps} searchQuery="toplantı" />);
      
      const clearButton = screen.getByText('Temizle');
      fireEvent.click(clearButton);
      
      expect(defaultProps.onClearFilters).toHaveBeenCalled();
    });

    it('calls onClearFilters when search and date filters are active', () => {
      render(
        <SearchBar 
          {...defaultProps} 
          searchQuery="toplantı" 
          startDate="2026-04-01"
          endDate="2026-04-30"
        />
      );
      
      const clearButton = screen.getByText('Temizle');
      fireEvent.click(clearButton);
      
      expect(defaultProps.onClearFilters).toHaveBeenCalled();
    });
  });

  describe('Combined Search and Date Filter', () => {
    it('filters events by both search query and date range', async () => {
      const props = {
        ...defaultProps,
        searchQuery: 'toplantı',
        startDate: '2026-04-01',
        endDate: '2026-04-02',
      };
      
      render(<SearchBar {...props} />);
      
      const input = screen.getByPlaceholderText('Etkinlik ara...');
      fireEvent.focus(input);
      
      await waitFor(() => {
        // Should show only the meeting event within the date range
        expect(screen.getByText('Toplantı: Tasarım Revizyonu')).toBeDefined();
      });
    });
  });
});
