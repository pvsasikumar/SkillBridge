import { useState, useCallback } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/lib/utils';
import { competencyCategories, allCompetencies, governmentRoles, roleRequirements, mockOfficials } from '@/data/competencyFramework';
import type { CompetencyCategory, CompetencyGap } from '@/types';

export default function CompetencyFrameworkPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('cat-statistical');
  const [selectedRole, setSelectedRole] = useState<string>('Statistical Officer');
  const [showAddModal, setShowAddModal] = useState(false);

  const roleReqs = roleRequirements.filter(r => r.role === selectedRole);

  const officialStats = mockOfficials.map(official => {
    const gaps: CompetencyGap[] = roleReqs.map(req => {
      const current = official.competencyScores[req.competencyId] || 0;
      const gap = req.requiredLevel - current;
      return {
        id: `gap-${official.id}-${req.competencyId}`,
        competencyId: req.competencyId,
        competencyName: req.competencyName,
        category: '',
        currentScore: current,
        requiredScore: req.requiredLevel,
        gapPercentage: gap,
        priority: gap > 20 ? 'critical' as const : gap > 10 ? 'high' as const : gap > 0 ? 'medium' as const : 'low' as const,
        aiInsight: '',
      };
    });
    return { official, gaps };
  });

  const avgByComp = roleReqs.map(req => {
    const scores = mockOfficials
      .filter(o => o.competencyScores[req.competencyId] !== undefined)
      .map(o => o.competencyScores[req.competencyId]);
    const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    return { ...req, averageScore: avg };
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Competency Framework</h1>
          <p className="text-sm text-on-surface-variant mt-1">Configure competencies, roles, and requirements</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <span className="material-symbols-outlined text-[16px]">add</span>
          Add Competency
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Competencies', value: allCompetencies.length, iconName: 'gps_fixed', color: 'text-primary', bg: 'bg-primary-50' },
          { label: 'Categories', value: competencyCategories.length, iconName: 'settings', color: 'text-success-600', bg: 'bg-success-50' },
          { label: 'Government Roles', value: governmentRoles.length, iconName: 'group', color: 'text-secondary-600', bg: 'bg-secondary-50' },
          { label: 'Active Officials', value: mockOfficials.length, iconName: 'bar_chart', color: 'text-warning-600', bg: 'bg-warning-50' },
        ].map(stat => (
          <Card key={stat.label} className="flex items-start gap-4">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center shrink-0`}>
              <span className={cn('material-symbols-outlined text-[18px]', stat.color)}>{stat.iconName}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Competency Categories */}
        <Card>
          <CardHeader title="Competency Categories" subtitle="Manage competency definitions" />
          <div className="space-y-2">
            {competencyCategories.map(category => (
              <div key={category.id} className="border border-outline-light rounded-xl overflow-hidden">
                <button onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)} className="w-full flex items-center justify-between p-3 hover:bg-surface-container transition-colors">
                  <div className="flex items-center gap-3">
                    {expandedCategory === category.id ? <span className="material-symbols-outlined text-[16px] text-outline">expand_more</span> : <span className="material-symbols-outlined text-[16px] text-outline">chevron_right</span>}
                    <div className="text-left">
                      <p className="text-sm font-semibold text-on-surface">{category.name}</p>
                      <p className="text-xs text-on-surface-variant">{category.competencies.length} competencies</p>
                    </div>
                  </div>
                  <Badge variant="primary" size="sm">{category.competencies.length}</Badge>
                </button>
                {expandedCategory === category.id && (
                  <div className="border-t border-outline-light p-3 space-y-2 bg-surface-container/50">
                    {category.competencies.map(comp => (
                      <div key={comp.id} className="flex items-center justify-between p-2 glass-card rounded-xl border border-outline-light">
                        <div>
                          <p className="text-sm font-medium text-on-surface">{comp.name}</p>
                          <p className="text-xs text-on-surface-variant">{comp.description}</p>
                        </div>
                        <button className="p-1.5 rounded-xl hover:bg-surface-container-high"><span className="material-symbols-outlined text-[12px] text-outline">edit</span></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Role Requirements */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Role-Based Requirements" subtitle="Competency requirements by government role" />
            <div className="mb-4">
              <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm">
                {governmentRoles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              {avgByComp.map(req => {
                const gap = req.requiredLevel - req.averageScore;
                return (
                  <div key={req.id} className="p-3 bg-surface-container rounded-xl">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-on-surface">{req.competencyName}</span>
                      <Badge variant={req.priority === 'high' ? 'danger' : req.priority === 'medium' ? 'warning' : 'primary'} size="sm">{req.priority}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-on-surface-variant mb-2">
                      <span>Avg: <strong className={cn(req.averageScore >= req.requiredLevel ? 'text-success-600' : 'text-danger-600')}>{req.averageScore}%</strong></span>
                      <span>Required: <strong>{req.requiredLevel}%</strong></span>
                      <span>Gap: <strong className={cn(gap > 0 ? 'text-danger-600' : 'text-success-600')}>{gap > 0 ? `+${gap}` : gap}%</strong></span>
                    </div>
                    <Progress value={req.averageScore} size="sm" />
                    <div className="mt-1 flex items-center gap-1">
                      <div className="flex-1 h-0.5 bg-outline-light relative">
                        <div className="absolute left-0 top-0 h-full bg-primary rounded-full" style={{ width: `${req.averageScore}%` }} />
                        <div className="absolute top-0 h-full w-0.5 bg-danger-500" style={{ left: `${req.requiredLevel}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
