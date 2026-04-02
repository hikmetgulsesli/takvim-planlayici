import { useState, useCallback, useMemo } from 'react';
import { useEvents } from './context/EventContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DailyView } from './components/DailyView';
import { MonthlyView } from './components/MonthlyView';
import { WeeklyView } from './components/WeeklyView';
import { EventFormModal } from './components/EventFormModal';
import { EventDetailModal } from './components/EventDetailModal';
import { ToastContainer } from './components/Toast';
import { EmptyState } from './components/EmptyState';
import type { ViewMode, CalendarEvent, EventFormData } from './types';
import './index.css';

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewMode>('day');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [formInitialData, setFormInitialData] = useState<Partial<EventFormData>>({});
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const { createEvent, updateEvent, deleteEvent, getEventsByDate, events } = useEvents();

  // Filter events based on search
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Search filter (case-insensitive partial match)
      return searchQuery.trim() === '' || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [events, searchQuery]);

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

  const handleTimeSlotClick = useCallback((date: string, time: string) => {
    const [hoursStr] = time.split(':');
    const hours = parseInt(hoursStr ?? '0', 10);
    const endHour = Math.min(hours + 1, 23);
    const endTime = `${endHour.toString().padStart(2, '0')}:00`;
    
    setFormInitialData({
      date,
      startTime: time,
      endTime,
    });
    setSelectedEvent(null);
    setIsFormOpen(true);
  }, []);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  }, []);

  const handleCreateEvent = useCallback(() => {
    setFormInitialData({});
    setSelectedEvent(null);
    setIsFormOpen(true);
  }, []);

  const handleFormSubmit = useCallback((data: EventFormData) => {
    if (selectedEvent) {
      updateEvent(selectedEvent.id, data);
    } else {
      createEvent(data);
    }
    setIsFormOpen(false);
    setSelectedEvent(null);
  }, [selectedEvent, createEvent, updateEvent]);

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
    } as Partial<EventFormData>);
    setIsDetailOpen(false);
    setIsFormOpen(true);
  }, []);

  const handleDeleteEvent = useCallback((id: string) => {
    deleteEvent(id);
    setIsDetailOpen(false);
    setSelectedEvent(null);
  }, [deleteEvent]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setShowSearchResults(query.trim() !== '');
  }, []);

  const currentDateStr = currentDate.toISOString().split('T')[0] ?? '';
  const todaysEvents = getEventsByDate(currentDateStr);

  // Get filtered events for the current view
  const getViewEvents = () => {
    if (showSearchResults) {
      return filteredEvents;
    }
    return events;
  };

  const viewEvents = getViewEvents();

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        onCreateEvent={handleCreateEvent}
      />
      
      <main className="ml-72 pt-24 px-8 min-h-screen">
        {/* Search Bar */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Etkinlik ara..."
              className="
                w-full bg-[var(--color-surface-container)] border border-transparent rounded-lg 
                py-3 pl-12 pr-4 text-[var(--color-on-surface)] 
                placeholder:text-[var(--color-on-surface-variant)]/50
                focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                transition-all duration-200 outline-none
              "
            />
          </div>
          {showSearchResults && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowSearchResults(false);
              }}
              className="px-4 py-3 rounded-lg text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] transition-all duration-200"
            >
              Temizle
            </button>
          )}
        </div>

        {/* Search Results Empty State */}
        {showSearchResults && filteredEvents.length === 0 && (
          <div className="animate-fade-in">
            <EmptyState
              icon="search_off"
              title="Sonuç bulunamadı"
              message="Arama kriterlerinize uygun etkinlik bulunamadı."
              action={{
                label: 'Tüm Etkinlikleri Göster',
                onClick: () => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }
              }}
            />
          </div>
        )}

        {/* Calendar Views */}
        {(!showSearchResults || filteredEvents.length > 0) && (
          <>
            {currentView === 'day' && (
              <DailyView
                date={currentDate}
                events={showSearchResults ? filteredEvents.filter(e => e.date === currentDateStr) : todaysEvents}
                onEventClick={handleEventClick}
                onTimeSlotClick={handleTimeSlotClick}
                onPreviousDay={handlePreviousDay}
                onNextDay={handleNextDay}
                onToday={handleToday}
              />
            )}
            
            {currentView === 'month' && (
              <MonthlyView
                date={currentDate}
                events={viewEvents}
                onEventClick={handleEventClick}
                onPreviousMonth={handlePreviousMonth}
                onNextMonth={handleNextMonth}
                onToday={handleToday}
              />
            )}
            
            {currentView === 'week' && (
              <WeeklyView
                date={currentDate}
                events={viewEvents}
                onEventClick={handleEventClick}
                onTimeSlotClick={handleTimeSlotClick}
                onPreviousWeek={handlePreviousWeek}
                onNextWeek={handleNextWeek}
                onToday={handleToday}
              />
            )}
          </>
        )}
      </main>

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

      <ToastContainer />
    </div>
  );
}
export default AppContent;
