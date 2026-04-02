import type { FC } from 'react';
import type { ViewMode } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const VIEW_OPTIONS: Array<{ value: ViewMode; label: string }> = [
  { value: 'month', label: 'Ay' },
  { value: 'week', label: 'Hafta' },
  { value: 'day', label: 'Gün' },
];

export const Navbar: FC<NavbarProps> = ({ currentView, onViewChange }) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-[var(--color-surface-container-low)]">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">calendar_today</span>
        <span className="text-xl font-bold text-[var(--color-on-surface)] font-headline tracking-tight">Takvim Planlayıcı</span>
      </div>
      
      <div className="flex items-center gap-2 bg-[var(--color-surface-container)] rounded-lg p-1">
        {VIEW_OPTIONS.map((view) => (
          <button
            key={view.value}
            onClick={() => onViewChange(view.value)}
            className={`
              px-4 py-2 rounded-md font-medium text-sm transition-all duration-200
              ${currentView === view.value 
                ? 'bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] shadow-sm' 
                : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)]'
              }
            `}
          >
            {view.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button 
          className="p-2 rounded-lg text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-container-high)] transition-all duration-200"
          aria-label="Ayarlar"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
        <div className="h-10 w-10 rounded-full overflow-hidden border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-high)] flex items-center justify-center">
          <span className="material-symbols-outlined text-[var(--color-on-surface-variant)]">person</span>
        </div>
      </div>
    </nav>
  );
};
