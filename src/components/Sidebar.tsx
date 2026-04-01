import type { FC } from 'react';
import type { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onCreateEvent: () => void;
}

const NAV_ITEMS: Array<{ value: ViewMode; label: string; icon: string }> = [
  { value: 'month', label: 'Ay', icon: 'calendar_month' },
  { value: 'week', label: 'Hafta', icon: 'view_week' },
  { value: 'day', label: 'Gün', icon: 'view_day' },
];

export const Sidebar: FC<SidebarProps> = ({ currentView, onViewChange, onCreateEvent }) => {
  return (
    <aside className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-72 flex flex-col py-6 px-4 bg-[var(--color-surface-container-low)] border-r border-[var(--color-outline-variant)]/15 z-40">
      {/* Create Event Button */}
      <button
        onClick={onCreateEvent}
        className="mb-6 mx-2 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] text-[var(--color-on-primary)] py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[var(--color-primary)]/10 hover:scale-[1.02] active:scale-95 transition-all duration-200"
      >
        <span className="material-symbols-outlined">add</span>
        Yeni Etkinlik
      </button>

      {/* Navigation */}
      <nav className="flex-1">
        <div className="text-xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-3 px-4">
          Görünüm
        </div>
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.value}
              onClick={() => onViewChange(item.value)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200
                ${currentView === item.value
                  ? 'bg-[var(--color-primary-container)]/20 text-[var(--color-primary)]'
                  : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] hover:text-[var(--color-on-surface)]'
                }
              `}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-[var(--color-outline-variant)]/15 pt-4 mt-4">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] hover:text-[var(--color-on-surface)] transition-all duration-200">
          <span className="material-symbols-outlined">help</span>
          Yardım
        </button>
      </div>
    </aside>
  );
};
