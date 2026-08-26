import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'auto';
  showLabel?: boolean;
  className?: string;
}

export function Progress({ value, max = 100, size = 'md', color = 'auto', showLabel, className }: ProgressProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const resolvedColor = color === 'auto'
    ? (percentage >= 75 ? 'bg-success-500' : percentage >= 50 ? 'bg-warning-500' : 'bg-danger-500')
    : ({
        primary: 'gradient-btn',
        success: 'bg-success-500',
        warning: 'bg-warning-500',
        danger: 'bg-danger-500',
      }[color]);

  const sizes = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-medium text-on-surface-variant">{percentage}%</span>
        </div>
      )}
      <div className={cn('w-full bg-surface-container-highest rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', resolvedColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
