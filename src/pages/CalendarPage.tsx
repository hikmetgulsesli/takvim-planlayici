import { useState, useCallback, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MonthlyView } from '../components/MonthlyView';
import { EventProvider, useEventContext } from '../context/EventContext';
import { NotificationPermissionModal } from '../components/NotificationPermissionModal';
import { showToast } from '../hooks';
import type { Event } from '../types';

type ViewMode = 'month' | 'week' | 'day';

// Demo events for testing
function getTodayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getTomorrowStr(): string {
  const d = new Date(Date.now() + 86400000);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const DEMO_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Editoryal Toplantı',
    date: getTodayStr(),
    startTime: '10:00',
    endTime: '11:30',
    description: 'Haftalık editoryal toplantısı',
    color: '#c0c1ff',
    reminder: '15 dakika önce'
  },
  {
    id: '2',
    title: 'Lansman Hazırlığı',
    date: getTomorrowStr(),
    startTime: '14:00',
    endTime: '16:00',
    description: 'Yeni ürün lansmanı hazırlıkları',
    color: '#ffb783',
    reminder: '1 saat önce'
  },
  {
    id: '3',
    title: 'Tasarım Revizyonu',
    date: getTodayStr(),
    startTime: '14:30',
    endTime: '15:30',
    description: 'UI/UX tasarım revizyonu',
    color: '#8083ff',
    reminder: '30 dakika önce'
  },
  {
    id: '4',
    title: 'Müşteri Görüşmesi',
    date: getTodayStr(),
    startTime: '16:00',
    endTime: '17:00',
    description: 'Müşteri ile görüşme',
    color: '#ffb4ab',
    reminder: '15 dakika önce'
  },
  {
    id: '5',
    title: 'Sprint Planlama',
    date: getTodayStr(),
    startTime: '09:00',
    endTime: '10:00',
    description: 'Sprint planlama toplantısı',
    color: '#d97721',
    reminder: '1 gün önce'
  }
];

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

