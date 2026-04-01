import { Button } from './components/common';
import { ToastContainer, showToast } from './components/common/Toast';
import { EventProvider } from './context/EventContext';

function AppContent() {
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold font-headline mb-8 text-primary">
        Takvim Planlayıcı
      </h1>
      <p className="text-on-surface-variant mb-8 text-center max-w-md">
        Etkinliklerinizi organize edin, hatırlatıcılar ayarlayın ve takvimlerinizi paylaşın.
      </p>
      <Button
        onClick={() => showToast('Takvim Planlayıcı hazır!', 'success')}
        leftIcon={<span className="material-symbols-outlined">calendar_today</span>}
      >
        Başla
      </Button>
      <ToastContainer />
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
