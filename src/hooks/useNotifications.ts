import { useCallback, useSyncExternalStore } from 'react';

export type NotificationPermission = 'default' | 'granted' | 'denied';

function getNotificationPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'default';
  }
  return Notification.permission as NotificationPermission;
}

export function useNotifications() {
  const permission = useSyncExternalStore(
    () => () => {},
    getNotificationPermission,
    () => 'default' as NotificationPermission
  );

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      return result === 'granted';
    } catch {
      return false;
    }
  }, []);

  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options);
    }
  }, []);

  return {
    permission,
    requestPermission,
    showNotification,
  };
}
