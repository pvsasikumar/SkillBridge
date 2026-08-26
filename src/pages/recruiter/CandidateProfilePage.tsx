import { useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { useRecruiter } from '@/context/RecruiterContext';
import { getCandidateProfile, matchCandidateToJob } from '@/data/recruiterData';

export default function CandidateProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('job') || '';
  const navigate = useNavigate();
  const { jobs, isShortlisted, addShortlist } = useRecruiter();

  const candidate = getCandidateProfile(id || '');
  const job = jobs.find(j => j.id === jobId);

  const matchResult = useMemo(() => {
    if (!candidate || !job) return null;
    return matchCandidateToJob(candidate.id, job);
  }, [candidate, job]);

  if (!candidate || !job || !matchResult) {
    return (
      <div className="p-8 text-center">
        <p className="text-on-surface-variant">Candidate or job not found.</p>
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const alreadyShortlisted = isShortlisted(jobId, id || '');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-surface-container text-outline hover:text-on-surface-variant">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-on-surface">{candidate.name}</h1>
          <p className="text-sm text-on-surface-variant">{candidate.targetRole} &middot; {job.title}</p>
        </div>
        <div className="flex gap-2">
          {!alreadyShortlisted ? (
            <Button onClick={() => {
              addShortlist({
                id: `sl_${Date.now()}`, jobId, candidateId: candidate.id, candidateName: candidate.name,
                companyId: job.companyId, matchScore: matchResult.skillMatchScore,
                shortlistedAt: new Date().toISOString().split('T')[0], recruiter: 'Meera Nair',
              });
            }}>Shortlist Candidate</Button>
          ) : (
            <Badge variant="success" size="md">Shortlisted</Badge>
          )}
          {alreadyShortlisted && (
            <Button onClick={() => navigate(`/recruiter/interviews/invite?candidate=${candidate.id}&job=${jobId}`)}>
              Invite for Interview
            </Button>
          )}
        </div>
      </div>

      {/* Match Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="text-center py-4">
          <p className="text-3xl font-bold text-primary-700">{matchResult.skillMatchScore}%</p>
          <p className="text-xs text-on-surface-variant mt-1">Skill Match</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-3xl font-bold text-on-surface">{candidate.overallCompetency}%</p>
          <p className="text-xs text-on-surface-variant mt-1">Overall Competency</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-3xl font-bold text-secondary-700">{candidate.interviewReadiness}%</p>
          <p className="text-xs text-on-surface-variant mt-1">Interview Readiness</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-3xl font-bold text-success-700">{candidate.verifiedSkillCount}</p>
          <p className="text-xs text-on-surface-variant mt-1">Verified Skills</p>
        </Card>
      </div>

      {/* Criteria Check */}
      <Card>
        <CardHeader title="Criteria Check" subtitle={`Evaluation against ${job.title} requirements`} />
        <div className="p-6 space-y-4">
          {matchResult.skillMatches.map(sm => (
            <div key={sm.skill} className="flex items-center gap-4">
              <div className="w-32 shrink-0">
                <p className="text-sm font-medium text-on-surface">{sm.skill}</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-on-surface-variant">Required: {sm.requiredScore}%</span>
                  <span className="text-xs text-on-surface-variant">&middot;</span>
                  <span className={`text-xs font-medium ${sm.meetsRequired ? 'text-success-600' : 'text-danger-600'}`}>
                    Candidate: {sm.candidateScore}%
                  </span>
                </div>
                <div className="relative h-3 bg-surface-container-high rounded-full">
                  <div
                    className={`absolute h-3 rounded-full ${sm.meetsRequired ? 'bg-success-500' : 'bg-danger-500'}`}
                    style={{ width: `${Math.min(sm.candidateScore, 100)}%` }}
                  />
                  <div
                    className="absolute h-3 border-r-2 border-dashed border-on-surface-variant"
                    style={{ left: `${sm.requiredScore}%` }}
                  />
                </div>
              </div>
              <div className="w-16 text-right shrink-0">
                {sm.meetsRequired ? (
                  <span className="text-success-600"><span className="material-symbols-outlined text-[18px]">check_circle</span></span>
                ) : (
                  <span className="text-danger-600"><span className="material-symbols-outlined text-[18px]">cancel</span></span>
                )}
              </div>
            </div>
          ))}

          <div className="mt-4 pt-4 border-t border-outline-light">
            {matchResult.category === 'eligible' ? (
              <div className="flex items-center gap-2 text-success-700 bg-success-50 p-3 rounded-xl">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span className="text-sm font-semibold">Criteria Satisfied — All required competencies meet thresholds</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-warning-700 bg-warning-50 p-3 rounded-xl">
                <AlertTriangle size={18} />
                <span className="text-sm font-semibold">
                  {matchResult.failsRequired.length} required competency below threshold
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Why this candidate matches */}
      <Card>
        <CardHeader title="Match Explanation" subtitle="Why this candidate matches this role" />
        <div className="p-6 space-y-2">
          {matchResult.skillMatches.map(sm => (
            <div key={sm.skill} className="flex items-center gap-2 text-sm">
              {sm.meetsRequired ? (
                <>
                  <span className="material-symbols-outlined text-[14px] text-success-500 shrink-0">check_circle</span>
                  <span className="text-success-700">
                    {sm.skill} exceeds requirement by {sm.gap} points
                  </span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[14px] text-danger-500 shrink-0">cancel</span>
                  <span className="text-danger-700">
                    {sm.skill} is {Math.abs(sm.gap)} points below the required threshold
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Verified Skills Evidence */}
      <Card>
        <CardHeader title="Verified Skills" subtitle="SkillBridge verified competency evidence" />
        <div className="p-6 space-y-3">
          {candidate.verifiedSkills.map(vs => (
            <div key={vs.skill} className="flex items-center justify-between p-3 bg-surface-container rounded-xl">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[16px] text-primary">work</span>
                <span className="text-sm font-medium text-on-surface">{vs.skill}</span>
                <span className="text-sm text-on-surface-variant">{vs.score}%</span>
              </div>
              <a href={`/verify/${vs.skill.toLowerCase().replace(/\s+/g, '-')}`} target="_blank" rel="noreferrer" className="text-primary text-xs font-medium flex items-center gap-1 hover:text-primary">
                View Verification <span className="material-symbols-outlined text-[12px]">visibility</span>
              </a>
            </div>
          ))}
        </div>
      </Card>

      {/* Additional Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Readiness Profile" />
          <div className="p-6 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-on-surface-variant">Interview Readiness</span>
                <span className="font-medium">{candidate.interviewReadiness}%</span>
              </div>
              <Progress value={candidate.interviewReadiness} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-on-surface-variant">Career Readiness</span>
                <span className="font-medium">{candidate.careerReadiness}%</span>
              </div>
              <Progress value={candidate.careerReadiness} color="success" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-on-surface-variant">Overall Competency</span>
                <span className="font-medium">{candidate.overallCompetency}%</span>
              </div>
              <Progress value={candidate.overallCompetency} color="primary" />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Actions" />
          <div className="p-6 space-y-3">
            {!alreadyShortlisted ? (
              <Button fullWidth onClick={() => {
                addShortlist({
                  id: `sl_${Date.now()}`, jobId, candidateId: candidate.id, candidateName: candidate.name,
                  companyId: job.companyId, matchScore: matchResult.skillMatchScore,
                  shortlistedAt: new Date().toISOString().split('T')[0], recruiter: 'Meera Nair',
                });
              }}>
                Shortlist Candidate
              </Button>
            ) : (
              <>
                <Button fullWidth onClick={() => navigate(`/recruiter/interviews/invite?candidate=${candidate.id}&job=${jobId}`)}>
                  Invite for Interview
                </Button>
                <Button fullWidth variant="outline" onClick={() => navigate('/recruiter/shortlisted')}>
                  View Shortlisted
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function AlertTriangle(props: { size: number; className?: string }) {
  return (
    <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" /><path d="M12 17h.01" />
    </svg>
  );
}
