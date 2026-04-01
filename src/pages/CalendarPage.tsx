import { useState, useCallback, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MonthlyView } from '../components/MonthlyView';
import { WeeklyView } from '../components/WeeklyView';
import { DailyView } from '../components/DailyView';
import { EventModal } from '../components/EventModal';
import { EventProvider, useEvents } from '../context/EventContext';
import type { CalendarEvent, EventFormData } from '../types';

type ViewMode = 'month' | 'week' | 'day';

// Toast system
let toastListeners: ((toasts: Array<{ id: string; message: string; type: string }>) => void)[] = [];
let toasts: Array<{ id: string; message: string; type: string }> = [];

function notifyListeners() {
  toastListeners.forEach((listener) => listener([...toasts]))
}

export function showToast(message: string, type: string = 'info') {
  const id = Math.random().toString(36).substring(2, 9);
  toasts = [...toasts, { id, message, type }];
  notifyListeners();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notifyListeners();
  }, 3000);
}

// View Toggle Component
function ViewToggle({ currentView, onViewChange }: { currentView: ViewMode; onViewChange: (view: ViewMode) => void }) {
  const views: { value: ViewMode; label: string }[] = [
    { value: 'month', label: 'Ay' },
    { value: 'week', label: 'Hafta' },
    { value: 'day', label: 'Gün' },
  ];

  return (
    <div className="flex items-center gap-1 bg-surface-container rounded-lg p-1">
      {views.map((view) => (
        <button
          key={view.value}
          onClick={() => onViewChange(view.value)}
          className={`
            px-4 py-2 rounded-md font-medium text-sm transition-all duration-200
            ${currentView === view.value
              ? 'bg-primary-container text-on-primary-container shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }
          `}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}

// Search Input Component
function SearchInput({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <div className="relative">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
        search
      </span>
      <input
        type="text"
        placeholder="Etkinlik ara..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-64 bg-surface-container border border-transparent rounded-lg pl-10 pr-4 py-2 
          text-on-surface placeholder:text-on-surface-variant/50
          focus:ring-2 focus:ring-primary focus:border-transparent
          transition-all duration-200 outline-none"
      />
    </div>
  );
}

// Notification Permission Modal Component
function NotificationPermissionModal({ onClose }: { onClose: () => void }) {
  const handleAllow = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        showToast('Bildirim izni verildi', 'success');
      } else {
        showToast('Bildirim izni reddedildi', 'warning');
      }
    }
    onClose();
  };

  const handleDismiss = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-dim/80 backdrop-blur-sm">
      <div className="glass-morphism w-full max-w-md mx-4 rounded-[2.5rem] p-10 relative overflow-hidden shadow-[0_32px_64px_rgba(128,131,255,0.12)] border border-white/5">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-tertiary/5 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-surface-container-highest rounded-full flex items-center justify-center mb-8 shadow-inner border border-white/5">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-container rounded-full flex items-center justify-center text-on-primary shadow-[0_0_20px_rgba(128,131,255,0.4)]">
              <span className="material-symbols-outlined text-3xl">notifications</span>
            </div>
          </div>
          
          <h2 className="font-headline font-extrabold text-3xl text-on-surface mb-4 tracking-tight">Bildirimlere İzin Ver</h2>
          <p className="font-body text-on-surface-variant leading-relaxed text-balance px-4 mb-10">
            Etkinlikleriniz başlamadan önce hatırlatıcı almak için tarayıcı bildirimlerini etkinleştirin.
          </p>
          
          <div className="w-full flex flex-col gap-3">
            <button
              onClick={handleAllow}
              className="w-full py-4 px-6 bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-headline font-bold text-lg rounded-2xl hover:brightness-110 active:scale-95 transition-all duration-300 shadow-lg shadow-primary/20"
            >
              İzin Ver
            </button>
            <button
              onClick={handleDismiss}
              className="w-full py-4 px-6 bg-transparent text-primary font-headline font-bold text-base rounded-2xl hover:bg-white/5 transition-all duration-300"
            >
              Şimdi Değil
            </button>
          </div>
          
          <div className="mt-8 flex gap-2">
            <div className="w-2 h-1 rounded-full bg-primary/20"></div>
            <div className="w-8 h-1 rounded-full bg-primary"></div>
            <div className="w-2 h-1 rounded-full bg-primary/20"></div>
          </div>
        </div>
        
        <button
          onClick={handleDismiss}
          className="absolute top-6 right-6 text-slate-500 hover:text-slate-200 transition-colors"
          aria-label="Kapat"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  );
}

function CalendarContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentView, setCurrentView] = useState<ViewMode>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const { events, createEvent } = useEvents();

  // Sync view with URL params
  useEffect(() => {
    const view = searchParams.get('view') as ViewMode;
    if (view && ['month', 'week', 'day'].includes(view)) {
      setCurrentView(view);
    }
  }, [searchParams]);

  const handleViewChange = useCallback((view: ViewMode) => {
    setCurrentView(view);
    setSearchParams({ view });
  }, [setSearchParams]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    showToast(`Etkinlik: ${event.title}`, 'info');
  }, []);

  const handleCreateEvent = useCallback(() => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDate(undefined);
  }, []);

  const handleSubmit = useCallback((data: EventFormData) => {
    createEvent(data);
    setIsModalOpen(false);
    showToast('Etkinlik başarıyla oluşturuldu!', 'success');
  }, [createEvent]);

  const closeNotificationModal = useCallback(() => {
    setShowNotificationModal(false);
  }, []);

  // Navigation handlers for MonthlyView
  const handlePreviousMonth = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  }, []);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Navigation handlers for WeeklyView
  const handlePreviousWeek = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  }, []);

  const handleNextWeek = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  }, []);

  // Navigation handlers for DailyView
  const handlePreviousDay = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  }, []);

  const handleNextDay = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  }, []);

  const handleTimeSlotClick = useCallback((date: string, time: string) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  }, []);

  // Filter events based on search query
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    return events.filter((event: CalendarEvent) => 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [events, searchQuery]);

  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-surface-container-low shadow-[0_8px_32px_rgba(99,102,241,0.08)]">
        <div className="text-xl font-bold text-primary tracking-tighter font-headline">Takvim Planlayıcı</div>
        <div className="hidden md:flex items-center gap-4">
          <ViewToggle currentView={currentView} onViewChange={handleViewChange} />
        </div>
        <div className="flex items-center gap-4">
          <SearchInput onSearch={handleSearch} />
          <button
            onClick={() => setShowNotificationModal(true)}
            className="p-2 text-primary hover:bg-white/5 rounded-xl transition-all duration-300"
            aria-label="Bildirimler"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <Link
            to="/ayarlar"
            className="p-2 text-primary hover:bg-white/5 rounded-xl transition-all duration-300"
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
        <button
          onClick={handleCreateEvent}
          className="mb-8 mx-2 bg-gradient-to-br from-primary to-primary-container text-on-primary-container py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/10 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined">add</span>
          Etkinlik Ekle
        </button>
        <nav className="flex-1 space-y-2">
          <div className="flex items-center gap-3 bg-primary/10 text-primary rounded-xl px-4 py-3 font-semibold font-body text-sm cursor-pointer">
            <span className="material-symbols-outlined">calendar_today</span>
            Takvimlerim
          </div>
          <div className="flex items-center gap-3 text-slate-400 px-4 py-3 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors font-body text-sm cursor-pointer">
            <span className="material-symbols-outlined">group</span>
            Paylaşılanlar
          </div>
          <div className="flex items-center gap-3 text-slate-400 px-4 py-3 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors font-body text-sm cursor-pointer">
            <span className="material-symbols-outlined">check_circle</span>
            Görevler
          </div>
          <div className="flex items-center gap-3 text-slate-400 px-4 py-3 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors font-body text-sm cursor-pointer">
            <span className="material-symbols-outlined">archive</span>
            Arşiv
          </div>
        </nav>
        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-3 text-slate-400 px-4 py-3 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors font-body text-sm cursor-pointer">
            <span className="material-symbols-outlined">help</span>
            Yardım
          </div>
          <div className="flex items-center gap-3 text-slate-400 px-4 py-3 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors font-body text-sm cursor-pointer">
            <span className="material-symbols-outlined">logout</span>
            Çıkış
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 pt-28 px-12 min-h-screen">
        {currentView === 'month' && (
          <MonthlyView 
            date={currentDate}
            events={filteredEvents}
            onEventClick={handleEventClick}
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
            onTimeSlotClick={handleTimeSlotClick}
            onPreviousWeek={handlePreviousWeek}
            onNextWeek={handleNextWeek}
            onToday={handleToday}
          />
        )}
        {currentView === 'day' && (
          <DailyView 
            date={currentDate}
            events={filteredEvents}
            onEventClick={handleEventClick}
            onTimeSlotClick={handleTimeSlotClick}
            onPreviousDay={handlePreviousDay}
            onNextDay={handleNextDay}
            onToday={handleToday}
          />
        )}
      </main>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialDate={selectedDate}
      />

      {/* Notification Permission Modal */}
      {showNotificationModal && (
        <NotificationPermissionModal onClose={closeNotificationModal} />
      )}
    </div>
  );
}

export function CalendarPage() {
  return (
    <EventProvider>
      <CalendarContent />
    </EventProvider>
  );
}