// Weekly View Component
function WeeklyView({ 
  onEventClick 
}: { 
  onEventClick?: (event: Event) => void;
}) {
  const { events, getEventsByDate } = useEventContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  }, [currentDate]);

  const navigatePreviousWeek = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  }, []);

  const navigateNextWeek = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  }, []);

  const navigateToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const formatDateKey = useCallback((date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  const isToday = useCallback((date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }, []);

  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface">
            Haftalık Görünüm
          </h1>
          <p className="text-primary font-medium mt-1">
            {weekDays[0]?.getDate()} {monthNames[weekDays[0]?.getMonth() ?? 0]} - {weekDays[6]?.getDate()} {monthNames[weekDays[6]?.getMonth() ?? 0]}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={navigatePreviousWeek}
            className="p-2 text-primary hover:bg-white/5 rounded-xl transition-all duration-300"
            aria-label="Önceki hafta"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            onClick={navigateToToday}
            className="px-4 py-2 text-primary font-semibold hover:bg-white/5 rounded-xl transition-all duration-300"
          >
            Bugün
          </button>
          <button
            onClick={navigateNextWeek}
            className="p-2 text-primary hover:bg-white/5 rounded-xl transition-all duration-300"
            aria-label="Sonraki hafta"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((date, index) => {
          const dateKey = formatDateKey(date);
          const dayEvents = getEventsByDate(dateKey);
          const todayFlag = isToday(date);

          return (
            <div
              key={index}
              className={`
                bg-surface-container-low rounded-xl p-4 min-h-[300px]
                ${todayFlag ? 'ring-2 ring-primary' : ''}
              `}
            >
              <div className="text-center mb-4">
                <p className="text-on-surface-variant text-sm">{dayNames[index]}</p>
                <p className={`font-headline text-2xl font-bold ${todayFlag ? 'text-primary' : 'text-on-surface'}`}>
                  {date.getDate()}
                </p>
              </div>
              <div className="space-y-2">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick?.(event)}
                    className="text-xs font-medium p-2 rounded-lg cursor-pointer hover:brightness-110 transition-all"
                    style={{
                      backgroundColor: `${event.color}20`,
                      color: event.color
                    }}
                  >
                    <p className="truncate">{event.title}</p>
                    <p className="opacity-70">{event.startTime}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Daily View Component
function DailyView({ 
  onEventClick 
}: { 
  onEventClick?: (event: Event) => void;
}) {
  const { events, getEventsByDate } = useEventContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const dateKey = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(currentDate.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [currentDate]);

  const dayEvents = useMemo(() => {
    return getEventsByDate(dateKey).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [dateKey, getEventsByDate]);

  const navigatePreviousDay = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  }, []);

  const navigateNextDay = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  }, []);

  const navigateToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const isToday = useCallback((date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }, []);

  const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface">
            {currentDate.getDate()} {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h1>
          <p className="text-primary font-medium mt-1">{dayNames[currentDate.getDay()]}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={navigatePreviousDay}
            className="p-2 text-primary hover:bg-white/5 rounded-xl transition-all duration-300"
            aria-label="Önceki gün"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            onClick={navigateToToday}
            className="px-4 py-2 text-primary font-semibold hover:bg-white/5 rounded-xl transition-all duration-300"
          >
            Bugün
          </button>
          <button
            onClick={navigateNextDay}
            className="p-2 text-primary hover:bg-white/5 rounded-xl transition-all duration-300"
            aria-label="Sonraki gün"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-surface-container-low rounded-2xl p-6">
        {dayEvents.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">event_busy</span>
            <p className="text-on-surface-variant">Bugün için etkinlik bulunmuyor</p>
          </div>
        ) : (
          <div className="space-y-4">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => onEventClick?.(event)}
                className="flex items-center gap-4 p-4 bg-surface-container rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors"
              >
                <div 
                  className="w-2 h-12 rounded-full"
                  style={{ backgroundColor: event.color }}
                />
                <div className="flex-1">
                  <h3 className="font-headline font-bold text-on-surface">{event.title}</h3>
                  <p className="text-on-surface-variant text-sm">{event.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-on-surface">{event.startTime} - {event.endTime}</p>
                  {event.reminder !== 'none' && (
                    <p className="text-xs text-on-surface-variant flex items-center gap-1 justify-end">
                      <span className="material-symbols-outlined text-sm">notifications</span>
                      {event.reminder}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Toast Container Component
function ToastContainer() {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: string }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Check for new toasts from the global toast system
      // This is a simplified version - in production, use a proper state management
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[200] space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="px-4 py-3 rounded-xl shadow-lg animate-fade-in"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

function CalendarContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentView, setCurrentView] = useState<ViewMode>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  
  const { events, addEvent, getEventsByDate } = useEventContext();

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

  const handleDayClick = useCallback((date: Date) => {
    setSelectedDate(date);
    setShowCreateModal(true);
  }, []);

  const handleEventClick = useCallback((event: Event) => {
    showToast(`Etkinlik: ${event.title}`, 'info');
  }, []);

  const handleCreateEvent = useCallback(() => {
    setSelectedDate(new Date());
    setShowCreateModal(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setShowCreateModal(false);
    setSelectedDate(null);
  }, []);

  const closeNotificationModal = useCallback(() => {
    setShowNotificationModal(false);
  }, []);

  const handleSaveEvent = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate) {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const title = formData.get('title') as string;
      
      if (title.trim()) {
        const newEvent: Event = {
          id: Date.now().toString(),
          title: title.trim(),
          date: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`,
          startTime: '09:00',
          endTime: '10:00',
          description: '',
          color: '#c0c1ff',
          reminder: 'none'
        };
        addEvent(newEvent);
        showToast('Etkinlik oluşturuldu', 'success');
        closeCreateModal();
      }
    }
  }, [selectedDate, addEvent, closeCreateModal]);

  // Filter events based on search query
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    return events.filter(event => 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
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
          <MonthlyView onDayClick={handleDayClick} onEventClick={handleEventClick} />
        )}
        {currentView === 'week' && (
          <WeeklyView onEventClick={handleEventClick} />
        )}
        {currentView === 'day' && (
          <DailyView onEventClick={handleEventClick} />
        )}
      </main>

      {/* Create Event Modal */}
      {showCreateModal && selectedDate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-dim/80 backdrop-blur-sm">
          <div className="w-full max-w-xl glass-morphism rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(192,193,255,0.12)] border border-outline-variant/15 p-10 relative overflow-hidden">
            <button
              onClick={closeCreateModal}
              className="absolute top-6 right-6 text-outline hover:text-on-surface transition-colors"
              aria-label="Kapat"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <header className="mb-8">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">Yeni Etkinlik Oluştur</h2>
              <p className="text-on-surface-variant font-medium mt-1">
                {selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} tarihi için etkinlik oluşturun.
              </p>
            </header>
            <form className="space-y-6" onSubmit={handleSaveEvent}>
              <div>
                <label className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-outline mb-2">Başlık</label>
                <input
                  name="title"
                  type="text"
                  className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Etkinlik başlığı..."
                  autoFocus
                  required
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="flex-1 px-6 py-4 rounded-xl font-bold text-primary hover:bg-white/5 transition-all text-sm"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-gradient-to-br from-primary to-primary-container text-on-primary-container px-6 py-4 rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Permission Modal */}
      {showNotificationModal && (
        <NotificationPermissionModal onClose={closeNotificationModal} />
      )}
    </div>
  );
}

export function CalendarPage() {
  // Load demo events into localStorage if empty
  const stored = localStorage.getItem('chronos_events');
  if (!stored || JSON.parse(stored).length === 0) {
    localStorage.setItem('chronos_events', JSON.stringify(DEMO_EVENTS));
  }

  return (
    <EventProvider>
      <CalendarContent />
    </EventProvider>
  );
}
