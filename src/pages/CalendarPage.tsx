import { Link } from 'react-router-dom';

export function CalendarPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-surface-container-low shadow-[0_8px_32px_rgba(99,102,241,0.08)]">
        <div className="text-xl font-bold text-primary tracking-tighter font-headline">Chronos Editorial</div>
        <div className="hidden md:flex gap-8">
          <Link to="/?view=month" className="font-headline font-bold text-sm tracking-tight text-slate-400 font-medium hover:text-slate-200 transition-all duration-300">
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
        <div className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="font-headline text-5xl font-bold tracking-tight text-on-surface">Nisan 2026</h1>
            <p className="text-primary font-medium mt-2">Bugün, 1 Nisan Çarşamba</p>
          </div>
          <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary-container px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            <span className="material-symbols-outlined">add</span>
            Yeni Etkinlik
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-surface-container-highest/20 rounded-2xl overflow-hidden border border-outline-variant/15">
          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day) => (
            <div key={day} className="bg-surface-container-high p-4 text-center">
              <span className="font-headline font-bold text-sm text-on-surface-variant">{day}</span>
            </div>
          ))}
          {Array.from({ length: 30 }, (_, i) => {
            const day = i + 1;
            const isToday = day === 1;
            return (
              <div
                key={day}
                className={`bg-surface-container-low p-4 h-48 group hover:bg-surface-container transition-colors ${
                  isToday ? 'border-2 border-primary/30 bg-surface-container' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`font-headline text-2xl font-bold ${isToday ? 'text-primary' : 'text-slate-600'}`}>
                    {day}
                  </span>
                  {isToday && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
