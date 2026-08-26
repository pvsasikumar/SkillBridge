import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function Card({ children, className, hover, padding = 'md', onClick }: CardProps) {
  const paddings = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' };
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-card',
        hover && 'hover:shadow-lg hover:border-primary-200 transition-all duration-200 cursor-pointer',
        paddings[padding],
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between mb-4', className)}>
      <div>
        <h3 className="text-base font-semibold text-on-surface">{title}</h3>
        {subtitle && <p className="text-sm text-on-surface-variant mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
