import type {
  CompanyProfile,
  JobOpening,
  CandidateMatchResult,
  ShortlistedCandidate,
  InterviewInvitation,
  InterviewFeedbackEntry,
  RecruiterUser,
  Skill,
  MatchCategory,
} from '@/types';
import { allStudents } from './mockData';

export const recruiterUser: RecruiterUser = {
  id: 'r1',
  name: 'Meera Nair',
  email: 'meera@abctech.com',
  role: 'recruiter',
  companyId: 'c1',
};

export const companyProfile: CompanyProfile = {
  id: 'c1',
  name: 'ABC Technologies',
  logo: 'A',
  industry: 'Information Technology',
  description: 'ABC Technologies is a leading software development company specializing in full-stack web applications, cloud solutions, and AI-powered products. We are committed to building innovative solutions for global clients.',
  website: 'https://abctech.com',
  location: 'Chennai, India',
  contactPerson: 'Meera Nair',
  contactEmail: 'meera@abctech.com',
};

export const recruiterSkills: Skill[] = [
  { id: 's1', name: 'JavaScript', category: 'Programming', currentLevel: 68, requiredLevel: 85, status: 'developing' },
  { id: 's2', name: 'React', category: 'Web Development', currentLevel: 42, requiredLevel: 80, status: 'needs-attention' },
  { id: 's3', name: 'Node.js', category: 'Web Development', currentLevel: 38, requiredLevel: 75, status: 'needs-attention' },
  { id: 's4', name: 'SQL', category: 'Database', currentLevel: 72, requiredLevel: 80, status: 'developing' },
  { id: 's5', name: 'Git', category: 'Programming', currentLevel: 89, requiredLevel: 85, status: 'strong', verified: true, lastVerified: '2026-08-20' },
  { id: 's6', name: 'TypeScript', category: 'Programming', currentLevel: 55, requiredLevel: 75, status: 'needs-attention' },
  { id: 's7', name: 'REST APIs', category: 'Web Development', currentLevel: 62, requiredLevel: 80, status: 'developing' },
  { id: 's8', name: 'Python', category: 'AI/ML', currentLevel: 45, requiredLevel: 70, status: 'needs-attention' },
  { id: 's9', name: 'Docker', category: 'Cloud', currentLevel: 30, requiredLevel: 65, status: 'needs-attention' },
  { id: 's10', name: 'Testing', category: 'Programming', currentLevel: 35, requiredLevel: 70, status: 'needs-attention' },
  { id: 's11', name: 'HTML/CSS', category: 'Web Development', currentLevel: 85, requiredLevel: 85, status: 'strong', verified: true, lastVerified: '2026-08-18' },
  { id: 's12', name: 'MongoDB', category: 'Database', currentLevel: 40, requiredLevel: 65, status: 'needs-attention' },
];

