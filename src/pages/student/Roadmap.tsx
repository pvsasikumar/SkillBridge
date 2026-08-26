import { Link } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { learningModules } from '@/data/mockData';
import { cn, formatMinutes } from '@/lib/utils';

const statusConfig = {
  completed: { icon: 'check_circle', color: 'text-success-500', bg: 'bg-success-50', border: 'border-success-200', label: 'Completed' },
  'in-progress': { icon: 'play_arrow', color: 'text-primary', bg: 'bg-primary-50', border: 'border-primary-200', label: 'In Progress' },
  upcoming: { icon: 'radio_button_unchecked', color: 'text-outline', bg: 'bg-surface-container', border: 'border-outline-light', label: 'Upcoming' },
  locked: { icon: 'lock', color: 'text-gray-300', bg: 'bg-surface-container', border: 'border-outline-light', label: 'Locked' },
};

const difficultyColor = {
  Beginner: 'success',
  Intermediate: 'warning',
  Advanced: 'danger',
} as const;

export default function Roadmap() {
  const completedCount = learningModules.filter(m => m.status === 'completed').length;
  const overallProgress = Math.round(learningModules.reduce((a, m) => a + m.progress, 0) / learningModules.length);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Learning Roadmap</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            {completedCount} of {learningModules.length} modules completed · {overallProgress}% overall progress
          </p>
        </div>
        <Link to="/learning">
          <Button>
            Continue Learning
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Button>
        </Link>
      </div>

      <Card padding="lg">
        <Progress value={overallProgress} size="lg" showLabel />
      </Card>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-outline-light hidden sm:block" />

        <div className="space-y-4">
          {learningModules.map((module, i) => {
            const config = statusConfig[module.status];

            return (
              <div key={module.id} className="relative flex gap-4 sm:gap-6">
                <div className="relative z-10 shrink-0 hidden sm:flex">
                  <div className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center border-2',
                    config.bg, config.border
                  )}>
                    <span className={`material-symbols-outlined text-[18px] ${config.color}`}>{config.icon}</span>
                  </div>
                </div>

                <Card
                  hover={module.status !== 'locked'}
                  className={cn(
                    'flex-1',
                    module.status === 'completed' && 'bg-success-50/30 border-success-200',
                    module.status === 'in-progress' && 'border-primary-200 ring-1 ring-primary-100',
                    module.status === 'locked' && 'opacity-60'
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-outline">Step {i + 1}</span>
                        <Badge variant={difficultyColor[module.difficulty]} size="sm">{module.difficulty}</Badge>
                        {module.status === 'completed' && <Badge variant="success" size="sm">Done</Badge>}
                        {module.status === 'in-progress' && <Badge variant="primary" size="sm">Active</Badge>}
                      </div>
                      <h3 className="text-base font-semibold text-on-surface">{module.title}</h3>
                      <p className="text-sm text-on-surface-variant mt-1">{module.description}</p>

                      <div className="flex items-center gap-4 mt-3 text-xs text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">schedule</span>
                          {formatMinutes(module.estimatedTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">menu_book</span>
                          {module.skill}
                        </span>
                      </div>

                      {module.progress > 0 && module.progress < 100 && (
                        <div className="mt-3">
                          <Progress value={module.progress} size="sm" />
                        </div>
                      )}
                    </div>

                    <div className="shrink-0">
                      {module.status === 'locked' ? (
                        <Button variant="outline" size="sm" disabled>Locked</Button>
                      ) : module.status === 'completed' ? (
                        <Button variant="ghost" size="sm">Review</Button>
                      ) : (
                        <Link to="/learning">
                          <Button size="sm">
                            {module.status === 'in-progress' ? 'Continue' : 'Start'}
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
