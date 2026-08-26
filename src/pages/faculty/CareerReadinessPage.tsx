import { Link } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { careerReadinessData, verifiedSkillsData, interviewReadinessDist } from '@/data/facultyData';
import { cn, getCompetencyColor } from '@/lib/utils';

export default function CareerReadinessPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/faculty" className="p-2 rounded-xl hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Career Readiness</h1>
          <p className="text-sm text-on-surface-variant mt-1">Class-wide career preparation analysis</p>
        </div>
      </div>

      {/* Overall Readiness */}
      <Card className="border-primary-200 bg-primary-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="text-center sm:text-left">
            <p className="text-xs text-on-surface-variant uppercase tracking-wide mb-1">Overall Career Readiness</p>
            <p className="text-5xl font-bold text-primary">{careerReadinessData.overallReadiness}%</p>
          </div>
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
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
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Target Role Distribution */}
        <Card>
          <CardHeader title="Target Role Distribution" subtitle="Student career goal breakdown" />
          <div className="space-y-3">
            {careerReadinessData.targetRoleDistribution.map(role => {
              const maxCount = Math.max(...careerReadinessData.targetRoleDistribution.map(r => r.count));
              return (
                <div key={role.role} className="flex items-center gap-3">
                  <span className="text-sm text-on-surface-variant w-40 truncate">{role.role}</span>
                  <div className="flex-1 bg-surface-container-high rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(role.count / maxCount) * 100}%`, minWidth: '2rem' }}
                    >
                      <span className="text-xs font-medium text-white">{role.count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Interview Readiness Distribution */}
        <Card>
          <CardHeader title="Interview Readiness Distribution" subtitle="Class interview preparation status" />
          <div className="space-y-4">
            {[
              { label: 'Excellent', count: interviewReadinessDist.excellent, color: 'bg-success-500' },
              { label: 'Good', count: interviewReadinessDist.good, color: 'bg-primary-500' },
              { label: 'Developing', count: interviewReadinessDist.developing, color: 'bg-warning-500' },
              { label: 'Needs Support', count: interviewReadinessDist.needsSupport, color: 'bg-danger-500' },
            ].map(item => {
              const total = Object.values(interviewReadinessDist).reduce((a, b) => a + b, 0);
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-3 h-3 rounded-full', item.color)} />
                      <span className="text-sm text-on-surface">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-on-surface">{item.count} students</span>
                      <span className="text-xs text-on-surface-variant">({pct}%)</span>
                    </div>
                  </div>
                  <Progress value={pct} size="sm" color={item.label === 'Excellent' ? 'success' : item.label === 'Good' ? 'primary' : item.label === 'Developing' ? 'warning' : 'danger'} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Verified Skills */}
      <Card>
        <CardHeader title="Verified Skills Analytics" subtitle="SkillBridge verification progress across the class" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-light">
                <th className="text-left py-3 px-4 font-medium text-on-surface-variant">Skill</th>
                <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Verified Students</th>
                <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Course Completed</th>
                <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Assessment Done</th>
                <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Skill Gap Closed</th>
              </tr>
            </thead>
            <tbody>
              {verifiedSkillsData.map(skill => (
                <tr key={skill.skill} className="border-b border-surface-container">
                  <td className="py-3 px-4 font-medium text-on-surface">{skill.skill}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-[12px] text-success-500">star</span>
                      <span className="font-semibold text-success-600">{skill.verifiedStudents}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-on-surface-variant">{skill.courseCompleted}</td>
                  <td className="py-3 px-4 text-center text-on-surface-variant">{skill.assessmentCompleted}</td>
                  <td className="py-3 px-4 text-center text-on-surface-variant">{skill.skillGapClosed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
