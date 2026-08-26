import type {
  User,
  Skill,
  LearningModule,
  QuizQuestion,
  AssessmentResult,
  Notification,
  StudentSummary,
  CompetencyHeatmapEntry,
  DailyPlan,
  PracticalChallenge,
} from '@/types';

export const currentUser: User = {
  id: 'u1',
  name: 'Anand Krishnamurthy',
  email: 'anand@gov.in',
  role: 'student',
  education: 'M.Sc. Statistics',
  course: 'National Statistical Office',
  year: 'Deputy Director',
  experienceLevel: 'Intermediate',
  careerGoal: 'Statistical Officer',
  learningPreference: 'Mixed',
};

export const facultyUser: User = {
  id: 'f1',
  name: 'Dr. Priya Sharma',
  email: 'priya.sharma@gov.in',
  role: 'faculty',
};

export const studentSkills: Skill[] = [
  { id: 's1', name: 'Fundamentals of Statistics', category: 'Statistical', currentLevel: 78, requiredLevel: 85, status: 'developing' },
  { id: 's2', name: 'Sampling Techniques', category: 'Statistical', currentLevel: 65, requiredLevel: 80, status: 'developing' },
  { id: 's3', name: 'Survey Methodology', category: 'Statistical', currentLevel: 42, requiredLevel: 70, status: 'needs-attention' },
  { id: 's4', name: 'Data Collection', category: 'Statistical', currentLevel: 55, requiredLevel: 75, status: 'needs-attention' },
  { id: 's5', name: 'Data Quality Assurance', category: 'Digital', currentLevel: 72, requiredLevel: 80, status: 'developing' },
  { id: 's6', name: 'Data Analysis', category: 'Statistical', currentLevel: 75, requiredLevel: 80, status: 'developing' },
  { id: 's7', name: 'Statistical Methods', category: 'Statistical', currentLevel: 68, requiredLevel: 80, status: 'developing' },
  { id: 's8', name: 'Official Statistics', category: 'Statistical', currentLevel: 80, requiredLevel: 85, status: 'strong', verified: true, lastVerified: '2026-08-20' },
  { id: 's9', name: 'Data Visualization', category: 'Statistical', currentLevel: 60, requiredLevel: 70, status: 'developing' },
  { id: 's10', name: 'Statistical Software', category: 'Digital', currentLevel: 45, requiredLevel: 65, status: 'needs-attention' },
  { id: 's11', name: 'Data Interpretation', category: 'Statistical', currentLevel: 70, requiredLevel: 75, status: 'developing' },
  { id: 's12', name: 'Python for Statistics', category: 'Digital', currentLevel: 38, requiredLevel: 60, status: 'needs-attention' },
];

export const skillCategories = [
  'Statistical',
  'Digital',
  'Professional',
  'Research',
];

export const learningModules: LearningModule[] = [
  { id: 'm1', title: 'JavaScript Fundamentals', skill: 'JavaScript', status: 'completed', difficulty: 'Beginner', estimatedTime: 45, progress: 100, description: 'Core JavaScript concepts including variables, functions, and control flow.' },
  { id: 'm2', title: 'Async JavaScript', skill: 'JavaScript', status: 'in-progress', difficulty: 'Intermediate', estimatedTime: 35, progress: 65, description: 'Promises, async/await, and event loop concepts.' },
  { id: 'm3', title: 'REST API Design', skill: 'REST APIs', status: 'in-progress', difficulty: 'Intermediate', estimatedTime: 40, progress: 40, description: 'Designing and consuming RESTful APIs.' },
  { id: 'm4', title: 'React Fundamentals', skill: 'React', status: 'upcoming', difficulty: 'Intermediate', estimatedTime: 50, progress: 0, description: 'Components, JSX, props, and basic React patterns.' },
  { id: 'm5', title: 'React State Management', skill: 'React', status: 'upcoming', difficulty: 'Intermediate', estimatedTime: 45, progress: 0, description: 'useState, useContext, and state management strategies.' },
  { id: 'm6', title: 'Node.js Basics', skill: 'Node.js', status: 'upcoming', difficulty: 'Intermediate', estimatedTime: 55, progress: 0, description: 'Server-side JavaScript with Node.js and Express.' },
  { id: 'm7', title: 'TypeScript Essentials', skill: 'TypeScript', status: 'upcoming', difficulty: 'Intermediate', estimatedTime: 40, progress: 0, description: 'Type system, interfaces, and TypeScript best practices.' },
  { id: 'm8', title: 'Full Stack Project', skill: 'Full Stack', status: 'locked', difficulty: 'Advanced', estimatedTime: 120, progress: 0, description: 'Build a complete full stack application from scratch.' },
];

export const todayPlan: DailyPlan[] = [
  { title: 'JavaScript Promises', duration: 15, type: 'lesson' },
  { title: 'API Practice Exercise', duration: 15, type: 'practice' },
  { title: 'Adaptive Quiz: Async JS', duration: 12, type: 'quiz' },
];

