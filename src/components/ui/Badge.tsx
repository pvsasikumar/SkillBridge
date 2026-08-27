import { cn } from '@/lib/utils';
import type { CompetencyStatus } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'primary';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const variants = {
    default: 'bg-surface-container-high text-on-surface-variant',
    primary: 'bg-primary-50 text-primary-700 border border-primary-200/50',
    success: 'bg-success-50 text-success-700 border border-success-400/20',
    warning: 'bg-warning-50 text-warning-600 border border-warning-400/20',
    danger: 'bg-danger-50 text-danger-600 border border-danger-400/20',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span className={cn('inline-flex items-center font-semibold rounded-full', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: CompetencyStatus }) {
  const config = {
    strong: { label: 'Strong', variant: 'success' as const },
    developing: { label: 'Developing', variant: 'warning' as const },
    'needs-attention': { label: 'Needs Attention', variant: 'danger' as const },
  };

  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function DotIndicator({ status }: { status: CompetencyStatus }) {
  const colors = {
    strong: 'bg-success-500',
    developing: 'bg-warning-500',
    'needs-attention': 'bg-danger-500',
  };
  return <span className={cn('inline-block w-2 h-2 rounded-full ring-2 ring-white', colors[status])} />;
}
