import { useState, useEffect, useCallback } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastHandler: ((message: string, type?: 'success' | 'error' | 'info') => void) | null = null;

export function setToastHandler(handler: (message: string, type?: 'success' | 'error' | 'info') => void) {
  toastHandler = handler;
}

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  if (toastHandler) {
    toastHandler(message, type);
  }
}

const TYPE_STYLES = {
  success: {
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    icon: 'check_circle',
  },
  error: {
    bg: 'bg-[var(--color-error)]/20',
    border: 'border-[var(--color-error)]/30',
    text: 'text-[var(--color-error)]',
    icon: 'error',
  },
  info: {
    bg: 'bg-[var(--color-primary)]/20',
    border: 'border-[var(--color-primary)]/30',
    text: 'text-[var(--color-primary)]',
    icon: 'info',
  },
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, [removeToast]);

  useEffect(() => {
    setToastHandler(addToast);
    return () => {
      setToastHandler(() => {});
    };
  }, [addToast]);

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const styles = TYPE_STYLES[toast.type];
        return (
          <div
            key={toast.id}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg min-w-[300px]
              ${styles.bg} border ${styles.border}
              animate-slide-in-right
            `}
          >
            <span className={`material-symbols-outlined ${styles.text}`}>{styles.icon}</span>
            <span className={`text-sm font-medium ${styles.text} flex-1`}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className={`${styles.text} hover:opacity-70 transition-opacity`}
              aria-label="Kapat"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
