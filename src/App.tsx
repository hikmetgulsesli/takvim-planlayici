import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EventProvider, useEvents } from './context/EventContext';
import { MonthlyView } from './components/MonthlyView';
import { WeeklyView } from './components/WeeklyView';
import { DailyView } from './components/DailyView';
import { EventFormModal } from './components/EventFormModal';
import { ToastContainer } from './components/common/Toast';
import type { ViewMode, CalendarEvent, EventFormData } from './types';
import './index.css';

// Navigation component with view toggle
function ViewToggle({ currentView, onViewChange }: { currentView: ViewMode; onViewChange: (view: ViewMode) => void }) {
  const views: { value: ViewMode; label: string }[] = [
    { value: 'month', label: 'Ay' },
    { value: 'week', label: 'Hafta' },
    { value: 'day', label: 'Gün' },
  ];

  return (
    <div className="flex items-center gap-1 bg-[var(--color-surface-container)] rounded-lg p-1">
      {views.map((view) => (
        <button
          key={view.value}
          onClick={() => onViewChange(view.value)}
          className={`
            px-4 py-2 rounded-md font-medium text-sm transition-all duration-200
            ${currentView === view.value
              ? 'bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] shadow-sm'
              : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)]'
            }
          `}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}

// Search component
function SearchInput({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <div className="relative">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">
        search
      </span>
      <input
        type="text"
        placeholder="Etkinlik ara..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-64 bg-[var(--color-surface-container)] border border-transparent rounded-lg pl-10 pr-4 py-2 
          text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/50
          focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
          transition-all duration-200 outline-none"
      />
    </div>
  );
}

// Header component
function Header({
  currentView,
  onViewChange,
  onToday,
  onCreateEvent,
  onSearch,
}: {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onToday: () => void;
  onCreateEvent: () => void;
  onSearch: (query: string) => void;
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-surface-container-low)] border-b border-[var(--color-outline-variant)]/20">
      <div className="flex items-center justify-between h-16 px-6">
        {/* App Title */}
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">calendar_today</span>
          <h1 className="text-xl font-bold text-[var(--color-on-surface)] font-headline">Takvim Planlayıcı</h1>
        </div>

        {/* View Toggle */}
        <ViewToggle currentView={currentView} onViewChange={onViewChange} />

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToday}
            className="px-4 py-2 rounded-lg text-[var(--color-on-surface)] bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] transition-all duration-200 font-medium text-sm"
          >
            Bugün
          </button>
          <SearchInput onSearch={onSearch} />
          <button
            onClick={onCreateEvent}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] text-[var(--color-on-primary)] font-semibold shadow-lg shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Etkinlik Ekle
          </button>
        </div>
      </div>
    </header>
  );
}

// Calendar Page component
function CalendarPage() {
  const [currentView, setCurrentView] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { events, createEvent } = useEvents();

  const handlePreviousMonth = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  }, []);

  const handlePreviousWeek = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  }, []);

  const handleNextWeek = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  }, []);

  const handlePreviousDay = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  }, []);

  const handleNextDay = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  }, []);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const handleCreateEvent = useCallback(() => {
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  const handleSubmitEvent = useCallback((data: EventFormData) => {
    createEvent(data);
    setIsFormOpen(false);
  }, [createEvent]);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    // For now, just log the event click - can be extended to show detail modal
    console.log('Event clicked:', event);
  }, []);

  const handleTimeSlotClick = useCallback((date: string, time: string) => {
    console.log('Time slot clicked:', date, time);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Filter events based on search query
  const filteredEvents = searchQuery.trim()
    ? events.filter((e) =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : events;

  const renderView = () => {
    switch (currentView) {
      case 'month':
        return (
          <MonthlyView
            date={currentDate}
            events={filteredEvents}
            onEventClick={handleEventClick}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
          />
        );
      case 'week':
        return (
          <WeeklyView
            date={currentDate}
            events={filteredEvents}
            onEventClick={handleEventClick}
            onTimeSlotClick={handleTimeSlotClick}
            onPreviousWeek={handlePreviousWeek}
            onNextWeek={handleNextWeek}
            onToday={handleToday}
          />
        );
      case 'day':
        return (
          <DailyView
            date={currentDate}
            events={filteredEvents}
            onEventClick={handleEventClick}
            onTimeSlotClick={handleTimeSlotClick}
            onPreviousDay={handlePreviousDay}
            onNextDay={handleNextDay}
            onToday={handleToday}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <ToastContainer />
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onToday={handleToday}
        onCreateEvent={handleCreateEvent}
        onSearch={handleSearch}
      />
      <main className="pt-20 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
      <EventFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitEvent}
      />
    </div>
  );
}

// Settings Page component
function SettingsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <ToastContainer />
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-surface-container-low)] border-b border-[var(--color-outline-variant)]/20">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">settings</span>
            <h1 className="text-xl font-bold text-[var(--color-on-surface)] font-headline">Ayarlar</h1>
          </div>
          <a
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-all duration-200"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Takvime Dön
          </a>
        </div>
      </header>
      <main className="pt-20 px-6 pb-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[var(--color-surface-container)] rounded-2xl p-8">
            <h2 className="text-2xl font-headline font-bold text-[var(--color-on-surface)] mb-6">
              Uygulama Ayarları
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-[var(--color-outline-variant)]/20">
                <div>
                  <h3 className="font-medium text-[var(--color-on-surface)]">Bildirimler</h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)]">Etkinlik hatırlatıcıları al</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[var(--color-surface-container-high)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2">
                  <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-[var(--color-primary)] transition-transform" />
                </button>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-[var(--color-outline-variant)]/20">
                <div>
                  <h3 className="font-medium text-[var(--color-on-surface)]">Koyu Tema</h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)]">Koyu renk temasını kullan</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[var(--color-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2">
                  <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                </button>
              </div>
              <div className="flex items-center justify-between py-4">
                <div>
                  <h3 className="font-medium text-[var(--color-on-surface)]">Veri Yönetimi</h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)]">Etkinliklerinizi dışa aktarın veya içe aktarın</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-lg text-[var(--color-primary)] hover:bg-[var(--color-surface-container-high)] transition-all duration-200 text-sm font-medium">
                    Dışa Aktar
                  </button>
                  <button className="px-4 py-2 rounded-lg text-[var(--color-primary)] hover:bg-[var(--color-surface-container-high)] transition-all duration-200 text-sm font-medium">
                    İçe Aktar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Main App component with routing
function App() {
  return (
    <EventProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/ayarlar" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </EventProvider>
  );
}

export default App;
