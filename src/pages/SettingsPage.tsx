import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

// Toast system (duplicate from CalendarPage for standalone usage)
let toastListeners: ((toasts: Array<{ id: string; message: string; type: string }>) => void)[] = [];
let toasts: Array<{ id: string; message: string; type: string }> = [];

function notifyListeners() {
  toastListeners.forEach((listener) => listener([...toasts]))
}

function showToast(message: string, type: string = 'info') {
  const id = Math.random().toString(36).substring(2, 9);
  toasts = [...toasts, { id, message, type }];
  notifyListeners();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notifyListeners();
  }, 3000);
}

export function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('tr');

  const handleExport = useCallback(() => {
    const events = localStorage.getItem('takvim-events') || '[]';
    const blob = new Blob([events], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `takvim-yedek-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Veriler dışa aktarıldı', 'success');
  }, []);

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data)) {
          localStorage.setItem('takvim-events', JSON.stringify(data));
          showToast('Veriler içe aktarıldı', 'success');
        } else {
          showToast('Geçersiz dosya formatı', 'error');
        }
      } catch {
        showToast('Dosya okunurken hata oluştu', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  const handleClear = useCallback(() => {
    if (confirm('Tüm etkinlikler silinecek. Emin misiniz?')) {
      localStorage.removeItem('takvim-events');
      showToast('Tüm etkinlikler silindi', 'info');
    }
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-surface-container-low shadow-[0_8px_32px_rgba(99,102,241,0.08)]">
        <div className="text-xl font-bold text-primary tracking-tighter font-headline">Takvim Planlayıcı</div>
        <div className="hidden md:flex gap-8">
          <Link to="/?view=month" className="font-headline font-bold text-sm tracking-tight text-slate-400 hover:text-slate-200 transition-all duration-300">
            Ay
          </Link>
          <Link to="/?view=week" className="font-headline font-bold text-sm tracking-tight text-slate-400 hover:text-slate-200 transition-all duration-300">
            Hafta
          </Link>
          <Link to="/?view=day" className="font-headline font-bold text-sm tracking-tight text-slate-400 hover:text-slate-200 transition-all duration-300">
            Gün
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="p-2 text-primary hover:bg-white/5 rounded-xl transition-all duration-300"
            aria-label="Takvime Dön"
          >
            <span className="material-symbols-outlined">calendar_today</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-28 px-8 max-w-4xl mx-auto min-h-screen">
        <div className="mb-8">
          <h1 className="font-headline text-4xl font-bold text-on-surface mb-2">Ayarlar</h1>
          <p className="text-on-surface-variant">Uygulama tercihlerinizi yönetin</p>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <section className="bg-surface-container-low rounded-2xl p-6">
            <h2 className="font-headline text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">palette</span>
              Görünüm
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-on-surface font-medium">Koyu Tema</p>
                  <p className="text-on-surface-variant text-sm">Koyu renk şemasını kullan</p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-14 h-7 rounded-full transition-colors relative ${darkMode ? 'bg-primary' : 'bg-surface-container-highest'}`}
                >
                  <span className={`absolute top-1 w-5 h-5 rounded-full bg-on-primary transition-transform ${darkMode ? 'left-8' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="bg-surface-container-low rounded-2xl p-6">
            <h2 className="font-headline text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">notifications</span>
              Bildirimler
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-on-surface font-medium">Hatırlatıcılar</p>
                  <p className="text-on-surface-variant text-sm">Etkinlik hatırlatıcıları al</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-14 h-7 rounded-full transition-colors relative ${notifications ? 'bg-primary' : 'bg-surface-container-highest'}`}
                >
                  <span className={`absolute top-1 w-5 h-5 rounded-full bg-on-primary transition-transform ${notifications ? 'left-8' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </section>

          {/* Language */}
          <section className="bg-surface-container-low rounded-2xl p-6">
            <h2 className="font-headline text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">language</span>
              Dil
            </h2>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary"
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
            </select>
          </section>

          {/* Data Management */}
          <section className="bg-surface-container-low rounded-2xl p-6">
            <h2 className="font-headline text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">storage</span>
              Veri Yönetimi
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleExport}
                  className="flex-1 px-6 py-3 bg-surface-container-highest text-on-surface rounded-xl font-semibold hover:bg-surface-container-highest/80 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">download</span>
                  Dışa Aktar
                </button>
                <label className="flex-1 px-6 py-3 bg-surface-container-highest text-on-surface rounded-xl font-semibold hover:bg-surface-container-highest/80 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <span className="material-symbols-outlined">upload</span>
                  İçe Aktar
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
              </div>
              <button
                onClick={handleClear}
                className="w-full px-6 py-3 bg-error-container text-on-error-container rounded-xl font-semibold hover:bg-error-container/80 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">delete_forever</span>
                Tüm Verileri Sil
              </button>
            </div>
          </section>

          {/* About */}
          <section className="bg-surface-container-low rounded-2xl p-6">
            <h2 className="font-headline text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">info</span>
              Hakkında
            </h2>
            <div className="text-on-surface-variant space-y-2">
              <p>Takvim Planlayıcı v1.0.0</p>
              <p>Etkinliklerinizi organize edin ve hatırlatıcılar alın.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
