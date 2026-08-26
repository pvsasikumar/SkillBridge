import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { GrowthChart } from '@/components/charts/GrowthChart';
import { AIInsight } from '@/components/ui/AIInsight';
import { Modal } from '@/components/ui/Modal';
import {
  allFacultyStudents,
  facultyProfile,
  skillGapData,
  competencyTrend,
  studentsNeedingSupport,
  aiFacultyInsights,
  recommendedActions,
  interventions,
  careerReadinessData,
  verifiedSkillsData,
  interviewReadinessDist,
} from '@/data/facultyData';
import { getGreeting, getCompetencyColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

const totalStudents = allFacultyStudents.length;
const activeLearners = allFacultyStudents.filter(s => s.inactiveDays <= 2).length;
const avgCompetency = Math.round(allFacultyStudents.reduce((a, s) => a + s.overallCompetency, 0) / totalStudents);
const verifiedSkillsCount = verifiedSkillsData.reduce((a, s) => a + s.verifiedStudents, 0);
const activeSkillGaps = skillGapData.filter(s => s.status === 'critical' || s.status === 'needs-support').length;
const studentsNeedingSupportCount = studentsNeedingSupport.length;
const activeInterventions = interventions.filter(i => i.status === 'active').length;

const topSkillGaps = [...skillGapData].sort((a, b) => b.gap - a.gap).slice(0, 5);

export default function FacultyDashboard() {
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">
            {getGreeting()}, {facultyProfile.name.split(' ').slice(1).join(' ')}
          </h1>
          <div className="flex items-center gap-3 text-sm text-on-surface-variant mt-1 flex-wrap">
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[13px]">school</span>{facultyProfile.department}</span>
            <span>·</span>
            <span>{facultyProfile.year}</span>
            <span>·</span>
            <span>Section {facultyProfile.section}</span>
            <span>·</span>
            <span>AY {facultyProfile.academicYear}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/faculty/ai-assistant">
            <Button variant="outline" size="sm"><span className="material-symbols-outlined text-[14px]">auto_awesome</span>AI Assistant</Button>
          </Link>
          <Link to="/faculty/interventions">
            <Button variant="gradient" size="sm"><span className="material-symbols-outlined text-[14px]">add</span>New Intervention</Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Total Officials', value: totalStudents, icon: 'group', color: 'text-primary-600', bg: 'bg-primary-50' },
          { label: 'Active Learners', value: activeLearners, icon: 'trending_up', color: 'text-success-600', bg: 'bg-success-50' },
          { label: 'Avg Competency', value: `${avgCompetency}%`, icon: 'bar_chart', color: 'text-secondary-600', bg: 'bg-secondary-50' },
          { label: 'Verified Skills', value: verifiedSkillsCount, icon: 'shield', color: 'text-success-600', bg: 'bg-success-50' },
          { label: 'Active Skill Gaps', value: activeSkillGaps, icon: 'gps_fixed', color: 'text-warning-600', bg: 'bg-warning-50' },
          { label: 'Needs Support', value: studentsNeedingSupportCount, icon: 'warning', color: 'text-danger-600', bg: 'bg-danger-50' },
        ].map(stat => (
          <Card key={stat.label} className="flex items-start gap-3">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', stat.bg)}>
              <span className={cn('material-symbols-outlined text-[16px]', stat.color)}>{stat.icon}</span>
            </div>
            <div>
              <p className="text-xl font-bold text-on-surface">{stat.value}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* AI Insights */}
      <div className="space-y-3">
        {aiFacultyInsights.filter(i => i.priority === 'high').slice(0, 2).map(insight => (
          <AIInsight
            key={insight.id}
            variant={insight.type === 'warning' ? 'warning' : insight.type === 'success' ? 'success' : 'info'}
            message={insight.message}
            actionLabel={insight.actionLabel}
            onAction={() => {
              if (insight.actionLabel === 'Create Intervention') {
                setSelectedAction(insight.message);
                setShowActionModal(true);
              }
            }}
          />
        ))}
      </div>

      {/* Class Competency Trend */}
      <Card>
        <CardHeader
          title="Department Competency Trend"
          subtitle="Average competency, assessment performance & skill improvement across departments"
          action={
            <Link to="/faculty/skill-gaps">
              <Button variant="ghost" size="sm">Full Analysis <span className="material-symbols-outlined text-[14px]">arrow_forward</span></Button>
            </Link>
          }
        />
        <GrowthChart
          data={competencyTrend.map(d => ({ ...d }))}
          lines={[
            { key: 'averageCompetency', color: '#006948', label: 'Avg Competency' },
            { key: 'assessmentPerformance', color: '#00685f', label: 'Assessment Performance' },
            { key: 'skillImprovement', color: '#5b598c', label: 'Skill Improvement' },
          ]}
          xAxisKey="month"
          height={280}
        />
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skill Gap Heatmap */}
        <Card>
          <CardHeader
            title="Competency Gap Analysis"
            subtitle="Department-wide competency gap analysis"
            action={
              <Link to="/faculty/skill-gaps">
                <Button variant="ghost" size="sm">View All <span className="material-symbols-outlined text-[14px]">arrow_forward</span></Button>
              </Link>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-light">
                  <th className="text-left py-2.5 px-3 font-medium text-on-surface-variant">Skill</th>
                  <th className="text-center py-2.5 px-3 font-medium text-on-surface-variant">Avg</th>
                  <th className="text-center py-2.5 px-3 font-medium text-on-surface-variant">Gap</th>
                  <th className="text-center py-2.5 px-3 font-medium text-on-surface-variant">Status</th>
                </tr>
              </thead>
              <tbody>
                {topSkillGaps.map(skill => (
                  <tr key={skill.skill} className="border-b border-outline-light/50 hover:bg-surface-container/50 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-on-surface">{skill.skill}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={cn('font-semibold', getCompetencyColor(skill.averageScore))}>{skill.averageScore}%</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={cn('font-semibold', skill.gap > 20 ? 'text-danger-600' : skill.gap > 10 ? 'text-warning-600' : 'text-success-600')}>
                        {skill.gap}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <Badge variant={skill.status === 'strong' ? 'success' : skill.status === 'developing' ? 'warning' : skill.status === 'critical' ? 'danger' : 'primary'} size="sm">
                        {skill.status === 'needs-support' ? 'Needs Support' : skill.status.charAt(0).toUpperCase() + skill.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Students Needing Support */}
        <Card>
          <CardHeader
            title="Officials Needing Support"
            subtitle={`${studentsNeedingSupportCount} students require attention`}
            action={
              <Link to="/faculty/students?filter=support">
                <Button variant="ghost" size="sm">View All <span className="material-symbols-outlined text-[14px]">arrow_forward</span></Button>
              </Link>
            }
          />
          <div className="space-y-3">
            {studentsNeedingSupport.slice(0, 6).map(student => (
              <Link
                key={student.studentId}
                to={`/faculty/student/${student.studentId}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center shrink-0',
                    student.severity === 'high' ? 'bg-danger-50' : student.severity === 'medium' ? 'bg-warning-50' : 'bg-surface-container-high'
                  )}>
                    <span className={cn(
                      'text-xs font-bold',
                      student.severity === 'high' ? 'text-danger-600' : student.severity === 'medium' ? 'text-warning-600' : 'text-on-surface-variant'
                    )}>
                      {student.studentName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{student.studentName}</p>
                    <p className="text-xs text-on-surface-variant truncate">{student.reason}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <Badge variant={student.severity === 'high' ? 'danger' : student.severity === 'medium' ? 'warning' : 'default'} size="sm">
                    {student.category}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Recommended Actions */}
      <Card>
        <CardHeader
          title="Recommended Trainer Actions"
          subtitle="AI-generated recommendations for capacity building"
          action={<span className="material-symbols-outlined text-[16px] text-warning-500">lightbulb</span>}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedActions.map(action => (
            <div key={action.id} className="p-4 glass-card hover:border-primary-200 hover:bg-primary-50/20 transition-all">
              <div className="flex items-start justify-between mb-2">
                <Badge variant={action.priority === 'high' ? 'danger' : action.priority === 'medium' ? 'warning' : 'primary'} size="sm">
                  {action.priority}
                </Badge>
                <span className="text-xs text-on-surface-variant">{action.targetStudents} students</span>
              </div>
              <h4 className="text-sm font-semibold text-on-surface mb-1">{action.title}</h4>
              <p className="text-xs text-on-surface-variant mb-3 line-clamp-2">{action.description}</p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1"><span className="material-symbols-outlined text-[12px]">visibility</span>View</Button>
                <Button variant="gradient" size="sm" className="flex-1"><span className="material-symbols-outlined text-[12px]">bolt</span>Create</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Career Readiness */}
        <Card>
          <CardHeader title="Capacity Building Readiness" subtitle="Overall competency readiness scores" />
          <div className="space-y-3">
            {[
              { label: 'Overall', value: careerReadinessData.overallReadiness },
              { label: 'Technical Skills', value: careerReadinessData.technicalSkills },
              { label: 'Practical Skills', value: careerReadinessData.practicalSkills },
              { label: 'Problem Solving', value: careerReadinessData.problemSolving },
              { label: 'Interview Readiness', value: careerReadinessData.interviewReadiness },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-on-surface-variant">{item.label}</span>
                  <span className={cn('font-semibold', getCompetencyColor(item.value))}>{item.value}%</span>
                </div>
                <Progress value={item.value} size="sm" />
              </div>
            ))}
          </div>
        </Card>

        {/* Interview Readiness */}
        <Card>
          <CardHeader title="Competency Distribution" subtitle="Officials by competency level" />
          <div className="space-y-4">
            {[
              { label: 'Excellent', count: interviewReadinessDist.excellent, color: 'bg-success-500' },
              { label: 'Good', count: interviewReadinessDist.good, color: 'bg-primary-500' },
              { label: 'Developing', count: interviewReadinessDist.developing, color: 'bg-warning-500' },
              { label: 'Needs Support', count: interviewReadinessDist.needsSupport, color: 'bg-danger-500' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={cn('w-3 h-3 rounded-full shrink-0', item.color)} />
                <span className="text-sm text-on-surface-variant flex-1">{item.label}</span>
                <span className="text-sm font-semibold text-on-surface">{item.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-outline-light">
            <div className="text-center">
              <p className="text-3xl font-bold text-on-surface">
                {totalStudents}
              </p>
              <p className="text-xs text-on-surface-variant mt-1">Total Officials</p>
            </div>
          </div>
        </Card>

        {/* Verified Skills */}
        <Card>
          <CardHeader title="Verified Competencies" subtitle="Students with SkillBridge verification" />
          <div className="space-y-3">
            {verifiedSkillsData.slice(0, 5).map(skill => (
              <div key={skill.skill} className="flex items-center justify-between">
                <span className="text-sm font-medium text-on-surface-variant">{skill.skill}</span>
                <span className="text-sm text-on-surface-variant">{skill.verifiedStudents} students</span>
              </div>
            ))}
          </div>
          <Link to="/faculty/skill-gaps" className="mt-4 block">
            <Button fullWidth variant="outline" size="sm">View All Skills <span className="material-symbols-outlined text-[14px]">arrow_forward</span></Button>
          </Link>
        </Card>
      </div>

      {/* Active Interventions Summary */}
      <Card>
        <CardHeader
          title="Active Interventions"
          subtitle={`${activeInterventions} training interventions currently running`}
          action={
            <Link to="/faculty/interventions">
              <Button variant="ghost" size="sm">View All <span className="material-symbols-outlined text-[14px]">arrow_forward</span></Button>
            </Link>
          }
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {interventions.filter(i => i.status === 'active').map(intervention => (
            <div key={intervention.id} className="p-4 glass-card hover:border-primary-200 transition-all">
              <div className="flex items-start justify-between mb-3">
                <Badge variant="primary" size="sm">Active</Badge>
                <span className="text-xs text-on-surface-variant">{intervention.skill}</span>
              </div>
              <h4 className="text-sm font-semibold text-on-surface mb-2">{intervention.title}</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Assigned</span>
                  <span className="font-medium text-on-surface">{intervention.assignedStudents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Completed</span>
                  <span className="font-medium text-on-surface">{intervention.completedStudents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Improvement</span>
                  <span className="font-medium text-success-600">+{intervention.improvement} pts</span>
                </div>
              </div>
              <div className="mt-3">
                <Progress value={(intervention.completedStudents / intervention.assignedStudents) * 100} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Create Intervention Modal */}
      <Modal open={showActionModal} onClose={() => setShowActionModal(false)} title="Create Intervention" size="lg">
        {selectedAction && (
          <div className="space-y-4">
            <p className="text-sm text-on-surface-variant">{selectedAction}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Skill</label>
                <select className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm bg-surface-container-low">
                  <option>Data Structures</option>
                  <option>SQL</option>
                  <option>Python</option>
                  <option>React</option>
                  <option>Git</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Topic</label>
                <select className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm bg-surface-container-low">
                  <option>Trees</option>
                  <option>Dynamic Programming</option>
                  <option>Graphs</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Condition: Students below</label>
                <select className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm bg-surface-container-low">
                  <option>60%</option>
                  <option>50%</option>
                  <option>40%</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Target Score</label>
                <select className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm bg-surface-container-low">
                  <option>75%</option>
                  <option>70%</option>
                  <option>65%</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowActionModal(false)}>Cancel</Button>
              <Button variant="gradient" onClick={() => setShowActionModal(false)}>Review & Assign</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
