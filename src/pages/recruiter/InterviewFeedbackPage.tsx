import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea, Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useRecruiter } from '@/context/RecruiterContext';
import { generateId } from '@/context/AppContext';
import type { FinalDecision } from '@/types';

const ratingFields = [
  { key: 'technicalKnowledge', label: 'Technical Knowledge' },
  { key: 'problemSolving', label: 'Problem Solving' },
  { key: 'communication', label: 'Communication' },
  { key: 'practicalUnderstanding', label: 'Practical Understanding' },
  { key: 'cultureFit', label: 'Culture Fit' },
  { key: 'overallPerformance', label: 'Overall Performance' },
] as const;

const decisions: Array<{ value: FinalDecision; icon: React.ReactNode; color: string }> = [
  { value: 'Selected', icon: <span className="material-symbols-outlined text-[16px]">check_circle</span>, color: 'border-success-400 bg-success-50 text-success-700' },
  { value: 'Rejected', icon: <span className="material-symbols-outlined text-[16px]">cancel</span>, color: 'border-danger-400 bg-danger-50 text-danger-700' },
  { value: 'Next Round', icon: <span className="material-symbols-outlined text-[16px]">arrow_forward</span>, color: 'border-warning-400 bg-warning-50 text-warning-700' },
  { value: 'On Hold', icon: <span className="material-symbols-outlined text-[16px]">pause</span>, color: 'border-outline-light bg-surface-container text-on-surface' },
];

export default function InterviewFeedbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invitationId = searchParams.get('invitation') || '';
  const { invitations, addFeedback, jobs, updateInvitation, feedback } = useRecruiter();

  const invitation = invitations.find(i => i.id === invitationId);
  const job = invitation ? jobs.find(j => j.id === invitation.jobId) : null;

  const [ratings, setRatings] = useState<Record<string, number>>({
    technicalKnowledge: 3, problemSolving: 3, communication: 3,
    practicalUnderstanding: 3, cultureFit: 3, overallPerformance: 3,
  });
  const [strengths, setStrengths] = useState('');
  const [areasForImprovement, setAreasForImprovement] = useState('');
  const [recruiterNotes, setRecruiterNotes] = useState('');
  const [decision, setDecision] = useState<FinalDecision | ''>('');
  const [saved, setSaved] = useState(false);

  const existingFeedback = feedback.find(f => f.invitationId === invitationId);

  const handleSave = () => {
    if (!invitation || !decision) return;
    addFeedback({
      id: generateId(),
      invitationId: invitation.id,
      candidateId: invitation.candidateId,
      candidateName: invitation.candidateName,
      jobId: invitation.jobId,
      companyId: invitation.companyId,
      round: invitation.round,
      ratings: ratings as any,
      strengths,
      areasForImprovement,
      recruiterNotes,
      decision: decision as FinalDecision,
      recordedAt: new Date().toISOString(),
      roundNumber: 1,
    });
    updateInvitation(invitation.id, { status: decision === 'Selected' ? 'selected' : decision === 'Rejected' ? 'rejected' : decision === 'Next Round' ? 'next-round' : 'on-hold' });
    setSaved(true);
  };

  if (!invitation || !job) {
    return (
      <div className="p-8 text-center">
        <p className="text-on-surface-variant">Interview not found.</p>
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    );
  }

  if (existingFeedback || saved) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        <Card className="text-center py-12">
          <span className="material-symbols-outlined text-[40px] text-success-500 mx-auto mb-3">check_circle</span>
          <h3 className="text-lg font-bold text-on-surface mb-2">Feedback Recorded</h3>
          <p className="text-sm text-on-surface-variant mb-6">
            Feedback for {invitation.candidateName} has been saved. Decision: {existingFeedback?.decision || decision}
          </p>
          <Button onClick={() => navigate('/recruiter/interviews')}>Back to Interviews</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-surface-container text-outline hover:text-on-surface-variant">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Interview Feedback</h1>
          <p className="text-sm text-on-surface-variant mt-1">{invitation.candidateName} &middot; {invitation.round} Round</p>
        </div>
      </div>

      {/* Candidate Summary */}
      <Card>
        <div className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-primary-700">{invitation.candidateName.charAt(0)}</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface">{invitation.candidateName}</h3>
            <p className="text-sm text-on-surface-variant">{job.title} &middot; {invitation.round} Round</p>
          </div>
        </div>
      </Card>

      {/* Ratings */}
      <Card>
        <CardHeader title="Interview Ratings" subtitle="Rate each dimension (1-5)" />
        <div className="p-6 grid md:grid-cols-2 gap-6">
          {ratingFields.map(field => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-on-surface mb-2">{field.label}</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(val => (
                  <button
                    key={val}
                    onClick={() => setRatings(prev => ({ ...prev, [field.key]: val }))}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                      ratings[field.key] === val
                        ? 'bg-primary text-white'
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Written Feedback */}
      <Card>
        <CardHeader title="Written Feedback" />
        <div className="p-6 space-y-4">
          <Textarea label="Strengths" rows={2} value={strengths} onChange={e => setStrengths(e.target.value)} placeholder="What did the candidate do well?" />
          <Textarea label="Areas for Improvement" rows={2} value={areasForImprovement} onChange={e => setAreasForImprovement(e.target.value)} placeholder="Where can the candidate improve?" />
          <Textarea label="Recruiter Notes" rows={2} value={recruiterNotes} onChange={e => setRecruiterNotes(e.target.value)} placeholder="Additional notes (private)" />
        </div>
      </Card>

      {/* Final Decision */}
      <Card>
        <CardHeader title="Final Decision" subtitle="The hiring decision belongs to the company" />
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {decisions.map(d => (
              <button
                key={d.value}
                onClick={() => setDecision(d.value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  decision === d.value ? d.color : 'border-outline-light hover:border-outline text-on-surface-variant'
                }`}
              >
                {d.icon}
                <span className="text-sm font-semibold">{d.value}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        <Button onClick={handleSave} disabled={!decision}>
          <span className="material-symbols-outlined text-[16px]">save</span> Save Feedback & Decision
        </Button>
      </div>
    </div>
  );
}
