import { useState, useEffect } from 'react';
import type { Toast, ToastType } from '../types';

let toastListeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

function notifyListeners() {
  toastListeners.forEach((listener) => listener([...toasts]))
}

export function showToast(message: string, type: ToastType = 'info', duration: number = 3000) {
  const id = Math.random().toString(36).substring(2, 9);
  toasts = [...toasts, { id, message, type, duration }];
  notifyListeners();

  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }
}

export function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  notifyListeners();
}

export function useToast() {
  const [localToasts, setLocalToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setLocalToasts(newToasts);
    };
    toastListeners.push(listener);
    Promise.resolve().then(() => {
      setLocalToasts([...toasts]);
    });
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  return localToasts;
}
