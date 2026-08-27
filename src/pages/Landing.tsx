import { Link } from 'react-router-dom';
import { LandingNavbar } from '@/components/layout/LandingNavbar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const benefits = [
  {
    icon: 'psychology',
    title: 'AI Competency Gap Detection',
    description: 'AI analyzes your current competencies against government role requirements and identifies precise gaps in India\'s Official Statistical System.',
    gradient: 'from-primary-500 to-secondary-500',
  },
  {
    icon: 'route',
    title: 'Personalized Learning Paths',
    description: 'Custom training roadmaps integrated with iGOT Karmayogi and internal resources, tailored to your role and competency gaps.',
    gradient: 'from-secondary-500 to-tertiary-500',
  },
  {
    icon: 'assignment',
    title: 'AI-Powered Assessments',
    description: 'Smart quizzes and MCQs generated from uploaded learning materials to measure your competency progress.',
    gradient: 'from-tertiary-500 to-primary-500',
  },
  {
    icon: 'bar_chart',
    title: 'Capacity Building Analytics',
    description: 'Track competency improvement with before vs after analysis, verified skills, and organizational capacity building reports.',
    gradient: 'from-primary-600 to-secondary-600',
  },
];

const steps = [
  { num: '01', title: 'Assess', description: 'Take baseline competency assessment', icon: 'assessment' },
  { num: '02', title: 'Detect Gaps', description: 'AI identifies competency gaps', icon: 'search' },
  { num: '03', title: 'Personalize', description: 'Get iGOT & internal training paths', icon: 'tune' },
  { num: '04', title: 'Learn', description: 'Complete AI-generated assessments', icon: 'menu_book' },
  { num: '05', title: 'Improve', description: 'Measure competency improvement', icon: 'trending_up' },
];

const roles = [
  { name: 'Statistical Officer', icon: 'analytics' },
  { name: 'Data Analyst', icon: 'query_stats' },
  { name: 'Survey Officer', icon: 'poll' },
  { name: 'Research Officer', icon: 'science' },
  { name: 'Data Manager', icon: 'database' },
  { name: 'Statistical Investigator', icon: 'fact_check' },
];

const stats = [
  { value: '10K+', label: 'Officials Trained' },
  { value: '500+', label: 'Competency Gaps Resolved' },
  { value: '95%', label: 'Improvement Rate' },
  { value: '50+', label: 'Departments' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="hero-mesh absolute inset-0 pointer-events-none" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary-400/8 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200/60 rounded-full text-sm font-medium text-primary-700 mb-8 animate-fade-in">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              AI-Powered Capacity Building
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-on-surface leading-[1.1] tracking-tight animate-slide-up">
              Know Your Competencies.{' '}
              <span className="gradient-text">Find Your Gaps.</span>{' '}
              Build India's Statistical Capacity.
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-on-surface-variant leading-relaxed max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
              An AI-enabled platform that identifies competency gaps and recommends personalized training through iGOT Karmayogi integration for capacity building in India's Official Statistical System.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link to="/signup">
                <Button variant="gradient" size="lg" className="text-base px-8 shadow-lg shadow-primary-500/25">
                  Start Skill Assessment
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="outline" size="lg" className="text-base">
                  Explore How It Works
                </Button>
              </a>
            </div>
          </div>

          {/* Flow visualization */}
          <div className="mt-20 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {['Official Profile', 'AI Assessment', 'Competency Gap Detection', 'Personalized Training', 'Capacity Building'].map((step, i) => (
                <div key={step} className="flex items-center gap-2 sm:gap-3">
                  <div className="px-4 py-2.5 glass-card text-sm font-semibold text-on-surface shadow-sm">
                    {step}
                  </div>
                  {i < 4 && (
                    <span className="material-symbols-outlined text-primary-400 hidden sm:block shrink-0 text-[18px]">arrow_forward</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '400ms' }}>
            {stats.map(stat => (
              <div key={stat.label} className="text-center py-4">
                <p className="text-2xl sm:text-3xl font-extrabold gradient-text">{stat.value}</p>
                <p className="text-sm text-on-surface-variant mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-container/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">Why SkillBridge</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
              Everything you need to build statistical capacity
            </h2>
            <p className="mt-4 text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              Our platform combines AI analysis with structured training to strengthen capacity building in India's Official Statistical System.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {benefits.map(b => (
              <div key={b.title} className="glass-card p-6 group hover:shadow-lg hover:border-primary-200/60 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-11 h-11 bg-gradient-to-br ${b.gradient} rounded-xl flex items-center justify-center mb-5 shadow-sm`}>
                  <span className="material-symbols-outlined text-[20px] text-white">{b.icon}</span>
                </div>
                <h3 className="text-base font-bold text-on-surface mb-2">{b.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">Process</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">How It Works</h2>
            <p className="mt-4 text-lg text-on-surface-variant">Five simple steps from assessment to capacity building</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 stagger-children">
            {steps.map((step, i) => (
              <div key={step.num} className="text-center relative group">
                <div className="w-14 h-14 gradient-btn text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-[22px]">{step.icon}</span>
                </div>
                {i < 4 && (
                  <div className="hidden lg:block absolute top-7 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-0.5 bg-gradient-to-r from-primary-200 to-secondary-200" />
                )}
                <p className="text-xs font-bold text-primary-500 mb-1">{step.num}</p>
                <h3 className="text-base font-bold text-on-surface mb-1">{step.title}</h3>
                <p className="text-sm text-on-surface-variant">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Roles */}
      <section id="career-roles" className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-container/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">Government Roles</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
              Build Competency for Your Government Role
            </h2>
            <p className="mt-4 text-lg text-on-surface-variant">Select your role and we'll identify exactly what competencies you need to develop</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto stagger-children">
            {roles.map(role => (
              <div key={role.name} className="glass-card p-5 text-center group hover:border-primary-200/60 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
                <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-100 transition-colors">
                  <span className="material-symbols-outlined text-[20px] text-primary-500">{role.icon}</span>
                </div>
                <p className="text-sm font-semibold text-on-surface">{role.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl gradient-btn p-12 sm:p-16 text-center shadow-2xl shadow-primary-500/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent)]" />
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Start building your statistical competency
              </h2>
              <p className="mt-4 text-white/80 text-lg max-w-xl mx-auto leading-relaxed">
                Take your baseline competency assessment and get a personalized training path through iGOT Karmayogi integration.
              </p>
              <div className="mt-8">
                <Link to="/signup">
                  <Button className="bg-white text-primary-700 hover:bg-white/90 px-8 py-3 text-base font-bold shadow-lg">
                    Start Competency Assessment
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-white/90">check_circle</span>
                  Free to start
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-white/90">check_circle</span>
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-white/90">shield</span>
                  Secure & Private
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-outline-light/60 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 gradient-btn rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[14px]">school</span>
            </div>
            <span className="text-sm font-bold text-on-surface">SkillBridge</span>
          </div>
          <p className="text-xs text-on-surface-variant text-center">
            AI-Enabled Competency & Capacity Building Platform for India's Official Statistical System
          </p>
          <div className="flex items-center gap-4 text-xs text-on-surface-variant">
            <a href="#" className="hover:text-on-surface transition-colors">Privacy</a>
            <a href="#" className="hover:text-on-surface transition-colors">Terms</a>
            <a href="#" className="hover:text-on-surface transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
