import { SearchBar } from './SearchBar';
import type { ViewMode, CalendarEvent } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
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

export function Navbar({
  currentView,
  onViewChange,
  events,
  onEventClick,
  searchQuery,
  onSearchChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClearFilters,
}: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-[#131b2e] shadow-[0_8px_32px_rgba(99,102,241,0.08)]">
      {/* Logo */}
      <div className="text-xl font-bold text-[#c0c1ff] tracking-tighter font-headline">
        Chronos Editorial
      </div>

      {/* Search Bar - Center */}
      <div className="hidden md:flex flex-1 justify-center max-w-xl mx-8">
        <SearchBar
          events={events}
          onEventClick={onEventClick}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
          onClearFilters={onClearFilters}
        />
      </div>

      {/* View Tabs & Actions */}
      <div className="flex items-center gap-6">
        <div className="hidden md:flex gap-8">
          <button
            onClick={() => onViewChange('month')}
            className={`font-headline font-bold text-sm tracking-tight transition-all duration-300 ${
              currentView === 'month'
                ? 'text-[#c0c1ff] border-b-2 border-[#c0c1ff] pb-1'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ay
          </button>
          <button
            onClick={() => onViewChange('week')}
            className={`font-headline font-bold text-sm tracking-tight transition-all duration-300 ${
              currentView === 'week'
                ? 'text-[#c0c1ff] border-b-2 border-[#c0c1ff] pb-1'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hafta
          </button>
          <button
            onClick={() => onViewChange('day')}
            className={`font-headline font-bold text-sm tracking-tight transition-all duration-300 ${
              currentView === 'day'
                ? 'text-[#c0c1ff] border-b-2 border-[#c0c1ff] pb-1'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Gün
          </button>
        </div>

        <button
          className="p-2 text-[#c0c1ff] hover:bg-white/5 rounded-xl transition-all duration-300"
          aria-label="Ayarlar"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
        <div className="w-10 h-10 rounded-full bg-[#2d3449] overflow-hidden">
          <img
            className="w-full h-full object-cover"
            alt="Profil"
            src="https://ui-avatars.com/api/?name=User&background=8083ff&color=0d0096"
          />
        </div>
      </div>
    </nav>
  );
}
