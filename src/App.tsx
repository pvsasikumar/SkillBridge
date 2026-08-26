import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { RecruiterProvider } from '@/context/RecruiterContext';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { FacultyLayout } from '@/components/layout/FacultyLayout';
import { RecruiterLayout } from '@/components/layout/RecruiterLayout';
import Landing from '@/pages/Landing';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import Onboarding from '@/pages/onboarding/Onboarding';
import Dashboard from '@/pages/student/Dashboard';
import SkillGap from '@/pages/student/SkillGap';
import Roadmap from '@/pages/student/Roadmap';
import Learning from '@/pages/student/Learning';
import Quiz from '@/pages/student/Quiz';
import PracticalAssessment from '@/pages/student/PracticalAssessment';
import ProgressPage from '@/pages/student/Progress';
import SkillPassport from '@/pages/student/SkillPassport';
import FacultyDashboard from '@/pages/faculty/FacultyDashboard';
import StudentDetail from '@/pages/faculty/StudentDetail';
import SkillGapAnalysis from '@/pages/faculty/SkillGapAnalysis';
import StudentList from '@/pages/faculty/StudentList';
import Interventions from '@/pages/faculty/Interventions';
import LearningContent from '@/pages/faculty/LearningContent';
import AssessmentAnalytics from '@/pages/faculty/AssessmentAnalytics';
import FacultyCareerReadiness from '@/pages/faculty/CareerReadinessPage';
import AIAssistant from '@/pages/faculty/AIAssistant';
import ReportsPage from '@/pages/faculty/Reports';
import Notifications from '@/pages/Notifications';
import Profile from '@/pages/Profile';
import CoursesPage from '@/pages/student/CoursesPage';
import CompetencyAssessmentPage from '@/pages/student/CompetencyAssessmentPage';
import CompetencyReportPage from '@/pages/student/CompetencyReportPage';
import RemediationPage from '@/pages/student/RemediationPage';
import VerifiedSkillPage from '@/pages/student/VerifiedSkillPage';
import CredentialPage from '@/pages/student/CredentialPage';
import PublicVerification from '@/pages/student/PublicVerification';
import ResumeBuilderPage from '@/pages/student/ResumeBuilderPage';
import InterviewPrepPage from '@/pages/student/InterviewPrepPage';
import CareerReadinessPage from '@/pages/student/CareerReadinessPage';
import LearningModuleView from '@/pages/student/LearningModuleView';
import IGOTCoursesPage from '@/pages/student/IGOTCoursesPage';
import LearningMaterialStudio from '@/pages/trainer/LearningMaterialStudio';
import QuestionBank from '@/pages/trainer/QuestionBank';
import QuizBuilder from '@/pages/trainer/QuizBuilder';
import CompetencyFrameworkPage from '@/pages/trainer/CompetencyFrameworkPage';

import RecruiterDashboard from '@/pages/recruiter/RecruiterDashboard';
import CompanyProfilePage from '@/pages/recruiter/CompanyProfilePage';
import JobsListPage from '@/pages/recruiter/JobsListPage';
import JobCreationPage from '@/pages/recruiter/JobCreationPage';
import CandidatesPage from '@/pages/recruiter/CandidatesPage';
import CandidateProfilePage from '@/pages/recruiter/CandidateProfilePage';
import ShortlistedPage from '@/pages/recruiter/ShortlistedPage';
import InterviewInvitationPage from '@/pages/recruiter/InterviewInvitationPage';
import InterviewsPage from '@/pages/recruiter/InterviewsPage';
import InterviewFeedbackPage from '@/pages/recruiter/InterviewFeedbackPage';
import RecruiterAnalyticsPage from '@/pages/recruiter/RecruiterAnalyticsPage';
import AIRecruiterAssistantPage from '@/pages/recruiter/AIRecruiterAssistantPage';

function StudentShell() {
  return (
    <StudentLayout>
      <Outlet />
    </StudentLayout>
  );
}

