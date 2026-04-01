import { useState, useCallback, useRef, useEffect } from 'react';
import type { CalendarEvent } from '../types';

interface SearchBarProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onClearFilters: () => void;
}

const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

function formatTurkishDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  const dayOfWeek = DAYS[date.getDay()];
  return `${day} ${month} ${year}, ${dayOfWeek}`;
}

export function SearchBar({
  events,
  onEventClick,
  searchQuery,
  onSearchChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClearFilters,
}: SearchBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter events based on search query and date range
  const filteredEvents = events.filter((event) => {
    // Search filter (case-insensitive partial match)
    const matchesSearch = searchQuery.trim() === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Date range filter
    let matchesDateRange = true;
    if (startDate && event.date < startDate) {
      matchesDateRange = false;
    }
    if (endDate && event.date > endDate) {
      matchesDateRange = false;
    }
    
    return matchesSearch && matchesDateRange;
  });

  // Sort by date
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
    setIsDropdownOpen(true);
  }, [onSearchChange]);

  const handleInputFocus = useCallback(() => {
    if (searchQuery.trim() !== '') {
      setIsDropdownOpen(true);
    }
  }, [searchQuery]);

  const handleEventSelect = useCallback((event: CalendarEvent) => {
    onEventClick(event);
    setIsDropdownOpen(false);
    onSearchChange('');
  }, [onEventClick, onSearchChange]);

  const handleClearSearch = useCallback(() => {
    onSearchChange('');
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  }, [onSearchChange]);

  const handleClearAll = useCallback(() => {
    onClearFilters();
    setIsDropdownOpen(false);
    setIsFilterOpen(false);
  }, [onClearFilters]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasActiveFilters = searchQuery.trim() !== '' || startDate !== '' || endDate !== '';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Search Input Container */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]/60">
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="Etkinlik ara..."
            className="w-full bg-[var(--color-surface-container-lowest)] border-none rounded-full py-2.5 pl-12 pr-10 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/50 focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] flex items-center justify-center bg-[var(--color-surface-variant)]/20 rounded-full w-6 h-6 transition-colors"
              aria-label="Aramayı temizle"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`p-2.5 rounded-full transition-all duration-300 flex items-center gap-2 ${
            isFilterOpen || startDate || endDate
              ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
              : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:bg-white/5'
          }`}
          aria-label="Filtrele"
          aria-expanded={isFilterOpen}
        >
          <span className="material-symbols-outlined">tune</span>
          {(startDate || endDate) && (
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
          )}
        </button>

        {/* Clear All Button */}
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="px-4 py-2 rounded-full text-sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:bg-white/5 transition-all"
          >
            Temizle
          </button>
        )}
      </div>

      {/* Date Filter Panel */}
      {isFilterOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-[var(--color-surface-container-high)] rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-[var(--color-outline-variant)]/20 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline font-bold text-[var(--color-on-surface)]">Tarih Filtresi</h3>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--color-on-surface-variant)] mb-2 uppercase tracking-wider">
                Başlangıç Tarihi
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="w-full bg-[var(--color-surface-container-lowest)] border-none rounded-xl px-4 py-3 text-sm text-[var(--color-on-surface)] focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-[var(--color-on-surface-variant)] mb-2 uppercase tracking-wider">
                Bitiş Tarihi
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="w-full bg-[var(--color-surface-container-lowest)] border-none rounded-xl px-4 py-3 text-sm text-[var(--color-on-surface)] focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
              />
            </div>

            {(startDate || endDate) && (
              <button
                onClick={() => {
                  onStartDateChange('');
                  onEndDateChange('');
                }}
                className="w-full py-2 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-container)] transition-colors"
              >
                Tarih filtresini temizle
              </button>
            )}
          </div>
        </div>
      )}

      {/* Search Results Dropdown */}
      {isDropdownOpen && searchQuery.trim() !== '' && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-[var(--color-surface-container-high)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-[var(--color-outline-variant)]/20 z-50 overflow-hidden">
          {sortedEvents.length > 0 ? (
            <>
              <div className="px-4 py-3 border-b border-[var(--color-outline-variant)]/20">
                <p className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">
                  {sortedEvents.length} sonuç bulundu
                </p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {sortedEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleEventSelect(event)}
                    className="w-full px-4 py-3 flex items-start gap-3 hover:bg-[var(--color-surface-bright)] transition-colors text-left border-b border-[var(--color-outline-variant)]/10 last:border-b-0"
                  >
                    <div 
                      className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: event.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--color-on-surface)] truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
                        {formatTurkishDate(event.date)} · {event.startTime} - {event.endTime}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-[var(--color-on-surface-variant)]/50 text-lg">
                      chevron_right
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="px-4 py-8 text-center">
              <span className="material-symbols-outlined text-4xl text-[var(--color-on-surface-variant)]/30 mb-3">
                search_off
              </span>
              <p className="text-[var(--color-on-surface-variant)]">
                Sonuç bulunamadı
              </p>
              <p className="text-xs text-[var(--color-on-surface-variant)]/60 mt-1">
                &quot;{searchQuery}&quot; ile eşleşen etkinlik yok
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
