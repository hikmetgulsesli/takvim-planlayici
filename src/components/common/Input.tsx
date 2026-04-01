import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', ...props }, ref) => {
    const inputClasses = [
      'w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary transition-all',
      leftIcon ? 'pl-12' : '',
      rightIcon ? 'pr-12' : '',
      error ? 'ring-2 ring-error' : '',
      className,
    ].join(' ');

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-on-surface-variant mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-outline">
              {leftIcon}
            </div>
          )}
          <input ref={ref} className={inputClasses} {...props} />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-outline">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-error">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-on-surface-variant">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
