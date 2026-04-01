import React, { useState, useCallback } from 'react';
import { EventModal } from './components/EventModal';
import { EventProvider, useEvents } from './context/EventContext';
import type { EventFormData } from './types';

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  const latestOnClose = React.useRef(onClose);
  React.useEffect(() => {
    latestOnClose.current = onClose;
  }, [onClose]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      latestOnClose.current();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#c0c1ff] to-[#8083ff] text-[#0d0096] px-6 py-3 rounded-xl font-bold shadow-lg z-[200] animate-fade-in">
      {message}
    </div>
  );
}

function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [toast, setToast] = useState<string | null>(null);
  const { createEvent } = useEvents();

  const handleOpenModal = useCallback((date?: string) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDate(undefined);
  }, []);

  const handleSubmit = useCallback((data: EventFormData) => {
    createEvent(data);
    setIsModalOpen(false);
    setToast('Etkinlik başarıyla oluşturuldu!');
  }, [createEvent]);

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd]">
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-[#131b2e] shadow-[0_8px_32px_rgba(99,102,241,0.08)]">
        <div className="text-xl font-bold text-[#c0c1ff] tracking-tighter font-headline">
          Chronos Editorial
        </div>
        <div className="hidden md:flex gap-8">
          <a className="font-headline font-bold text-sm tracking-tight text-slate-400 hover:text-slate-200 transition-all duration-300" href="#">
            Ay
          </a>
          <a className="font-headline font-bold text-sm tracking-tight text-slate-400 hover:text-slate-200 transition-all duration-300" href="#">
            Hafta
          </a>
          <a className="font-headline font-bold text-sm tracking-tight text-slate-400 hover:text-slate-200 transition-all duration-300" href="#">
            Gün
          </a>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-[#c0c1ff] hover:bg-white/5 rounded-xl transition-all duration-300 cursor-pointer">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </nav>

      <aside className="fixed left-0 top-0 h-full flex flex-col py-8 px-4 z-40 bg-[#131b2e] w-72 pt-28">
        <div className="mb-8 px-4">
          <h2 className="text-lg font-black text-[#c0c1ff] font-headline">The Curator</h2>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Premium Plan</p>
        </div>
        <nav className="flex-1 space-y-2">
          <div className="flex items-center gap-3 bg-[#c0c1ff]/10 text-[#c0c1ff] rounded-xl px-4 py-3 font-semibold text-sm cursor-pointer">
            <span className="material-symbols-outlined">calendar_today</span>
            Takvimlerim
          </div>
          <div className="flex items-center gap-3 text-slate-400 px-4 py-3 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors text-sm cursor-pointer">
            <span className="material-symbols-outlined">group</span>
            Paylaşılanlar
          </div>
          <div className="flex items-center gap-3 text-slate-400 px-4 py-3 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors text-sm cursor-pointer">
            <span className="material-symbols-outlined">check_circle</span>
            Görevler
          </div>
          <div className="flex items-center gap-3 text-slate-400 px-4 py-3 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors text-sm cursor-pointer">
            <span className="material-symbols-outlined">archive</span>
            Arşiv
          </div>
        </nav>
      </aside>

      <main className="ml-72 pt-28 px-12 min-h-screen">
        <div className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="font-headline text-5xl font-bold tracking-tight text-[#dae2fd]">
              {new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
            </h1>
            <p className="text-[#c0c1ff] font-medium mt-2">
              Bugün, {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] text-[#0d0096] px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-[#c0c1ff]/20 hover:scale-105 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined">add</span>
            Yeni Etkinlik
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-[#2d3449]/20 rounded-2xl overflow-hidden border border-[#464554]/15">
          {Array.from({ length: 7 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - 1 + i);
            const dateStr = date.toISOString().split('T')[0];
            const isToday = i === 1;
            
            return (
              <div
                key={i}
                onClick={() => handleOpenModal(dateStr)}
                className={`p-4 h-48 group transition-colors cursor-pointer ${
                  isToday
                    ? 'bg-[#171f33] border-2 border-[#c0c1ff]/30'
                    : 'bg-[#131b2e] hover:bg-[#171f33]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`font-headline text-2xl font-bold ${
                      isToday ? 'text-[#c0c1ff]' : 'text-slate-600'
                    }`}
                  >
                    {date.getDate()}
                  </span>
                  {isToday && <div className="w-2 h-2 rounded-full bg-[#c0c1ff]"></div>}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialDate={selectedDate}
      />

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
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
