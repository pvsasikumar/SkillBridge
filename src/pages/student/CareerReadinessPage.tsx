import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { AIInsight } from '@/components/ui/AIInsight';
import { useApp } from '@/context/AppContext';
import { currentUser, studentSkills } from '@/data/mockData';
import { cn } from '@/lib/utils';
import type { CareerReadinessProfile, ProjectRecommendation } from '@/types';

const defaultProjects: ProjectRecommendation[] = [
  {
    id: 'pr1',
    title: 'Full Stack Task Manager',
    description: 'Build a complete task management application with user authentication, CRUD operations, and real-time updates.',
    difficulty: 'Intermediate',
    estimatedTime: 40,
    skillsCovered: ['JavaScript', 'React', 'Node.js', 'REST APIs'],
    requirements: ['User auth', 'Task CRUD', 'API integration', 'Responsive UI'],
    expectedOutcome: 'A deployable full-stack application demonstrating end-to-end development skills.',
    reason: 'Covers your key skill gaps in React and Node.js while reinforcing your strong JavaScript foundation.',
  },
  {
    id: 'pr2',
    title: 'RESTful API Dashboard',
    description: 'Create a dashboard that consumes multiple REST APIs, displays data visualizations, and supports filtering.',
    difficulty: 'Intermediate',
    estimatedTime: 30,
    skillsCovered: ['REST APIs', 'JavaScript', 'HTML/CSS', 'SQL'],
    requirements: ['API consumption', 'Data visualization', 'Filter/search', 'Error handling'],
    expectedOutcome: 'A professional portfolio piece showing API integration and data presentation skills.',
    reason: 'Builds on your SQL and REST API skills while filling the gap in practical data handling.',
  },
  {
    id: 'pr3',
    title: 'TypeScript Component Library',
    description: 'Develop a reusable UI component library with TypeScript, featuring comprehensive documentation and tests.',
    difficulty: 'Intermediate',
    estimatedTime: 25,
    skillsCovered: ['TypeScript', 'HTML/CSS', 'Testing', 'Git'],
    requirements: ['TypeScript types', 'Unit tests', 'Documentation', 'Git workflow'],
    expectedOutcome: 'A publishable component library demonstrating type safety and testing best practices.',
    reason: 'Directly addresses your TypeScript gap and introduces testing, which is currently at 35%.',
  },
];

