import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth,
  loading,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-primary-600 active:bg-primary-700 shadow-sm focus-visible:outline-primary',
    secondary: 'bg-primary-50 text-primary-700 hover:bg-primary-100 active:bg-primary-200 focus-visible:outline-primary-500',
    outline: 'border border-outline-light text-on-surface bg-surface-container-lowest hover:bg-surface-container active:bg-surface-container-high focus-visible:outline-outline',
    ghost: 'text-on-surface-variant hover:bg-surface-container active:bg-surface-container-high focus-visible:outline-outline',
    danger: 'bg-danger-500 text-on-primary hover:bg-danger-600 active:bg-danger-600 focus-visible:outline-danger-500',
    gradient: 'gradient-btn shadow-sm hover:opacity-90 active:opacity-80 focus-visible:outline-primary',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
