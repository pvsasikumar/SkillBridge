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
    info: 'border-primary-200/60 bg-gradient-to-r from-primary-50/80 to-secondary-50/40',
    success: 'border-success-400/30 bg-gradient-to-r from-success-50/80 to-success-50/40',
    warning: 'border-warning-400/30 bg-gradient-to-r from-warning-50/80 to-warning-50/40',
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
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">{title}</p>
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