export const assessmentResults: AssessmentResult[] = [
  { id: 'a1', skill: 'JavaScript', score: 72, maxScore: 100, date: '2026-08-22', type: 'adaptive' },
  { id: 'a2', skill: 'React', score: 45, maxScore: 100, date: '2026-08-20', type: 'adaptive' },
  { id: 'a3', skill: 'SQL', score: 78, maxScore: 100, date: '2026-08-18', type: 'adaptive' },
  { id: 'a4', skill: 'Git', score: 92, maxScore: 100, date: '2026-08-15', type: 'practical' },
  { id: 'a5', skill: 'Node.js', score: 38, maxScore: 100, date: '2026-08-14', type: 'adaptive' },
];

export const competencyHistory = [
  { month: 'Apr', javascript: 48, react: 35, sql: 65, nodejs: 25, git: 78 },
  { month: 'May', javascript: 52, react: 38, sql: 67, nodejs: 28, git: 82 },
  { month: 'Jun', javascript: 58, react: 40, sql: 69, nodejs: 32, git: 85 },
  { month: 'Jul', javascript: 64, react: 42, sql: 71, nodejs: 35, git: 87 },
  { month: 'Aug', javascript: 68, react: 42, sql: 72, nodejs: 38, git: 89 },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is the output of typeof null in JavaScript?',
    options: ['"null"', '"undefined"', '"object"', '"boolean"'],
    correctIndex: 2,
    explanation: 'typeof null returns "object" — this is a well-known bug in JavaScript that has existed since the language was first created.',
    concept: 'JavaScript Type System',
    difficulty: 'Easy',
  },
  {
    id: 'q2',
    question: 'Which method is used to handle asynchronous operations in modern JavaScript?',
    options: ['setTimeout()', 'Promise.then()', 'callback nesting', 'All of the above'],
    correctIndex: 1,
    explanation: 'Promise.then() is the modern way to handle async operations, providing cleaner and more maintainable code compared to callback nesting.',
    concept: 'Asynchronous JavaScript',
    difficulty: 'Medium',
  },
  {
    id: 'q3',
    question: 'What does the "await" keyword do in an async function?',
    options: ['Pauses the function execution', 'Makes the function synchronous', 'Returns a Promise', 'Catches errors automatically'],
    correctIndex: 0,
    explanation: 'The await keyword pauses the async function execution and waits for the Promise to resolve before continuing.',
    concept: 'Async/Await',
    difficulty: 'Medium',
  },
  {
    id: 'q4',
    question: 'What is the event loop in JavaScript?',
    options: [
      'A loop that runs infinitely',
      'A mechanism that handles asynchronous callbacks',
      'A for-loop iteration',
      'A type of recursive function',
    ],
    correctIndex: 1,
    explanation: 'The event loop is a core mechanism in JavaScript that continuously checks the call stack and callback queue to handle asynchronous operations.',
    concept: 'Event Loop',
    difficulty: 'Hard',
  },
  {
    id: 'q5',
    question: 'What is closure in JavaScript?',
    options: [
      'A way to close the browser',
      'A function that has access to its outer scope variables',
      'A method to end a loop',
      'A way to make variables private using classes',
    ],
    correctIndex: 1,
    explanation: 'A closure is a function that retains access to its enclosing scope variables even after the outer function has returned.',
    concept: 'Closures',
    difficulty: 'Medium',
  },
];

export const practicalChallenge: PracticalChallenge = {
  id: 'pc1',
  title: 'Build a REST API',
  description: 'Create a RESTful API that manages a collection of books. Implement proper error handling and input validation.',
  requirements: [
    'Create a GET endpoint to retrieve all books',
    'Create a POST endpoint to add a new book',
    'Return JSON responses with proper status codes',
    'Handle 404 errors for missing resources',
    'Validate input data (title and author required)',
  ],
  skill: 'Node.js',
  difficulty: 'Intermediate',
};

export const notifications: Notification[] = [
  { id: 'n1', title: 'New Assessment Available', message: 'A new JavaScript assessment is ready for you.', type: 'assessment', read: false, timestamp: '2026-08-25T09:00:00Z' },
  { id: 'n2', title: 'Learning Plan Updated', message: 'Your learning path has been updated based on recent quiz results.', type: 'learning', read: false, timestamp: '2026-08-25T08:30:00Z' },
  { id: 'n3', title: 'Skill Gap Detected', message: 'React state management identified as a priority gap.', type: 'gap', read: true, timestamp: '2026-08-24T14:00:00Z' },
  { id: 'n4', title: 'Quiz Completed', message: 'You scored 78% on the SQL fundamentals quiz.', type: 'achievement', read: true, timestamp: '2026-08-24T11:00:00Z' },
  { id: 'n5', title: 'Competency Improved', message: 'Your JavaScript competency increased by 4% this week.', type: 'achievement', read: true, timestamp: '2026-08-23T16:00:00Z' },
  { id: 'n6', title: 'Faculty Assignment', message: 'Dr. Sharma assigned you a new practical challenge.', type: 'faculty', read: false, timestamp: '2026-08-25T10:00:00Z' },
];

