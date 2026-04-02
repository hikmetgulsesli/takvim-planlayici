import { useState, useCallback, useMemo } from 'react';
import { EventProvider, useEvents } from './context/EventContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DailyView } from './components/DailyView';
import { MonthlyView } from './components/MonthlyView';
import { WeeklyView } from './components/WeeklyView';
import { EventFormModal } from './components/EventFormModal';
import { EventDetailModal } from './components/EventDetailModal';
import type { ViewMode, CalendarEvent, EventFormData } from './types';
import { formatShortDate } from './types';
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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const { createEvent, updateEvent, deleteEvent, getEventsByDate, events } = useEvents();

  // Filter events based on search and date range
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
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
  }, [events, searchQuery, startDate, endDate]);

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

  const handleEventDrop = useCallback((eventId: string, newDate: string, newStartTime?: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const updates: Partial<EventFormData> = { date: newDate };
    
    if (newStartTime) {
      // Calculate new end time based on duration
      const startParts = event.startTime.split(':');
      const endParts = event.endTime.split(':');
      const startMinutes = parseInt(startParts[0] ?? '0') * 60 + parseInt(startParts[1] ?? '0');
      const endMinutes = parseInt(endParts[0] ?? '0') * 60 + parseInt(endParts[1] ?? '0');
      const duration = endMinutes - startMinutes;
      
      const newTimeParts = newStartTime.split(':');
      const newHours = parseInt(newTimeParts[0] ?? '0');
      const newMinutes = parseInt(newTimeParts[1] ?? '0');
      const newEndMinutes = newHours * 60 + newMinutes + duration;
      let newEndHours = Math.floor(newEndMinutes / 60);
      const newEndMins = newEndMinutes % 60;
      
      // Clamp to 23:59 if crossing midnight
      if (newEndHours >= 24) {
        newEndHours = 23;
      }
      
      updates.startTime = newStartTime;
      updates.endTime = `${newEndHours.toString().padStart(2, '0')}:${newEndMins.toString().padStart(2, '0')}`;
    }
    
    updateEvent(eventId, updates);
  }, [events, updateEvent]);

  const handleTimeSlotClick = useCallback((date: string, time: string) => {
    const [hoursStr] = time.split(':');
    const hours = parseInt(hoursStr ?? '0', 10);
    let endTime: string;
    if (hours === 23) {
      endTime = '23:59';
    } else {
      const endHour = hours + 1;
      endTime = `${endHour.toString().padStart(2, '0')}:00`;
    }
    
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

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
  }, []);

  const currentDateStr = formatShortDate(currentDate);
  const todaysEvents = getEventsByDate(currentDateStr);

  // Get filtered events for daily view (apply date range filter)
  const filteredTodaysEvents = useMemo(() => {
    if (!searchQuery.trim() && !startDate && !endDate) {
      return todaysEvents;
    }
    return todaysEvents.filter((event) => {
      const matchesSearch = searchQuery.trim() === '' || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase());
      let matchesDateRange = true;
      if (startDate && event.date < startDate) matchesDateRange = false;
      if (endDate && event.date > endDate) matchesDateRange = false;
      return matchesSearch && matchesDateRange;
    });
  }, [todaysEvents, searchQuery, startDate, endDate]);

  return (
    <div className="min-h-screen bg-[#0b1326]">
      <Navbar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        events={events}
        onEventClick={handleEventClick}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onClearFilters={handleClearFilters}
      />
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        onCreateEvent={handleCreateEvent}
      />
      
      <main className="ml-72 pt-24 px-8 min-h-screen">
        {/* Active Filters Display */}
        {(searchQuery || startDate || endDate) && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-[var(--color-surface-container-low)] rounded-xl border border-[var(--color-outline-variant)]/20">
            <span className="material-symbols-outlined text-[var(--color-primary)]">filter_list</span>
            <span className="text-sm text-[var(--color-on-surface-variant)]">
              Aktif filtreler:
            </span>
            {searchQuery && (
              <span className="px-3 py-1 text-xs bg-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-full">
                Arama: &quot;{searchQuery}&quot;
              </span>
            )}
            {startDate && (
              <span className="px-3 py-1 text-xs bg-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-full">
                Başlangıç: {startDate}
              </span>
            )}
            {endDate && (
              <span className="px-3 py-1 text-xs bg-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-full">
                Bitiş: {endDate}
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="ml-auto text-xs text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
            >
              Tümünü Temizle
            </button>
          </div>
        )}

        {currentView === 'day' && (
          <DailyView
            date={currentDate}
            events={filteredTodaysEvents}
            onEventClick={handleEventClick}
            onTimeSlotClick={handleTimeSlotClick}
            onEventDrop={handleEventDrop}
            onPreviousDay={handlePreviousDay}
            onNextDay={handleNextDay}
            onToday={handleToday}
          />
        )}
        
        {currentView === 'month' && (
          <MonthlyView
            date={currentDate}
            events={filteredEvents}
            onEventClick={handleEventClick}
            onEventDrop={handleEventDrop}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
          />
        )}
        
        {currentView === 'week' && (
          <WeeklyView
            date={currentDate}
            events={filteredEvents}
            onEventClick={handleEventClick}
            onEventDrop={handleEventDrop}
            onTimeSlotClick={handleTimeSlotClick}
            onPreviousWeek={handlePreviousWeek}
            onNextWeek={handleNextWeek}
            onToday={handleToday}
          />
        )}
      </main>

      <EventFormModal
        key={isFormOpen ? (selectedEvent?.id || 'new') : 'closed'}
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

function App() {
  return (
    <EventProvider>
      <AppContent />
    </EventProvider>
  );
}

export default App;
