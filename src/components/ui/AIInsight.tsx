import { cn } from '@/lib/utils';
import { Button } from './Button';

interface AIInsightProps {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'info' | 'success' | 'warning';
  className?: string;
}

export function AIInsight({ title = 'AI Insight', message, actionLabel, onAction, variant = 'info', className }: AIInsightProps) {
  const variants = {
    info: 'border-primary-200 bg-primary-50/50',
    success: 'border-success-200 bg-success-50/50',
    warning: 'border-warning-200 bg-warning-50/50',
  };

  const iconColors = {
    info: 'text-primary-500',
    success: 'text-success-500',
    warning: 'text-warning-500',
  };

  return (
    <div className={cn('glass-card border p-4', variants[variant], className)}>
      <div className="flex gap-3">
        <div className={cn('mt-0.5 shrink-0', iconColors[variant])}>
          <span className="material-symbols-outlined text-[18px]">lightbulb</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">{title}</p>
          <p className="text-sm text-on-surface leading-relaxed">{message}</p>
          {actionLabel && onAction && (
            <Button variant="ghost" size="sm" className="mt-3 -ml-2" onClick={onAction}>
              {actionLabel}
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
