import { Link } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useRecruiter } from '@/context/RecruiterContext';

export default function ShortlistedPage() {
  const { shortlisted, jobs, removeShortlist, invitations, isShortlisted } = useRecruiter();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Shortlisted Candidates</h1>
        <p className="text-sm text-on-surface-variant mt-1">Candidates who meet your competency criteria</p>
      </div>

      {shortlisted.length === 0 ? (
        <Card className="text-center py-12">
          <span className="material-symbols-outlined text-[40px] text-outline mx-auto mb-3">how_to_reg</span>
          <h3 className="text-lg font-semibold text-on-surface mb-1">No candidates shortlisted</h3>
          <p className="text-sm text-on-surface-variant mb-4">Go to Candidates to shortlist eligible candidates</p>
          <Link to="/recruiter/candidates"><Button>Find Candidates</Button></Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {shortlisted.map(sl => {
            const job = jobs.find(j => j.id === sl.jobId);
            const hasInvitation = invitations.some(i => i.candidateId === sl.candidateId && i.jobId === sl.jobId);
            return (
              <Card key={sl.id}>
                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-lg font-bold text-primary-700">{sl.candidateName.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-on-surface">{sl.candidateName}</h3>
                      <p className="text-sm text-on-surface-variant">{job?.title || 'Unknown Job'}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-on-surface-variant">
                        <span>Match: {sl.matchScore}%</span>
                        <span>Shortlisted: {sl.shortlistedAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link to={`/recruiter/candidate/${sl.candidateId}?job=${sl.jobId}`}>
                      <Button variant="outline" size="sm"><span className="material-symbols-outlined text-[14px]">visibility</span> View</Button>
                    </Link>
                    {!hasInvitation ? (
                      <Link to={`/recruiter/interviews/invite?candidate=${sl.candidateId}&job=${sl.jobId}`}>
                        <Button size="sm"><span className="material-symbols-outlined text-[14px]">calendar_today</span> Invite for Interview</Button>
                      </Link>
                    ) : (
                      <Badge variant="success" size="sm">Invited</Badge>
                    )}
                    <button onClick={() => removeShortlist(sl.id)} className="p-1.5 rounded hover:bg-danger-50 text-outline hover:text-danger-500">
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
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