const candidateProfiles: Array<{
  id: string;
  name: string;
  targetRole: string;
  overallCompetency: number;
  interviewReadiness: number;
  careerReadiness: number;
  verifiedSkillCount: number;
  verifiedSkills: Array<{ skill: string; score: number }>;
  visibility: 'public' | 'private';
}> = [
  {
    id: 'u1', name: 'Sasi', targetRole: 'Full Stack Developer', overallCompetency: 58, interviewReadiness: 62, careerReadiness: 55, verifiedSkillCount: 2,
    verifiedSkills: [{ skill: 'Git', score: 89 }, { skill: 'HTML/CSS', score: 85 }],
    visibility: 'public',
  },
  {
    id: 'u2', name: 'Aisha Khan', targetRole: 'Data Analyst', overallCompetency: 72, interviewReadiness: 70, careerReadiness: 68, verifiedSkillCount: 3,
    verifiedSkills: [{ skill: 'Python', score: 78 }, { skill: 'SQL', score: 82 }, { skill: 'Data Analysis', score: 75 }],
    visibility: 'public',
  },
  {
    id: 'u3', name: 'Rahul Verma', targetRole: 'AI/ML Engineer', overallCompetency: 45, interviewReadiness: 40, careerReadiness: 38, verifiedSkillCount: 1,
    verifiedSkills: [{ skill: 'Python', score: 55 }],
    visibility: 'public',
  },
  {
    id: 'u4', name: 'Priya Patel', targetRole: 'Cloud Engineer', overallCompetency: 63, interviewReadiness: 65, careerReadiness: 60, verifiedSkillCount: 2,
    verifiedSkills: [{ skill: 'Docker', score: 68 }, { skill: 'AWS', score: 62 }],
    visibility: 'public',
  },
  {
    id: 'u5', name: 'Arjun Singh', targetRole: 'Full Stack Developer', overallCompetency: 38, interviewReadiness: 35, careerReadiness: 32, verifiedSkillCount: 0,
    verifiedSkills: [],
    visibility: 'public',
  },
  {
    id: 'u6', name: 'Neha Gupta', targetRole: 'Cybersecurity Analyst', overallCompetency: 81, interviewReadiness: 78, careerReadiness: 76, verifiedSkillCount: 4,
    verifiedSkills: [{ skill: 'Python', score: 70 }, { skill: 'SQL', score: 75 }, { skill: 'Data Structures', score: 82 }, { skill: 'Git', score: 88 }],
    visibility: 'public',
  },
  {
    id: 'u7', name: 'Vikram Das', targetRole: 'Business Analyst', overallCompetency: 55, interviewReadiness: 52, careerReadiness: 50, verifiedSkillCount: 1,
    verifiedSkills: [{ skill: 'SQL', score: 62 }],
    visibility: 'public',
  },
  {
    id: 'u8', name: 'Sneha Reddy', targetRole: 'Full Stack Developer', overallCompetency: 69, interviewReadiness: 66, careerReadiness: 64, verifiedSkillCount: 3,
    verifiedSkills: [{ skill: 'React', score: 76 }, { skill: 'JavaScript', score: 74 }, { skill: 'Node.js', score: 70 }],
    visibility: 'public',
  },
  {
    id: 'u9', name: 'Karthik Menon', targetRole: 'Full Stack Developer', overallCompetency: 78, interviewReadiness: 75, careerReadiness: 73, verifiedSkillCount: 4,
    verifiedSkills: [{ skill: 'React', score: 84 }, { skill: 'JavaScript', score: 79 }, { skill: 'Node.js', score: 72 }, { skill: 'SQL', score: 81 }],
    visibility: 'public',
  },
  {
    id: 'u10', name: 'Divya Iyer', targetRole: 'Full Stack Developer', overallCompetency: 74, interviewReadiness: 71, careerReadiness: 69, verifiedSkillCount: 3,
    verifiedSkills: [{ skill: 'React', score: 82 }, { skill: 'JavaScript', score: 76 }, { skill: 'SQL', score: 78 }],
    visibility: 'public',
  },
  {
    id: 'u11', name: 'Arun Krishnan', targetRole: 'Full Stack Developer', overallCompetency: 66, interviewReadiness: 63, careerReadiness: 61, verifiedSkillCount: 2,
    verifiedSkills: [{ skill: 'JavaScript', score: 71 }, { skill: 'Node.js', score: 63 }],
    visibility: 'public',
  },
  {
    id: 'u12', name: 'Pooja Sharma', targetRole: 'Data Analyst', overallCompetency: 71, interviewReadiness: 68, careerReadiness: 66, verifiedSkillCount: 3,
    verifiedSkills: [{ skill: 'Python', score: 74 }, { skill: 'SQL', score: 80 }, { skill: 'Data Analysis', score: 72 }],
    visibility: 'public',
  },
];

export const mockCandidateSkills: Record<string, Array<{ skill: string; score: number }>> = {};

candidateProfiles.forEach(c => {
  mockCandidateSkills[c.id] = c.verifiedSkills;
});

function getCandidateSkillScore(candidateId: string, skillName: string): number {
  const scores = mockCandidateSkills[candidateId];
  if (!scores) return 0;
  const found = scores.find(s => s.skill === skillName);
  if (found) return found.score;
  const student = allStudents.find(s => s.id === candidateId);
  if (student && student.skills.length > 0) {
    const sk = student.skills.find(s => s.name === skillName);
    if (sk) return sk.currentLevel;
  }
  return Math.floor(Math.random() * 40) + 35;
}

export function matchCandidateToJob(
  candidateId: string,
  job: JobOpening
): CandidateMatchResult | null {
  const candidate = candidateProfiles.find(c => c.id === candidateId);
  if (!candidate || candidate.visibility === 'private') return null;

  const skillMatches = job.requiredSkills.map(req => {
    const candidateScore = getCandidateSkillScore(candidateId, req.skill);
    const gap = candidateScore - req.minimumCompetency;
    return {
      skill: req.skill,
      candidateScore,
      requiredScore: req.minimumCompetency,
      meetsRequired: candidateScore >= req.minimumCompetency,
      gap,
    };
  });

  const requiredSkills = skillMatches.filter(s => {
    const req = job.requiredSkills.find(r => r.skill === s.skill);
    return req?.type === 'required';
  });

  const failsRequired = requiredSkills.filter(s => !s.meetsRequired);
  const category: MatchCategory = failsRequired.length === 0 ? 'eligible' : 'near-match';

  const totalRequiredScore = requiredSkills.reduce((a, s) => a + s.requiredScore, 0) || 1;
  const totalCandidateScore = requiredSkills.reduce((a, s) => a + Math.min(s.candidateScore, s.requiredScore * 1.5), 0);
  const skillMatchScore = Math.min(100, Math.round((totalCandidateScore / totalRequiredScore) * 100));

  return {
    candidateId: candidate.id,
    candidateName: candidate.name,
    targetRole: candidate.targetRole,
    overallCompetency: candidate.overallCompetency,
    interviewReadiness: candidate.interviewReadiness,
    careerReadiness: candidate.careerReadiness,
    verifiedSkillCount: candidate.verifiedSkillCount,
    skillMatches,
    skillMatchScore,
    category,
    failsRequired,
  };
}

