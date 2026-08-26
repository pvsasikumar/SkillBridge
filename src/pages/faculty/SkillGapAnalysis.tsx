import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Modal } from '@/components/ui/Modal';
import { skillGapData } from '@/data/facultyData';
import { cn, getCompetencyColor } from '@/lib/utils';

type SkillGapStatus = 'strong' | 'developing' | 'needs-support' | 'critical';

const statusConfig: Record<SkillGapStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'primary'; color: string }> = {
  strong: { label: 'Strong', variant: 'success', color: 'text-success-600' },
  developing: { label: 'Developing', variant: 'warning', color: 'text-warning-600' },
  'needs-support': { label: 'Needs Support', variant: 'primary', color: 'text-primary' },
  critical: { label: 'Critical', variant: 'danger', color: 'text-danger-600' },
};

export default function SkillGapAnalysis() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [showInterventionModal, setShowInterventionModal] = useState(false);

  const skillDetail = selectedSkill ? skillGapData.find(s => s.skill === selectedSkill) : null;
  const weakestTopic = skillDetail
    ? [...skillDetail.topics].sort((a, b) => a.averageScore - b.averageScore)[0]
    : null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/faculty" className="p-2 rounded-xl hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-on-surface">
            {selectedSkill ? `${selectedSkill} — Topic Analysis` : 'Skill Gap Analysis'}
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            {selectedSkill
              ? `Detailed topic breakdown for ${selectedSkill}`
              : 'Class-wide skill gap heatmap and analysis'}
          </p>
        </div>
      </div>

      {!selectedSkill ? (
        <>
          {/* Skill Gap Heatmap Table */}
          <Card>
            <CardHeader title="Class Skill Gap Analysis" subtitle="Skills ranked by gap severity" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-light">
                    <th className="text-left py-3 px-4 font-medium text-on-surface-variant">Skill</th>
                    <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Students Assessed</th>
                    <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Average Score</th>
                    <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Target</th>
                    <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Gap</th>
                    <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Status</th>
                    <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[...skillGapData].sort((a, b) => b.gap - a.gap).map(skill => {
                    const cfg = statusConfig[skill.status];
                    return (
                      <tr
                        key={skill.skill}
                        className="border-b border-surface-container hover:bg-surface-container/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedSkill(skill.skill)}
                      >
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-semibold text-on-surface">{skill.skill}</span>
                            <span className="text-xs text-outline ml-2">{skill.category}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center text-on-surface-variant">{skill.studentsAssessed}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={cn('font-semibold', getCompetencyColor(skill.averageScore))}>{skill.averageScore}%</span>
                        </td>
                        <td className="py-3 px-4 text-center text-on-surface-variant">{skill.targetScore}%</td>
                        <td className="py-3 px-4 text-center">
                          <span className={cn('font-bold', skill.gap > 20 ? 'text-danger-600' : skill.gap > 10 ? 'text-warning-600' : 'text-success-600')}>
                            {skill.gap}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedSkill(skill.skill); }}>
                            <span className="material-symbols-outlined text-[14px]">visibility</span>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Quick Overview Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Critical Skills', count: skillGapData.filter(s => s.status === 'critical').length, iconName: 'warning', color: 'text-danger-600', bg: 'bg-danger-50' },
              { label: 'Developing Skills', count: skillGapData.filter(s => s.status === 'developing').length, iconName: 'trending_down', color: 'text-warning-600', bg: 'bg-warning-50' },
              { label: 'Strong Skills', count: skillGapData.filter(s => s.status === 'strong').length, iconName: 'check_circle', color: 'text-success-600', bg: 'bg-success-50' },
            ].map(item => (
              <Card key={item.label} className="flex items-center gap-4">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', item.bg)}>
                  <span className={cn('material-symbols-outlined text-[18px]', item.color)}>{item.iconName}</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-on-surface">{item.count}</p>
                  <p className="text-xs text-on-surface-variant">{item.label}</p>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : skillDetail ? (
        <>
          {/* Topic-Level Analysis */}
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={() => setSelectedSkill(null)}>
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>Back to All Skills
            </Button>
          </div>

          {/* Skill Summary */}
          <div className="grid sm:grid-cols-4 gap-4">
            <Card className="text-center">
              <p className="text-3xl font-bold text-on-surface">{skillDetail.averageScore}%</p>
              <p className="text-xs text-on-surface-variant mt-1">Average Score</p>
            </Card>
            <Card className="text-center">
              <p className="text-3xl font-bold text-danger-600">{skillDetail.gap}%</p>
              <p className="text-xs text-on-surface-variant mt-1">Gap from Target</p>
            </Card>
            <Card className="text-center">
              <p className="text-3xl font-bold text-on-surface">{skillDetail.studentsAssessed}</p>
              <p className="text-xs text-on-surface-variant mt-1">Students Assessed</p>
            </Card>
            <Card className="text-center">
              <Badge variant={statusConfig[skillDetail.status].variant} size="md">
                {statusConfig[skillDetail.status].label}
              </Badge>
              <p className="text-xs text-on-surface-variant mt-2">Overall Status</p>
            </Card>
          </div>

          {/* Topic Breakdown */}
          <Card>
            <CardHeader title="Topic-Level Competency" subtitle={`Detailed breakdown for ${skillDetail.skill}`} />
            <div className="space-y-4">
              {skillDetail.topics.map((topic) => {
                const isWeakest = weakestTopic && topic.topic === weakestTopic.topic;
                return (
                  <div key={topic.topic} className={cn('p-4 rounded-xl border transition-all', isWeakest ? 'border-danger-200 bg-danger-50/50' : 'border-outline-light hover:border-outline')}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {isWeakest && <span className="material-symbols-outlined text-[14px] text-danger-500">warning</span>}
                        <span className={cn('text-sm font-semibold', isWeakest ? 'text-danger-700' : 'text-on-surface')}>{topic.topic}</span>
                        {isWeakest && <Badge variant="danger" size="sm">Weakest</Badge>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn('text-lg font-bold', getCompetencyColor(topic.averageScore))}>{topic.averageScore}%</span>
                        {topic.trend === 'improving' && <span className="material-symbols-outlined text-[14px] text-success-500">trending_up</span>}
                        {topic.trend === 'declining' && <span className="material-symbols-outlined text-[14px] text-danger-500">trending_down</span>}
                        {topic.trend === 'stable' && <span className="material-symbols-outlined text-[14px] text-outline">remove</span>}
                      </div>
                    </div>
                    <Progress value={topic.averageScore} size="sm" className="mb-2" />
                    <div className="flex items-center justify-between text-xs text-on-surface-variant">
                      <span>{topic.studentsBelowThreshold} students below threshold</span>
                      <span>{topic.assessmentCount} assessments taken</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Highest Priority Topic */}
          {weakestTopic && (
            <Card className="border-danger-200 bg-danger-50/30">
              <CardHeader title="Highest Priority Topic" subtitle="This topic requires immediate intervention" />
              <div className="grid sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-on-surface-variant mb-1">Topic</p>
                  <p className="text-lg font-bold text-danger-700">{weakestTopic.topic}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant mb-1">Average Score</p>
                  <p className="text-lg font-bold text-danger-600">{weakestTopic.averageScore}%</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant mb-1">Students Affected</p>
                  <p className="text-lg font-bold text-danger-600">{weakestTopic.studentsBelowThreshold}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={() => setShowInterventionModal(true)}>
                  <span className="material-symbols-outlined text-[14px]">bolt</span>Create Intervention
                </Button>
                <Button variant="outline" onClick={() => setShowInterventionModal(true)}>
                  <span className="material-symbols-outlined text-[14px]">visibility</span>View Affected Students
                </Button>
              </div>
            </Card>
          )}
        </>
      ) : null}

      {/* Create Intervention Modal */}
      <Modal open={showInterventionModal} onClose={() => setShowInterventionModal(false)} title="Create Intervention" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5">Skill</label>
              <select className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm">
                {skillGapData.map(s => <option key={s.skill} value={s.skill}>{s.skill}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5">Topic</label>
              <select className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm">
                {skillDetail?.topics.map(t => <option key={t.topic}>{t.topic}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5">Students below</label>
              <select className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm">
                <option>60%</option>
                <option>50%</option>
                <option>40%</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5">Target Score</label>
              <select className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm">
                <option>75%</option>
                <option>70%</option>
                <option>65%</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">Duration (days)</label>
            <input type="number" defaultValue={7} className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm" />
          </div>
          <div className="p-3 bg-surface-container rounded-xl text-sm">
            <p className="text-on-surface-variant"><span className="font-medium text-on-surface">{weakestTopic?.studentsBelowThreshold || 0}</span> students match the criteria</p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowInterventionModal(false)}>Cancel</Button>
            <Button onClick={() => setShowInterventionModal(false)}>Review & Assign</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
