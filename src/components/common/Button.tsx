import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';
  
  const variantClasses = {
    primary: 'bg-gradient-to-br from-primary to-primary-container text-on-primary-container shadow-lg shadow-primary/20 hover:scale-105',
    secondary: 'bg-gradient-to-br from-secondary to-secondary-container text-on-secondary-container shadow-lg shadow-secondary/20 hover:scale-105',
    tertiary: 'bg-gradient-to-br from-tertiary to-tertiary-container text-on-tertiary-container shadow-lg shadow-tertiary/20 hover:scale-105',
    ghost: 'bg-transparent text-primary hover:bg-white/5',
    danger: 'bg-error-container text-on-error-container hover:bg-error/20',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className,
  ].join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="material-symbols-outlined animate-spin text-lg">
          progress_activity
        </span>
      )}
      {!isLoading && leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}
