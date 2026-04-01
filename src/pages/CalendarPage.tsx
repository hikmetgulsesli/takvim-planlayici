import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MonthlyView } from '../components/MonthlyView';
import { EventProvider } from '../context/EventContext';
import { NotificationPermissionModal } from '../components/NotificationPermissionModal';
import { showToast } from '../hooks';
import type { Event } from '../types';

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

function CalendarContent() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

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

  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-surface-container-low shadow-[0_8px_32px_rgba(99,102,241,0.08)]">
        <div className="text-xl font-bold text-primary tracking-tighter font-headline">Chronos Editorial</div>
        <div className="hidden md:flex gap-8">
          <Link to="/?view=month" className="font-headline font-bold text-sm tracking-tight text-primary border-b-2 border-primary pb-1 transition-all duration-300">
            Ay
          </Link>
          <Link to="/?view=week" className="font-headline font-bold text-sm tracking-tight text-slate-400 font-medium hover:text-slate-200 transition-all duration-300">
            Hafta
          </Link>
          <Link to="/?view=day" className="font-headline font-bold text-sm tracking-tight text-slate-400 font-medium hover:text-slate-200 transition-all duration-300">
            Gün
          </Link>
        </div>
        <div className="flex items-center gap-4">
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
          Yeni Etkinlik
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
        <MonthlyView onDayClick={handleDayClick} onEventClick={handleEventClick} />
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
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); closeCreateModal(); showToast('Etkinlik oluşturuldu', 'success'); }}>
              <div>
                <label className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-outline mb-2">Başlık</label>
                <input
                  type="text"
                  className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Etkinlik başlığı..."
                  autoFocus
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
