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

  const stats = [
    { label: 'Verified Competencies', value: verifiedCount.toString(), icon: 'emoji_events', gradient: 'from-success-400 to-success-600' },
    { label: 'Active Competency Gaps', value: activeGaps.toString(), icon: 'gps_fixed', gradient: 'from-danger-400 to-danger-600' },
    { label: 'Courses Completed', value: certCount.toString(), icon: 'description', gradient: 'from-primary-400 to-primary-600' },
    { label: 'Overall Competency', value: `${avgCompetency}%`, icon: 'trending_up', gradient: 'from-secondary-400 to-secondary-600' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">
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
            <Button variant="gradient" className="shadow-md shadow-primary-500/20">
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {stats.map(stat => (
          <div key={stat.label} className="glass-card p-4 flex items-center gap-4">
            <div className={`w-11 h-11 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shrink-0 shadow-sm`}>
              <span className="material-symbols-outlined text-[18px] text-white">{stat.icon}</span>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-on-surface">{stat.value}</p>
              <p className="text-xs text-on-surface-variant mt-0.5 font-medium">{stat.label}</p>
            </div>
          </div>
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
                <Button variant="ghost" size="sm">
                  View All <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Button>
              </Link>
            }
          />
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
            {studentSkills.slice(0, 6).map(skill => (
              <SkillBar key={skill.id} skill={skill} showGap />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-outline-light/60">
            <CompetencyChart data={radarData} height={220} />
          </div>
        </Card>

        {/* Today's Learning + Priority Gaps */}
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Today's Plan"
              subtitle={`${formatMinutes(totalTodayMinutes)} estimated`}
              action={<span className="material-symbols-outlined text-[16px] text-outline">schedule</span>}
            />
            <div className="space-y-2">
              {todayPlan.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/80 hover:bg-surface-container-high transition-colors">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-outline-light/60 shrink-0 shadow-sm">
                    <span className="text-xs font-bold text-primary-600">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface truncate">{item.title}</p>
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
            <div className="space-y-2">
              {priorityGaps.map(skill => (
                <div key={skill.id} className="flex items-center justify-between p-3 rounded-xl bg-danger-50/60 border border-danger-400/10">
                  <span className="text-sm font-semibold text-on-surface">{skill.name}</span>
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {[
          { to: '/verified-skills', icon: 'check_circle', gradient: 'from-success-400 to-success-600', label: 'Verified Skills', sub: `${verifiedCount} verified` },
          { to: '/career-readiness', icon: 'bar_chart', gradient: 'from-primary-400 to-primary-600', label: 'Capacity Readiness', sub: `${careerReadinessScore}%` },
          { to: '/igot-courses', icon: 'play_arrow', gradient: 'from-secondary-400 to-secondary-600', label: 'Training Resources', sub: 'iGOT Karmayogi' },
          { to: '/assessment/new', icon: 'description', gradient: 'from-warning-400 to-warning-600', label: 'AI Assessment', sub: 'Evaluate competency' },
        ].map(item => (
          <Link key={item.label} to={item.to}>
            <div className="glass-card p-4 text-center hover:shadow-md hover:border-primary-200/60 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
              <div className={`w-10 h-10 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm`}>
                <span className="material-symbols-outlined text-[20px] text-white">{item.icon}</span>
              </div>
              <p className="text-sm font-bold text-on-surface">{item.label}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{item.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recommended Training */}
      <Card>
        <CardHeader
          title="Recommended iGOT Training"
          subtitle="Courses from iGOT Karmayogi based on your competency gaps"
          action={<span className="material-symbols-outlined text-[16px] text-outline">work</span>}
        />
        <div className="space-y-2 p-1">
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
              <div key={job.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container/80 transition-colors">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0 border border-primary-200/40">
                  <span className="material-symbols-outlined text-[16px] text-primary-600">work</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-on-surface">{job.title}</p>
                    <Badge variant={matchPct === 100 ? 'success' : 'warning'} size="sm">{matchPct}% Match</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {requiredSkills.map(sk => {
                      const studentSk = studentSkills.find(s => s.name === sk.skill);
                      const met = studentSk && studentSk.currentLevel >= sk.minimumCompetency;
                      return (
                        <span key={sk.id} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${met ? 'bg-success-50 text-success-700 border border-success-400/20' : 'bg-danger-50 text-danger-700 border border-danger-400/20'}`}>
                          {sk.skill} {met ? '✓' : `need ${sk.minimumCompetency}%`}
                        </span>
                      );
                    })}
                  </div>
                  {gaps.length > 0 && (
                    <p className="text-[11px] text-danger-600 mt-1 font-medium">
                      Improve {gaps.map(g => g.skill).join(', ')} to become eligible
                    </p>
                  )}
                </div>
                <div className="shrink-0">
                  {matchPct === 100 ? (
                    <Badge variant="success" size="sm">Meets Criteria</Badge>
                  ) : (
                    <span className="text-xs font-medium text-on-surface-variant">Skill gap</span>
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
