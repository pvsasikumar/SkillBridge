import { Link } from 'react-router-dom';
import { LandingNavbar } from '@/components/layout/LandingNavbar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const benefits = [
  { icon: 'psychology', title: 'AI Competency Gap Detection', description: 'AI analyzes your current competencies against government role requirements and identifies precise gaps in India\'s Official Statistical System.' },
  { icon: 'route', title: 'Personalized Learning Paths', description: 'Custom training roadmaps integrated with iGOT Karmayogi and internal resources, tailored to your role and competency gaps.' },
  { icon: 'assignment', title: 'AI-Powered Assessments', description: 'Smart quizzes and MCQs generated from uploaded learning materials to measure your competency progress.' },
  { icon: 'bar_chart', title: 'Capacity Building Analytics', description: 'Track competency improvement with before vs after analysis, verified skills, and organizational capacity building reports.' },
];

const steps = [
  { num: '01', title: 'Assess', description: 'Take baseline competency assessment' },
  { num: '02', title: 'Detect Gaps', description: 'AI identifies competency gaps' },
  { num: '03', title: 'Personalize', description: 'Get iGOT & internal training paths' },
  { num: '04', title: 'Learn', description: 'Complete AI-generated assessments' },
  { num: '05', title: 'Improve', description: 'Measure competency improvement' },
];

const roles = [
  'Statistical Officer',
  'Data Analyst',
  'Survey Officer',
  'Research Officer',
  'Data Manager',
  'Statistical Investigator',
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface">
      <LandingNavbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-6">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              AI-Powered Capacity Building
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-on-surface leading-tight tracking-tight">
              Know Your Competencies.{' '}
              <span className="gradient-text">Find Your Gaps.</span>{' '}
              Build India's Statistical Capacity.
            </h1>
            <p className="mt-6 text-lg text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
              An AI-enabled platform that identifies competency gaps and recommends personalized training through iGOT Karmayogi integration for capacity building in India's Official Statistical System.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button variant="gradient" size="lg">
                  Start Skill Assessment
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="outline" size="lg">
                  Explore How It Works
                </Button>
              </a>
            </div>
          </div>

          {/* Flow visualization */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {['Official Profile', 'AI Assessment', 'Competency Gap Detection', 'Personalized Training', 'Capacity Building'].map((step, i) => (
                <div key={step} className="flex items-center gap-3 sm:gap-4">
                  <div className="px-4 py-2.5 glass-card text-sm font-medium text-on-surface">
                    {step}
                  </div>
                  {i < 4 && <span className="material-symbols-outlined text-outline hidden sm:block shrink-0 text-[18px]">chevron_right</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-container">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-on-surface">Everything you need to build statistical capacity</h2>
            <p className="mt-3 text-on-surface-variant max-w-2xl mx-auto">
              Our platform combines AI analysis with structured training to strengthen capacity building in India's Official Statistical System.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map(b => (
              <Card key={b.title} hover className="p-6">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[20px] text-primary-500">{b.icon}</span>
                </div>
                <h3 className="text-base font-semibold text-on-surface mb-2">{b.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{b.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-on-surface">How It Works</h2>
            <p className="mt-3 text-on-surface-variant">Five simple steps from assessment to capacity building</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="text-center relative">
                <div className="w-12 h-12 gradient-btn text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4">
                  {step.num}
                </div>
                {i < 4 && (
                  <div className="hidden lg:block absolute top-6 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-outline-light" />
                )}
                <h3 className="text-base font-semibold text-on-surface mb-1">{step.title}</h3>
                <p className="text-sm text-on-surface-variant">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Roles */}
      <section id="roles" className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-container">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-on-surface">Build Competency for Your Government Role</h2>
            <p className="mt-3 text-on-surface-variant">Select your role and we'll identify exactly what competencies you need to develop</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {roles.map(role => (
              <Card key={role} hover className="p-4 text-center">
                <span className="material-symbols-outlined text-[20px] text-primary-500 mx-auto mb-2 block">gps_fixed</span>
                <p className="text-sm font-medium text-on-surface">{role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-on-surface">Start building your statistical competency</h2>
          <p className="mt-4 text-on-surface-variant text-lg">
            Take your baseline competency assessment and get a personalized training path through iGOT Karmayogi integration.
          </p>
          <div className="mt-8">
            <Link to="/signup">
              <Button variant="gradient" size="lg">
                Start Competency Assessment
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex items-center justify-center gap-8 text-sm text-on-surface-variant">
            <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-success-500">check_circle</span> Free to start</div>
            <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-success-500">check_circle</span> No credit card required</div>
            <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-success-500">check_circle</span> <span className="material-symbols-outlined text-[14px]">shield</span> Secure</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-outline-light py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 gradient-btn rounded-md flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[12px]">menu_book</span>
            </div>
            <span className="text-sm font-semibold text-on-surface">SkillBridge</span>
          </div>
          <p className="text-xs text-on-surface-variant">AI-Enabled Competency & Capacity Building Platform for India's Official Statistical System</p>
        </div>
      </footer>
    </div>
  );
}