export default function CareerReadinessPage() {
  const { verifiedSkills, assessments, careerReadiness, interviewSessions, skills } = useApp();

  const readiness = useMemo((): CareerReadinessProfile => {
    if (careerReadiness) return careerReadiness;

    const allSkills = skills.length > 0 ? skills : studentSkills;
    const avgCompetency = Math.round(allSkills.reduce((a, s) => a + s.currentLevel, 0) / allSkills.length);
    const verifiedCount = verifiedSkills.length || allSkills.filter(s => s.verified).length;
    const assessmentCount = assessments.length;

    const technical = Math.min(100, Math.round(avgCompetency * 1.05));
    const practical = Math.min(100, Math.round(avgCompetency * 0.85 + (assessmentCount * 3)));
    const problemSolving = Math.min(100, Math.round(avgCompetency * 0.9));
    const interviewReadiness = interviewSessions.length > 0
      ? Math.round(interviewSessions.reduce((a, s) => a + s.readiness, 0) / interviewSessions.length)
      : Math.min(100, Math.round(avgCompetency * 0.75));
    const communication = Math.min(100, Math.round(avgCompetency * 0.8));

    const overall = Math.round((technical + practical + problemSolving + interviewReadiness + communication) / 5);

    const weakSkills = allSkills
      .filter(s => s.currentLevel < s.requiredLevel)
      .map(s => ({
        name: s.name,
        level: (s.requiredLevel - s.currentLevel >= 25 ? 'critical' : 'moderate') as 'critical' | 'moderate',
        currentLevel: s.currentLevel,
        requiredLevel: s.requiredLevel,
      }))
      .sort((a, b) => (b.requiredLevel - b.currentLevel) - (a.requiredLevel - a.currentLevel));

    const steps: string[] = [];
    const criticalGaps = weakSkills.filter(s => s.level === 'critical');
    const moderateGaps = weakSkills.filter(s => s.level === 'moderate');

    if (criticalGaps.length > 0) {
      steps.push(`Complete learning modules for ${criticalGaps[0].name} (priority gap: ${criticalGaps[0].requiredLevel - criticalGaps[0].currentLevel}% gap)`);
    }
    if (verifiedCount === 0) {
      steps.push('Submit a course certificate for SkillBridge verification');
    }
    if (assessmentCount < 3) {
      steps.push('Take competency assessments for your verified skills');
    }
    if (interviewSessions.length === 0) {
      steps.push('Complete an AI interview practice session');
    }
    if (moderateGaps.length > 0) {
      steps.push(`Practice ${moderateGaps[0].name} through hands-on projects`);
    }
    steps.push('Build a project to demonstrate practical skills');
    steps.push('Review and update your SkillBridge resume');

    return {
      overallReadiness: overall,
      technicalSkills: technical,
      practicalSkills: practical,
      problemSolving,
      interviewReadiness,
      communication,
      missingSkills: weakSkills.slice(0, 6),
      recommendedNextSteps: steps.slice(0, 6),
    };
  }, [careerReadiness, verifiedSkills, assessments, interviewSessions, skills]);

  const scoreColor = (score: number) =>
    score >= 75 ? 'text-success-600' : score >= 50 ? 'text-warning-600' : 'text-danger-600';

  const breakdownCards = [
    { label: 'Technical Skills', score: readiness.technicalSkills, icon: 'bolt', color: 'text-primary', bg: 'bg-primary-50' },
    { label: 'Practical Skills', score: readiness.practicalSkills, icon: 'assignment', color: 'text-success-600', bg: 'bg-success-50' },
    { label: 'Problem Solving', score: readiness.problemSolving, icon: 'lightbulb', color: 'text-warning-600', bg: 'bg-warning-50' },
    { label: 'Interview Readiness', score: readiness.interviewReadiness, icon: 'chat', color: 'text-secondary-600', bg: 'bg-secondary-50' },
    { label: 'Communication', score: readiness.communication, icon: 'group', color: 'text-pink-600', bg: 'bg-pink-50' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Career Readiness</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Target Role: <span className="font-medium text-gray-700">{currentUser.careerGoal || 'Full Stack Developer'}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/skill-passport">
            <Button variant="outline" size="sm">
              <span className="material-symbols-outlined text-[16px]">shield</span>
              View Skill Passport
            </Button>
          </Link>
          <Link to="/quiz">
            <Button variant="outline" size="sm">
              <span className="material-symbols-outlined text-[16px]">assignment</span>
              Take Assessment
            </Button>
          </Link>
          <Link to="/interview-prep">
            <Button size="sm">
              <span className="material-symbols-outlined text-[16px]">chat</span>
              Practice Interview
            </Button>
          </Link>
        </div>
      </div>

      <AIInsight
        message={`You are ${readiness.overallReadiness}% ready for your target role as ${currentUser.careerGoal || 'Full Stack Developer'}. ${
          readiness.overallReadiness >= 75
            ? 'You are well-positioned for your career goal. Focus on maintaining and refining your skills.'
            : readiness.overallReadiness >= 50
            ? 'You are making good progress. Focus on your weak areas to reach proficiency.'
            : 'There are significant gaps to address. Follow the recommended steps below.'
        }`}
        variant={readiness.overallReadiness >= 75 ? 'success' : readiness.overallReadiness >= 50 ? 'info' : 'warning'}
      />

      <div className="flex justify-center">
        <Card className="text-center px-12 py-8">
          <div className="relative inline-flex items-center justify-center mb-4">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(readiness.overallReadiness / 100) * 326.7} 326.7`}
                className={cn(
                  readiness.overallReadiness >= 75 ? 'stroke-success-500' :
                  readiness.overallReadiness >= 50 ? 'stroke-warning-500' :
                  'stroke-danger-500'
                )}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn('text-3xl font-bold', scoreColor(readiness.overallReadiness))}>
                {readiness.overallReadiness}%
              </span>
              <span className="text-xs text-on-surface-variant">Ready</span>
            </div>
          </div>
          <h2 className="text-lg font-bold text-on-surface">Overall Readiness</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            {readiness.overallReadiness >= 75 ? 'Strong candidate profile' :
             readiness.overallReadiness >= 50 ? 'Developing profile' :
             'Early stage — keep building'}
          </p>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {breakdownCards.map(item => (
          <Card key={item.label}>
            <div className="flex items-center gap-3 mb-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', item.bg)}>
                <span className={`material-symbols-outlined text-[18px] ${item.color}`}>{item.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface">{item.label}</p>
              </div>
              <span className={cn('text-lg font-bold', scoreColor(item.score))}>{item.score}%</span>
            </div>
            <Progress value={item.score} size="sm" />
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="Missing / Weak Skills"
            subtitle={`${readiness.missingSkills.length} skills below target level`}
            action={<span className="material-symbols-outlined text-[18px] text-warning-400">warning</span>}
          />
          {readiness.missingSkills.length > 0 ? (
            <div className="space-y-3">
              {readiness.missingSkills.map(skill => (
                <div key={skill.name} className="flex items-center gap-3 p-3 rounded-xl bg-surface-container">
                  <div className={cn(
                    'w-2 h-2 rounded-full shrink-0',
                    skill.level === 'critical' ? 'bg-danger-500' : 'bg-warning-500'
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-on-surface">{skill.name}</span>
                      <Badge variant={skill.level === 'critical' ? 'danger' : 'warning'} size="sm">
                        {skill.level === 'critical' ? 'Critical' : 'Moderate'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <span>Current: {skill.currentLevel}%</span>
                      <span>·</span>
                      <span>Required: {skill.requiredLevel}%</span>
                      <span>·</span>
                      <span className="font-medium text-danger-600">Gap: {skill.requiredLevel - skill.currentLevel}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-[32px] text-success-400 mx-auto mb-2">check_circle</span>
              <p className="text-sm text-on-surface-variant">All skills meet or exceed target levels.</p>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Recommended Next Steps"
            subtitle="Actionable steps to improve your readiness"
            action={<span className="material-symbols-outlined text-[18px] text-outline">arrow_forward</span>}
          />
          <div className="space-y-3">
            {readiness.recommendedNextSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-surface-container">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary-700">{i + 1}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Project Recommendations"
          subtitle="Hands-on projects to boost your career readiness"
        />
        <div className="grid md:grid-cols-3 gap-4">
          {defaultProjects.map(project => (
            <div
              key={project.id}
              className="p-4 rounded-xl border border-outline-light hover:border-primary-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[16px] text-primary-500">work</span>
                <h3 className="text-sm font-semibold text-on-surface">{project.title}</h3>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{project.description}</p>
              <div className="flex items-center gap-3 mb-3 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[10px]">gps_fixed</span>
                  {project.difficulty}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[10px]">schedule</span>
                  {project.estimatedTime}h
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {project.skillsCovered.map(skill => (
                  <Badge key={skill} variant="primary" size="sm">{skill}</Badge>
                ))}
              </div>
              <div className="p-2.5 bg-primary-50/50 rounded-xl">
                <p className="text-xs font-medium text-primary-700 mb-0.5">Why this project?</p>
                <p className="text-xs text-primary-600 leading-relaxed">{project.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
