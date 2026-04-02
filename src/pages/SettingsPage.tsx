import { useState, useRef, useCallback, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications, useEvents, showToast } from '../hooks';
import type { Event } from '../types';

const APP_VERSION = '1.0.0';

export function SettingsPage() {
  const { permission, requestPermission } = useNotifications();
  const { exportEvents, importEvents } = useEvents();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = useCallback(() => {
    const data = exportEvents();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `events.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Veriler başarıyla dışa aktarıldı', 'success');
  }, [exportEvents]);

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    try {
      const text = await file.text();
      let parsed: unknown;

      try {
        parsed = JSON.parse(text);
      } catch {
        showToast('Geçersiz JSON dosyası', 'error');
        setIsImporting(false);
        return;
      }

      // Validate structure
      if (!Array.isArray(parsed)) {
        showToast('JSON dosyası bir dizi içermeli', 'error');
        setIsImporting(false);
        return;
      }

      const isValidEvent = (item: unknown): item is Event => {
        if (typeof item !== 'object' || item === null) return false;
        const event = item as Record<string, unknown>;
        return (
          typeof event.id === 'string' &&
          typeof event.title === 'string' &&
          typeof event.date === 'string' &&
          typeof event.startTime === 'string' &&
          typeof event.endTime === 'string' &&
          typeof event.description === 'string' &&
          typeof event.color === 'string' &&
          typeof event.reminder === 'string'
        );
      };

      const validEvents: Event[] = [];
      let invalidCount = 0;

      for (const item of parsed) {
        if (isValidEvent(item)) {
          validEvents.push(item);
        } else {
          invalidCount++;
        }
      }

      if (invalidCount > 0) {
        showToast(`${invalidCount} geçersiz öğe içe aktarma sırasında atlandı`, 'warning');
      }

      if (validEvents.length === 0) {
        showToast('Geçerli etkinlik bulunamadı', 'error');
        setIsImporting(false);
        return;
      }

      const importedCount = importEvents(validEvents);
      showToast(`${importedCount} etkinlik başarıyla içe aktarıldı`, 'success');
    } catch {
      showToast('Dosya okunurken hata oluştu', 'error');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [importEvents]);

  const handleRequestNotification = useCallback(async () => {
    const granted = await requestPermission();
    if (granted) {
      showToast('Bildirim izni verildi', 'success');
    } else {
      showToast('Bildirim izni reddedildi', 'warning');
    }
  }, [requestPermission]);

  const getPermissionText = () => {
    switch (permission) {
      case 'granted':
        return 'İzin Verildi';
      case 'denied':
        return 'İzin Reddedildi';
      default:
        return 'Bekliyor';
    }
  };

  const getPermissionColor = () => {
    switch (permission) {
      case 'granted':
        return 'text-green-400';
      case 'denied':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-surface-container-low shadow-[0_8px_32px_rgba(99,102,241,0.08)]">
        <div className="text-xl font-bold text-primary tracking-tighter font-headline">Chronos Editorial</div>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-primary font-semibold hover:text-on-primary-container transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Takvime Dön
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-28 px-6 md:px-12 pb-12 max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-on-surface">Ayarlar</h1>
          <p className="text-on-surface-variant mt-2">Uygulama tercihlerinizi ve veri yönetimini buradan yapılandırın.</p>
        </header>

        <div className="space-y-6">
          {/* Notification Preferences Section */}
          <section className="glass-morphism rounded-2xl p-8 border border-outline-variant/15">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">notifications</span>
              </div>
              <div>
                <h2 className="font-headline text-xl font-bold text-on-surface">Bildirim Tercihleri</h2>
                <p className="text-sm text-on-surface-variant">Etkinlik hatırlatıcıları için bildirim ayarları</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl">
                <div>
                  <p className="font-medium text-on-surface">Bildirim Durumu</p>
                  <p className={`text-sm ${getPermissionColor()}`}>{getPermissionText()}</p>
                </div>
                {permission !== 'granted' && (
                  <button
                    onClick={handleRequestNotification}
                    className="px-4 py-2 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-semibold rounded-lg hover:scale-[1.02] active:scale-95 transition-all text-sm"
                  >
                    İzin İste
                  </button>
                )}
              </div>

              {permission === 'denied' && (
                <div className="p-4 bg-error-container/20 border border-error/30 rounded-xl">
                  <p className="text-sm text-error">
                    Bildirimler engellendi. Tarayıcı ayarlarından bildirim iznini manuel olarak etkinleştirmeniz gerekiyor.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Data Management Section */}
          <section className="glass-morphism rounded-2xl p-8 border border-outline-variant/15">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary">storage</span>
              </div>
              <div>
                <h2 className="font-headline text-xl font-bold text-on-surface">Veri Yönetimi</h2>
                <p className="text-sm text-on-surface-variant">Etkinlik verilerinizi dışa aktarın veya içe aktarın</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Export */}
              <div className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant">download</span>
                  <div>
                    <p className="font-medium text-on-surface">Verileri Dışa Aktar</p>
                    <p className="text-sm text-on-surface-variant">Tüm etkinlikleri JSON dosyası olarak indir</p>
                  </div>
                </div>
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-semibold rounded-lg hover:scale-[1.02] active:scale-95 transition-all text-sm"
                >
                  Dışa Aktar
                </button>
              </div>

              {/* Import */}
              <div className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant">upload</span>
                  <div>
                    <p className="font-medium text-on-surface">Verileri İçe Aktar</p>
                    <p className="text-sm text-on-surface-variant">JSON dosyasından etkinlikleri yükle</p>
                  </div>
                </div>
                <button
                  onClick={handleImportClick}
                  disabled={isImporting}
                  className="px-4 py-2 bg-gradient-to-br from-tertiary to-tertiary-container text-on-tertiary-container font-semibold rounded-lg hover:scale-[1.02] active:scale-95 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isImporting ? 'Yükleniyor...' : 'İçe Aktar'}
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
                aria-label="JSON dosyası seçin"
              />
            </div>
          </section>

          {/* App Info Section */}
          <section className="glass-morphism rounded-2xl p-8 border border-outline-variant/15">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary">info</span>
              </div>
              <div>
                <h2 className="font-headline text-xl font-bold text-on-surface">Uygulama Bilgisi</h2>
                <p className="text-sm text-on-surface-variant">Versiyon ve detaylar</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-outline-variant/15">
                <span className="text-on-surface-variant">Versiyon</span>
                <span className="font-medium text-on-surface">{APP_VERSION}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-outline-variant/15">
                <span className="text-on-surface-variant">Uygulama Adı</span>
                <span className="font-medium text-on-surface">Chronos Editorial</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-on-surface-variant">Geliştirici</span>
                <span className="font-medium text-on-surface">The Curator</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
