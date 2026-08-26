export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type CompetencyStatus = 'strong' | 'developing' | 'needs-attention';

export type UserRole = 'student' | 'faculty' | 'recruiter';

export type AssessmentLevel = 'knowledge' | 'application' | 'practical';

export type QuestionType = 'mcq' | 'scenario' | 'code' | 'debug' | 'short-answer';

export type AssessmentStatus = 'in-progress' | 'completed' | 'terminated';

export type ProfileVisibility = 'public' | 'private' | 'unlisted';

export type LearningContentType = 'video' | 'notes' | 'example' | 'practice' | 'quiz' | 'assessment';

export type InterviewCategory = 'knowledge' | 'practical' | 'problem-solving' | 'communication';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  education?: string;
  course?: string;
  year?: string;
  experienceLevel?: SkillLevel;
  careerGoal?: string;
  learningPreference?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  currentLevel: number;
  requiredLevel: number;
  status: CompetencyStatus;
  verified?: boolean;
  lastVerified?: string;
}

export interface LearningModule {
  id: string;
  title: string;
  skill: string;
  status: 'completed' | 'in-progress' | 'upcoming' | 'locked';
  difficulty: SkillLevel;
  estimatedTime: number;
  progress: number;
  description: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  concept: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface AssessmentResult {
  id: string;
  skill: string;
  score: number;
  maxScore: number;
  date: string;
  type: 'adaptive' | 'practical';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'assessment' | 'learning' | 'gap' | 'achievement' | 'faculty';
  read: boolean;
  timestamp: string;
}

export interface StudentSummary {
  id: string;
  name: string;
  email: string;
  careerGoal: string;
  overallCompetency: number;
  atRisk: boolean;
  skills: Skill[];
  lastActive: string;
}

export interface CompetencyHeatmapEntry {
  studentId: string;
  studentName: string;
  skills: Record<string, number>;
}

export interface DailyPlan {
  title: string;
  duration: number;
  type: 'lesson' | 'practice' | 'quiz';
}

export interface PracticalChallenge {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  skill: string;
  difficulty: SkillLevel;
}

export interface PracticalEvaluation {
  technicalAccuracy: number;
  problemSolving: number;
  codeQuality: number;
  overallCompetency: number;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AIContext {
  student: { name: string; targetRole: string };
  competencies: Record<string, number>;
  skillGaps: string[];
  currentTopic: string;
  currentLesson: string;
  recentPerformance: {
    quizScore: number;
    recentMistakes: string[];
  };
}

export interface AITutorRequest {
  message: string;
  context: AIContext;
  conversation: Array<{ role: 'user' | 'assistant'; content: string }>;
}

// ── Phase 1: Course/Certificate ──────────────────────────────────

export type CoursePlatform = 'Udemy' | 'Coursera' | 'NPTEL' | 'edX' | 'Other';

export type CertificateStatus = 'submitted' | 'skillbridge-verified' | 'pending';

export interface CourseSubmission {
  id: string;
  platform: CoursePlatform;
  courseName: string;
  courseUrl: string;
  certificateUrl: string;
  completionDate: string;
  skillsLearned: string[];
  certificateImage?: string;
  status: CertificateStatus;
  submittedAt: string;
}

export interface ExtractedSkill {
  name: string;
  confidence: number;
  category: string;
}

// ── Phase 1: Competency Assessment ──────────────────────────────

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: QuestionType;
  level: AssessmentLevel;
  options?: string[];
  correctIndex?: number;
  code?: string;
  expectedOutput?: string;
  scenario?: string;
  rubric?: string[];
  explanation: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface AssessmentAttempt {
  id: string;
  questionId: string;
  answer: string | number;
  correct: boolean;
  timeSpent: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
}

export interface CompetencyAssessment {
  id: string;
  skill: string;
  courseSubmissionId?: string;
  questions: AssessmentQuestion[];
  attempts: AssessmentAttempt[];
  competencyEstimate: number;
  status: AssessmentStatus;
  startedAt: string;
  completedAt?: string;
  warnings: number;
  maxWarnings: number;
  level: 'Novice' | 'Developing' | 'Proficient' | 'Advanced';
}

export interface CompetencyReport {
  skill: string;
  score: number;
  level: string;
  topicBreakdown: Array<{
    topic: string;
    score: number;
    status: string;
    assessment: string;
  }>;
  overallCompetency: number;
  overallLevel: string;
  priorityGaps: Array<{
    skill: string;
    current: number;
    target: number;
    gap: number;
  }>;
}

// ── Phase 2: Learning Content ───────────────────────────────────

export interface LearningContent {
  id: string;
  type: LearningContentType;
  title: string;
  description: string;
  duration?: number;
  skill: string;
  topic: string;
  difficulty: SkillLevel;
  url?: string;
  content?: string;
  questions?: QuizQuestion[];
  targetRole: string;
}

export interface PersonalizedLearningPlan {
  id: string;
  skillGap: string;
  currentLevel: number;
  targetLevel: number;
  contents: LearningContent[];
  progress: number;
  startedAt: string;
  completedAt?: string;
}

// ── Phase 3: Verified Skill ─────────────────────────────────────

export interface VerifiedSkill {
  id: string;
  skill: string;
  score: number;
  level: string;
  verificationDate: string;
  assessmentId: string;
  verificationId: string;
  evidence: string[];
  expiryDate?: string;
  courseSubmissionId?: string;
}

export interface DigitalCredential {
  id: string;
  verifiedSkillId: string;
  studentName: string;
  targetRole: string;
  skill: string;
  score: number;
  level: string;
  verificationDate: string;
  verificationId: string;
  evidence: string[];
}

// ── Phase 4: Resume / Profile ───────────────────────────────────

export interface ResumeProfile {
  id: string;
  summary: string;
  technicalSkills: Array<{
    name: string;
    verified: boolean;
    score?: number;
  }>;
  verifiedSkills: VerifiedSkill[];
  education: string;
  certifications: CourseSubmission[];
  targetRole: string;
}

export interface PublicProfile {
  username: string;
  name: string;
  targetRole: string;
  verifiedSkills: VerifiedSkill[];
  overallCompetency: number;
  interviewReadiness: number;
  careerReadiness: number;
  visibility: ProfileVisibility;
}

// ── Phase 5: Interview ──────────────────────────────────────────

export interface InterviewQuestion {
  id: string;
  question: string;
  category: InterviewCategory;
  skill: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  expectedAnswer?: string;
}

export interface InterviewResponse {
  questionId: string;
  answer: string;
  category: InterviewCategory;
}

export interface InterviewEvaluation {
  category: InterviewCategory;
  score: number;
  feedback: string;
}

export interface InterviewSession {
  id: string;
  skill: string;
  targetRole: string;
  questions: InterviewQuestion[];
  responses: InterviewResponse[];
  evaluations: InterviewEvaluation[];
  overallScore: number;
  readiness: number;
  startedAt: string;
  completedAt?: string;
}

// ── Phase 6: Career Readiness ───────────────────────────────────

export interface CareerReadinessProfile {
  overallReadiness: number;
  technicalSkills: number;
  practicalSkills: number;
  problemSolving: number;
  interviewReadiness: number;
  communication: number;
  missingSkills: Array<{
    name: string;
    level: 'critical' | 'moderate';
    currentLevel: number;
    requiredLevel: number;
  }>;
  recommendedNextSteps: string[];
}

export interface ProjectRecommendation {
  id: string;
  title: string;
  description: string;
  difficulty: SkillLevel;
  estimatedTime: number;
  skillsCovered: string[];
  requirements: string[];
  expectedOutcome: string;
  reason: string;
}

// ── Recruiter / Company Portal ──────────────────────────────────

export type WorkMode = 'On-site' | 'Hybrid' | 'Remote';
export type ExperienceLevel = 'Fresher' | '0-1 years' | '1-3 years' | '3-5 years' | '5+ years';
export type JobStatus = 'draft' | 'published' | 'paused' | 'closed';
export type SkillRequirementType = 'required' | 'optional';
export type MatchCategory = 'eligible' | 'near-match' | 'not-eligible';
export type InterviewType = 'Face-to-Face' | 'Online' | 'Phone';
export type InterviewRound = 'Technical' | 'HR' | 'Managerial' | 'Final' | 'Custom';
export type InterviewStatus = 'invited' | 'accepted' | 'reschedule-requested' | 'declined' | 'scheduled' | 'completed' | 'selected' | 'rejected' | 'next-round' | 'on-hold';
export type FinalDecision = 'Selected' | 'Rejected' | 'Next Round' | 'On Hold';
export type JobApplicationStatus = 'shortlisted' | 'invited' | 'applied';

export interface CompanyProfile {
  id: string;
  name: string;
  logo: string;
  industry: string;
  description: string;
  website: string;
  location: string;
  contactPerson: string;
  contactEmail: string;
}

export interface SkillRequirement {
  id: string;
  skill: string;
  minimumCompetency: number;
  type: SkillRequirementType;
}

export interface JobOpening {
  id: string;
  companyId: string;
  title: string;
  description: string;
  location: string;
  workMode: WorkMode;
  experience: ExperienceLevel;
  status: JobStatus;
  requiredSkills: SkillRequirement[];
  createdAt: string;
  updatedAt: string;
}

export interface CandidateMatchResult {
  candidateId: string;
  candidateName: string;
  targetRole: string;
  overallCompetency: number;
  interviewReadiness: number;
  careerReadiness: number;
  verifiedSkillCount: number;
  skillMatches: Array<{
    skill: string;
    candidateScore: number;
    requiredScore: number;
    meetsRequired: boolean;
    gap: number;
  }>;
  skillMatchScore: number;
  category: MatchCategory;
  failsRequired: Array<{
    skill: string;
    candidateScore: number;
    requiredScore: number;
    gap: number;
  }>;
}

export interface ShortlistedCandidate {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  companyId: string;
  matchScore: number;
  shortlistedAt: string;
  recruiter: string;
}

export interface InterviewInvitation {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  companyId: string;
  shortlistId: string;
  interviewType: InterviewType;
  location: string;
  date: string;
  time: string;
  duration: string;
  round: InterviewRound;
  customRoundName?: string;
  instructions?: string;
  status: InterviewStatus;
  sentAt: string;
}

export interface InterviewFeedbackEntry {
  id: string;
  invitationId: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  companyId: string;
  round: InterviewRound;
  ratings: {
    technicalKnowledge: number;
    problemSolving: number;
    communication: number;
    practicalUnderstanding: number;
    cultureFit: number;
    overallPerformance: number;
  };
  strengths: string;
  areasForImprovement: string;
  recruiterNotes: string;
  decision: FinalDecision;
  recordedAt: string;
  roundNumber: number;
}

export interface InterviewTimelineEntry {
  stage: string;
  date: string;
  status: 'completed' | 'current' | 'upcoming';
  detail?: string;
}

export interface RecruiterUser {
  id: string;
  name: string;
  email: string;
  role: 'recruiter';
  companyId: string;
}

// ═══════════════════════════════════════════════════════════════════
// India Statistical System Capacity Building Platform Types
// ═══════════════════════════════════════════════════════════════════

export type GovernmentRole =
  | 'Statistical Officer'
  | 'Data Analyst'
  | 'Survey Officer'
  | 'Research Officer'
  | 'Data Manager'
  | 'Statistical Investigator'
  | 'Senior Statistical Officer'
  | 'Joint Director Statistics'
  | 'Additional Director Statistics'
  | 'Deputy Director Statistics';

export type CompetencyPriority = 'low' | 'medium' | 'high' | 'critical';

export type ProficiencyLevel = 'Novice' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type MaterialStatus = 'uploading' | 'processing' | 'ready' | 'failed';

export type QuestionApprovalStatus = 'pending' | 'approved' | 'rejected' | 'needs-revision';

export type LearningProviderType = 'igot' | 'internal' | 'external';

// ── Configurable Competency Framework ─────────────────────────────

export interface CompetencyCategory {
  id: string;
  name: string;
  description: string;
  competencies: CompetencyDefinition[];
}

export interface CompetencyDefinition {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  proficiencyLevels: ProficiencyLevel[];
  isActive: boolean;
}

export interface RoleCompetencyRequirement {
  id: string;
  role: GovernmentRole;
  competencyId: string;
  competencyName: string;
  requiredLevel: number; // percentage 0-100
  priority: CompetencyPriority;
}

export interface OfficialProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  ministry: string;
  designation: string;
  governmentRole: GovernmentRole;
  experienceLevel: string;
  areaOfWork: string;
  avatar?: string;
  competencyScores: Record<string, number>; // competencyId -> score
  baselineCompleted: boolean;
}

// ── Competency Gap ────────────────────────────────────────────────

export interface CompetencyGap {
  id: string;
  competencyId: string;
  competencyName: string;
  category: string;
  currentScore: number;
  requiredScore: number;
  gapPercentage: number;
  priority: CompetencyPriority;
  aiInsight: string;
}

// ── iGOT Karmayogi Integration ────────────────────────────────────

export interface LearningProvider {
  type: LearningProviderType;
  name: string;
  searchCourses: (query: string, competencies: string[]) => Promise<ExternalCourse[]>;
  getCourseDetails: (courseId: string) => Promise<ExternalCourse | null>;
}

export interface ExternalCourse {
  id: string;
  title: string;
  provider: string;
  providerType: LearningProviderType;
  description: string;
  competencies: string[];
  duration: string;
  difficulty: SkillLevel;
  url: string;
  relevanceScore?: number;
  completionStatus?: 'not-started' | 'in-progress' | 'completed';
}

// ── Learning Material Upload ──────────────────────────────────────

export interface LearningMaterial {
  id: string;
  title: string;
  description: string;
  file: File | null;
  fileName: string;
  fileType: string;
  fileSize: number;
  competency: string;
  topics: string[];
  uploadedBy: string;
  uploadedAt: string;
  status: MaterialStatus;
  extractedText?: string;
  detectedTopics?: string[];
  processedContent?: string;
}

// ── Question Bank ─────────────────────────────────────────────────

export interface BankQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  competency: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionType: 'mcq' | 'true-false' | 'scenario';
  sourceMaterial?: string;
  createdBy: string;
  isAiGenerated: boolean;
  approvalStatus: QuestionApprovalStatus;
  createdAt: string;
}

// ── Quiz Builder ──────────────────────────────────────────────────

export interface BuiltQuiz {
  id: string;
  title: string;
  competency: string;
  topics: string[];
  questionCount: number;
  passingScore: number;
  timeLimit: number; // minutes
  attemptLimit: number;
  questions: BankQuestion[];
  status: 'draft' | 'published' | 'closed';
  createdBy: string;
  createdAt: string;
}

// ── Before vs After ──────────────────────────────────────────────

export interface CompetencyImprovement {
  competency: string;
  beforeScore: number;
  afterScore: number;
  improvement: number; // percentage points
  improvementDate: string;
  learningPath: string;
}

// ── Organizational Analytics ──────────────────────────────────────

export interface OrganizationAnalytics {
  totalOfficials: number;
  assessmentsCompleted: number;
  averageCompetency: number;
  criticalGaps: number;
  trainingCompletion: number;
  averageImprovement: number;
  departmentWise: Array<{
    department: string;
    officials: number;
    averageCompetency: number;
    criticalGaps: number;
  }>;
}
