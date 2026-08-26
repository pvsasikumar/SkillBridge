import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { useRecruiter } from '@/context/RecruiterContext';
import { getCandidateProfile } from '@/data/recruiterData';
import { generateId } from '@/context/AppContext';
import type { InterviewType, InterviewRound } from '@/types';

const interviewTypes = ['Face-to-Face', 'Online', 'Phone'] as const;
const interviewRounds = ['Technical', 'HR', 'Managerial', 'Final', 'Custom'] as const;

export default function InterviewInvitationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const candidateId = searchParams.get('candidate') || '';
  const jobId = searchParams.get('job') || '';
  const { addInvitation, jobs, shortlisted } = useRecruiter();

  const candidate = getCandidateProfile(candidateId);
  const job = jobs.find(j => j.id === jobId);

  const [interviewType, setInterviewType] = useState<string>('Face-to-Face');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('60 minutes');
  const [round, setRound] = useState<string>('Technical');
  const [customRoundName, setCustomRoundName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!candidate || !job || !date || !time) return;
    addInvitation({
      id: generateId(),
      jobId,
      candidateId,
      candidateName: candidate.name,
      companyId: job.companyId,
      shortlistId: shortlisted.find(s => s.candidateId === candidateId && s.jobId === jobId)?.id || '',
      interviewType: interviewType as InterviewType,
      location,
      date,
      time,
      duration,
      round: round as InterviewRound,
      customRoundName: round === 'Custom' ? customRoundName : undefined,
      instructions,
      status: 'invited',
      sentAt: new Date().toISOString().split('T')[0],
    });
    setSent(true);
  };

  if (!candidate || !job) {
    return (
      <div className="p-8 text-center">
        <p className="text-on-surface-variant">Candidate or job not found.</p>
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
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
          <h1 className="text-2xl font-bold text-on-surface">Interview Invitation</h1>
          <p className="text-sm text-on-surface-variant mt-1">Send interview details to {candidate.name}</p>
        </div>
      </div>

      {/* Candidate Summary */}
      <Card>
        <div className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-primary-700">{candidate.name.charAt(0)}</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface">{candidate.name}</h3>
            <p className="text-sm text-on-surface-variant">{candidate.targetRole} &middot; {job.title}</p>
          </div>
        </div>
      </Card>

      {sent ? (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[24px] text-success-600">send</span>
          </div>
          <h3 className="text-lg font-bold text-on-surface mb-2">Interview Invitation Sent</h3>
          <p className="text-sm text-on-surface-variant mb-6">{candidate.name} will receive the interview details.</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => navigate('/recruiter/shortlisted')}>Back to Shortlisted</Button>
            <Button onClick={() => navigate('/recruiter/interviews')}>View Interviews</Button>
          </div>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader title="Interview Details" subtitle="Configure the interview schedule" />
            <div className="grid md:grid-cols-2 gap-6 p-6">
              <Select label="Interview Type" value={interviewType} onChange={e => setInterviewType(e.target.value)} options={interviewTypes.map(t => ({ value: t, label: t }))} />
              <Select label="Interview Round" value={round} onChange={e => setRound(e.target.value)} options={interviewRounds.map(r => ({ value: r, label: r }))} />
              {round === 'Custom' && (
                <Input label="Custom Round Name" value={customRoundName} onChange={e => setCustomRoundName(e.target.value)} placeholder="e.g. Code Review" />
              )}
              <Input label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} icon={<span className="material-symbols-outlined text-[16px]">calendar_today</span>} />
              <Input label="Time" value={time} onChange={e => setTime(e.target.value)} placeholder="e.g. 10:30 AM" />
              <Select label="Duration" value={duration} onChange={e => setDuration(e.target.value)} options={['30 minutes', '45 minutes', '60 minutes', '90 minutes', '120 minutes'].map(d => ({ value: d, label: d }))} />
              <Input label="Location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. ABC Technologies, Chennai" />
              <div className="md:col-span-2">
                <Textarea label="Interview Instructions (Optional)" rows={3} value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="e.g. Bring your resume and ID proof. Be prepared for a live coding session." />
              </div>
            </div>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader title="Invitation Preview" subtitle="What the candidate will see" />
            <div className="p-6 bg-surface-container rounded-b-xl space-y-3">
              <div className="glass-card p-4 rounded-xl border border-outline-light space-y-2">
                <h4 className="font-bold text-on-surface">Interview Invitation</h4>
                <div className="text-sm space-y-1 text-on-surface-variant">
                  <p><span className="font-medium">Company:</span> {job.location ? 'ABC Technologies' : 'Company'}</p>
                  <p><span className="font-medium">Role:</span> {job.title}</p>
                  <p><span className="font-medium">Type:</span> {interviewType}</p>
                  {date && <p><span className="font-medium">Date:</span> {new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
                  {time && <p><span className="font-medium">Time:</span> {time}</p>}
                  {location && <p><span className="font-medium">Location:</span> {location}</p>}
                  <p><span className="font-medium">Round:</span> {round === 'Custom' ? customRoundName : round}</p>
                  {instructions && <p><span className="font-medium">Instructions:</span> {instructions}</p>}
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button onClick={handleSend} disabled={!date || !time || !location}>
              <span className="material-symbols-outlined text-[16px]">send</span> Send Interview Invitation
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
