import type { StudentSummary, Skill } from '@/types';

// ── Faculty Profile ──────────────────────────────────────────────

export interface FacultyProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  year: string;
  section: string;
  academicYear: string;
}

export const facultyProfile: FacultyProfile = {
  id: 'f1',
  name: 'Dr. Priya Sharma',
  email: 'priya.sharma@college.edu',
  department: 'Computer Science',
  year: '3rd Year',
  section: 'A',
  academicYear: '2025-2026',
};

// ── Expanded Student List ────────────────────────────────────────

export interface FacultyStudent extends StudentSummary {
  department: string;
  year: string;
  section: string;
  skills: Skill[];
  assessmentsTaken: number;
  learningProgress: number;
  interventionStatus: 'none' | 'active' | 'completed';
  interviewReadiness: number;
  careerReadiness: number;
  verificationCount: number;
  lastAssessmentDate: string;
  performanceTrend: 'improving' | 'stable' | 'declining';
  inactiveDays: number;
}

export const allFacultyStudents: FacultyStudent[] = [
  { id: 'u1', name: 'Sasi', email: 'sasi@college.edu', careerGoal: 'Full Stack Developer', overallCompetency: 58, atRisk: false, skills: [], lastActive: '2026-08-25', department: 'Computer Science', year: '3rd Year', section: 'A', assessmentsTaken: 5, learningProgress: 65, interventionStatus: 'none', interviewReadiness: 55, careerReadiness: 58, verificationCount: 2, lastAssessmentDate: '2026-08-22', performanceTrend: 'improving', inactiveDays: 1 },
  { id: 'u2', name: 'Aisha Khan', email: 'aisha@college.edu', careerGoal: 'Data Analyst', overallCompetency: 72, atRisk: false, skills: [], lastActive: '2026-08-25', department: 'Computer Science', year: '3rd Year', section: 'A', assessmentsTaken: 6, learningProgress: 78, interventionStatus: 'none', interviewReadiness: 68, careerReadiness: 70, verificationCount: 3, lastAssessmentDate: '2026-08-24', performanceTrend: 'improving', inactiveDays: 1 },
  { id: 'u3', name: 'Rahul Verma', email: 'rahul@college.edu', careerGoal: 'AI/ML Engineer', overallCompetency: 45, atRisk: true, skills: [], lastActive: '2026-08-24', department: 'Computer Science', year: '3rd Year', section: 'A', assessmentsTaken: 4, learningProgress: 42, interventionStatus: 'active', interviewReadiness: 38, careerReadiness: 40, verificationCount: 1, lastAssessmentDate: '2026-08-20', performanceTrend: 'declining', inactiveDays: 2 },
  { id: 'u4', name: 'Priya Patel', email: 'priya.p@college.edu', careerGoal: 'Cloud Engineer', overallCompetency: 63, atRisk: false, skills: [], lastActive: '2026-08-25', department: 'Computer Science', year: '3rd Year', section: 'A', assessmentsTaken: 5, learningProgress: 70, interventionStatus: 'none', interviewReadiness: 60, careerReadiness: 62, verificationCount: 2, lastAssessmentDate: '2026-08-23', performanceTrend: 'stable', inactiveDays: 1 },
  { id: 'u5', name: 'Arjun Singh', email: 'arjun@college.edu', careerGoal: 'Full Stack Developer', overallCompetency: 38, atRisk: true, skills: [], lastActive: '2026-08-22', department: 'Computer Science', year: '3rd Year', section: 'A', assessmentsTaken: 3, learningProgress: 30, interventionStatus: 'active', interviewReadiness: 28, careerReadiness: 32, verificationCount: 0, lastAssessmentDate: '2026-08-18', performanceTrend: 'declining', inactiveDays: 4 },
  { id: 'u6', name: 'Neha Gupta', email: 'neha@college.edu', careerGoal: 'Cybersecurity Analyst', overallCompetency: 81, atRisk: false, skills: [], lastActive: '2026-08-25', department: 'Computer Science', year: '3rd Year', section: 'A', assessmentsTaken: 7, learningProgress: 88, interventionStatus: 'none', interviewReadiness: 78, careerReadiness: 80, verificationCount: 4, lastAssessmentDate: '2026-08-25', performanceTrend: 'improving', inactiveDays: 1 },
  { id: 'u7', name: 'Vikram Das', email: 'vikram@college.edu', careerGoal: 'Business Analyst', overallCompetency: 55, atRisk: false, skills: [], lastActive: '2026-08-24', department: 'Computer Science', year: '3rd Year', section: 'A', assessmentsTaken: 4, learningProgress: 58, interventionStatus: 'none', interviewReadiness: 50, careerReadiness: 52, verificationCount: 1, lastAssessmentDate: '2026-08-22', performanceTrend: 'stable', inactiveDays: 2 },
  { id: 'u8', name: 'Sneha Reddy', email: 'sneha@college.edu', careerGoal: 'Full Stack Developer', overallCompetency: 69, atRisk: false, skills: [], lastActive: '2026-08-25', department: 'Computer Science', year: '3rd Year', section: 'A', assessmentsTaken: 5, learningProgress: 72, interventionStatus: 'none', interviewReadiness: 65, careerReadiness: 67, verificationCount: 3, lastAssessmentDate: '2026-08-24', performanceTrend: 'improving', inactiveDays: 1 },
  { id: 'u9', name: 'Karthik Menon', email: 'karthik@college.edu', careerGoal: 'Software Developer', overallCompetency: 42, atRisk: true, skills: [], lastActive: '2026-08-23', department: 'Computer Science', year: '3rd Year', section: 'A', assessmentsTaken: 3, learningProgress: 35, interventionStatus: 'active', interviewReadiness: 32, careerReadiness: 35, verificationCount: 0, lastAssessmentDate: '2026-08-19', performanceTrend: 'declining', inactiveDays: 3 },
  { id: 'u10', name: 'Divya Nair', email: 'divya@college.edu', careerGoal: 'Data Analyst', overallCompetency: 74, atRisk: false, skills: [], lastActive: '2026-08-25', department: 'Computer Science', year: '3rd Year', section: 'A', assessmentsTaken: 6, learningProgress: 80, interventionStatus: 'none', interviewReadiness: 70, careerReadiness: 72, verificationCount: 3, lastAssessmentDate: '2026-08-24', performanceTrend: 'improving', inactiveDays: 1 },
  { id: 'u11', name: 'Rohan Joshi', email: 'rohan@college.edu', careerGoal: 'Cloud Engineer', overallCompetency: 51, atRisk: false, skills: [], lastActive: '2026-08-24', department: 'Computer Science', year: '3rd Year', section: 'A', assessmentsTaken: 4, learningProgress: 55, interventionStatus: 'none', interviewReadiness: 45, careerReadiness: 48, verificationCount: 1, lastAssessmentDate: '2026-08-21', performanceTrend: 'stable', inactiveDays: 2 },
  { id: 'u12', name: 'Ananya Iyer', email: 'ananya@college.edu', careerGoal: 'Full Stack Developer', overallCompetency: 67, atRisk: false, skills: [], lastActive: '2026-08-25', department: 'Computer Science', year: '3rd Year', section: 'A', assessmentsTaken: 5, learningProgress: 70, interventionStatus: 'none', interviewReadiness: 62, careerReadiness: 65, verificationCount: 2, lastAssessmentDate: '2026-08-23', performanceTrend: 'improving', inactiveDays: 1 },
  { id: 'u13', name: 'Aditya Bose', email: 'aditya@college.edu', careerGoal: 'AI/ML Engineer', overallCompetency: 48, atRisk: true, skills: [], lastActive: '2026-08-23', department: 'Computer Science', year: '3rd Year', section: 'A', assessmentsTaken: 4, learningProgress: 40, interventionStatus: 'active', interviewReadiness: 35, careerReadiness: 38, verificationCount: 0, lastAssessmentDate: '2026-08-20', performanceTrend: 'declining', inactiveDays: 3 },
  { id: 'u14', name: 'Meera Rao', email: 'meera@college.edu', careerGoal: 'Software Developer', overallCompetency: 76, atRisk: false, skills: [], lastActive: '2026-08-25', department: 'Computer Science', year: '3rd Year', section: 'A', assessmentsTaken: 7, learningProgress: 82, interventionStatus: 'none', interviewReadiness: 72, careerReadiness: 75, verificationCount: 4, lastAssessmentDate: '2026-08-25', performanceTrend: 'improving', inactiveDays: 1 },
  { id: 'u15', name: 'Nikhil Sharma', email: 'nikhil@college.edu', careerGoal: 'Full Stack Developer', overallCompetency: 56, atRisk: false, skills: [], lastActive: '2026-08-24', department: 'Computer Science', year: '3rd Year', section: 'A', assessmentsTaken: 4, learningProgress: 60, interventionStatus: 'none', interviewReadiness: 50, careerReadiness: 54, verificationCount: 1, lastAssessmentDate: '2026-08-22', performanceTrend: 'stable', inactiveDays: 2 },
  { id: 'u16', name: 'Pooja Malhotra', email: 'pooja@college.edu', careerGoal: 'Data Analyst', overallCompetency: 70, atRisk: false, skills: [], lastActive: '2026-08-25', department: 'Computer Science', year: '3rd Year', section: 'A', assessmentsTaken: 6, learningProgress: 75, interventionStatus: 'none', interviewReadiness: 66, careerReadiness: 68, verificationCount: 3, lastAssessmentDate: '2026-08-24', performanceTrend: 'improving', inactiveDays: 1 },
  { id: 'u17', name: 'Varun Kumar', email: 'varun@college.edu', careerGoal: 'Software Developer', overallCompetency: 44, atRisk: true, skills: [], lastActive: '2026-08-22', department: 'Computer Science', year: '3rd Year', section: 'A', assessmentsTaken: 3, learningProgress: 38, interventionStatus: 'active', interviewReadiness: 30, careerReadiness: 34, verificationCount: 0, lastAssessmentDate: '2026-08-18', performanceTrend: 'declining', inactiveDays: 4 },
  { id: 'u18', name: 'Ishita Chakraborty', email: 'ishita@college.edu', careerGoal: 'Cloud Engineer', overallCompetency: 65, atRisk: false, skills: [], lastActive: '2026-08-25', department: 'Computer Science', year: '3rd Year', section: 'A', assessmentsTaken: 5, learningProgress: 68, interventionStatus: 'none', interviewReadiness: 58, careerReadiness: 62, verificationCount: 2, lastAssessmentDate: '2026-08-23', performanceTrend: 'improving', inactiveDays: 1 },
  { id: 'u19', name: 'Siddharth Jain', email: 'sid@college.edu', careerGoal: 'Full Stack Developer', overallCompetency: 39, atRisk: true, skills: [], lastActive: '2026-08-21', department: 'Computer Science', year: '3rd Year', section: 'A', assessmentsTaken: 2, learningProgress: 28, interventionStatus: 'active', interviewReadiness: 25, careerReadiness: 30, verificationCount: 0, lastAssessmentDate: '2026-08-15', performanceTrend: 'declining', inactiveDays: 5 },
  { id: 'u20', name: 'Tanvi Deshmukh', email: 'tanvi@college.edu', careerGoal: 'AI/ML Engineer', overallCompetency: 73, atRisk: false, skills: [], lastActive: '2026-08-25', department: 'Computer Science', year: '3rd Year', section: 'A', assessmentsTaken: 6, learningProgress: 78, interventionStatus: 'none', interviewReadiness: 68, careerReadiness: 72, verificationCount: 3, lastAssessmentDate: '2026-08-24', performanceTrend: 'improving', inactiveDays: 1 },
];

