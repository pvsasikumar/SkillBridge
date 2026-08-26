import { Link } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AIInsight } from '@/components/ui/AIInsight';
import { SkillBar } from '@/components/ui/SkillIndicator';
import { CompetencyChart } from '@/components/charts/CompetencyChart';
import { useApp } from '@/context/AppContext';
import { currentUser, studentSkills, todayPlan, learningModules } from '@/data/mockData';
import { initialJobs } from '@/data/recruiterData';
import { getGreeting, formatMinutes } from '@/lib/utils';

const priorityGaps = studentSkills.filter(s => s.status === 'needs-attention').slice(0, 3);
const totalTodayMinutes = todayPlan.reduce((acc, p) => acc + p.duration, 0);
const avgCompetency = Math.round(studentSkills.reduce((a, s) => a + s.currentLevel, 0) / studentSkills.length);

const radarData = studentSkills.slice(0, 6).map(s => ({
  skill: s.name,
  current: s.currentLevel,
  required: s.requiredLevel,
}));

export default function Dashboard() {
  const { verifiedSkills, courses, interviewSessions } = useApp();
  const verifiedCount = verifiedSkills.length;
  const activeGaps = studentSkills.filter(s => s.status === 'needs-attention').length;
  const certCount = courses.length;
  const avgInterviewReadiness = interviewSessions.length > 0
    ? Math.round(interviewSessions.reduce((a, s) => a + s.overallScore, 0) / interviewSessions.length)
    : 0;
  const careerReadinessScore = Math.round(avgCompetency * 0.4 + (avgInterviewReadiness || avgCompetency) * 0.3 + (verifiedCount > 0 ? 75 : 50) * 0.3);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">
            {getGreeting()}, {currentUser.name}
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">Ministry of Statistics & Programme Implementation</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/courses">
            <Button variant="outline">
              <span className="material-symbols-outlined text-[16px]">description</span>
              Add Course
            </Button>
          </Link>
          <Link to="/quiz">
            <Button variant="gradient">
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              Start Assessment
            </Button>
          </Link>
        </div>
      </div>

      {/* AI Insight */}
      <AIInsight
        message="Your SQL competency improved by 14% this week. React remains your highest-priority skill gap — consider focusing on React State Management next."
        actionLabel="View Detailed Analysis"
        onAction={() => {}}
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Verified Competencies', value: verifiedCount.toString(), icon: 'emoji_events', color: 'text-success-600', bg: 'bg-success-50' },
          { label: 'Active Competency Gaps', value: activeGaps.toString(), icon: 'gps_fixed', color: 'text-danger-600', bg: 'bg-danger-50' },
          { label: 'Courses Completed', value: certCount.toString(), icon: 'description', color: 'text-primary-600', bg: 'bg-primary-50' },
          { label: 'Overall Competency', value: `${avgCompetency}%`, icon: 'trending_up', color: 'text-secondary-600', bg: 'bg-secondary-50' },
        ].map(stat => (
          <Card key={stat.label} className="flex items-start gap-4">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center shrink-0`}>
              <span className={`material-symbols-outlined text-[18px] ${stat.color}`}>{stat.icon}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Skill Overview */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Competency Overview"
            subtitle="Your current competency across key areas"
            action={
              <Link to="/skills">
                <Button variant="ghost" size="sm">View All <span className="material-symbols-outlined text-[14px]">arrow_forward</span></Button>
              </Link>
            }
          />
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
            {studentSkills.slice(0, 6).map(skill => (
              <SkillBar key={skill.id} skill={skill} showGap />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-outline-light">
            <CompetencyChart data={radarData} height={220} />
          </div>
        </Card>

        {/* Today's Learning */}
        <div className="space-y-6">
          <Card>
            <CardHeader
              title={`Today's Plan`}
              subtitle={`${formatMinutes(totalTodayMinutes)} estimated`}
              action={<span className="material-symbols-outlined text-[16px] text-outline">schedule</span>}
            />
            <div className="space-y-3">
              {todayPlan.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-container">
                  <div className="w-8 h-8 bg-surface-container-low rounded-xl flex items-center justify-center border border-outline-light shrink-0">
                    <span className="text-xs font-bold text-on-surface-variant">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{item.title}</p>
                    <p className="text-xs text-on-surface-variant">{item.duration} min · {item.type}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/learning" className="mt-4 block">
              <Button fullWidth variant="secondary" size="sm">
                Continue Learning
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Button>
            </Link>
          </Card>

          {/* Critical Gaps */}
          <Card>
            <CardHeader
              title="Priority Competency Gaps"
              subtitle={`${priorityGaps.length} priority gaps detected`}
            />
            <div className="space-y-2.5">
              {priorityGaps.map(skill => (
                <div key={skill.id} className="flex items-center justify-between p-2.5 rounded-xl bg-danger-50/50">
                  <span className="text-sm font-medium text-on-surface">{skill.name}</span>
                  <Badge variant="danger" size="sm">Gap: {skill.requiredLevel - skill.currentLevel}%</Badge>
                </div>
              ))}
            </div>
            <Link to="/skills" className="mt-4 block">
              <Button fullWidth variant="outline" size="sm">View Skill Gaps</Button>
            </Link>
          </Card>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/verified-skills">
          <Card hover className="text-center py-4">
            <span className="material-symbols-outlined text-[24px] text-success-500 mx-auto mb-2 block">check_circle</span>
            <p className="text-sm font-semibold text-on-surface">Verified Skills</p>
            <p className="text-xs text-on-surface-variant mt-0.5">{verifiedCount} verified</p>
          </Card>
        </Link>
        <Link to="/career-readiness">
          <Card hover className="text-center py-4">
            <span className="material-symbols-outlined text-[24px] text-primary-500 mx-auto mb-2 block">bar_chart</span>
            <p className="text-sm font-semibold text-on-surface">Capacity Readiness</p>
            <p className="text-xs text-on-surface-variant mt-0.5">{careerReadinessScore}%</p>
          </Card>
        </Link>
        <Link to="/igot-courses">
          <Card hover className="text-center py-4">
            <span className="material-symbols-outlined text-[24px] text-secondary-500 mx-auto mb-2 block">play_arrow</span>
            <p className="text-sm font-semibold text-on-surface">Training Resources</p>
            <p className="text-xs text-on-surface-variant mt-0.5">iGOT Karmayogi</p>
          </Card>
        </Link>
        <Link to="/assessment/new">
          <Card hover className="text-center py-4">
            <span className="material-symbols-outlined text-[24px] text-warning-500 mx-auto mb-2 block">description</span>
            <p className="text-sm font-semibold text-on-surface">AI Assessment</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Evaluate competency</p>
          </Card>
        </Link>
      </div>

      {/* Career Opportunities */}
      <Card>
        <CardHeader
          title="Recommended iGOT Training"
          subtitle="Courses from iGOT Karmayogi based on your competency gaps"
          action={<span className="material-symbols-outlined text-[16px] text-outline">work</span>}
        />
        <div className="space-y-3 p-1">
          {initialJobs.filter(j => j.status === 'published').slice(0, 3).map(job => {
            const requiredSkills = job.requiredSkills.filter(s => s.type === 'required');
            const matchedCount = requiredSkills.filter(req => {
              const sk = studentSkills.find(s => s.name === req.skill);
              return sk && sk.currentLevel >= req.minimumCompetency;
            }).length;
            const matchPct = requiredSkills.length > 0 ? Math.round((matchedCount / requiredSkills.length) * 100) : 0;
            const gaps = requiredSkills.filter(req => {
              const sk = studentSkills.find(s => s.name === req.skill);
              return !sk || sk.currentLevel < req.minimumCompetency;
            });
            return (
              <div key={job.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px] text-primary-500">work</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-on-surface">{job.title}</p>
                    <Badge variant={matchPct === 100 ? 'success' : 'warning'} size="sm">{matchPct}% Match</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {requiredSkills.map(sk => {
                      const studentSk = studentSkills.find(s => s.name === sk.skill);
                      const met = studentSk && studentSk.currentLevel >= sk.minimumCompetency;
                      return (
                        <span key={sk.id} className={`text-[10px] px-1.5 py-0.5 rounded-full ${met ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700'}`}>
                          {sk.skill} {met ? '✓' : `need ${sk.minimumCompetency}%`}
                        </span>
                      );
                    })}
                  </div>
                  {gaps.length > 0 && (
                    <p className="text-[11px] text-danger-600 mt-1">
                      Improve {gaps.map(g => g.skill).join(', ')} to become eligible
                    </p>
                  )}
                </div>
                <div className="shrink-0">
                  {matchPct === 100 ? (
                    <Badge variant="success" size="sm">Meets Criteria</Badge>
                  ) : (
                    <span className="text-xs text-on-surface-variant">Skill gap</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
