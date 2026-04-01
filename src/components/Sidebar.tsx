
import type { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onCreateEvent: () => void;
}

export function Sidebar({ currentView, onViewChange, onCreateEvent }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col py-8 px-4 z-40 bg-[#131b2e] w-72 pt-24">
      {/* User Info */}
      <div className="mb-8 px-4">
        <h2 className="text-lg font-black text-[#c0c1ff] font-headline">The Curator</h2>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Premium Plan</p>
      </div>

      {/* Create Event Button */}
      <button
        onClick={onCreateEvent}
        className="mb-8 mx-2 bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] text-[#0d0096] py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#8083ff]/10 active:scale-95 transition-transform"
      >
        <span className="material-symbols-outlined">add</span>
        Yeni Etkinlik
      </button>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <button
          onClick={() => onViewChange('month')}
          className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-sm transition-colors ${
            currentView === 'month'
              ? 'bg-[#c0c1ff]/10 text-[#c0c1ff]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <span className="material-symbols-outlined">calendar_today</span>
          Takvimlerim
        </button>
        <button
          onClick={() => onViewChange('week')}
          className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-sm transition-colors ${
            currentView === 'week'
              ? 'bg-[#c0c1ff]/10 text-[#c0c1ff]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <span className="material-symbols-outlined">view_week</span>
          Haftalık Görünüm
        </button>
        <button
          onClick={() => onViewChange('day')}
          className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-sm transition-colors ${
            currentView === 'day'
              ? 'bg-[#c0c1ff]/10 text-[#c0c1ff]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <span className="material-symbols-outlined">view_day</span>
          Günlük Görünüm
        </button>
        <button
          className="w-full flex items-center gap-3 text-slate-400 px-4 py-3 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors text-sm"
        >
          <span className="material-symbols-outlined">group</span>
          Paylaşılanlar
        </button>
        <button
          className="w-full flex items-center gap-3 text-slate-400 px-4 py-3 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors text-sm"
        >
          <span className="material-symbols-outlined">check_circle</span>
          Görevler
        </button>
        <button
          className="w-full flex items-center gap-3 text-slate-400 px-4 py-3 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors text-sm"
        >
          <span className="material-symbols-outlined">archive</span>
          Arşiv
        </button>
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto space-y-2">
        <button className="w-full flex items-center gap-3 text-slate-400 px-4 py-3 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors text-sm">
          <span className="material-symbols-outlined">help</span>
          Yardım
        </button>
        <button className="w-full flex items-center gap-3 text-slate-400 px-4 py-3 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors text-sm">
          <span className="material-symbols-outlined">logout</span>
          Çıkış
        </button>
      </div>
    </aside>
  );
}
