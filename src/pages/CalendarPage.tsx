import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MonthlyView } from '../components/MonthlyView';
import { WeeklyView } from '../components/WeeklyView';
import { DailyView } from '../components/DailyView';
import { EventFormModal } from '../components/EventFormModal';
import { EventDetailModal } from '../components/EventDetailModal';
import { SearchBar } from '../components/SearchBar';
import { CalendarEmptyState, NoResultsState } from '../components/EmptyState';
import { useEvents } from '../hooks/useEvents';
import { showToast } from '../hooks/useToast';
import type { ViewMode, CalendarEvent, EventFormData } from '../types';

export function CalendarPage() {
  const [currentView, setCurrentView] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [formInitialData, setFormInitialData] = useState<Partial<EventFormData>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const { getEvents, saveEvents } = useEvents();
  const events = getEvents();

  // Filter events based on search query
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    return events.filter((event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [events, searchQuery]);

  // Navigation handlers
  const handlePrevious = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (currentView === 'month') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else if (currentView === 'week') {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() - 1);
      }
      return newDate;
    });
  }, [currentView]);

  const handleNext = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (currentView === 'month') {
        newDate.setMonth(newDate.getMonth() + 1);
      } else if (currentView === 'week') {
        newDate.setDate(newDate.getDate() + 7);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
      return newDate;
    });
  }, [currentView]);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Event handlers
  const handleCreateEvent = useCallback(() => {
    setFormInitialData({});
    setSelectedEvent(null);
    setIsFormOpen(true);
  }, []);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  }, []);

  const handleTimeSlotClick = useCallback((date: string, time: string) => {
    const [hours] = time.split(':');
    const startHour = parseInt(hours ?? '9', 10);
    const endHour = Math.min(startHour + 1, 23);
    
    setFormInitialData({
      date,
      startTime: `${startHour.toString().padStart(2, '0')}:00`,
      endTime: `${endHour.toString().padStart(2, '0')}:00`,
    });
    setSelectedEvent(null);
    setIsFormOpen(true);
  }, []);

  const handleFormSubmit = useCallback((data: EventFormData) => {
    if (selectedEvent) {
      // Update existing event
      const updatedEvents = events.map((event) =>
        event.id === selectedEvent.id ? { ...event, ...data } : event
      );
      saveEvents(updatedEvents);
      showToast('Etkinlik güncellendi', 'success');
    } else {
      // Create new event
      const newEvent: CalendarEvent = {
        id: crypto.randomUUID(),
        ...data,
      };
      saveEvents([...events, newEvent]);
      showToast('Etkinlik oluşturuldu', 'success');
    }
    setIsFormOpen(false);
    setSelectedEvent(null);
  }, [events, saveEvents, selectedEvent]);

  const handleEditEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setFormInitialData({
      title: event.title,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      description: event.description,
      color: event.color,
      reminder: event.reminder,
    });
    setIsDetailOpen(false);
    setIsFormOpen(true);
  }, []);

  const handleDeleteEvent = useCallback((id: string) => {
    const updatedEvents = events.filter((event) => event.id !== id);
    saveEvents(updatedEvents);
    setIsDetailOpen(false);
    setSelectedEvent(null);
    showToast('Etkinlik silindi', 'info');
  }, [events, saveEvents]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Render the appropriate view
  const renderView = () => {
    const viewProps = {
      events: searchQuery ? filteredEvents : events,
      onEventClick: handleEventClick,
      onTimeSlotClick: handleTimeSlotClick,
    };

    switch (currentView) {
      case 'month':
        return (
          <MonthlyView
            {...viewProps}
            date={currentDate}
            onPreviousMonth={handlePrevious}
            onNextMonth={handleNext}
            onToday={handleToday}
          />
        );
      case 'week':
        return (
          <WeeklyView
            {...viewProps}
            date={currentDate}
            onPreviousWeek={handlePrevious}
            onNextWeek={handleNext}
            onToday={handleToday}
          />
        );
      case 'day':
        return (
          <DailyView
            {...viewProps}
            date={currentDate}
            onPreviousDay={handlePrevious}
            onNextDay={handleNext}
            onToday={handleToday}
          />
        );
      default:
        return null;
    }
  };

  const hasEvents = events.length > 0;
  const hasSearchResults = filteredEvents.length > 0;

  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-surface-container-low shadow-[0_8px_32px_rgba(99,102,241,0.08)]">
        <div className="text-xl font-bold text-primary tracking-tighter font-headline">Chronos Editorial</div>
        <div className="hidden md:flex gap-8">
          <button
            onClick={() => setCurrentView('month')}
            className={`font-headline font-bold text-sm tracking-tight transition-all duration-200 ${
              currentView === 'month'
                ? 'text-primary border-b-2 border-primary pb-1'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ay
          </button>
          <button
            onClick={() => setCurrentView('week')}
            className={`font-headline font-bold text-sm tracking-tight transition-all duration-200 ${
              currentView === 'week'
                ? 'text-primary border-b-2 border-primary pb-1'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hafta
          </button>
          <button
            onClick={() => setCurrentView('day')}
            className={`font-headline font-bold text-sm tracking-tight transition-all duration-200 ${
              currentView === 'day'
                ? 'text-primary border-b-2 border-primary pb-1'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Gün
          </button>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/ayarlar"
            className="p-2 text-primary hover:bg-white/5 rounded-xl transition-all duration-200"
            aria-label="Ayarlar"
          >
            <span className="material-symbols-outlined">settings</span>
          </Link>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full flex flex-col py-8 px-4 z-40 bg-surface-container-low w-72 pt-28">
        <div className="mb-8 px-4">
          <h2 className="text-lg font-black text-primary font-headline">The Curator</h2>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Premium Plan</p>
        </div>
        
        {/* Search */}
        <div className="px-2 mb-6">
          <SearchBar onSearch={handleSearch} placeholder="Etkinlik ara..." />
        </div>
        
        <button
          onClick={handleCreateEvent}
          className="mb-6 mx-2 bg-gradient-to-br from-primary to-primary-container text-on-primary-container py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-95 transition-all duration-200"
        >
          <span className="material-symbols-outlined">add</span>
          Yeni Etkinlik
        </button>

        <nav className="flex-1 space-y-1">
          <button
            onClick={() => setCurrentView('month')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              currentView === 'month'
                ? 'bg-primary/10 text-primary'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined">calendar_month</span>
            <span>Aylık</span>
          </button>
          <button
            onClick={() => setCurrentView('week')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              currentView === 'week'
                ? 'bg-primary/10 text-primary'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined">date_range</span>
            <span>Haftalık</span>
          </button>
          <button
            onClick={() => setCurrentView('day')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              currentView === 'day'
                ? 'bg-primary/10 text-primary'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined">calendar_today</span>
            <span>Günlük</span>
          </button>
        </nav>

        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-3 text-slate-400 px-4 py-3 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-all duration-200 cursor-pointer">
            <span className="material-symbols-outlined">help</span>
            <span>Yardım</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 px-4 py-3 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-all duration-200 cursor-pointer">
            <span className="material-symbols-outlined">logout</span>
            <span>Çıkış</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 pt-28 px-12 min-h-screen">
        {!hasEvents ? (
          <CalendarEmptyState onCreateEvent={handleCreateEvent} />
        ) : searchQuery && !hasSearchResults ? (
          <NoResultsState searchQuery={searchQuery} onClearSearch={clearSearch} />
        ) : (
          renderView()
        )}
      </main>

      {/* Modals */}
      <EventFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={formInitialData}
        editingEvent={selectedEvent}
      />

      <EventDetailModal
        event={selectedEvent}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}
