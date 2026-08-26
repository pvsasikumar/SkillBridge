import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { GrowthChart } from '@/components/charts/GrowthChart';
import { CompetencyChart } from '@/components/charts/CompetencyChart';
import { AIInsight } from '@/components/ui/AIInsight';
import { competencyHistory, studentSkills } from '@/data/mockData';
import { cn, getCompetencyLabel } from '@/lib/utils';

const growthLines = [
  { key: 'javascript', color: '#006948', label: 'JavaScript' },
  { key: 'react', color: '#5b598c', label: 'React' },
  { key: 'sql', color: '#00685f', label: 'SQL' },
  { key: 'nodejs', color: '#d9a000', label: 'Node.js' },
  { key: 'git', color: '#dc3545', label: 'Git' },
];

const masteryStatus = [
  { label: 'Mastered', count: studentSkills.filter(s => s.currentLevel >= 75).length, color: 'text-success-600', bg: 'bg-success-50' },
  { label: 'Developing', count: studentSkills.filter(s => s.currentLevel >= 50 && s.currentLevel < 75).length, color: 'text-warning-600', bg: 'bg-warning-50' },
  { label: 'Needs Improvement', count: studentSkills.filter(s => s.currentLevel < 50).length, color: 'text-danger-600', bg: 'bg-danger-50' },
];

const radarData = studentSkills.slice(0, 6).map(s => ({
  skill: s.name,
  current: s.currentLevel,
  required: s.requiredLevel,
}));

export default function ProgressPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Progress & Analytics</h1>
        <p className="text-sm text-on-surface-variant mt-1">Track your learning journey and competency growth</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Learning Streak', value: '7 days', icon: 'local_fire_department', color: 'text-warning-600', bg: 'bg-warning-50' },
          { label: 'Time Spent', value: '24.5 hrs', icon: 'schedule', color: 'text-primary-600', bg: 'bg-primary-50' },
          { label: 'Topics Completed', value: '6/12', icon: 'menu_book', color: 'text-success-600', bg: 'bg-success-50' },
          { label: 'Assessments', value: '5', icon: 'assignment', color: 'text-secondary-600', bg: 'bg-secondary-50' },
          { label: 'Quiz Accuracy', value: '76%', icon: 'trending_up', color: 'text-tertiary-600', bg: 'bg-tertiary-50' },
        ].map(stat => (
          <Card key={stat.label} className="flex items-start gap-3">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', stat.bg)}>
              <span className={cn('material-symbols-outlined text-[16px]', stat.color)}>{stat.icon}</span>
            </div>
            <div>
              <p className="text-xl font-bold text-on-surface">{stat.value}</p>
              <p className="text-xs text-on-surface-variant">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <AIInsight
        message="Your SQL competency improved by 14% this week. JavaScript has shown steady growth over the past month. Focus on React to accelerate your progress toward Full Stack Developer."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <Card>
          <CardHeader title="Competency Growth" subtitle="Before vs After — 5 month trend" />
          <GrowthChart data={competencyHistory} lines={growthLines} xAxisKey="month" height={300} />
        </Card>

        {/* Radar */}
        <Card>
          <CardHeader title="Current vs Required" subtitle="Skill competency overview" />
          <CompetencyChart data={radarData} height={300} />
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Mastery Status */}
        <Card>
          <CardHeader title="Mastery Status" />
          <div className="space-y-4">
            {masteryStatus.map(status => (
              <div key={status.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn('w-3 h-3 rounded-full', status.bg)} />
                  <span className="text-sm font-medium text-on-surface-variant">{status.label}</span>
                </div>
                <span className={cn('text-lg font-bold', status.color)}>{status.count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Competency Growth Table */}
        <Card className="lg:col-span-2">
          <CardHeader title="Skill Progress" subtitle="Your improvement over time" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-light">
                  <th className="text-left py-2.5 font-medium text-on-surface-variant">Skill</th>
                  <th className="text-center py-2.5 font-medium text-on-surface-variant">Start</th>
                  <th className="text-center py-2.5 font-medium text-on-surface-variant">Current</th>
                  <th className="text-center py-2.5 font-medium text-on-surface-variant">Change</th>
                  <th className="text-center py-2.5 font-medium text-on-surface-variant">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'JavaScript', start: 48, current: 68 },
                  { name: 'React', start: 35, current: 42 },
                  { name: 'SQL', start: 65, current: 72 },
                  { name: 'Node.js', start: 25, current: 38 },
                  { name: 'Git', start: 78, current: 89 },
                  { name: 'TypeScript', start: 40, current: 55 },
                ].map(skill => (
                  <tr key={skill.name} className="border-b border-outline-light/50">
                    <td className="py-3 font-medium text-on-surface">{skill.name}</td>
                    <td className="py-3 text-center text-on-surface-variant">{skill.start}%</td>
                    <td className="py-3 text-center font-semibold text-on-surface">{skill.current}%</td>
                    <td className="py-3 text-center">
                      <span className="text-success-600 font-semibold">+{skill.current - skill.start}%</span>
                    </td>
                    <td className="py-3 text-center">
                      <Badge variant={skill.current >= 75 ? 'success' : skill.current >= 50 ? 'warning' : 'danger'} size="sm">
                        {getCompetencyLabel(skill.current)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