// ── Skill Gap Analysis ───────────────────────────────────────────

export type SkillGapStatus = 'strong' | 'developing' | 'needs-support' | 'critical';

export interface SkillTopicAnalysis {
  topic: string;
  averageScore: number;
  studentsBelowThreshold: number;
  assessmentCount: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface SkillGapEntry {
  skill: string;
  category: string;
  studentsAssessed: number;
  averageScore: number;
  targetScore: number;
  gap: number;
  status: SkillGapStatus;
  topics: SkillTopicAnalysis[];
}

export const skillGapData: SkillGapEntry[] = [
  {
    skill: 'Python',
    category: 'Programming',
    studentsAssessed: 20,
    averageScore: 78,
    targetScore: 80,
    gap: 2,
    status: 'strong',
    topics: [
      { topic: 'Variables & Types', averageScore: 88, studentsBelowThreshold: 2, assessmentCount: 20, trend: 'improving' },
      { topic: 'Control Flow', averageScore: 82, studentsBelowThreshold: 4, assessmentCount: 20, trend: 'stable' },
      { topic: 'Functions', averageScore: 79, studentsBelowThreshold: 6, assessmentCount: 19, trend: 'improving' },
      { topic: 'OOP Concepts', averageScore: 74, studentsBelowThreshold: 8, assessmentCount: 18, trend: 'stable' },
      { topic: 'File Handling', averageScore: 70, studentsBelowThreshold: 9, assessmentCount: 17, trend: 'declining' },
      { topic: 'Decorators', averageScore: 55, studentsBelowThreshold: 14, assessmentCount: 15, trend: 'declining' },
    ],
  },
  {
    skill: 'SQL',
    category: 'Database',
    studentsAssessed: 20,
    averageScore: 71,
    targetScore: 80,
    gap: 9,
    status: 'developing',
    topics: [
      { topic: 'Basic Queries', averageScore: 85, studentsBelowThreshold: 3, assessmentCount: 20, trend: 'improving' },
      { topic: 'Joins', averageScore: 72, studentsBelowThreshold: 8, assessmentCount: 20, trend: 'stable' },
      { topic: 'Subqueries', averageScore: 65, studentsBelowThreshold: 11, assessmentCount: 18, trend: 'declining' },
      { topic: 'Complex Joins', averageScore: 52, studentsBelowThreshold: 15, assessmentCount: 16, trend: 'declining' },
      { topic: 'Indexing', averageScore: 48, studentsBelowThreshold: 16, assessmentCount: 14, trend: 'declining' },
      { topic: 'Optimization', averageScore: 45, studentsBelowThreshold: 17, assessmentCount: 12, trend: 'declining' },
    ],
  },
  {
    skill: 'Data Structures',
    category: 'Computer Science',
    studentsAssessed: 19,
    averageScore: 49,
    targetScore: 80,
    gap: 31,
    status: 'critical',
    topics: [
      { topic: 'Arrays', averageScore: 78, studentsBelowThreshold: 5, assessmentCount: 19, trend: 'stable' },
      { topic: 'Linked Lists', averageScore: 62, studentsBelowThreshold: 10, assessmentCount: 18, trend: 'stable' },
      { topic: 'Stacks', averageScore: 54, studentsBelowThreshold: 13, assessmentCount: 17, trend: 'declining' },
      { topic: 'Queues', averageScore: 51, studentsBelowThreshold: 14, assessmentCount: 17, trend: 'declining' },
      { topic: 'Trees', averageScore: 38, studentsBelowThreshold: 17, assessmentCount: 16, trend: 'declining' },
      { topic: 'Graphs', averageScore: 31, studentsBelowThreshold: 18, assessmentCount: 14, trend: 'declining' },
      { topic: 'Dynamic Programming', averageScore: 24, studentsBelowThreshold: 19, assessmentCount: 12, trend: 'declining' },
    ],
  },
  {
    skill: 'React',
    category: 'Web Development',
    studentsAssessed: 18,
    averageScore: 62,
    targetScore: 80,
    gap: 18,
    status: 'developing',
    topics: [
      { topic: 'JSX & Components', averageScore: 78, studentsBelowThreshold: 4, assessmentCount: 18, trend: 'improving' },
      { topic: 'Props & State', averageScore: 70, studentsBelowThreshold: 7, assessmentCount: 18, trend: 'stable' },
      { topic: 'Hooks', averageScore: 58, studentsBelowThreshold: 11, assessmentCount: 16, trend: 'declining' },
      { topic: 'State Management', averageScore: 52, studentsBelowThreshold: 13, assessmentCount: 15, trend: 'declining' },
      { topic: 'API Integration', averageScore: 50, studentsBelowThreshold: 14, assessmentCount: 14, trend: 'declining' },
      { topic: 'Performance', averageScore: 42, studentsBelowThreshold: 16, assessmentCount: 12, trend: 'declining' },
    ],
  },
  {
    skill: 'Git',
    category: 'DevOps',
    studentsAssessed: 20,
    averageScore: 43,
    targetScore: 75,
    gap: 32,
    status: 'critical',
    topics: [
      { topic: 'Basic Commands', averageScore: 68, studentsBelowThreshold: 8, assessmentCount: 20, trend: 'stable' },
      { topic: 'Branching', averageScore: 52, studentsBelowThreshold: 13, assessmentCount: 18, trend: 'declining' },
      { topic: 'Merging', averageScore: 40, studentsBelowThreshold: 17, assessmentCount: 16, trend: 'declining' },
      { topic: 'Conflict Resolution', averageScore: 32, studentsBelowThreshold: 19, assessmentCount: 14, trend: 'declining' },
      { topic: 'Advanced Workflows', averageScore: 22, studentsBelowThreshold: 20, assessmentCount: 10, trend: 'declining' },
    ],
  },
  {
    skill: 'Java',
    category: 'Programming',
    studentsAssessed: 16,
    averageScore: 58,
    targetScore: 75,
    gap: 17,
    status: 'developing',
    topics: [
      { topic: 'Syntax & Basics', averageScore: 75, studentsBelowThreshold: 4, assessmentCount: 16, trend: 'improving' },
      { topic: 'OOP', averageScore: 62, studentsBelowThreshold: 8, assessmentCount: 15, trend: 'stable' },
      { topic: 'Collections', averageScore: 50, studentsBelowThreshold: 11, assessmentCount: 14, trend: 'declining' },
      { topic: 'Multithreading', averageScore: 38, studentsBelowThreshold: 14, assessmentCount: 12, trend: 'declining' },
      { topic: 'Exception Handling', averageScore: 45, studentsBelowThreshold: 12, assessmentCount: 13, trend: 'declining' },
    ],
  },
  {
    skill: 'AWS',
    category: 'Cloud',
    studentsAssessed: 14,
    averageScore: 55,
    targetScore: 75,
    gap: 20,
    status: 'needs-support',
    topics: [
      { topic: 'EC2 & S3', averageScore: 65, studentsBelowThreshold: 5, assessmentCount: 14, trend: 'stable' },
      { topic: 'IAM', averageScore: 55, studentsBelowThreshold: 8, assessmentCount: 12, trend: 'declining' },
      { topic: 'VPC', averageScore: 45, studentsBelowThreshold: 11, assessmentCount: 10, trend: 'declining' },
      { topic: 'Lambda', averageScore: 40, studentsBelowThreshold: 12, assessmentCount: 9, trend: 'declining' },
      { topic: 'CloudFormation', averageScore: 32, studentsBelowThreshold: 13, assessmentCount: 7, trend: 'declining' },
    ],
  },
  {
    skill: 'Docker',
    category: 'DevOps',
    studentsAssessed: 12,
    averageScore: 42,
    targetScore: 70,
    gap: 28,
    status: 'critical',
    topics: [
      { topic: 'Containers', averageScore: 58, studentsBelowThreshold: 4, assessmentCount: 12, trend: 'stable' },
      { topic: 'Dockerfile', averageScore: 45, studentsBelowThreshold: 8, assessmentCount: 10, trend: 'declining' },
      { topic: 'Docker Compose', averageScore: 35, studentsBelowThreshold: 10, assessmentCount: 8, trend: 'declining' },
      { topic: 'Networking', averageScore: 28, studentsBelowThreshold: 11, assessmentCount: 7, trend: 'declining' },
    ],
  },
];

// ── Competency Trend ─────────────────────────────────────────────

export interface CompetencyTrendPoint {
  month: string;
  averageCompetency: number;
  assessmentPerformance: number;
  skillImprovement: number;
}

export const competencyTrend: CompetencyTrendPoint[] = [
  { month: 'Apr', averageCompetency: 42, assessmentPerformance: 45, skillImprovement: 38 },
  { month: 'May', averageCompetency: 48, assessmentPerformance: 52, skillImprovement: 45 },
  { month: 'Jun', averageCompetency: 58, assessmentPerformance: 55, skillImprovement: 52 },
  { month: 'Jul', averageCompetency: 64, assessmentPerformance: 62, skillImprovement: 60 },
  { month: 'Aug', averageCompetency: 71, assessmentPerformance: 68, skillImprovement: 67 },
];

// ── Students Needing Support ─────────────────────────────────────

export interface StudentSupportEntry {
  studentId: string;
  studentName: string;
  reason: string;
  category: string;
  severity: 'high' | 'medium' | 'low';
  competencyScore: number;
  lastActive: string;
  recommendedAction: string;
}

export const studentsNeedingSupport: StudentSupportEntry[] = [
  { studentId: 'u5', studentName: 'Arjun Singh', reason: 'Persistent skill gaps across multiple areas', category: 'DSA', severity: 'high', competencyScore: 38, lastActive: '2026-08-22', recommendedAction: 'Assign foundational DSA module' },
  { studentId: 'u19', studentName: 'Siddharth Jain', reason: 'Declining performance & long inactivity', category: 'DSA', severity: 'high', competencyScore: 39, lastActive: '2026-08-21', recommendedAction: 'Schedule one-on-one meeting' },
  { studentId: 'u3', studentName: 'Rahul Verma', reason: 'Multiple reassessment attempts with no improvement', category: 'DSA', severity: 'high', competencyScore: 45, lastActive: '2026-08-24', recommendedAction: 'Create targeted intervention' },
  { studentId: 'u17', studentName: 'Varun Kumar', reason: 'Low learning progress & repeated failures', category: 'DSA', severity: 'high', competencyScore: 44, lastActive: '2026-08-22', recommendedAction: 'Assign practice modules' },
  { studentId: 'u9', studentName: 'Karthik Menon', reason: 'Persistent DSA gaps & declining scores', category: 'DSA', severity: 'medium', competencyScore: 42, lastActive: '2026-08-23', recommendedAction: 'Create intervention for Trees & Graphs' },
  { studentId: 'u13', studentName: 'Aditya Bose', reason: 'Low Python & DSA scores', category: 'Python', severity: 'medium', competencyScore: 48, lastActive: '2026-08-23', recommendedAction: 'Assign Python fundamentals review' },
  { studentId: 'u11', studentName: 'Rohan Joshi', reason: 'Below threshold in SQL subqueries', category: 'SQL', severity: 'medium', competencyScore: 51, lastActive: '2026-08-24', recommendedAction: 'Assign SQL practice module' },
  { studentId: 'u1', studentName: 'Sasi', reason: 'Low React & Node.js scores', category: 'Python', severity: 'medium', competencyScore: 58, lastActive: '2026-08-25', recommendedAction: 'Assign React hooks module' },
  { studentId: 'u7', studentName: 'Vikram Das', reason: 'Below target in multiple skills', category: 'Python', severity: 'low', competencyScore: 55, lastActive: '2026-08-24', recommendedAction: 'Review learning plan' },
  { studentId: 'u15', studentName: 'Nikhil Sharma', reason: 'Stagnant progress in last 2 weeks', category: 'Python', severity: 'low', competencyScore: 56, lastActive: '2026-08-24', recommendedAction: 'Encourage course completion' },
  { studentId: 'u4', studentName: 'Priya Patel', reason: 'Below target in cloud skills', category: 'SQL', severity: 'low', competencyScore: 63, lastActive: '2026-08-25', recommendedAction: 'Assign AWS fundamentals' },
  { studentId: 'u18', studentName: 'Ishita Chakraborty', reason: 'Needs support in Docker & CI/CD', category: 'SQL', severity: 'low', competencyScore: 65, lastActive: '2026-08-25', recommendedAction: 'Assign Docker basics module' },
];

// ── AI Faculty Insights ──────────────────────────────────────────

export interface AIInsightItem {
  id: string;
  type: 'warning' | 'info' | 'success';
  message: string;
  priority: 'high' | 'medium' | 'low';
  actionLabel?: string;
}

export const aiFacultyInsights: AIInsightItem[] = [
  { id: 'ins1', type: 'warning', message: '68 students are below 60% in Trees under Data Structures. This is the highest-impact area for intervention.', priority: 'high', actionLabel: 'Create Intervention' },
  { id: 'ins2', type: 'warning', message: 'Dynamic Programming has the lowest average competency (24%) in this class. Consider scheduling a dedicated workshop.', priority: 'high', actionLabel: 'Create Intervention' },
  { id: 'ins3', type: 'info', message: 'Students who completed the recommended DSA module improved by an average of 21 percentage points last month.', priority: 'medium' },
  { id: 'ins4', type: 'warning', message: '12 students have persistent DSA gaps and may benefit from additional intervention. 5 of them have been inactive for 3+ days.', priority: 'high', actionLabel: 'View Students' },
  { id: 'ins5', type: 'success', message: 'Python competency improved by 18% across the class over the last quarter. 82% of students are now above the target threshold.', priority: 'low' },
  { id: 'ins6', type: 'info', message: 'SQL Complex Joins and Subqueries show the largest gap. A targeted workshop could benefit 15 students.', priority: 'medium', actionLabel: 'Create Workshop' },
];

// ── Recommended Actions ──────────────────────────────────────────

export interface RecommendedAction {
  id: string;
  title: string;
  description: string;
  targetStudents: number;
  skill: string;
  priority: 'high' | 'medium' | 'low';
}

export const recommendedActions: RecommendedAction[] = [
  { id: 'ra1', title: 'Assign Tree Fundamentals module to 17 students', description: 'Students scoring below 60% in Trees. Includes video lessons, notes, and practice problems.', targetStudents: 17, skill: 'Data Structures', priority: 'high' },
  { id: 'ra2', title: 'Conduct a doubt-clearing session on Dynamic Programming', description: '19 students scored below 50%. A live session could address common misconceptions.', targetStudents: 19, skill: 'Data Structures', priority: 'high' },
  { id: 'ra3', title: 'Create a targeted assessment for SQL below 60%', description: '15 students need reassessment on Complex Joins and Subqueries.', targetStudents: 15, skill: 'SQL', priority: 'medium' },
  { id: 'ra4', title: 'Assign Git advanced workflows practice', description: '20 students scored below 50% in Git workflows. Assign practical exercises.', targetStudents: 20, skill: 'Git', priority: 'medium' },
  { id: 'ra5', title: 'Schedule React Hooks workshop', description: '11 students need hands-on practice with useState, useEffect, and custom hooks.', targetStudents: 11, skill: 'React', priority: 'low' },
];

// ── Interventions ────────────────────────────────────────────────

export type InterventionStatus = 'upcoming' | 'active' | 'completed';
export type InterventionPhase = 'in-progress' | 'completed' | 'needs-further-support';

export interface Intervention {
  id: string;
  title: string;
  skill: string;
  topic: string;
  status: InterventionStatus;
  startDate: string;
  endDate: string;
  assignedStudents: number;
  startedStudents: number;
  completedStudents: number;
  assessmentTaken: number;
  averageBefore: number;
  averageAfter: number;
  improvement: number;
  phase: InterventionPhase;
  learningContent: { type: string; title: string }[];
  targetScore: number;
  thresholdScore: number;
}

export const interventions: Intervention[] = [
  {
    id: 'int1', title: 'DSA — Trees Fundamentals', skill: 'Data Structures', topic: 'Trees',
    status: 'active', startDate: '2026-08-18', endDate: '2026-08-25',
    assignedStudents: 17, startedStudents: 15, completedStudents: 12, assessmentTaken: 10,
    averageBefore: 38, averageAfter: 58, improvement: 20, phase: 'in-progress',
    learningContent: [{ type: 'video', title: 'Tree Traversal Explained' }, { type: 'notes', title: 'BST Concepts' }, { type: 'practice', title: '20 Tree Problems' }],
    targetScore: 75, thresholdScore: 60,
  },
  {
    id: 'int2', title: 'SQL — Complex Joins Workshop', skill: 'SQL', topic: 'Complex Joins',
    status: 'active', startDate: '2026-08-20', endDate: '2026-08-27',
    assignedStudents: 15, startedStudents: 13, completedStudents: 8, assessmentTaken: 7,
    averageBefore: 52, averageAfter: 66, improvement: 14, phase: 'in-progress',
    learningContent: [{ type: 'video', title: 'Joins Deep Dive' }, { type: 'practice', title: '15 Join Exercises' }],
    targetScore: 80, thresholdScore: 60,
  },
  {
    id: 'int3', title: 'Git — Branching & Merging', skill: 'Git', topic: 'Branching',
    status: 'completed', startDate: '2026-08-01', endDate: '2026-08-08',
    assignedStudents: 13, startedStudents: 13, completedStudents: 11, assessmentTaken: 11,
    averageBefore: 40, averageAfter: 62, improvement: 22, phase: 'completed',
    learningContent: [{ type: 'video', title: 'Git Branching Strategy' }, { type: 'practice', title: '10 Merge Conflicts' }],
    targetScore: 75, thresholdScore: 60,
  },
  {
    id: 'int4', title: 'Dynamic Programming Crash Course', skill: 'Data Structures', topic: 'Dynamic Programming',
    status: 'upcoming', startDate: '2026-09-01', endDate: '2026-09-08',
    assignedStudents: 19, startedStudents: 0, completedStudents: 0, assessmentTaken: 0,
    averageBefore: 24, averageAfter: 0, improvement: 0, phase: 'in-progress',
    learningContent: [{ type: 'video', title: 'DP Fundamentals' }, { type: 'notes', title: 'DP Patterns' }, { type: 'practice', title: '25 DP Problems' }],
    targetScore: 65, thresholdScore: 50,
  },
];

// ── Assessment Analytics ─────────────────────────────────────────

export interface AssessmentAnalyticsEntry {
  id: string;
  name: string;
  skill: string;
  attempts: number;
  averageScore: number;
  completionRate: number;
  mostMissedTopic: string;
  mostDifficultQuestion: string;
  difficultyDistribution: { easy: number; medium: number; hard: number };
  scoreDistribution: { range: string; count: number }[];
}

export const assessmentAnalytics: AssessmentAnalyticsEntry[] = [
  {
    id: 'aa1', name: 'Python Fundamentals', skill: 'Python', attempts: 18, averageScore: 72, completionRate: 94,
    mostMissedTopic: 'Decorators', mostDifficultQuestion: 'Explain descriptor protocol',
    difficultyDistribution: { easy: 40, medium: 35, hard: 25 },
    scoreDistribution: [{ range: '90-100', count: 3 }, { range: '75-89', count: 7 }, { range: '60-74', count: 5 }, { range: '40-59', count: 2 }, { range: '0-39', count: 1 }],
  },
  {
    id: 'aa2', name: 'SQL Mastery', skill: 'SQL', attempts: 16, averageScore: 64, completionRate: 88,
    mostMissedTopic: 'Complex Joins', mostDifficultQuestion: 'Write a query with 3+ table joins',
    difficultyDistribution: { easy: 35, medium: 40, hard: 25 },
    scoreDistribution: [{ range: '90-100', count: 2 }, { range: '75-89', count: 4 }, { range: '60-74', count: 5 }, { range: '40-59', count: 4 }, { range: '0-39', count: 1 }],
  },
  {
    id: 'aa3', name: 'DSA Comprehensive', skill: 'Data Structures', attempts: 15, averageScore: 49, completionRate: 82,
    mostMissedTopic: 'Dynamic Programming', mostDifficultQuestion: 'Implement LRU Cache',
    difficultyDistribution: { easy: 30, medium: 40, hard: 30 },
    scoreDistribution: [{ range: '90-100', count: 0 }, { range: '75-89', count: 2 }, { range: '60-74', count: 3 }, { range: '40-59', count: 6 }, { range: '0-39', count: 4 }],
  },
  {
    id: 'aa4', name: 'React Assessment', skill: 'React', attempts: 14, averageScore: 58, completionRate: 85,
    mostMissedTopic: 'Performance Optimization', mostDifficultQuestion: 'Implement memoization patterns',
    difficultyDistribution: { easy: 35, medium: 40, hard: 25 },
    scoreDistribution: [{ range: '90-100', count: 1 }, { range: '75-89', count: 3 }, { range: '60-74', count: 5 }, { range: '40-59', count: 4 }, { range: '0-39', count: 1 }],
  },
  {
    id: 'aa5', name: 'Git Proficiency', skill: 'Git', attempts: 18, averageScore: 43, completionRate: 90,
    mostMissedTopic: 'Advanced Workflows', mostDifficultQuestion: 'Resolve complex merge conflicts',
    difficultyDistribution: { easy: 40, medium: 35, hard: 25 },
    scoreDistribution: [{ range: '90-100', count: 1 }, { range: '75-89', count: 2 }, { range: '60-74', count: 4 }, { range: '40-59', count: 6 }, { range: '0-39', count: 5 }],
  },
];

// ── Career Readiness ─────────────────────────────────────────────

export interface CareerReadinessData {
  overallReadiness: number;
  technicalSkills: number;
  practicalSkills: number;
  problemSolving: number;
  interviewReadiness: number;
  targetRoleDistribution: { role: string; count: number }[];
}

export const careerReadinessData: CareerReadinessData = {
  overallReadiness: 68,
  technicalSkills: 74,
  practicalSkills: 63,
  problemSolving: 66,
  interviewReadiness: 61,
  targetRoleDistribution: [
    { role: 'Full Stack Developer', count: 6 },
    { role: 'Data Analyst', count: 4 },
    { role: 'Software Developer', count: 4 },
    { role: 'Cloud Engineer', count: 3 },
    { role: 'AI/ML Engineer', count: 2 },
    { role: 'Other', count: 1 },
  ],
};

// ── Verified Skills ──────────────────────────────────────────────

export interface VerifiedSkillEntry {
  skill: string;
  verifiedStudents: number;
  courseCompleted: number;
  assessmentCompleted: number;
  skillGapClosed: number;
}

export const verifiedSkillsData: VerifiedSkillEntry[] = [
  { skill: 'Python', verifiedStudents: 8, courseCompleted: 12, assessmentCompleted: 18, skillGapClosed: 6 },
  { skill: 'SQL', verifiedStudents: 6, courseCompleted: 10, assessmentCompleted: 16, skillGapClosed: 5 },
  { skill: 'React', verifiedStudents: 4, courseCompleted: 8, assessmentCompleted: 14, skillGapClosed: 3 },
  { skill: 'Java', verifiedStudents: 3, courseCompleted: 6, assessmentCompleted: 12, skillGapClosed: 2 },
  { skill: 'AWS', verifiedStudents: 2, courseCompleted: 4, assessmentCompleted: 10, skillGapClosed: 1 },
  { skill: 'Git', verifiedStudents: 1, courseCompleted: 5, assessmentCompleted: 18, skillGapClosed: 1 },
  { skill: 'Docker', verifiedStudents: 1, courseCompleted: 3, assessmentCompleted: 8, skillGapClosed: 0 },
];

// ── Interview Readiness Distribution ─────────────────────────────

export interface InterviewReadinessDist {
  excellent: number;
  good: number;
  developing: number;
  needsSupport: number;
}

export const interviewReadinessDist: InterviewReadinessDist = {
  excellent: 3,
  good: 7,
  developing: 6,
  needsSupport: 4,
};

// ── Department Comparison ────────────────────────────────────────

export interface DepartmentComparison {
  class: string;
  averageCompetency: number;
  studentCount: number;
  verifiedSkills: number;
}

export const departmentComparison: DepartmentComparison[] = [
  { class: 'BCA III-A', averageCompetency: 71, studentCount: 20, verifiedSkills: 25 },
  { class: 'BCA III-B', averageCompetency: 68, studentCount: 18, verifiedSkills: 20 },
  { class: 'BCA III-C', averageCompetency: 74, studentCount: 22, verifiedSkills: 28 },
  { class: 'B.Tech CSE III-A', averageCompetency: 65, studentCount: 25, verifiedSkills: 18 },
];

// ── Learning Content (for Faculty Management) ────────────────────

export interface FacultyLearningContent {
  id: string;
  title: string;
  description: string;
  skill: string;
  topic: string;
  type: 'video' | 'notes' | 'pdf' | 'example' | 'practice' | 'assessment';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedDuration: number;
  objectives: string[];
  status: 'published' | 'draft' | 'unpublished';
  assignedStudents: number;
  completedStudents: number;
  createdAt: string;
}

export const facultyLearningContent: FacultyLearningContent[] = [
  { id: 'lc1', title: 'Tree Traversal Explained', description: 'Complete guide to inorder, preorder, and postorder traversals', skill: 'Data Structures', topic: 'Trees', type: 'video', difficulty: 'Intermediate', estimatedDuration: 30, objectives: ['Understand tree traversal types', 'Implement each traversal algorithm', 'Identify use cases for each traversal'], status: 'published', assignedStudents: 17, completedStudents: 12, createdAt: '2026-08-15' },
  { id: 'lc2', title: 'BST Concepts & Operations', description: 'Binary Search Tree insertion, deletion, and search', skill: 'Data Structures', topic: 'Trees', type: 'notes', difficulty: 'Intermediate', estimatedDuration: 20, objectives: ['Understand BST properties', 'Implement insert and search', 'Handle deletion cases'], status: 'published', assignedStudents: 17, completedStudents: 10, createdAt: '2026-08-15' },
  { id: 'lc3', title: '20 Tree Practice Problems', description: 'Curated problems covering all tree topics', skill: 'Data Structures', topic: 'Trees', type: 'practice', difficulty: 'Intermediate', estimatedDuration: 60, objectives: ['Solve basic tree problems', 'Solve traversal problems', 'Solve BST problems'], status: 'published', assignedStudents: 17, completedStudents: 8, createdAt: '2026-08-16' },
  { id: 'lc4', title: 'Joins Deep Dive', description: 'Comprehensive guide to SQL joins including advanced patterns', skill: 'SQL', topic: 'Complex Joins', type: 'video', difficulty: 'Intermediate', estimatedDuration: 45, objectives: ['Master INNER, LEFT, RIGHT, FULL joins', 'Write complex multi-table queries', 'Optimize join performance'], status: 'published', assignedStudents: 15, completedStudents: 8, createdAt: '2026-08-18' },
  { id: 'lc5', title: '15 Join Exercises', description: 'Hands-on SQL join practice problems', skill: 'SQL', topic: 'Complex Joins', type: 'practice', difficulty: 'Intermediate', estimatedDuration: 40, objectives: ['Practice all join types', 'Solve real-world join scenarios', 'Write optimized queries'], status: 'published', assignedStudents: 15, completedStudents: 6, createdAt: '2026-08-18' },
  { id: 'lc6', title: 'DP Fundamentals', description: 'Introduction to dynamic programming concepts', skill: 'Data Structures', topic: 'Dynamic Programming', type: 'video', difficulty: 'Advanced', estimatedDuration: 50, objectives: ['Understand memoization', 'Understand tabulation', 'Identify DP problems'], status: 'draft', assignedStudents: 0, completedStudents: 0, createdAt: '2026-08-25' },
  { id: 'lc7', title: 'Git Branching Strategy', description: 'Learn Git branching workflows for teams', skill: 'Git', topic: 'Branching', type: 'video', difficulty: 'Beginner', estimatedDuration: 25, objectives: ['Create and manage branches', 'Understand branching strategies', 'Practice feature branch workflow'], status: 'published', assignedStudents: 13, completedStudents: 11, createdAt: '2026-08-01' },
];

// ── Announcements ────────────────────────────────────────────────

export interface Announcement {
  id: string;
  title: string;
  message: string;
  target: 'all' | 'section' | 'intervention-group' | 'selected';
  sentAt: string;
  type: 'learning' | 'assessment' | 'intervention' | 'doubt-clearing';
}

export const announcements: Announcement[] = [
  { id: 'ann1', title: 'DSA Assessment Reminder', message: 'The DSA Trees assessment is scheduled for tomorrow. Please complete the practice modules before attempting.', target: 'all', sentAt: '2026-08-24T10:00:00Z', type: 'assessment' },
  { id: 'ann2', title: 'Doubt Clearing — SQL Joins', message: 'A doubt-clearing session on SQL Complex Joins will be held on Friday at 3 PM.', target: 'all', sentAt: '2026-08-23T14:00:00Z', type: 'doubt-clearing' },
];

// ── Skill Improvement Tracking ───────────────────────────────────

export interface SkillImprovementEntry {
  skill: string;
  monthlyData: { month: string; score: number }[];
  totalImprovement: number;
}

export const skillImprovementData: SkillImprovementEntry[] = [
  { skill: 'SQL', monthlyData: [{ month: 'Apr', score: 50 }, { month: 'May', score: 55 }, { month: 'Jun', score: 60 }, { month: 'Jul', score: 66 }, { month: 'Aug', score: 71 }], totalImprovement: 21 },
  { skill: 'Python', monthlyData: [{ month: 'Apr', score: 60 }, { month: 'May', score: 64 }, { month: 'Jun', score: 68 }, { month: 'Jul', score: 73 }, { month: 'Aug', score: 78 }], totalImprovement: 18 },
  { skill: 'React', monthlyData: [{ month: 'Apr', score: 47 }, { month: 'May', score: 50 }, { month: 'Jun', score: 53 }, { month: 'Jul', score: 58 }, { month: 'Aug', score: 62 }], totalImprovement: 15 },
  { skill: 'Java', monthlyData: [{ month: 'Apr', score: 48 }, { month: 'May', score: 50 }, { month: 'Jun', score: 52 }, { month: 'Jul', score: 55 }, { month: 'Aug', score: 58 }], totalImprovement: 10 },
  { skill: 'AWS', monthlyData: [{ month: 'Apr', score: 48 }, { month: 'May', score: 50 }, { month: 'Jun', score: 51 }, { month: 'Jul', score: 53 }, { month: 'Aug', score: 55 }], totalImprovement: 7 },
  { skill: 'Docker', monthlyData: [{ month: 'Apr', score: 38 }, { month: 'May', score: 39 }, { month: 'Jun', score: 40 }, { month: 'Jul', score: 41 }, { month: 'Aug', score: 42 }], totalImprovement: 4 },
];