function FacultyShell() {
  return (
    <FacultyLayout>
      <Outlet />
    </FacultyLayout>
  );
}

function RecruiterShell() {
  return (
    <RecruiterProvider>
      <RecruiterLayout>
        <Outlet />
      </RecruiterLayout>
    </RecruiterProvider>
  );
}

function FacultyPlaceholder({ title }: { title: string }) {
  return (
    <div className="p-8 flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📋</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">{title}</h2>
        <p className="text-sm text-gray-500">This page is part of the Faculty portal</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Public verification */}
          <Route path="/verify/:verificationId" element={<PublicVerification />} />

          {/* Student routes */}
          <Route element={<StudentShell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/skills" element={<SkillGap />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/learning/:planId" element={<LearningModuleView />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/practical" element={<PracticalAssessment />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/passport" element={<SkillPassport />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/assessment/new" element={<CompetencyAssessmentPage />} />
            <Route path="/assessment/:assessmentId" element={<CompetencyAssessmentPage />} />
            <Route path="/report/:reportId" element={<CompetencyReportPage />} />
            <Route path="/remediation/:planId" element={<RemediationPage />} />
            <Route path="/verified-skills" element={<VerifiedSkillPage />} />
            <Route path="/credential/:credentialId" element={<CredentialPage />} />
            <Route path="/resume" element={<ResumeBuilderPage />} />
            <Route path="/interview" element={<InterviewPrepPage />} />
            <Route path="/interview/:sessionId" element={<InterviewPrepPage />} />
            <Route path="/igot-courses" element={<IGOTCoursesPage />} />
            <Route path="/career-readiness" element={<CareerReadinessPage />} />
          </Route>

          {/* Faculty routes */}
          <Route element={<FacultyShell />}>
            <Route path="/faculty" element={<FacultyDashboard />} />
            <Route path="/faculty/students" element={<StudentList />} />
            <Route path="/faculty/skill-gaps" element={<SkillGapAnalysis />} />
            <Route path="/faculty/assessments" element={<AssessmentAnalytics />} />
            <Route path="/faculty/learning-content" element={<LearningContent />} />
            <Route path="/faculty/interventions" element={<Interventions />} />
            <Route path="/faculty/material-studio" element={<LearningMaterialStudio />} />
            <Route path="/faculty/question-bank" element={<QuestionBank />} />
            <Route path="/faculty/quiz-builder" element={<QuizBuilder />} />
            <Route path="/faculty/competency-framework" element={<CompetencyFrameworkPage />} />
            <Route path="/faculty/career-readiness" element={<FacultyCareerReadiness />} />
            <Route path="/faculty/ai-assistant" element={<AIAssistant />} />
            <Route path="/faculty/reports" element={<ReportsPage />} />
            <Route path="/faculty/student/:id" element={<StudentDetail />} />
            <Route path="/faculty/analytics" element={<SkillGapAnalysis />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Recruiter routes */}
          <Route element={<RecruiterShell />}>
            <Route path="/recruiter" element={<RecruiterDashboard />} />
            <Route path="/recruiter/company" element={<CompanyProfilePage />} />
            <Route path="/recruiter/jobs" element={<JobsListPage />} />
            <Route path="/recruiter/jobs/create" element={<JobCreationPage />} />
            <Route path="/recruiter/candidates" element={<CandidatesPage />} />
            <Route path="/recruiter/candidate/:id" element={<CandidateProfilePage />} />
            <Route path="/recruiter/shortlisted" element={<ShortlistedPage />} />
            <Route path="/recruiter/interviews" element={<InterviewsPage />} />
            <Route path="/recruiter/interviews/invite" element={<InterviewInvitationPage />} />
            <Route path="/recruiter/feedback" element={<InterviewFeedbackPage />} />
            <Route path="/recruiter/feedback/record" element={<InterviewFeedbackPage />} />
            <Route path="/recruiter/analytics" element={<RecruiterAnalyticsPage />} />
            <Route path="/recruiter/ai-assistant" element={<AIRecruiterAssistantPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
