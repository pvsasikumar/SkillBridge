import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { useApp } from '@/context/AppContext';
import { studentSkills } from '@/data/mockData';
import type { CompetencyReport } from '@/types';

function getLevelFromScore(score: number): string {
  if (score >= 85) return 'Advanced';
  if (score >= 65) return 'Proficient';
  if (score >= 40) return 'Developing';
  return 'Novice';
}

function getLevelBadgeVariant(level: string): 'success' | 'primary' | 'warning' | 'danger' {
  switch (level) {
    case 'Advanced':
      return 'success';
    case 'Proficient':
      return 'primary';
    case 'Developing':
      return 'warning';
    default:
      return 'danger';
  }
}

function getStatusVariant(status: string): 'success' | 'warning' | 'danger' | 'default' {
  switch (status) {
    case 'strong':
      return 'success';
    case 'developing':
      return 'warning';
    case 'needs-attention':
      return 'danger';
    default:
      return 'default';
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'strong':
      return 'Strong';
    case 'developing':
      return 'Developing';
    case 'needs-attention':
      return 'Needs Attention';
    default:
      return status;
  }
}

export default function CompetencyReportPage() {
  const { reportId } = useParams<{ reportId: string }>();
  const { competencyReports, skills } = useApp();

  const report: CompetencyReport | null = useMemo(() => {
    if (reportId && competencyReports[Number(reportId)]) {
      return competencyReports[Number(reportId)];
    }
    if (competencyReports.length > 0) {
      return competencyReports[competencyReports.length - 1];
    }

    const sampleTopicBreakdown = [
      {
        topic: 'Core Concepts',
        score: 72,
        status: 'developing',
        assessment: '3/4 correct',
      },
      {
        topic: 'Practical Application',
        score: 55,
        status: 'needs-attention',
        assessment: '2/4 correct',
      },
      {
        topic: 'Advanced Topics',
        score: 40,
        status: 'needs-attention',
        assessment: '1/3 correct',
      },
      {
        topic: 'Best Practices',
        score: 85,
        status: 'strong',
        assessment: '3/3 correct',
      },
    ];

    const sampleGaps = studentSkills
      .filter(s => s.currentLevel < s.requiredLevel)
      .sort((a, b) => b.requiredLevel - b.currentLevel - (a.requiredLevel - a.currentLevel))
      .slice(0, 5)
      .map(s => ({
        skill: s.name,
        current: s.currentLevel,
        target: s.requiredLevel,
        gap: s.requiredLevel - s.currentLevel,
      }));

    const avgScore = Math.round(
      sampleTopicBreakdown.reduce((a, t) => a + t.score, 0) / sampleTopicBreakdown.length
    );

    return {
      skill: 'JavaScript',
      score: avgScore,
      level: getLevelFromScore(avgScore),
      topicBreakdown: sampleTopicBreakdown,
      overallCompetency: avgScore,
      overallLevel: getLevelFromScore(avgScore),
      priorityGaps: sampleGaps,
    };
  }, [reportId, competencyReports]);

  if (!report) return null;

  const scoreColor =
    report.overallCompetency >= 75
      ? 'text-success-600'
      : report.overallCompetency >= 50
      ? 'text-warning-600'
      : 'text-danger-600';

  const scoreBg =
    report.overallCompetency >= 75
      ? 'bg-success-50'
      : report.overallCompetency >= 50
      ? 'bg-warning-50'
      : 'bg-danger-50';

  const ringColor =
    report.overallCompetency >= 75
      ? 'border-success-500'
      : report.overallCompetency >= 50
      ? 'border-warning-500'
      : 'border-danger-500';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-on-surface">Competency Report</h1>
            <Badge variant={getLevelBadgeVariant(report.overallLevel)} size="md">
              {report.overallLevel}
            </Badge>
          </div>
          <p className="text-sm text-on-surface-variant mt-1">
            Skill assessment results for {report.skill}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/assessment/new">
            <Button variant="outline" size="sm">
              <span className="material-symbols-outlined text-[14px]">refresh</span>
              Retake Assessment
            </Button>
          </Link>
          {report.priorityGaps.length > 0 && (
            <Link to="/remediation/latest">
              <Button size="sm">
                <span className="material-symbols-outlined text-[14px]">menu_book</span>
                Start Personalized Learning
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <Card className="sm:col-span-1 flex flex-col items-center justify-center py-8">
          <div
            className={cn(
              'w-28 h-28 rounded-full border-4 flex items-center justify-center mb-4',
              ringColor,
              scoreBg
            )}
          >
            <div className="text-center">
              <p className={cn('text-3xl font-bold', scoreColor)}>
                {report.overallCompetency}%
              </p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">Score</p>
            </div>
          </div>
          <Badge variant={getLevelBadgeVariant(report.overallLevel)} size="md">
            <span className="material-symbols-outlined text-[12px] mr-1">emoji_events</span>
            {report.overallLevel}
          </Badge>
          <p className="text-xs text-on-surface-variant mt-3 text-center px-4">
            {report.overallLevel === 'Advanced'
              ? 'Excellent competency! You demonstrate mastery across topics.'
              : report.overallLevel === 'Proficient'
              ? 'Good competency. A few areas need targeted improvement.'
              : report.overallLevel === 'Developing'
              ? 'Moderate competency. Focus on strengthening weak areas.'
              : 'Foundational level. Prioritize building core skills.'}
          </p>
        </Card>

        <div className="sm:col-span-2 space-y-4">
          <Card>
            <CardHeader
              title="Topic Breakdown"
              subtitle="Performance across different topics"
            />
            <div className="space-y-4">
              {report.topicBreakdown.map((topic, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-on-surface">
                        {topic.topic}
                      </span>
                      <Badge variant={getStatusVariant(topic.status)} size="sm">
                        {getStatusLabel(topic.status)}
                      </Badge>
                    </div>
                    <span className="text-xs text-on-surface-variant">
                      {topic.assessment} · {topic.score}%
                    </span>
                  </div>
                  <Progress
                    value={topic.score}
                    size="sm"
                    color={
                      topic.score >= 70 ? 'success' : topic.score >= 40 ? 'warning' : 'danger'
                    }
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Topic Statistics"
              subtitle="Summary of your assessment performance"
            />
            <div className="grid grid-cols-3 gap-4">
              {(() => {
                const strong = report.topicBreakdown.filter(
                  t => t.status === 'strong'
                ).length;
                const developing = report.topicBreakdown.filter(
                  t => t.status === 'developing'
                ).length;
                const needsAttention = report.topicBreakdown.filter(
                  t => t.status === 'needs-attention'
                ).length;
                return (
                  <>
                    <div className="text-center p-3 bg-success-50 rounded-xl">
                      <p className="text-2xl font-bold text-success-600">{strong}</p>
                      <p className="text-xs text-on-surface-variant mt-1">Strong</p>
                    </div>
                    <div className="text-center p-3 bg-warning-50 rounded-xl">
                      <p className="text-2xl font-bold text-warning-600">{developing}</p>
                      <p className="text-xs text-on-surface-variant mt-1">Developing</p>
                    </div>
                    <div className="text-center p-3 bg-danger-50 rounded-xl">
                      <p className="text-2xl font-bold text-danger-600">{needsAttention}</p>
                      <p className="text-xs text-on-surface-variant mt-1">Needs Attention</p>
                    </div>
                  </>
                );
              })()}
            </div>
          </Card>
        </div>
      </div>

      {report.priorityGaps.length > 0 && (
        <Card>
          <CardHeader
            title="Priority Skill Gaps"
            subtitle="Skills where your current level is below the required level"
            action={
              <Link to="/remediation/latest">
                <Button size="sm">
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  Start Learning
                </Button>
              </Link>
            }
          />
          <div className="space-y-3">
            {report.priorityGaps.map((gap, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 bg-surface-container rounded-xl"
              >
                <div className="w-8 h-8 bg-danger-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[14px] text-danger-600">warning</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-on-surface">{gap.skill}</span>
                    <span className="text-xs font-semibold text-danger-600">
                      Gap: {gap.gap}%
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-outline-light rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-danger-400 rounded-full"
                        style={{ width: `${gap.current}%` }}
                      />
                      <div
                        className="absolute top-0 h-full w-0.5 bg-on-surface-variant"
                        style={{ left: `${gap.target}%` }}
                      />
                    </div>
                    <span className="text-xs text-on-surface-variant shrink-0 w-20 text-right">
                      {gap.current}% → {gap.target}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <CardHeader
          title="Skill Competency Overview"
          subtitle="Your current skill levels across all tracked skills"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {skills.slice(0, 9).map(skill => {
            const gap = skill.requiredLevel - skill.currentLevel;
            return (
              <div
                key={skill.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-surface-container"
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0',
                    skill.status === 'strong'
                      ? 'bg-success-100 text-success-700'
                      : skill.status === 'developing'
                      ? 'bg-warning-100 text-warning-700'
                      : 'bg-danger-100 text-danger-700'
                  )}
                >
                  {skill.currentLevel}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface truncate">
                    {skill.name}
                  </p>
                  <div className="mt-1 h-1.5 bg-outline-light rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        skill.status === 'strong'
                          ? 'bg-success-500'
                          : skill.status === 'developing'
                          ? 'bg-warning-500'
                          : 'bg-danger-500'
                      )}
                      style={{ width: `${skill.currentLevel}%` }}
                    />
                  </div>
                </div>
                {gap > 0 && (
                  <span className="text-[10px] font-medium text-danger-500 shrink-0">
                    -{gap}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex justify-center gap-3">
        <Link to="/assessment/new">
          <Button variant="outline">
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            Retake Assessment
          </Button>
        </Link>
        {report.priorityGaps.length > 0 && (
          <Link to="/remediation/latest">
            <Button>
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              Start Personalized Learning
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
