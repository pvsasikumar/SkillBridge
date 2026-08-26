import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type {
  CourseSubmission,
  ExtractedSkill,
  CompetencyAssessment,
  CompetencyReport,
  PersonalizedLearningPlan,
  VerifiedSkill,
  DigitalCredential,
  ResumeProfile,
  PublicProfile,
  InterviewSession,
  CareerReadinessProfile,
  ProjectRecommendation,
  Skill,
} from '@/types';
import { studentSkills } from '@/data/mockData';

interface AppState {
  courses: CourseSubmission[];
  assessments: CompetencyAssessment[];
  competencyReports: CompetencyReport[];
  learningPlans: PersonalizedLearningPlan[];
  verifiedSkills: VerifiedSkill[];
  credentials: DigitalCredential[];
  resumeProfile: ResumeProfile | null;
  publicProfile: PublicProfile | null;
  interviewSessions: InterviewSession[];
  careerReadiness: CareerReadinessProfile | null;
  projectRecommendations: ProjectRecommendation[];
  skills: Skill[];
}

interface AppContextType extends AppState {
  addCourse: (course: CourseSubmission) => void;
  updateCourse: (id: string, updates: Partial<CourseSubmission>) => void;
  setExtractedSkills: (courseId: string, skills: ExtractedSkill[]) => void;
  addAssessment: (assessment: CompetencyAssessment) => void;
  updateAssessment: (id: string, updates: Partial<CompetencyAssessment>) => void;
  addCompetencyReport: (report: CompetencyReport) => void;
  addLearningPlan: (plan: PersonalizedLearningPlan) => void;
  updateLearningPlan: (id: string, updates: Partial<PersonalizedLearningPlan>) => void;
  addVerifiedSkill: (skill: VerifiedSkill) => void;
  addCredential: (cred: DigitalCredential) => void;
  setResumeProfile: (profile: ResumeProfile) => void;
  setPublicProfile: (profile: PublicProfile) => void;
  addInterviewSession: (session: InterviewSession) => void;
  updateInterviewSession: (id: string, updates: Partial<InterviewSession>) => void;
  setCareerReadiness: (cr: CareerReadinessProfile) => void;
  setProjectRecommendations: (recs: ProjectRecommendation[]) => void;
  updateSkillLevel: (skillName: string, newLevel: number) => void;
  getSkillLevel: (skillName: string) => number;
}

const AppContext = createContext<AppContextType | null>(null);

const initialSkills: Skill[] = [...studentSkills];

export function AppProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<CourseSubmission[]>([]);
  const [assessments, setAssessments] = useState<CompetencyAssessment[]>([]);
  const [competencyReports, setCompetencyReports] = useState<CompetencyReport[]>([]);
  const [learningPlans, setLearningPlans] = useState<PersonalizedLearningPlan[]>([]);
  const [verifiedSkills, setVerifiedSkills] = useState<VerifiedSkill[]>([]);
  const [credentials, setCredentials] = useState<DigitalCredential[]>([]);
  const [resumeProfile, setResumeProfile] = useState<ResumeProfile | null>(null);
  const [publicProfile, setPublicProfile] = useState<PublicProfile | null>(null);
  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>([]);
  const [careerReadiness, setCareerReadiness] = useState<CareerReadinessProfile | null>(null);
  const [projectRecommendations, setProjectRecommendations] = useState<ProjectRecommendation[]>([]);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);

  const addCourse = useCallback((course: CourseSubmission) => {
    setCourses(prev => [...prev, course]);
  }, []);

  const updateCourse = useCallback((id: string, updates: Partial<CourseSubmission>) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const setExtractedSkills = useCallback((_courseId: string, _extracted: ExtractedSkill[]) => {
    // Store in the course's skillsLearned - handled by updateCourse in components
  }, []);

  const addAssessment = useCallback((assessment: CompetencyAssessment) => {
    setAssessments(prev => [...prev, assessment]);
  }, []);

  const updateAssessment = useCallback((id: string, updates: Partial<CompetencyAssessment>) => {
    setAssessments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  }, []);

  const addCompetencyReport = useCallback((report: CompetencyReport) => {
    setCompetencyReports(prev => [...prev, report]);
  }, []);

  const addLearningPlan = useCallback((plan: PersonalizedLearningPlan) => {
    setLearningPlans(prev => [...prev, plan]);
  }, []);

  const updateLearningPlan = useCallback((id: string, updates: Partial<PersonalizedLearningPlan>) => {
    setLearningPlans(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const addVerifiedSkill = useCallback((skill: VerifiedSkill) => {
    setVerifiedSkills(prev => {
      const exists = prev.find(v => v.skill === skill.skill);
      if (exists) return prev.map(v => v.skill === skill.skill ? skill : v);
      return [...prev, skill];
    });
  }, []);

  const addCredential = useCallback((cred: DigitalCredential) => {
    setCredentials(prev => {
      const exists = prev.find(c => c.skill === cred.skill);
      if (exists) return prev.map(c => c.skill === cred.skill ? cred : c);
      return [...prev, cred];
    });
  }, []);

  const addInterviewSession = useCallback((session: InterviewSession) => {
    setInterviewSessions(prev => [...prev, session]);
  }, []);

  const updateInterviewSession = useCallback((id: string, updates: Partial<InterviewSession>) => {
    setInterviewSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const updateSkillLevel = useCallback((skillName: string, newLevel: number) => {
    setSkills(prev => prev.map(s => {
      if (s.name === skillName) {
        const status = newLevel >= 75 ? 'strong' as const : newLevel >= 50 ? 'developing' as const : 'needs-attention' as const;
        return { ...s, currentLevel: newLevel, status };
      }
      return s;
    }));
  }, []);

  const getSkillLevel = useCallback((skillName: string): number => {
    const skill = skills.find(s => s.name === skillName);
    return skill?.currentLevel ?? 0;
  }, [skills]);

  return (
    <AppContext.Provider value={{
      courses,
      assessments,
      competencyReports,
      learningPlans,
      verifiedSkills,
      credentials,
      resumeProfile,
      publicProfile,
      interviewSessions,
      careerReadiness,
      projectRecommendations,
      skills,
      addCourse,
      updateCourse,
      setExtractedSkills,
      addAssessment,
      updateAssessment,
      addCompetencyReport,
      addLearningPlan,
      updateLearningPlan,
      addVerifiedSkill,
      addCredential,
      setResumeProfile,
      setPublicProfile,
      addInterviewSession,
      updateInterviewSession,
      setCareerReadiness,
      setProjectRecommendations,
      updateSkillLevel,
      getSkillLevel,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
