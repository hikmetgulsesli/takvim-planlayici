import { useState, useCallback } from 'react';
import { EventProvider, useEvents } from './context/EventContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DailyView } from './components/DailyView';
import { EventFormModal } from './components/EventFormModal';
import { EventDetailModal } from './components/EventDetailModal';
import type { ViewMode, CalendarEvent, EventFormData } from './types';
import './index.css';

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewMode>('day');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [formInitialData, setFormInitialData] = useState<Partial<EventFormData>>({});
  
  const { createEvent, updateEvent, deleteEvent, getEventsByDate } = useEvents();

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

  const currentDateStr = currentDate.toISOString().split('T')[0] ?? '';
  const todaysEvents = getEventsByDate(currentDateStr);

  return (
    <div className="min-h-screen bg-[#0b1326]">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        onCreateEvent={handleCreateEvent}
      />
      
      <main className="ml-72 pt-24 px-8 min-h-screen">
        {currentView === 'day' && (
          <DailyView
            date={currentDate}
            events={todaysEvents}
            onEventClick={handleEventClick}
            onTimeSlotClick={handleTimeSlotClick}
            onPreviousDay={handlePreviousDay}
            onNextDay={handleNextDay}
            onToday={handleToday}
          />
        )}
        
        {currentView === 'month' && (
          <div className="flex items-center justify-center h-96">
            <p className="text-[#908fa0] text-lg">Aylık görünüm yakında geliyor...</p>
          </div>
        )}
        
        {currentView === 'week' && (
          <div className="flex items-center justify-center h-96">
            <p className="text-[#908fa0] text-lg">Haftalık görünüm yakında geliyor...</p>
          </div>
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
