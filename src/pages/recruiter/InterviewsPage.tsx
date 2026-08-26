import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Input';
import { useRecruiter } from '@/context/RecruiterContext';
import type { InterviewStatus } from '@/types';

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'primary' | 'default' }> = {
  invited: { label: 'Invited', variant: 'primary' },
  accepted: { label: 'Accepted', variant: 'success' },
  'reschedule-requested': { label: 'Reschedule Requested', variant: 'warning' },
  declined: { label: 'Declined', variant: 'danger' },
  scheduled: { label: 'Scheduled', variant: 'primary' },
  completed: { label: 'Completed', variant: 'success' },
  selected: { label: 'Selected', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'danger' },
  'next-round': { label: 'Next Round', variant: 'warning' },
  'on-hold': { label: 'On Hold', variant: 'default' },
};

export default function InterviewsPage() {
  const { invitations, updateInvitation, jobs, feedback } = useRecruiter();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = invitations.filter(inv => statusFilter === 'all' || inv.status === statusFilter);

  const todayInterviews = invitations.filter(i => {
    const today = new Date().toISOString().split('T')[0];
    return i.date === today && i.status === 'scheduled';
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Interviews</h1>
        <p className="text-sm text-on-surface-variant mt-1">Manage interview invitations and track status</p>
      </div>

      {/* Today's Interviews */}
      {todayInterviews.length > 0 && (
        <Card>
          <CardHeader title="Today's Interviews" subtitle="Scheduled for today" />
          <div className="space-y-3 p-4">
            {todayInterviews.map(inv => {
              const job = jobs.find(j => j.id === inv.jobId);
              return (
                <div key={inv.id} className="flex items-center gap-4 p-3 bg-primary-50 rounded-xl border border-primary-100">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px] text-primary">calendar_today</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-on-surface">{inv.candidateName}</p>
                    <p className="text-xs text-on-surface-variant">{job?.title} &middot; {inv.round} Round</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary-700">{inv.time}</p>
                    <p className="text-xs text-on-surface-variant">{inv.duration}</p>
                  </div>
                  <Button size="sm" onClick={() => updateInvitation(inv.id, { status: 'completed' })}>
                    Start Interview Record
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Filter */}
      <div className="flex gap-4 items-end">
        <div className="w-64">
          <Select
            label="Filter by Status"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All' },
              { value: 'invited', label: 'Invited' },
              { value: 'accepted', label: 'Accepted' },
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'completed', label: 'Completed' },
              { value: 'selected', label: 'Selected' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'next-round', label: 'Next Round' },
              { value: 'declined', label: 'Declined' },
            ]}
          />
        </div>
        <Badge variant="default" size="md">{filtered.length} interviews</Badge>
      </div>

      {/* Interview List */}
      {filtered.length === 0 ? (
        <Card className="text-center py-12">
          <span className="material-symbols-outlined text-[40px] text-outline mx-auto mb-3">calendar_today</span>
          <h3 className="text-lg font-semibold text-on-surface mb-1">No interviews found</h3>
          <p className="text-sm text-on-surface-variant">Shortlist candidates and send interview invitations to get started</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map(inv => {
            const job = jobs.find(j => j.id === inv.jobId);
            const st = statusConfig[inv.status] || statusConfig.invited;
            const hasFeedback = feedback.some(f => f.invitationId === inv.id);
            return (
              <Card key={inv.id}>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-lg font-bold text-primary-700">{inv.candidateName.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-bold text-on-surface">{inv.candidateName}</h3>
                          <Badge variant={st.variant} size="sm">{st.label}</Badge>
                        </div>
                        <p className="text-sm text-on-surface-variant">{job?.title || 'Job'}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-on-surface-variant">
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">calendar_today</span> {inv.date}</span>
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">schedule</span> {inv.time}</span>
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">location_on</span> {inv.location}</span>
                          <span>{inv.round} Round &middot; {inv.duration}</span>
                        </div>
                        {inv.instructions && (
                          <p className="text-xs text-on-surface-variant mt-1 italic">"{inv.instructions}"</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {inv.status === 'invited' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => updateInvitation(inv.id, { status: 'accepted' })}>
                            <span className="material-symbols-outlined text-[14px]">check_circle</span> Accept
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => updateInvitation(inv.id, { status: 'declined' })}>
                            <span className="material-symbols-outlined text-[14px]">cancel</span> Decline
                          </Button>
                        </>
                      )}
                      {inv.status === 'accepted' && (
                        <Button size="sm" onClick={() => updateInvitation(inv.id, { status: 'scheduled' })}>
                          <span className="material-symbols-outlined text-[14px]">calendar_today</span> Mark Scheduled
                        </Button>
                      )}
                      {inv.status === 'scheduled' && (
                        <Button size="sm" onClick={() => updateInvitation(inv.id, { status: 'completed' })}>
                          <span className="material-symbols-outlined text-[14px]">check_circle</span> Mark Completed
                        </Button>
                      )}
                      {inv.status === 'completed' && !hasFeedback && (
                        <Link to={`/recruiter/feedback/record?invitation=${inv.id}`}>
                          <Button size="sm"><span className="material-symbols-outlined text-[14px]">chat</span> Record Feedback</Button>
                        </Link>
                      )}
                      {hasFeedback && (
                        <Badge variant="success" size="sm">Feedback Recorded</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
