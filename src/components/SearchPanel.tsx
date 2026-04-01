import { useState, useMemo } from 'react';
import type { CalendarEvent } from '../types';
import { EmptyState } from './EmptyState';

interface SearchPanelProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  isOpen: boolean;
  onClose: () => void;
}

const COLOR_MAP: Record<string, string> = {
  '#c0c1ff': 'bg-[#c0c1ff]/20 text-[#c0c1ff] border-[#c0c1ff]',
  '#ffb783': 'bg-[#ffb783]/20 text-[#ffb783] border-[#ffb783]',
  '#ffb4ab': 'bg-[#ffb4ab]/20 text-[#ffb4ab] border-[#ffb4ab]',
  '#8083ff': 'bg-[#8083ff]/20 text-[#8083ff] border-[#8083ff]',
  '#31394d': 'bg-[#31394d]/50 text-[#dae2fd] border-[#31394d]',
  '#d97721': 'bg-[#d97721]/20 text-[#ffb783] border-[#d97721]',
  '#10b981': 'bg-emerald-400/20 text-emerald-400 border-emerald-400',
  '#14b8a6': 'bg-teal-300/20 text-teal-300 border-teal-300',
};

const getColorClasses = (color: string): string => {
  return COLOR_MAP[color] || 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] border-[var(--color-primary)]';
};

const formatTurkishDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  return `${date.getDate()} ${months[date.getMonth()]}`;
};

export function SearchPanel({ events, onEventClick, isOpen, onClose }: SearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Search filter (case-insensitive partial match)
      const matchesSearch = searchQuery.trim() === '' || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Date range filter
      let matchesDateRange = true;
      if (startDate && event.date < startDate) {
        matchesDateRange = false;
      }
      if (endDate && event.date > endDate) {
        matchesDateRange = false;
      }
      
      return matchesSearch && matchesDateRange;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, searchQuery, startDate, endDate]);

  const hasActiveFilters = searchQuery || startDate || endDate;
  const hasNoResults = hasActiveFilters && filteredEvents.length === 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[var(--color-surface)]/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl max-h-[80vh] glass-morphism rounded-2xl shadow-[0_32px_64px_rgba(128,131,255,0.12)] border border-[var(--color-outline-variant)]/15 flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-outline-variant)]/15">
          <h2 className="font-headline text-xl font-bold text-[var(--color-on-surface)]">
            Etkinlik Ara
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
            aria-label="Kapat"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Search Filters */}
        <div className="p-6 space-y-4 border-b border-[var(--color-outline-variant)]/15">
          {/* Search Input */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Etkinlik ara..."
              className="w-full bg-[var(--color-surface-container-highest)] border border-transparent rounded-xl pl-12 pr-4 py-3 
                text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/50
                focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                transition-all duration-200"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-on-surface-variant)] mb-2">
                Başlangıç Tarihi
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[var(--color-surface-container-highest)] border border-transparent rounded-xl px-4 py-3 
                  text-[var(--color-on-surface)]
                  focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                  transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-on-surface-variant)] mb-2">
                Bitiş Tarihi
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[var(--color-surface-container-highest)] border border-transparent rounded-xl px-4 py-3 
                  text-[var(--color-on-surface)]
                  focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                  transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-auto p-6">
          {hasNoResults ? (
            <EmptyState
              icon="search_off"
              title="Sonuç Bulunamadı"
              message="Arama kriterlerinize uygun etkinlik bulunamadı."
            />
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12 text-[var(--color-on-surface-variant)]">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-50">search</span>
              <p>Arama yapmak için yukarıdaki alanları kullanın</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-[var(--color-on-surface-variant)] mb-4">
                {filteredEvents.length} etkinlik bulundu
              </div>
              {filteredEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => {
                    onEventClick(event);
                    onClose();
                  }}
                  className="w-full text-left p-4 rounded-xl bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] transition-all duration-200 group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-2 h-2 rounded-full mt-2 ${getColorClasses(event.color).split(' ')[0]}`} />
                    <div className="flex-1">
                      <div className="font-semibold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">
                        {event.title}
                      </div>
                      <div className="text-sm text-[var(--color-on-surface-variant)] mt-1">
                        {formatTurkishDate(event.date)} · {event.startTime} - {event.endTime}
                      </div>
                      {event.description && (
                        <div className="text-sm text-[var(--color-on-surface-variant)]/70 mt-1 truncate">
                          {event.description}
                        </div>
                      )}
                    </div>
                    <span className="material-symbols-outlined text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)] transition-colors">
                      chevron_right
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