export function matchAllCandidates(job: JobOpening): CandidateMatchResult[] {
  return candidateProfiles
    .map(c => matchCandidateToJob(c.id, job))
    .filter((r): r is CandidateMatchResult => r !== null)
    .sort((a, b) => {
      const catOrder = { eligible: 0, 'near-match': 1, 'not-eligible': 2 };
      const catDiff = catOrder[a.category] - catOrder[b.category];
      if (catDiff !== 0) return catDiff;
      return b.skillMatchScore - a.skillMatchScore;
    });
}

export function getCandidateProfile(candidateId: string) {
  return candidateProfiles.find(c => c.id === candidateId) || null;
}

export const initialJobs: JobOpening[] = [
  {
    id: 'j1',
    companyId: 'c1',
    title: 'Junior Full Stack Developer',
    description: 'We are looking for a motivated Junior Full Stack Developer to join our engineering team. You will work on building and maintaining web applications using modern JavaScript frameworks.',
    location: 'Chennai, India',
    workMode: 'Hybrid',
    experience: 'Fresher',
    status: 'published',
    requiredSkills: [
      { id: 'sk1', skill: 'React', minimumCompetency: 75, type: 'required' },
      { id: 'sk2', skill: 'JavaScript', minimumCompetency: 70, type: 'required' },
      { id: 'sk3', skill: 'Node.js', minimumCompetency: 65, type: 'required' },
      { id: 'sk4', skill: 'SQL', minimumCompetency: 70, type: 'required' },
      { id: 'sk5', skill: 'Problem Solving', minimumCompetency: 65, type: 'required' },
      { id: 'sk6', skill: 'Docker', minimumCompetency: 60, type: 'optional' },
      { id: 'sk7', skill: 'Git', minimumCompetency: 60, type: 'optional' },
    ],
    createdAt: '2026-08-15',
    updatedAt: '2026-08-15',
  },
  {
    id: 'j2',
    companyId: 'c1',
    title: 'Data Analyst',
    description: 'Join our analytics team to turn data into actionable insights. Work with SQL, Python, and visualization tools to support business decisions.',
    location: 'Chennai, India',
    workMode: 'On-site',
    experience: '0-1 years',
    status: 'published',
    requiredSkills: [
      { id: 'sk8', skill: 'SQL', minimumCompetency: 75, type: 'required' },
      { id: 'sk9', skill: 'Python', minimumCompetency: 70, type: 'required' },
      { id: 'sk10', skill: 'Data Analysis', minimumCompetency: 65, type: 'required' },
      { id: 'sk11', skill: 'Git', minimumCompetency: 55, type: 'optional' },
    ],
    createdAt: '2026-08-12',
    updatedAt: '2026-08-12',
  },
];

export const initialShortlisted: ShortlistedCandidate[] = [
  {
    id: 'sl1', jobId: 'j1', candidateId: 'u9', candidateName: 'Karthik Menon', companyId: 'c1',
    matchScore: 92, shortlistedAt: '2026-08-20', recruiter: 'Meera Nair',
  },
  {
    id: 'sl2', jobId: 'j1', candidateId: 'u10', candidateName: 'Divya Iyer', companyId: 'c1',
    matchScore: 86, shortlistedAt: '2026-08-20', recruiter: 'Meera Nair',
  },
];

export const initialInvitations: InterviewInvitation[] = [
  {
    id: 'inv1', jobId: 'j1', candidateId: 'u9', candidateName: 'Karthik Menon', companyId: 'c1',
    shortlistId: 'sl1', interviewType: 'Face-to-Face', location: 'ABC Technologies, Chennai',
    date: '2026-09-15', time: '10:30 AM', duration: '60 minutes', round: 'Technical',
    instructions: 'Bring your resume and ID proof. Be prepared for a live coding session.',
    status: 'scheduled', sentAt: '2026-08-21',
  },
];

export const initialFeedback: InterviewFeedbackEntry[] = [];

export function calculateSkillMatchScore(
  candidateId: string,
  requiredSkills: Array<{ skill: string; minimumCompetency: number; type: string }>
): number {
  const required = requiredSkills.filter(s => s.type === 'required');
  if (required.length === 0) return 0;
  let totalWeightedScore = 0;
  let totalRequired = 0;
  for (const req of required) {
    const score = getCandidateSkillScore(candidateId, req.skill);
    totalWeightedScore += Math.min(score, req.minimumCompetency * 1.5);
    totalRequired += req.minimumCompetency;
  }
  return Math.min(100, Math.round((totalWeightedScore / (totalRequired || 1)) * 100));
}
