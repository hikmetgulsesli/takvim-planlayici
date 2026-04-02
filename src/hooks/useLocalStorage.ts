import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'takvim-planlayici-events';

interface UseLocalStorageResult<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

function isQuotaExceededError(error: unknown): boolean {
  if (error instanceof DOMException) {
    if (
      error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      error.code === 22
    ) {
      return true;
    }
  }
  if (error instanceof Error) {
    if (
      error.name === 'QuotaExceededError' ||
      error.message.includes('quota') ||
      error.message.includes('QUOTA')
    ) {
      return true;
    }
  }
  return false;
}

export function useLocalStorage<T>(
  key: string = STORAGE_KEY,
  initialValue: T
): UseLocalStorageResult<T> {
  const [value, setInternalValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      setIsLoading(true);
      setError(null);

      const stored = localStorage.getItem(key);
      if (stored !== null) {
        setInternalValue(JSON.parse(stored));
      }
    } catch (err) {
      setError(`Yükleme hatası: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  // Save to localStorage
  const setValue = useCallback(async (newValue: T | ((prev: T) => T)) => {
    try {
      setError(null);

      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;

      localStorage.setItem(key, JSON.stringify(valueToStore));
      setInternalValue(valueToStore);
    } catch (err) {
      if (isQuotaExceededError(err)) {
        setError('Depolama alanı dolu. Bazı etkinlikleri silin.');
      } else {
        setError(`Kaydetme hatası: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
      }
      throw err;
    }
  }, [key, value]);

  return { value, setValue, isLoading, error };
}
