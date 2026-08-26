import { Link } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useRecruiter } from '@/context/RecruiterContext';
import { recruiterUser } from '@/data/recruiterData';
import { getGreeting } from '@/lib/utils';

export default function RecruiterDashboard() {
  const { jobs, shortlisted, invitations, feedback } = useRecruiter();
  const publishedJobs = jobs.filter(j => j.status === 'published');
  const totalInterviews = invitations.length;
  const completedInterviews = invitations.filter(i => i.status === 'completed').length;
  const selectedCount = feedback.filter(f => f.decision === 'Selected').length;

  const pipeline = [
    { label: 'Active Jobs', count: publishedJobs.length, icon: 'work', color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Shortlisted', count: shortlisted.length, icon: 'how_to_reg', color: 'text-secondary-600', bg: 'bg-secondary-50' },
    { label: 'Interviews', count: totalInterviews, icon: 'calendar_today', color: 'text-warning-600', bg: 'bg-warning-50' },
    { label: 'Selected', count: selectedCount, icon: 'check_circle', color: 'text-success-600', bg: 'bg-success-50' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">{getGreeting()}, {recruiterUser.name}</h1>
          <p className="text-sm text-on-surface-variant mt-1">Recruiter Dashboard</p>
        </div>
        <Link to="/recruiter/jobs">
          <Button variant="gradient"><span className="material-symbols-outlined text-[16px]">work</span> Post New Job</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {pipeline.map(stat => (
          <Card key={stat.label} className="flex items-start gap-4">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center shrink-0`}>
              <span className={`material-symbols-outlined text-[18px] ${stat.color}`}>{stat.icon}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-on-surface">{stat.count}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recruitment Pipeline */}
        <Card className="lg:col-span-2">
          <CardHeader title="Recruitment Pipeline" subtitle="Track candidates across stages" />
          <div className="space-y-3 p-1">
            {[
              { stage: 'Active Jobs', count: publishedJobs.length, pct: 100, color: 'bg-primary-500' },
              { stage: 'Shortlisted', count: shortlisted.length, pct: publishedJobs.length > 0 ? Math.round((shortlisted.length / (publishedJobs.length * 10)) * 100) : 0, color: 'bg-secondary-500' },
              { stage: 'Interview Invited', count: invitations.length, pct: publishedJobs.length > 0 ? Math.round((invitations.length / (publishedJobs.length * 10)) * 100) : 0, color: 'bg-warning-500' },
              { stage: 'Interview Completed', count: completedInterviews, pct: invitations.length > 0 ? Math.round((completedInterviews / invitations.length) * 100) : 0, color: 'bg-tertiary-500' },
              { stage: 'Selected', count: selectedCount, pct: completedInterviews > 0 ? Math.round((selectedCount / completedInterviews) * 100) : 0, color: 'bg-success-500' },
            ].map(item => (
              <div key={item.stage} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-on-surface-variant">{item.stage}</span>
                    <span className="text-sm font-semibold text-on-surface">{item.count}</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full transition-all`} style={{ width: `${Math.min(item.pct, 100)}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Interviews */}
        <Card>
          <CardHeader title="Upcoming Interviews" subtitle="Scheduled interviews" action={<Link to="/recruiter/interviews"><Button variant="ghost" size="sm">View All</Button></Link>} />
          <div className="space-y-3">
            {invitations.filter(i => i.status === 'scheduled').length === 0 ? (
              <p className="text-sm text-on-surface-variant text-center py-4">No upcoming interviews</p>
            ) : (
              invitations.filter(i => i.status === 'scheduled').map(inv => (
                <div key={inv.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-container">
                  <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[16px] text-primary-500">calendar_today</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{inv.candidateName}</p>
                    <p className="text-xs text-on-surface-variant">{inv.round} &middot; {inv.date}</p>
                  </div>
                  <Badge variant="primary" size="sm">{inv.time}</Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/recruiter/candidates">
          <Card hover className="text-center py-4">
            <span className="material-symbols-outlined text-[24px] text-primary-500 mx-auto mb-2 block">group</span>
            <p className="text-sm font-semibold text-on-surface">Find Candidates</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Search & match</p>
          </Card>
        </Link>
        <Link to="/recruiter/shortlisted">
          <Card hover className="text-center py-4">
            <span className="material-symbols-outlined text-[24px] text-secondary-500 mx-auto mb-2 block">how_to_reg</span>
            <p className="text-sm font-semibold text-on-surface">Shortlisted</p>
            <p className="text-xs text-on-surface-variant mt-0.5">{shortlisted.length} candidates</p>
          </Card>
        </Link>
        <Link to="/recruiter/analytics">
          <Card hover className="text-center py-4">
            <span className="material-symbols-outlined text-[24px] text-success-500 mx-auto mb-2 block">trending_up</span>
            <p className="text-sm font-semibold text-on-surface">Analytics</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Recruitment metrics</p>
          </Card>
        </Link>
        <Link to="/recruiter/company">
          <Card hover className="text-center py-4">
            <span className="material-symbols-outlined text-[24px] text-warning-500 mx-auto mb-2 block">gps_fixed</span>
            <p className="text-sm font-semibold text-on-surface">Company Profile</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Manage details</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
