import type {
  CompetencyCategory,
  CompetencyDefinition,
  RoleCompetencyRequirement,
  GovernmentRole,
  ExternalCourse,
} from '@/types';

// ── Competency Categories ─────────────────────────────────────────

export const competencyCategories: CompetencyCategory[] = [
  {
    id: 'cat-statistical',
    name: 'Statistical Competencies',
    description: 'Core statistical and methodological skills',
    competencies: [
      { id: 'comp-1', name: 'Fundamentals of Statistics', description: 'Basic statistical concepts, measures of central tendency and dispersion', categoryId: 'cat-statistical', proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced'], isActive: true },
      { id: 'comp-2', name: 'Sampling Techniques', description: 'Random, stratified, cluster, and multi-stage sampling methods', categoryId: 'cat-statistical', proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced'], isActive: true },
      { id: 'comp-3', name: 'Survey Methodology', description: 'Survey design, questionnaire construction, and field operations', categoryId: 'cat-statistical', proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced'], isActive: true },
      { id: 'comp-4', name: 'Data Collection', description: 'Primary and secondary data collection methods and quality control', categoryId: 'cat-statistical', proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced'], isActive: true },
      { id: 'comp-5', name: 'Data Quality Assurance', description: 'Data validation, cleaning, and quality metrics', categoryId: 'cat-statistical', proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced'], isActive: true },
      { id: 'comp-6', name: 'Data Analysis', description: 'Statistical analysis techniques, hypothesis testing, regression', categoryId: 'cat-statistical', proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced'], isActive: true },
      { id: 'comp-7', name: 'Statistical Methods', description: 'Advanced statistical methods, time series, multivariate analysis', categoryId: 'cat-statistical', proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced'], isActive: true },
      { id: 'comp-8', name: 'Official Statistics', description: 'National Statistical System, NSO frameworks, data dissemination standards', categoryId: 'cat-statistical', proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced'], isActive: true },
      { id: 'comp-9', name: 'Data Visualization', description: 'Charts, dashboards, and statistical data presentation', categoryId: 'cat-statistical', proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced'], isActive: true },
      { id: 'comp-10', name: 'Statistical Software', description: 'SPSS, SAS, R, Stata, and other statistical tools', categoryId: 'cat-statistical', proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced'], isActive: true },
      { id: 'comp-11', name: 'Data Interpretation', description: 'Interpreting statistical outputs and drawing conclusions', categoryId: 'cat-statistical', proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced'], isActive: true },
      { id: 'comp-12', name: 'Data Dissemination', description: 'Reporting standards, publication, and data sharing protocols', categoryId: 'cat-statistical', proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced'], isActive: true },
    ],
  },
  {
    id: 'cat-digital',
    name: 'Digital Competencies',
    description: 'Technology and digital literacy skills',
    competencies: [
      { id: 'comp-13', name: 'Data Management', description: 'Database design, data warehousing, and data lifecycle management', categoryId: 'cat-digital', proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced'], isActive: true },
      { id: 'comp-14', name: 'Spreadsheet Analysis', description: 'Advanced Excel/Google Sheets for data analysis and reporting', categoryId: 'cat-digital', proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced'], isActive: true },
      { id: 'comp-15', name: 'Python for Statistics', description: 'Python programming for statistical analysis and data processing', categoryId: 'cat-digital', proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced'], isActive: true },
      { id: 'comp-16', name: 'R Programming', description: 'R language for statistical computing and graphics', categoryId: 'cat-digital', proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced'], isActive: true },
      { id: 'comp-17', name: 'Data Security', description: 'Data protection, encryption, and access control', categoryId: 'cat-digital', proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced'], isActive: true },
    ],
  },
  {
    id: 'cat-professional',
    name: 'Professional Competencies',
    description: 'Soft skills and professional capabilities',
    competencies: [
      { id: 'comp-18', name: 'Analytical Thinking', description: 'Critical thinking, problem-solving, and analytical reasoning', categoryId: 'cat-professional', proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced'], isActive: true },
      { id: 'comp-19', name: 'Research Methods', description: 'Research design, methodology, and academic writing', categoryId: 'cat-professional', proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced'], isActive: true },
      { id: 'comp-20', name: 'Communication', description: 'Technical writing, presentation, and data storytelling', categoryId: 'cat-professional', proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced'], isActive: true },
      { id: 'comp-21', name: 'Data Ethics', description: 'Ethical data handling, privacy, and responsible AI use', categoryId: 'cat-professional', proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced'], isActive: true },
      { id: 'comp-22', name: 'Confidentiality', description: 'Handling sensitive data, data classification, and compliance', categoryId: 'cat-professional', proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced'], isActive: true },
    ],
  },
];

export const allCompetencies: CompetencyDefinition[] = competencyCategories.flatMap(c => c.competencies);

// ── Role-Based Competency Requirements ────────────────────────────

export const roleRequirements: RoleCompetencyRequirement[] = [
  // Statistical Officer
  { id: 'rr-1', role: 'Statistical Officer', competencyId: 'comp-7', competencyName: 'Statistical Methods', requiredLevel: 75, priority: 'high' },
  { id: 'rr-2', role: 'Statistical Officer', competencyId: 'comp-3', competencyName: 'Survey Methodology', requiredLevel: 70, priority: 'high' },
  { id: 'rr-3', role: 'Statistical Officer', competencyId: 'comp-6', competencyName: 'Data Analysis', requiredLevel: 75, priority: 'high' },
  { id: 'rr-4', role: 'Statistical Officer', competencyId: 'comp-8', competencyName: 'Official Statistics', requiredLevel: 80, priority: 'high' },
  { id: 'rr-5', role: 'Statistical Officer', competencyId: 'comp-9', competencyName: 'Data Visualization', requiredLevel: 65, priority: 'medium' },
  { id: 'rr-6', role: 'Statistical Officer', competencyId: 'comp-10', competencyName: 'Statistical Software', requiredLevel: 60, priority: 'medium' },
  { id: 'rr-7', role: 'Statistical Officer', competencyId: 'comp-1', competencyName: 'Fundamentals of Statistics', requiredLevel: 80, priority: 'high' },
  { id: 'rr-8', role: 'Statistical Officer', competencyId: 'comp-18', competencyName: 'Analytical Thinking', requiredLevel: 70, priority: 'medium' },

  // Data Analyst
  { id: 'rr-9', role: 'Data Analyst', competencyId: 'comp-6', competencyName: 'Data Analysis', requiredLevel: 80, priority: 'high' },
  { id: 'rr-10', role: 'Data Analyst', competencyId: 'comp-15', competencyName: 'Python for Statistics', requiredLevel: 70, priority: 'high' },
  { id: 'rr-11', role: 'Data Analyst', competencyId: 'comp-9', competencyName: 'Data Visualization', requiredLevel: 75, priority: 'high' },
  { id: 'rr-12', role: 'Data Analyst', competencyId: 'comp-14', competencyName: 'Spreadsheet Analysis', requiredLevel: 80, priority: 'high' },
  { id: 'rr-13', role: 'Data Analyst', competencyId: 'comp-11', competencyName: 'Data Interpretation', requiredLevel: 75, priority: 'medium' },
  { id: 'rr-14', role: 'Data Analyst', competencyId: 'comp-5', competencyName: 'Data Quality Assurance', requiredLevel: 65, priority: 'medium' },

  // Survey Officer
  { id: 'rr-15', role: 'Survey Officer', competencyId: 'comp-3', competencyName: 'Survey Methodology', requiredLevel: 85, priority: 'high' },
  { id: 'rr-16', role: 'Survey Officer', competencyId: 'comp-2', competencyName: 'Sampling Techniques', requiredLevel: 80, priority: 'high' },
  { id: 'rr-17', role: 'Survey Officer', competencyId: 'comp-4', competencyName: 'Data Collection', requiredLevel: 80, priority: 'high' },
  { id: 'rr-18', role: 'Survey Officer', competencyId: 'comp-5', competencyName: 'Data Quality Assurance', requiredLevel: 70, priority: 'medium' },
  { id: 'rr-19', role: 'Survey Officer', competencyId: 'comp-20', competencyName: 'Communication', requiredLevel: 70, priority: 'medium' },

  // Research Officer
  { id: 'rr-20', role: 'Research Officer', competencyId: 'comp-19', competencyName: 'Research Methods', requiredLevel: 85, priority: 'high' },
  { id: 'rr-21', role: 'Research Officer', competencyId: 'comp-7', competencyName: 'Statistical Methods', requiredLevel: 75, priority: 'high' },
  { id: 'rr-22', role: 'Research Officer', competencyId: 'comp-6', competencyName: 'Data Analysis', requiredLevel: 75, priority: 'high' },
  { id: 'rr-23', role: 'Research Officer', competencyId: 'comp-18', competencyName: 'Analytical Thinking', requiredLevel: 80, priority: 'medium' },

  // Data Manager
  { id: 'rr-24', role: 'Data Manager', competencyId: 'comp-13', competencyName: 'Data Management', requiredLevel: 85, priority: 'high' },
  { id: 'rr-25', role: 'Data Manager', competencyId: 'comp-5', competencyName: 'Data Quality Assurance', requiredLevel: 80, priority: 'high' },
  { id: 'rr-26', role: 'Data Manager', competencyId: 'comp-17', competencyName: 'Data Security', requiredLevel: 75, priority: 'high' },
  { id: 'rr-27', role: 'Data Manager', competencyId: 'comp-14', competencyName: 'Spreadsheet Analysis', requiredLevel: 70, priority: 'medium' },

  // Statistical Investigator
  { id: 'rr-28', role: 'Statistical Investigator', competencyId: 'comp-2', competencyName: 'Sampling Techniques', requiredLevel: 75, priority: 'high' },
  { id: 'rr-29', role: 'Statistical Investigator', competencyId: 'comp-4', competencyName: 'Data Collection', requiredLevel: 80, priority: 'high' },
  { id: 'rr-30', role: 'Statistical Investigator', competencyId: 'comp-1', competencyName: 'Fundamentals of Statistics', requiredLevel: 70, priority: 'high' },
  { id: 'rr-31', role: 'Statistical Investigator', competencyId: 'comp-10', competencyName: 'Statistical Software', requiredLevel: 60, priority: 'medium' },
];

export const governmentRoles: GovernmentRole[] = [
  'Statistical Officer',
  'Data Analyst',
  'Survey Officer',
  'Research Officer',
  'Data Manager',
  'Statistical Investigator',
  'Senior Statistical Officer',
  'Joint Director Statistics',
  'Additional Director Statistics',
  'Deputy Director Statistics',
];

// ── Mock Government Officials ─────────────────────────────────────

export interface MockOfficial {
  id: string;
  name: string;
  email: string;
  department: string;
  ministry: string;
  designation: string;
  governmentRole: GovernmentRole;
  experienceLevel: string;
  areaOfWork: string;
  overallCompetency: number;
  atRisk: boolean;
  lastActive: string;
  competencyScores: Record<string, number>;
}

export const mockOfficials: MockOfficial[] = [
  { id: 'u1', name: 'Anand Krishnamurthy', email: 'anand@gov.in', department: 'National Statistical Office', ministry: 'Ministry of Statistics & Programme Implementation', designation: 'Deputy Director', governmentRole: 'Statistical Officer', experienceLevel: 'Senior', areaOfWork: 'National Accounts', overallCompetency: 72, atRisk: false, lastActive: '2026-08-25', competencyScores: { 'comp-1': 78, 'comp-2': 65, 'comp-3': 70, 'comp-6': 75, 'comp-7': 72, 'comp-8': 80, 'comp-9': 60 } },
  { id: 'u2', name: 'Deepa Nair', email: 'deepa@gov.in', department: 'Data Management Division', ministry: 'Ministry of Statistics & Programme Implementation', designation: 'Statistical Officer', governmentRole: 'Data Analyst', experienceLevel: 'Mid-Level', areaOfWork: 'Census Data', overallCompetency: 65, atRisk: false, lastActive: '2026-08-25', competencyScores: { 'comp-6': 70, 'comp-9': 68, 'comp-14': 75, 'comp-15': 55, 'comp-11': 62 } },
  { id: 'u3', name: 'Rajesh Verma', email: 'rajesh@gov.in', department: 'Survey Design Division', ministry: 'Ministry of Statistics & Programme Implementation', designation: 'Survey Investigator', governmentRole: 'Survey Officer', experienceLevel: 'Junior', areaOfWork: 'Household Surveys', overallCompetency: 42, atRisk: true, lastActive: '2026-08-22', competencyScores: { 'comp-2': 38, 'comp-3': 45, 'comp-4': 40, 'comp-5': 35 } },
  { id: 'u4', name: 'Sunita Patel', email: 'sunita@gov.in', department: 'Research Wing', ministry: 'Ministry of Statistics & Programme Implementation', designation: 'Research Officer', governmentRole: 'Research Officer', experienceLevel: 'Senior', areaOfWork: 'Economic Research', overallCompetency: 78, atRisk: false, lastActive: '2026-08-25', competencyScores: { 'comp-6': 82, 'comp-7': 78, 'comp-19': 85, 'comp-18': 80, 'comp-11': 75 } },
  { id: 'u5', name: 'Mohan Das', email: 'mohan@gov.in', department: 'IT & Data Security', ministry: 'Ministry of Statistics & Programme Implementation', designation: 'Data Manager', governmentRole: 'Data Manager', experienceLevel: 'Mid-Level', areaOfWork: 'Data Infrastructure', overallCompetency: 58, atRisk: true, lastActive: '2026-08-23', competencyScores: { 'comp-13': 62, 'comp-17': 55, 'comp-5': 58, 'comp-14': 60 } },
  { id: 'u6', name: 'Kavitha Subramaniam', email: 'kavitha@gov.in', department: 'Field Operations', ministry: 'Ministry of Statistics & Programme Implementation', designation: 'Senior Statistical Officer', governmentRole: 'Senior Statistical Officer', experienceLevel: 'Senior', areaOfWork: 'NSS Surveys', overallCompetency: 82, atRisk: false, lastActive: '2026-08-25', competencyScores: { 'comp-1': 85, 'comp-2': 80, 'comp-3': 88, 'comp-7': 82, 'comp-8': 85 } },
  { id: 'u7', name: 'Prakash Reddy', email: 'prakash@gov.in', department: 'Data Processing Centre', ministry: 'Ministry of Statistics & Programme Implementation', designation: 'Statistical Investigator', governmentRole: 'Statistical Investigator', experienceLevel: 'Junior', areaOfWork: 'Data Processing', overallCompetency: 48, atRisk: true, lastActive: '2026-08-24', competencyScores: { 'comp-2': 42, 'comp-4': 50, 'comp-10': 45, 'comp-1': 52 } },
  { id: 'u8', name: 'Meena Gupta', email: 'meena@gov.in', department: 'Dissemination Division', ministry: 'Ministry of Statistics & Programme Implementation', designation: 'Data Analyst', governmentRole: 'Data Analyst', experienceLevel: 'Mid-Level', areaOfWork: 'Data Reporting', overallCompetency: 70, atRisk: false, lastActive: '2026-08-25', competencyScores: { 'comp-9': 75, 'comp-11': 72, 'comp-12': 68, 'comp-6': 65 } },
  { id: 'u9', name: 'Suresh Iyer', email: 'suresh@gov.in', department: 'Quality Assurance', ministry: 'Ministry of Statistics & Programme Implementation', designation: 'Assistant Director', governmentRole: 'Joint Director Statistics', experienceLevel: 'Senior', areaOfWork: 'Quality Assurance', overallCompetency: 85, atRisk: false, lastActive: '2026-08-25', competencyScores: { 'comp-5': 88, 'comp-8': 82, 'comp-18': 86, 'comp-21': 80 } },
  { id: 'u10', name: 'Lakshmi Menon', email: 'lakshmi@gov.in', department: 'Regional Statistics', ministry: 'Ministry of Statistics & Programme Implementation', designation: 'Deputy Director', governmentRole: 'Deputy Director Statistics', experienceLevel: 'Senior', areaOfWork: 'Regional Data Analysis', overallCompetency: 76, atRisk: false, lastActive: '2026-08-25', competencyScores: { 'comp-6': 80, 'comp-7': 75, 'comp-9': 72, 'comp-20': 78 } },
];

// ── Mock iGOT Courses ────────────────────────────────────────────

export const mockIGOTCourses: ExternalCourse[] = [
  { id: 'igot-1', title: 'Fundamentals of Survey Sampling', provider: 'iGOT Karmayogi (Demo)', providerType: 'igot', description: 'Comprehensive course on sampling methodologies used in national surveys', competencies: ['Sampling Techniques', 'Survey Methodology'], duration: '8 hours', difficulty: 'Intermediate', url: 'https://learn.igot.gov.in/demo/survey-sampling', relevanceScore: 95 },
  { id: 'igot-2', title: 'Data Quality Management Framework', provider: 'iGOT Karmayogi (Demo)', providerType: 'igot', description: 'Best practices for ensuring data quality in official statistics', competencies: ['Data Quality Assurance', 'Data Management'], duration: '6 hours', difficulty: 'Intermediate', url: 'https://learn.igot.gov.in/demo/data-quality', relevanceScore: 88 },
  { id: 'igot-3', title: 'Statistical Computing with R', provider: 'iGOT Karmayogi (Demo)', providerType: 'igot', description: 'Learn R programming for statistical analysis and visualization', competencies: ['R Programming', 'Statistical Methods'], duration: '12 hours', difficulty: 'Intermediate', url: 'https://learn.igot.gov.in/demo/r-programming', relevanceScore: 82 },
  { id: 'igot-4', title: 'Official Statistics and NSO Framework', provider: 'iGOT Karmayogi (Demo)', providerType: 'igot', description: 'Understanding India\'s National Statistical System and dissemination standards', competencies: ['Official Statistics', 'Data Dissemination'], duration: '5 hours', difficulty: 'Beginner', url: 'https://learn.igot.gov.in/demo/official-stats', relevanceScore: 90 },
  { id: 'igot-5', title: 'Data Visualization for Policy Makers', provider: 'iGOT Karmayogi (Demo)', providerType: 'igot', description: 'Creating effective data visualizations for policy reports', competencies: ['Data Visualization', 'Communication'], duration: '4 hours', difficulty: 'Beginner', url: 'https://learn.igot.gov.in/demo/data-viz', relevanceScore: 85 },
  { id: 'igot-6', title: 'Advanced Regression Analysis', provider: 'iGOT Karmayogi (Demo)', providerType: 'igot', description: 'Multiple regression, logistic regression, and panel data methods', competencies: ['Statistical Methods', 'Data Analysis'], duration: '10 hours', difficulty: 'Advanced', url: 'https://learn.igot.gov.in/demo/regression', relevanceScore: 78 },
  { id: 'igot-7', title: 'Field Survey Management', provider: 'iGOT Karmayogi (Demo)', providerType: 'igot', description: 'Planning and managing large-scale field surveys', competencies: ['Survey Methodology', 'Data Collection'], duration: '7 hours', difficulty: 'Intermediate', url: 'https://learn.igot.gov.in/demo/field-survey', relevanceScore: 92 },
  { id: 'igot-8', title: 'Python for Statistical Analysis', provider: 'iGOT Karmayogi (Demo)', providerType: 'igot', description: 'Using pandas, numpy, and scipy for statistical computing', competencies: ['Python for Statistics', 'Data Analysis'], duration: '9 hours', difficulty: 'Intermediate', url: 'https://learn.igot.gov.in/demo/python-stats', relevanceScore: 86 },
];

// ── Internal Learning Resources ───────────────────────────────────

export const internalCourses: ExternalCourse[] = [
  { id: 'int-1', title: 'NSSO Survey Methods Handbook', provider: 'Internal Learning Library', providerType: 'internal', description: 'Official handbook on NSSO survey methodologies', competencies: ['Survey Methodology', 'Official Statistics'], duration: '6 hours', difficulty: 'Intermediate', url: '#', relevanceScore: 90 },
  { id: 'int-2', title: 'Census Data Processing Guide', provider: 'Internal Learning Library', providerType: 'internal', description: 'Step-by-step guide for census data processing', competencies: ['Data Collection', 'Data Quality Assurance'], duration: '4 hours', difficulty: 'Beginner', url: '#', relevanceScore: 85 },
  { id: 'int-3', title: 'Data Dissemination Standards Manual', provider: 'Internal Learning Library', providerType: 'internal', description: 'Standards and protocols for data dissemination', competencies: ['Data Dissemination', 'Official Statistics'], duration: '3 hours', difficulty: 'Beginner', url: '#', relevanceScore: 78 },
  { id: 'int-4', title: 'Statistical Software Training Kit', provider: 'Internal Learning Library', providerType: 'internal', description: 'Hands-on training for SPSS, SAS, and R', competencies: ['Statistical Software', 'Data Analysis'], duration: '8 hours', difficulty: 'Intermediate', url: '#', relevanceScore: 82 },
];

// ── Admin Configurable Roles ─────────────────────────────────────

export interface ConfigurableRole {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export const configurableRoles: ConfigurableRole[] = governmentRoles.map((role, i) => ({
  id: `role-${i + 1}`,
  name: role,
  description: `Government role in India's Official Statistical System`,
  isActive: true,
}));
