import { cn } from '@/lib/utils';
import { DotIndicator } from './Badge';
import type { Skill } from '@/types';

interface SkillBarProps {
  skill: Skill;
  showGap?: boolean;
  className?: string;
}

export function SkillBar({ skill, showGap, className }: SkillBarProps) {
  const gap = skill.requiredLevel - skill.currentLevel;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DotIndicator status={skill.status} />
          <span className="text-sm font-medium text-on-surface">{skill.name}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-on-surface-variant">{skill.currentLevel}%</span>
          {showGap && gap > 0 && (
            <span className="text-danger-500 font-medium">-{gap}%</span>
          )}
          <span className="text-outline">/ {skill.requiredLevel}%</span>
        </div>
      </div>
      <div className="relative h-2.5 bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700',
            skill.currentLevel >= 75 ? 'bg-success-500' : skill.currentLevel >= 50 ? 'bg-warning-500' : 'bg-danger-500'
          )}
          style={{ width: `${skill.currentLevel}%` }}
        />
        {showGap && (
          <div
            className="absolute top-0 h-full bg-outline-light/50 rounded-r-full"
            style={{
              left: `${skill.currentLevel}%`,
              width: `${Math.min(gap, 100 - skill.currentLevel)}%`,
            }}
          />
        )}
      </div>
    </div>
  );
}

interface SkillCardProps {
  skill: Skill;
  className?: string;
}

export function SkillCard({ skill, className }: SkillCardProps) {
  const gap = skill.requiredLevel - skill.currentLevel;

  return (
    <div className={cn('p-4 glass-card space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-on-surface">{skill.name}</h4>
        <span className="text-xs text-outline">{skill.category}</span>
      </div>
      <SkillBar skill={skill} showGap />
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          <DotIndicator status={skill.status} />
          <span className="text-xs text-on-surface-variant capitalize">{skill.status.replace('-', ' ')}</span>
        </div>
        {gap > 0 && (
          <span className="text-xs font-medium text-danger-600">Gap: {gap}%</span>
        )}
      </div>
    </div>
  );
}
