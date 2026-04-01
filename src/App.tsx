import { useState, useCallback } from 'react';
import { EventProvider, useEvents } from './context/EventContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MonthlyView } from './components/MonthlyView';
import { WeeklyView } from './components/WeeklyView';
import { DailyView } from './components/DailyView';
import { EventFormModal } from './components/EventFormModal';
import { EventDetailModal } from './components/EventDetailModal';
import { SearchPanel } from './components/SearchPanel';
import { ToastContainer, showToast } from './components/Toast';
import type { ViewMode, CalendarEvent, EventFormData } from './types';
import './index.css';

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [formInitialData, setFormInitialData] = useState<Partial<EventFormData>>({});
  
  const { createEvent, updateEvent, deleteEvent, events } = useEvents();

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
    setFormInitialData({});
    setSelectedEvent(null);
    setIsFormOpen(true);
  }, []);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  }, []);

  const handleFormSubmit = useCallback((data: EventFormData) => {
    if (selectedEvent) {
      updateEvent(selectedEvent.id, data);
      showToast('Etkinlik güncellendi', 'success');
    } else {
      createEvent(data);
      showToast('Etkinlik oluşturuldu', 'success');
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
    });
    setIsDetailOpen(false);
    setIsFormOpen(true);
  }, []);

  const handleDeleteEvent = useCallback((id: string) => {
    deleteEvent(id);
    setIsDetailOpen(false);
    setSelectedEvent(null);
    showToast('Etkinlik silindi', 'info');
  }, [deleteEvent]);

  const renderView = () => {
    const commonProps = {
      events,
      onEventClick: handleEventClick,
      onCreateEvent: handleCreateEvent,
    };

    switch (currentView) {
      case 'month':
        return (
          <MonthlyView
            date={currentDate}
            {...commonProps}
          />
        );
      case 'week':
        return (
          <WeeklyView
            date={currentDate}
            {...commonProps}
          />
        );
      case 'day':
        return (
          <DailyView
            date={currentDate}
            {...commonProps}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <ToastContainer />
      
      <Navbar 
        currentView={currentView} 
        onViewChange={setCurrentView}
      />
      
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onCreateEvent={handleCreateEvent}
      />

      {/* Main Content */}
      <main className="ml-72 pt-28 px-8 pb-8 min-h-screen">
        {/* Navigation Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={
                currentView === 'month' ? handlePreviousMonth :
                currentView === 'week' ? handlePreviousWeek :
                handlePreviousDay
              }
              className="p-2 rounded-lg text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-all duration-200"
              aria-label="Önceki"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={handleToday}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-all duration-200"
            >
              Bugün
            </button>
            <button
              onClick={
                currentView === 'month' ? handleNextMonth :
                currentView === 'week' ? handleNextWeek :
                handleNextDay
              }
              className="p-2 rounded-lg text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-all duration-200"
              aria-label="Sonraki"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-all duration-200"
          >
            <span className="material-symbols-outlined">search</span>
            Ara
          </button>
        </div>

        {/* Calendar View */}
        <div className="h-[calc(100vh-12rem)]">
          {renderView()}
        </div>
      </main>

      {/* Modals */}
      <EventFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedEvent(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={formInitialData}
        editingEvent={selectedEvent}
      />

      <EventDetailModal
        event={selectedEvent}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedEvent(null);
        }}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />

      <SearchPanel
        events={events}
        onEventClick={handleEventClick}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <EventProvider>
      <AppContent />
    </EventProvider>
  );
}

export default App;
