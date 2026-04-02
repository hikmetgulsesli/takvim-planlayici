import type { FC } from 'react';
import type { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onCreateEvent: () => void;
}

const NAV_ITEMS: Array<{ view: ViewMode; label: string; icon: string }> = [
  { view: 'month', label: 'Ay', icon: 'calendar_month' },
  { view: 'week', label: 'Hafta', icon: 'date_range' },
  { view: 'day', label: 'Gün', icon: 'calendar_today' },
];

export const Sidebar: FC<SidebarProps> = ({ currentView, onViewChange, onCreateEvent }) => {
  return (
    <aside className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-72 flex flex-col py-6 px-4 z-40 bg-[var(--color-surface-container-low)] border-r border-[var(--color-outline-variant)]/10">
      <button
        onClick={onCreateEvent}
        className="mb-6 mx-2 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] text-[var(--color-on-primary)] py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[var(--color-primary)]/10 hover:scale-[1.02] active:scale-95 transition-all duration-200"
      >
        <span className="material-symbols-outlined">add</span>
        Yeni Etkinlik
      </button>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.view}
            onClick={() => onViewChange(item.view)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200
              ${currentView === item.view 
                ? 'bg-[var(--color-primary-container)]/20 text-[var(--color-primary)]' 
                : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)]'
              }
            `}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 space-y-1 border-t border-[var(--color-outline-variant)]/10">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-all duration-200">
          <span className="material-symbols-outlined">notifications</span>
          <span>Bildirimler</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-all duration-200">
          <span className="material-symbols-outlined">help</span>
          <span>Yardım</span>
        </button>
      </div>
    </aside>
  );
};
