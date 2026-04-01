import { useEffect, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration ?? 5000);

    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const typeClasses = {
    success: 'bg-gradient-to-r from-green-500/20 to-green-600/20 border-green-500/50 text-green-400',
    error: 'bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-500/50 text-red-400',
    warning: 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/50 text-yellow-400',
    info: 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/50 text-blue-400',
  };

  const typeIcons = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info',
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-lg transition-all duration-300 ${
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      } ${typeClasses[toast.type]}`}
      role="alert"
    >
      <span className="material-symbols-outlined">{typeIcons[toast.type]}</span>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={handleClose}
        className="p-1 hover:bg-white/10 rounded transition-colors"
        aria-label="Kapat"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  );
}

let toastListeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

function notifyListeners() {
  toastListeners.forEach((listener) => listener([...toasts]));
}

export function showToast(message: string, type: ToastType = 'info', duration?: number) {
  const id = Math.random().toString(36).substring(2, 9);
  toasts = [...toasts, { id, message, type, duration }];
  notifyListeners();
}

export function ToastContainer() {
  const [localToasts, setLocalToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setLocalToasts(newToasts);
    };
    toastListeners.push(listener);
    // Initialize with current toasts using a microtask to avoid sync setState
    Promise.resolve().then(() => {
      setLocalToasts([...toasts]);
    });
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  const removeToast = useCallback((id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    notifyListeners();
  }, []);

  if (localToasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[1700] flex flex-col gap-2 max-w-sm">
      {localToasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}
