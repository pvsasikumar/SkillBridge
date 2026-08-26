import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useRecruiter } from '@/context/RecruiterContext';

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'default' }> = {
  published: { label: 'Published', variant: 'success' },
  draft: { label: 'Draft', variant: 'default' },
  paused: { label: 'Paused', variant: 'warning' },
  closed: { label: 'Closed', variant: 'danger' },
};

export default function JobsListPage() {
  const { jobs, updateJob, shortlisted } = useRecruiter();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Job Openings</h1>
          <p className="text-sm text-on-surface-variant mt-1">Manage your job postings and requirements</p>
        </div>
        <Link to="/recruiter/jobs/create">
          <Button><span className="material-symbols-outlined text-[16px]">add</span> Create Job</Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <Card className="text-center py-12">
          <span className="material-symbols-outlined text-[40px] text-outline mx-auto mb-3">work</span>
          <h3 className="text-lg font-semibold text-on-surface mb-1">No jobs posted yet</h3>
          <p className="text-sm text-on-surface-variant mb-4">Create your first job opening to start matching candidates</p>
          <Link to="/recruiter/jobs/create"><Button><span className="material-symbols-outlined text-[16px]">add</span> Create Job</Button></Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => {
            const st = statusConfig[job.status] || statusConfig.draft;
            const jobShortlisted = shortlisted.filter(s => s.jobId === job.id).length;
            const requiredSkills = job.requiredSkills.filter(s => s.type === 'required');
            const optionalSkills = job.requiredSkills.filter(s => s.type === 'optional');
            return (
              <Card key={job.id}>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-on-surface">{job.title}</h3>
                        <Badge variant={st.variant} size="sm">{st.label}</Badge>
                      </div>
                      <p className="text-sm text-on-surface-variant mb-3 line-clamp-2">{job.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant mb-3">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">location_on</span> {job.location}</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">schedule</span> {job.workMode}</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">work</span> {job.experience}</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">group</span> {jobShortlisted} shortlisted</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {requiredSkills.map(sk => (
                          <Badge key={sk.id} variant="primary" size="sm">{sk.skill} &ge; {sk.minimumCompetency}%</Badge>
                        ))}
                        {optionalSkills.map(sk => (
                          <Badge key={sk.id} variant="default" size="sm">{sk.skill} &ge; {sk.minimumCompetency}% (opt)</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link to={`/recruiter/candidates?job=${job.id}`}>
                        <Button variant="outline" size="sm"><span className="material-symbols-outlined text-[14px]">visibility</span> View Candidates</Button>
                      </Link>
                      {job.status === 'published' ? (
                        <Button variant="ghost" size="sm" onClick={() => updateJob(job.id, { status: 'paused' })}><span className="material-symbols-outlined text-[14px]">pause</span></Button>
                      ) : job.status === 'paused' ? (
                        <Button variant="ghost" size="sm" onClick={() => updateJob(job.id, { status: 'published' })}><span className="material-symbols-outlined text-[14px]">play_arrow</span></Button>
                      ) : null}
                      {job.status !== 'closed' && (
                        <Button variant="ghost" size="sm" onClick={() => updateJob(job.id, { status: 'closed' })}><span className="material-symbols-outlined text-[14px]">close</span></Button>
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
