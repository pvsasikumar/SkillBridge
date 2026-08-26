import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Avatar } from '@/components/ui/Avatar';
import { CompetencyChart } from '@/components/charts/CompetencyChart';
import { GrowthChart } from '@/components/charts/GrowthChart';
import { AIInsight } from '@/components/ui/AIInsight';
import { allFacultyStudents, interventions } from '@/data/facultyData';
import { cn, getCompetencyColor } from '@/lib/utils';

const growthData = [
  { month: 'Apr', competency: 38 },
  { month: 'May', competency: 42 },
  { month: 'Jun', competency: 48 },
  { month: 'Jul', competency: 55 },
  { month: 'Aug', competency: 58 },
];

const studentSkillBreakdown = [
  { name: 'React', current: 62, target: 80, initial: 42, verified: false },
  { name: 'JavaScript', current: 76, target: 85, initial: 55, verified: false },
  { name: 'Node.js', current: 61, target: 80, initial: 38, verified: false },
  { name: 'DSA', current: 43, target: 75, initial: 28, verified: false },
  { name: 'SQL', current: 72, target: 80, initial: 60, verified: true },
  { name: 'Git', current: 89, target: 85, initial: 78, verified: true },
];

export default function StudentDetail() {
  const { id } = useParams();
  const student = allFacultyStudents.find(s => s.id === id) || allFacultyStudents[0];

  const radarData = studentSkillBreakdown.map(s => ({
    skill: s.name,
    current: s.current,
    required: s.target,
  }));

  const studentInterventions = interventions.filter(i => i.status === 'active' || i.status === 'completed');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/faculty/students" className="p-2 rounded-xl hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">arrow_back</span>
        </Link>
        <div className="flex items-center gap-4">
          <Avatar name={student.name} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-on-surface">{student.name}</h1>
            <div className="flex items-center gap-3 text-sm text-on-surface-variant flex-wrap">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">mail</span>{student.email}</span>
              <span>·</span>
              <span>{student.careerGoal}</span>
              {student.atRisk && <Badge variant="danger" size="sm">At Risk</Badge>}
              {student.interventionStatus === 'active' && <Badge variant="primary" size="sm">In Intervention</Badge>}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Overall Competency', value: `${student.overallCompetency}%`, color: 'text-primary', bg: 'bg-primary-50', iconName: 'trending_up' },
          { label: 'Interview Readiness', value: `${student.interviewReadiness}%`, color: 'text-secondary-600', bg: 'bg-secondary-50', iconName: 'gps_fixed' },
          { label: 'Career Readiness', value: `${student.careerReadiness}%`, color: 'text-indigo-600', bg: 'bg-indigo-50', iconName: 'star' },
          { label: 'Assessments Taken', value: student.assessmentsTaken.toString(), color: 'text-success-600', bg: 'bg-success-50', iconName: 'menu_book' },
          { label: 'Verified Skills', value: student.verificationCount.toString(), color: 'text-warning-600', bg: 'bg-warning-50', iconName: 'check_circle' },
          { label: 'Last Active', value: `${student.inactiveDays}d ago`, color: 'text-on-surface-variant', bg: 'bg-surface-container', iconName: 'calendar_today' },
        ].map(stat => (
          <Card key={stat.label} className="flex items-start gap-3">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', stat.bg)}>
              <span className={cn('material-symbols-outlined text-[16px]', stat.color)}>{stat.iconName}</span>
            </div>
            <div>
              <p className="text-xl font-bold text-on-surface">{stat.value}</p>
              <p className="text-xs text-on-surface-variant">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Competency Radar */}
        <Card>
          <CardHeader title="Competency Profile" subtitle="Current vs required competency" />
          <CompetencyChart data={radarData} height={280} />
        </Card>

        {/* Growth over time */}
        <Card>
          <CardHeader title="Improvement Over Time" subtitle="Competency growth trend" />
          <GrowthChart
            data={growthData}
            lines={[{ key: 'competency', color: '#3b82f6', label: 'Competency' }]}
            xAxisKey="month"
            height={280}
          />
        </Card>
      </div>

      <AIInsight
        message={`${student.name} has strong fundamentals in JavaScript and SQL but needs improvement in React and DSA. Recommend focusing on the DSA Trees module and React Hooks practice.`}
        actionLabel="Create Learning Plan"
        onAction={() => {}}
      />

      {/* Skill Breakdown with Before/After */}
      <Card>
        <CardHeader title="Skill Breakdown" subtitle="Detailed competency with initial vs current scores" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-light">
                <th className="text-left py-3 px-4 font-medium text-on-surface-variant">Skill</th>
                <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Initial</th>
                <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Current</th>
                <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Target</th>
                <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Gap</th>
                <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Progress</th>
                <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Status</th>
              </tr>
            </thead>
            <tbody>
              {studentSkillBreakdown.map(skill => {
                const gap = skill.target - skill.current;
                const progress = Math.round(((skill.current - skill.initial) / (skill.target - skill.initial)) * 100);
                return (
                  <tr key={skill.name} className="border-b border-surface-container">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-on-surface">{skill.name}</span>
                        {skill.verified && <Badge variant="success" size="sm">Verified</Badge>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-on-surface-variant">{skill.initial}%</td>
                    <td className="py-3 px-4 text-center">
                      <span className={cn('font-semibold', getCompetencyColor(skill.current))}>{skill.current}%</span>
                    </td>
                    <td className="py-3 px-4 text-center text-on-surface-variant">{skill.target}%</td>
                    <td className="py-3 px-4 text-center">
                      <span className={cn('font-semibold', gap > 20 ? 'text-danger-600' : gap > 10 ? 'text-warning-600' : 'text-success-600')}>
                        {gap > 0 ? `-${gap}%` : '✓'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Progress value={Math.max(0, progress)} size="sm" className="w-20" />
                        <span className="text-xs text-on-surface-variant">{Math.max(0, progress)}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={gap <= 0 ? 'success' : gap > 20 ? 'danger' : 'warning'} size="sm">
                        {gap <= 0 ? 'Strong' : gap > 20 ? 'Needs Support' : 'Developing'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Active Interventions for this student */}
      <Card>
        <CardHeader title="Assigned Interventions" subtitle="Active and completed interventions" />
        <div className="space-y-3">
          {studentInterventions.slice(0, 3).map(intervention => (
            <div key={intervention.id} className="flex items-center justify-between p-3 bg-surface-container rounded-xl">
              <div>
                <p className="text-sm font-medium text-on-surface">{intervention.title}</p>
                <p className="text-xs text-on-surface-variant">{intervention.skill} · {intervention.topic}</p>
              </div>
              <div className="flex items-center gap-3">
                {intervention.averageAfter > 0 && (
                  <div className="text-right">
                    <p className="text-xs text-on-surface-variant">Improvement</p>
                    <p className="text-sm font-bold text-success-600">+{intervention.improvement} pts</p>
                  </div>
                )}
                <Badge variant={intervention.status === 'active' ? 'primary' : 'success'} size="sm">
                  {intervention.status === 'active' ? 'In Progress' : 'Completed'}
                </Badge>
              </div>
            </div>
          ))}
          {studentInterventions.length === 0 && (
            <p className="text-sm text-on-surface-variant text-center py-4">No interventions assigned yet</p>
          )}
        </div>
      </Card>

      {/* Assessment Results */}
      <Card>
        <CardHeader title="Recent Assessments" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-light">
                <th className="text-left py-2.5 font-medium text-on-surface-variant">Skill</th>
                <th className="text-center py-2.5 font-medium text-on-surface-variant">Type</th>
                <th className="text-center py-2.5 font-medium text-on-surface-variant">Score</th>
                <th className="text-center py-2.5 font-medium text-on-surface-variant">Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                { skill: 'JavaScript', type: 'adaptive', score: 72, date: '2026-08-22' },
                { skill: 'React', type: 'adaptive', score: 45, date: '2026-08-20' },
                { skill: 'SQL', type: 'adaptive', score: 78, date: '2026-08-18' },
                { skill: 'Git', type: 'practical', score: 92, date: '2026-08-15' },
                { skill: 'Node.js', type: 'adaptive', score: 38, date: '2026-08-14' },
              ].map((result, i) => (
                <tr key={i} className="border-b border-surface-container">
                  <td className="py-3 font-medium text-on-surface">{result.skill}</td>
                  <td className="py-3 text-center">
                    <Badge variant={result.type === 'practical' ? 'primary' : 'default'} size="sm">{result.type}</Badge>
                  </td>
                  <td className="py-3 text-center">
                    <span className={cn(
                      'font-semibold',
                      result.score >= 75 ? 'text-success-600' : result.score >= 50 ? 'text-warning-600' : 'text-danger-600'
                    )}>
                      {result.score}%
                    </span>
                  </td>
                  <td className="py-3 text-center text-on-surface-variant">{result.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
