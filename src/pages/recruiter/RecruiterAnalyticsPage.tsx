import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useRecruiter } from '@/context/RecruiterContext';

export default function RecruiterAnalyticsPage() {
  const { jobs, shortlisted, invitations, feedback, getJobMatches } = useRecruiter();

  const publishedJobs = jobs.filter(j => j.status === 'published');
  const totalMatches = jobs.reduce((acc, job) => acc + getJobMatches(job.id).length, 0);
  const eligibleMatches = jobs.reduce((acc, job) => acc + getJobMatches(job.id).filter(m => m.category === 'eligible').length, 0);
  const completedInterviews = invitations.filter(i => i.status === 'completed').length;
  const selectedCount = feedback.filter(f => f.decision === 'Selected').length;
  const rejectedCount = feedback.filter(f => f.decision === 'Rejected').length;
  const avgMatchScore = shortlisted.length > 0
    ? Math.round(shortlisted.reduce((a, s) => a + s.matchScore, 0) / shortlisted.length)
    : 0;
  const avgFeedbackScore = feedback.length > 0
    ? Math.round(feedback.reduce((a, f) => a + f.ratings.overallPerformance, 0) / feedback.length * 20)
    : 0;
  const selectionRate = completedInterviews > 0 ? Math.round((selectedCount / completedInterviews) * 100) : 0;

  const stats = [
    { label: 'Total Applications', value: totalMatches, icon: 'group', color: 'text-primary', bg: 'bg-primary-50' },
    { label: 'Criteria Satisfied', value: eligibleMatches, icon: 'check_circle', color: 'text-success-600', bg: 'bg-success-50' },
    { label: 'Shortlisted', value: shortlisted.length, icon: 'how_to_reg', color: 'text-secondary-600', bg: 'bg-secondary-50' },
    { label: 'Interviewed', value: completedInterviews, icon: 'calendar_today', color: 'text-warning-600', bg: 'bg-warning-50' },
    { label: 'Selected', value: selectedCount, icon: 'check_circle', color: 'text-success-600', bg: 'bg-success-50' },
    { label: 'Rejected', value: rejectedCount, icon: 'bar_chart', color: 'text-danger-600', bg: 'bg-danger-50' },
  ];

  const metrics = [
    { label: 'Average Skill Match', value: `${avgMatchScore}%` },
    { label: 'Average Interview Score', value: `${avgFeedbackScore}%` },
    { label: 'Selection Rate', value: `${selectionRate}%` },
    { label: 'Active Jobs', value: publishedJobs.length.toString() },
  ];

  const pipeline = [
    { stage: 'Applications', count: totalMatches },
    { stage: 'Criteria Satisfied', count: eligibleMatches },
    { stage: 'Shortlisted', count: shortlisted.length },
    { stage: 'Interviewed', count: completedInterviews },
    { stage: 'Selected', count: selectedCount },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Recruitment Analytics</h1>
        <p className="text-sm text-on-surface-variant mt-1">Track your recruitment metrics and pipeline performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(stat => (
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Metrics */}
        <Card>
          <CardHeader title="Key Metrics" subtitle="Recruitment performance indicators" />
          <div className="p-6 space-y-4">
            {metrics.map(m => (
              <div key={m.label} className="flex items-center justify-between p-3 bg-surface-container rounded-xl">
                <span className="text-sm text-on-surface-variant">{m.label}</span>
                <span className="text-lg font-bold text-on-surface">{m.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Pipeline */}
        <Card>
          <CardHeader title="Recruitment Pipeline" subtitle="Funnel from application to selection" />
          <div className="p-6 space-y-4">
            {pipeline.map((step, i) => {
              const maxCount = pipeline[0].count || 1;
              const pct = Math.round((step.count / maxCount) * 100);
              return (
                <div key={step.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-on-surface">{step.stage}</span>
                    <span className="text-sm font-bold text-on-surface">{step.count}</span>
                  </div>
                  <div className="w-full bg-surface-container-high rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Per-Job Breakdown */}
      <Card>
        <CardHeader title="Job-wise Breakdown" subtitle="Metrics per job opening" />
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-light">
                  <th className="text-left py-3 px-4 font-semibold text-on-surface">Job Title</th>
                  <th className="text-center py-3 px-4 font-semibold text-on-surface">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-on-surface">Eligible</th>
                  <th className="text-center py-3 px-4 font-semibold text-on-surface">Near Match</th>
                  <th className="text-center py-3 px-4 font-semibold text-on-surface">Shortlisted</th>
                  <th className="text-center py-3 px-4 font-semibold text-on-surface">Interviews</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => {
                  const matches = getJobMatches(job.id);
                  const jobShortlisted = shortlisted.filter(s => s.jobId === job.id).length;
                  const jobInterviews = invitations.filter(i => i.jobId === job.id).length;
                  return (
                    <tr key={job.id} className="border-b border-outline-light hover:bg-surface-container">
                      <td className="py-3 px-4 font-medium text-on-surface">{job.title}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={job.status === 'published' ? 'success' : 'default'} size="sm">{job.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-center">{matches.filter(m => m.category === 'eligible').length}</td>
                      <td className="py-3 px-4 text-center">{matches.filter(m => m.category === 'near-match').length}</td>
                      <td className="py-3 px-4 text-center">{jobShortlisted}</td>
                      <td className="py-3 px-4 text-center">{jobInterviews}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}
