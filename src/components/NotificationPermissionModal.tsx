import { useNotifications, showToast } from '../hooks';

export function NotificationPermissionModal({ onClose }: { onClose: () => void }) {
  const { requestPermission } = useNotifications();

  const handleAllow = async () => {
    const granted = await requestPermission();
    if (granted) {
      showToast('Bildirim izni verildi', 'success');
    } else {
      showToast('Bildirim izni reddedildi', 'warning');
    }
    onClose();
  };

  const handleDismiss = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#060e20]/80 backdrop-blur-sm">
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
