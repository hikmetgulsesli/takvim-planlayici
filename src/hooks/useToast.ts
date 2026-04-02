import { useSyncExternalStore } from 'react';
import type { Toast, ToastType } from '../types';

let toastListeners: (() => void)[] = [];
let toasts: Toast[] = [];

function notifyListeners() {
  toastListeners.forEach((listener) => listener());
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

function getSnapshot(): Toast[] {
  return [...toasts];
}

function getServerSnapshot(): Toast[] {
  return [];
}

export function useToast() {
  return useSyncExternalStore(
    (callback) => {
      toastListeners.push(callback);
      return () => {
        toastListeners = toastListeners.filter((l) => l !== callback);
      };
    },
    getSnapshot,
    getServerSnapshot
  );
}
