import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  trailing?: ReactNode;
}

export function Input({ label, error, hint, icon, trailing, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-on-surface-variant">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-outline">{icon}</div>}
        <input
          id={inputId}
          className={cn(
            'w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl transition-all duration-200',
            'placeholder:text-outline',
            error
              ? 'border-danger-400 focus:border-danger-500 focus:ring-2 focus:ring-danger-500/20'
              : 'border-outline-light focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15',
            'focus:outline-none',
            icon && 'pl-10',
            trailing && 'pr-10',
            className
          )}
          {...props}
        />
        {trailing && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {trailing}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-danger-600 font-medium">{error}</p>}
      {hint && !error && <p className="text-sm text-on-surface-variant">{hint}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-semibold text-on-surface-variant">{label}</label>}
      <select
        className={cn(
          'w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl transition-all duration-200',
          error
            ? 'border-danger-400 focus:border-danger-500 focus:ring-2 focus:ring-danger-500/20'
            : 'border-outline-light focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15',
          'focus:outline-none',
          className
        )}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-sm text-danger-600 font-medium">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-semibold text-on-surface-variant">{label}</label>}
      <textarea
        className={cn(
          'w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl transition-all duration-200 resize-none',
          error
            ? 'border-danger-400 focus:border-danger-500 focus:ring-2 focus:ring-danger-500/20'
            : 'border-outline-light focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15',
          'focus:outline-none',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-danger-600 font-medium">{error}</p>}
    </div>
  );
}
