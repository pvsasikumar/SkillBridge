import { notifications } from '@/data/mockData';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const iconMap: Record<string, string> = {
  assessment: 'assignment',
  learning: 'menu_book',
  gap: 'gps_fixed',
  achievement: 'emoji_events',
  faculty: 'group',
};

const colorMap = {
  assessment: 'bg-primary-50 text-primary-600',
  learning: 'bg-success-50 text-success-600',
  gap: 'bg-danger-50 text-danger-600',
  achievement: 'bg-purple-50 text-purple-600',
  faculty: 'bg-warning-50 text-warning-600',
};

export default function Notifications() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-on-surface">Notifications</h1>
        <Button variant="ghost" size="sm">Mark all as read</Button>
      </div>

      <div className="space-y-2">
        {notifications.map(n => {
          const iconName = iconMap[n.type];
          return (
            <Card
              key={n.id}
              hover
              padding="sm"
              className={cn('flex items-start gap-4 p-4', !n.read && 'border-l-2 border-l-primary-500')}
            >
              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', colorMap[n.type])}>
                <span className="material-symbols-outlined text-[16px]">{iconName}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={cn('text-sm', n.read ? 'font-medium text-on-surface' : 'font-semibold text-on-surface')}>
                    {n.title}
                  </p>
                  {!n.read && <span className="w-2 h-2 bg-primary-500 rounded-full shrink-0" />}
                </div>
                <p className="text-sm text-on-surface-variant mt-0.5">{n.message}</p>
                <p className="text-xs text-outline mt-1">{new Date(n.timestamp).toLocaleDateString()}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
