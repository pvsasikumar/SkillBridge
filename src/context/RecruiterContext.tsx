import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type {
  CompanyProfile,
  JobOpening,
  CandidateMatchResult,
  ShortlistedCandidate,
  InterviewInvitation,
  InterviewFeedbackEntry,
} from '@/types';
import {
  companyProfile as initialCompany,
  initialJobs,
  initialShortlisted,
  initialInvitations,
  initialFeedback,
  matchAllCandidates,
} from '@/data/recruiterData';

interface RecruiterContextType {
  company: CompanyProfile;
  updateCompany: (updates: Partial<CompanyProfile>) => void;
  jobs: JobOpening[];
  addJob: (job: JobOpening) => void;
  updateJob: (id: string, updates: Partial<JobOpening>) => void;
  deleteJob: (id: string) => void;
  getJobMatches: (jobId: string) => CandidateMatchResult[];
  shortlisted: ShortlistedCandidate[];
  addShortlist: (entry: ShortlistedCandidate) => void;
  removeShortlist: (id: string) => void;
  isShortlisted: (jobId: string, candidateId: string) => boolean;
  invitations: InterviewInvitation[];
  addInvitation: (inv: InterviewInvitation) => void;
  updateInvitation: (id: string, updates: Partial<InterviewInvitation>) => void;
  feedback: InterviewFeedbackEntry[];
  addFeedback: (fb: InterviewFeedbackEntry) => void;
}

const RecruiterContext = createContext<RecruiterContextType | null>(null);

export function RecruiterProvider({ children }: { children: ReactNode }) {
  const [company, setCompany] = useState<CompanyProfile>(initialCompany);
  const [jobs, setJobs] = useState<JobOpening[]>(initialJobs);
  const [shortlisted, setShortlisted] = useState<ShortlistedCandidate[]>(initialShortlisted);
  const [invitations, setInvitations] = useState<InterviewInvitation[]>(initialInvitations);
  const [feedback, setFeedback] = useState<InterviewFeedbackEntry[]>(initialFeedback);

  const updateCompany = useCallback((updates: Partial<CompanyProfile>) => {
    setCompany(prev => ({ ...prev, ...updates }));
  }, []);

  const addJob = useCallback((job: JobOpening) => {
    setJobs(prev => [...prev, job]);
  }, []);

  const updateJob = useCallback((id: string, updates: Partial<JobOpening>) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j));
  }, []);

  const deleteJob = useCallback((id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  }, []);

  const getJobMatches = useCallback((jobId: string): CandidateMatchResult[] => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return [];
    return matchAllCandidates(job);
  }, [jobs]);

  const addShortlist = useCallback((entry: ShortlistedCandidate) => {
    setShortlisted(prev => [...prev, entry]);
  }, []);

  const removeShortlist = useCallback((id: string) => {
    setShortlisted(prev => prev.filter(s => s.id !== id));
  }, []);

  const isShortlisted = useCallback((jobId: string, candidateId: string): boolean => {
    return shortlisted.some(s => s.jobId === jobId && s.candidateId === candidateId);
  }, [shortlisted]);

  const addInvitation = useCallback((inv: InterviewInvitation) => {
    setInvitations(prev => [...prev, inv]);
  }, []);

  const updateInvitation = useCallback((id: string, updates: Partial<InterviewInvitation>) => {
    setInvitations(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  }, []);

  const addFeedback = useCallback((fb: InterviewFeedbackEntry) => {
    setFeedback(prev => [...prev, fb]);
  }, []);

  return (
    <RecruiterContext.Provider value={{
      company, updateCompany,
      jobs, addJob, updateJob, deleteJob, getJobMatches,
      shortlisted, addShortlist, removeShortlist, isShortlisted,
      invitations, addInvitation, updateInvitation,
      feedback, addFeedback,
    }}>
      {children}
    </RecruiterContext.Provider>
  );
}

export function useRecruiter() {
  const ctx = useContext(RecruiterContext);
  if (!ctx) throw new Error('useRecruiter must be used within RecruiterProvider');
  return ctx;
}
