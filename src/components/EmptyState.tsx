import type { FC } from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: FC<EmptyStateProps> = ({ icon, title, message, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center animate-fade-in">
      <div className="relative mb-8">
        {/* Abstract glow background */}
        <div className="absolute inset-0 blur-[60px] bg-[var(--color-primary)]/10 rounded-full scale-150"></div>
        <div className="absolute inset-0 blur-[100px] bg-[var(--color-secondary)]/5 rounded-full scale-[2]"></div>
        
        {/* Icon container */}
        <div className="relative w-32 h-32 flex items-center justify-center rounded-full border border-[var(--color-primary)]/20 glass-morphism shadow-[inset_0_0_20px_rgba(0,212,255,0.05)]">
          <span className="material-symbols-outlined text-6xl text-[var(--color-primary)]" style={{ textShadow: '0 0 15px rgba(168, 232, 255, 0.4)' }}>
            {icon}
          </span>
        </div>
      </div>
      
      <h3 className="font-headline text-2xl font-bold text-[var(--color-on-surface)] mb-3">
        {title}
      </h3>
      <p className="text-[var(--color-on-surface-variant)] max-w-sm mb-8 leading-relaxed">
        {message}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] text-[var(--color-on-primary)] font-semibold shadow-lg shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-95 transition-all duration-200"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
