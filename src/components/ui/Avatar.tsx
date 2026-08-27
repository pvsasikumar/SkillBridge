import { cn } from '@/lib/utils';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const colors = [
  'bg-primary-100 text-primary-700',
  'bg-success-100 text-success-700',
  'bg-warning-100 text-warning-600',
  'bg-danger-100 text-danger-600',
  'bg-secondary-100 text-secondary-700',
  'bg-tertiary-100 text-tertiary-700',
  'bg-primary-50 text-primary-600',
  'bg-tertiary-50 text-tertiary-600',
];

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-lg' };

  return (
    <div className={cn('rounded-full flex items-center justify-center font-bold shrink-0 ring-2 ring-white shadow-sm', sizes[size], getColor(name), className)}>
      {getInitials(name)}
    </div>
  );
}
