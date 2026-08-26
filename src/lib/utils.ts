import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'strong':
    case 'completed':
    case 'mastered':
      return 'text-success-600 bg-success-50';
    case 'developing':
    case 'in-progress':
      return 'text-warning-600 bg-warning-50';
    case 'needs-attention':
    case 'needs-improvement':
    case 'upcoming':
    case 'locked':
      return 'text-danger-600 bg-danger-50';
    default:
      return 'text-on-surface-variant bg-surface-container';
  }
}

export function getCompetencyColor(level: number): string {
  if (level >= 75) return 'text-success-600';
  if (level >= 50) return 'text-warning-600';
  return 'text-danger-600';
}

export function getCompetencyBg(level: number): string {
  if (level >= 75) return 'bg-success-500';
  if (level >= 50) return 'bg-warning-500';
  return 'bg-danger-500';
}

export function getCompetencyLabel(level: number): string {
  if (level >= 75) return 'Strong';
  if (level >= 50) return 'Developing';
  return 'Needs Attention';
}

export function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