export const allStudents: StudentSummary[] = [
  { id: 'u1', name: 'Anand Krishnamurthy', email: 'anand@gov.in', careerGoal: 'Statistical Officer', overallCompetency: 72, atRisk: false, skills: studentSkills, lastActive: '2026-08-25' },
  { id: 'u2', name: 'Deepa Nair', email: 'deepa@gov.in', careerGoal: 'Data Analyst', overallCompetency: 65, atRisk: false, skills: [], lastActive: '2026-08-25' },
  { id: 'u3', name: 'Rajesh Verma', email: 'rajesh@gov.in', careerGoal: 'Survey Officer', overallCompetency: 42, atRisk: true, skills: [], lastActive: '2026-08-22' },
  { id: 'u4', name: 'Sunita Patel', email: 'sunita@gov.in', careerGoal: 'Research Officer', overallCompetency: 78, atRisk: false, skills: [], lastActive: '2026-08-25' },
  { id: 'u5', name: 'Mohan Das', email: 'mohan@gov.in', careerGoal: 'Data Manager', overallCompetency: 58, atRisk: true, skills: [], lastActive: '2026-08-23' },
  { id: 'u6', name: 'Kavitha Subramaniam', email: 'kavitha@gov.in', careerGoal: 'Senior Statistical Officer', overallCompetency: 82, atRisk: false, skills: [], lastActive: '2026-08-25' },
  { id: 'u7', name: 'Prakash Reddy', email: 'prakash@gov.in', careerGoal: 'Statistical Investigator', overallCompetency: 48, atRisk: true, skills: [], lastActive: '2026-08-24' },
  { id: 'u8', name: 'Meena Gupta', email: 'meena@gov.in', careerGoal: 'Data Analyst', overallCompetency: 70, atRisk: false, skills: [], lastActive: '2026-08-25' },
];

export const heatmapData: CompetencyHeatmapEntry[] = [
  { studentId: 'u1', studentName: 'Anand K.', skills: { 'Stat Methods': 68, 'Survey': 42, 'Data Analysis': 75, 'Official Stats': 80, 'Data Viz': 60 } },
  { studentId: 'u2', studentName: 'Deepa N.', skills: { 'Stat Methods': 72, 'Survey': 58, 'Data Analysis': 70, 'Official Stats': 75, 'Data Viz': 68 } },
  { studentId: 'u3', studentName: 'Rajesh V.', skills: { 'Stat Methods': 38, 'Survey': 35, 'Data Analysis': 42, 'Official Stats': 45, 'Data Viz': 40 } },
  { studentId: 'u4', studentName: 'Sunita P.', skills: { 'Stat Methods': 82, 'Survey': 70, 'Data Analysis': 78, 'Official Stats': 85, 'Data Viz': 72 } },
  { studentId: 'u5', studentName: 'Mohan D.', skills: { 'Stat Methods': 52, 'Survey': 40, 'Data Analysis': 55, 'Official Stats': 60, 'Data Viz': 48 } },
  { studentId: 'u6', studentName: 'Kavitha S.', skills: { 'Stat Methods': 85, 'Survey': 88, 'Data Analysis': 82, 'Official Stats': 85, 'Data Viz': 78 } },
  { studentId: 'u7', studentName: 'Prakash R.', skills: { 'Stat Methods': 42, 'Survey': 45, 'Data Analysis': 38, 'Official Stats': 50, 'Data Viz': 35 } },
  { studentId: 'u8', studentName: 'Meena G.', skills: { 'Stat Methods': 65, 'Survey': 60, 'Data Analysis': 72, 'Official Stats': 70, 'Data Viz': 75 } },
];

export const targetRoles = [
  'Statistical Officer',
  'Data Analyst',
  'Survey Officer',
  'Research Officer',
  'Data Manager',
  'Statistical Investigator',
  'Senior Statistical Officer',
  'Joint Director Statistics',
];

export const availableSkills = [
  'Fundamentals of Statistics', 'Sampling Techniques', 'Survey Methodology',
  'Data Collection', 'Data Quality Assurance', 'Data Analysis',
  'Statistical Methods', 'Official Statistics', 'Data Visualization',
  'Statistical Software', 'Data Interpretation', 'Data Dissemination',
  'Data Management', 'Spreadsheet Analysis', 'Python for Statistics',
  'R Programming', 'Data Security', 'Analytical Thinking',
  'Research Methods', 'Communication', 'Data Ethics', 'Confidentiality',
];
