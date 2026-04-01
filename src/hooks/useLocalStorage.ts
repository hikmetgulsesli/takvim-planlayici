import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'takvim-planlayici-events';

interface UseLocalStorageResult<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => Promise<void>;
  isLoading: boolean;
  error: string | null;
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
    const loadValue = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use setTimeout to make it async and non-blocking
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            try {
              const stored = localStorage.getItem(key);
              if (stored !== null) {
                setInternalValue(JSON.parse(stored));
              }
            } catch (err) {
              setError(`Yükleme hatası: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
            }
            resolve();
          }, 0);
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadValue();
  }, [key]);

  // Save to localStorage
  const setValue = useCallback(async (newValue: T | ((prev: T) => T)) => {
    try {
      setError(null);
      
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          try {
            setInternalValue((prev) => {
              const valueToStore = newValue instanceof Function ? newValue(prev) : newValue;
              
              try {
                localStorage.setItem(key, JSON.stringify(valueToStore));
              } catch (storageError) {
                // Handle quota exceeded error
                if (storageError instanceof Error && storageError.name === 'QuotaExceededError') {
                  reject(new Error('Depolama alanı dolu. Bazı etkinlikleri silin.'));
                  return prev;
                }
                throw storageError;
              }
              
              return valueToStore;
            });
            resolve();
          } catch (err) {
            reject(err);
          }
        }, 0);
      });
    } catch (err) {
      setError(`Kaydetme hatası: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
      throw err;
    }
  }, [key]);

  return { value, setValue, isLoading, error };
}
