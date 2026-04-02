import { useCallback, useSyncExternalStore } from 'react';

export type NotificationPermission = 'default' | 'granted' | 'denied';

let permissionListeners: (() => void)[] = [];

function getNotificationPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'default';
  }
  return Notification.permission as NotificationPermission;
}

function notifyPermissionListeners() {
  permissionListeners.forEach((listener) => listener());
}

export function useNotifications() {
  const permission = useSyncExternalStore(
    (callback) => {
      permissionListeners.push(callback);
      // Also listen to permission changes via the permissionchange event
      if (typeof window !== 'undefined' && 'Notification' in window) {
        window.addEventListener('permissionchange', callback);
        return () => {
          permissionListeners = permissionListeners.filter((l) => l !== callback);
          window.removeEventListener('permissionchange', callback);
        };
      }
      return () => {
        permissionListeners = permissionListeners.filter((l) => l !== callback);
      };
    },
    getNotificationPermission,
    () => 'default' as NotificationPermission
  );

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      notifyPermissionListeners();
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
