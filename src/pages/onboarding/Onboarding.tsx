import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { targetRoles, availableSkills } from '@/data/mockData';

const steps = [
  { title: 'About You', icon: 'menu_book' },
  { title: 'Current Competencies', icon: 'gps_fixed' },
  { title: 'Target Role', icon: 'rocket_launch' },
  { title: 'Training Preferences', icon: 'tune' },
  { title: 'Start', icon: 'check_circle' },
];

const skillLevels = ['Beginner', 'Intermediate', 'Advanced'] as const;

const learningPreferences = [
  { id: 'video', label: 'Video Tutorials', desc: 'Learn through iGOT Karmayogi video content' },
  { id: 'reading', label: 'Reading Materials', desc: 'Official handbooks, manuals, and notes' },
  { id: 'practice', label: 'Practice Quizzes', desc: 'AI-generated quizzes from learning materials' },
  { id: 'assessments', label: 'Competency Assessments', desc: 'Baseline and reassessment evaluations' },
  { id: 'mixed', label: 'Mixed Learning', desc: 'Combination of all training methods' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState<Record<string, string>>({});
  const [careerGoal, setCareerGoal] = useState('');
  const [learningPref, setLearningPref] = useState('');
  const [education, setEducation] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');

  const progress = ((step + 1) / steps.length) * 100;

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => {
      if (prev[skill]) {
        const next = { ...prev };
        delete next[skill];
        return next;
      }
      return { ...prev, [skill]: 'Beginner' };
    });
  };

  return (
    <div className="min-h-screen bg-gray-25">
      {/* Top bar */}
      <div className="bg-surface border-b border-outline-light px-4 sm:px-8 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] text-white">rocket_launch</span>
            </div>
            <span className="text-sm font-bold text-on-surface">Onboarding</span>
          </div>
          <span className="text-sm text-on-surface-variant">Step {step + 1} of {steps.length}</span>
        </div>
        <div className="max-w-2xl mx-auto mt-3">
          <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors',
                i < step ? 'bg-success-500 text-white' : i === step ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'
              )}>
                {i < step ? <span className="material-symbols-outlined text-[14px]">check_circle</span> : i + 1}
              </div>
              {i < steps.length - 1 && <div className={cn('w-8 h-0.5', i < step ? 'bg-success-500' : 'bg-surface-container-high')} />}
            </div>
          ))}
        </div>

        {/* Step content */}
        <Card padding="lg">
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-on-surface">Tell us about your role</h2>
                <p className="text-sm text-on-surface-variant mt-1">Help us personalize your capacity building path</p>
              </div>
              <Select
                label="Education Level"
                value={education}
                onChange={e => setEducation(e.target.value)}
                options={[
                  { value: '', label: 'Select your education' },
                  { value: 'bachelors', label: "Bachelor's Degree" },
                  { value: 'masters', label: "Master's Degree" },
                  { value: 'diploma', label: 'Diploma' },
                ]}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Department"
                  value={course}
                  onChange={e => setCourse(e.target.value)}
                  options={[
                    { value: '', label: 'Select department' },
                    { value: 'nso', label: 'National Statistical Office' },
                    { value: 'mospi', label: 'MoSPI' },
                    { value: 'data-mgmt', label: 'Data Management Division' },
                    { value: 'survey', label: 'Survey Design Division' },
                    { value: 'other', label: 'Other' },
                  ]}
                />
                <Select
                  label="Experience"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  options={[
                    { value: '', label: 'Select experience' },
                    { value: 'junior', label: 'Junior (0-3 years)' },
                    { value: 'mid', label: 'Mid-Level (3-8 years)' },
                    { value: 'senior', label: 'Senior (8+ years)' },
                  ]}
                />
              </div>
              <Select
                label="Experience Level"
                options={[
                  { value: '', label: 'Select experience level' },
                  { value: 'beginner', label: 'Beginner — New to the system' },
                  { value: 'intermediate', label: 'Intermediate — Some field experience' },
                  { value: 'advanced', label: 'Advanced — Extensive experience' },
                ]}
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-on-surface">Select your current competencies</h2>
                <p className="text-sm text-on-surface-variant mt-1">Pick areas you have knowledge in and rate your proficiency</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableSkills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={cn(
                      'px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left',
                      selectedSkills[skill]
                        ? 'border-primary-300 bg-primary-50 text-primary-700'
                        : 'border-outline-light bg-surface text-on-surface hover:border-outline'
                    )}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {Object.keys(selectedSkills).length > 0 && (
                <div className="space-y-3 pt-2">
                  <p className="text-sm font-medium text-on-surface">Rate your proficiency for selected competencies:</p>
                  {Object.keys(selectedSkills).map(skill => (
                    <div key={skill} className="flex items-center justify-between">
                      <span className="text-sm text-on-surface">{skill}</span>
                      <div className="flex gap-1">
                        {skillLevels.map(level => (
                          <button
                            key={level}
                            onClick={() => setSelectedSkills(prev => ({ ...prev, [skill]: level }))}
                            className={cn(
                              'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                              selectedSkills[skill] === level
                                ? 'bg-primary text-white'
                                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
                            )}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-on-surface">What role do you want to build competency for?</h2>
                <p className="text-sm text-on-surface-variant mt-1">We'll customize your training path based on your target role</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {targetRoles.map(role => (
                  <button
                    key={role}
                    onClick={() => setCareerGoal(role)}
                    className={cn(
                      'p-4 rounded-xl border text-left transition-all',
                      careerGoal === role
                        ? 'border-primary-300 bg-primary-50 ring-2 ring-primary-200'
                        : 'border-outline-light hover:border-outline'
                    )}
                  >
                    <p className={cn('text-sm font-semibold', careerGoal === role ? 'text-primary-700' : 'text-on-surface')}>{role}</p>
                    {careerGoal === role && <span className="material-symbols-outlined text-[16px] text-primary mt-1">check_circle</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-on-surface">How do you prefer to learn?</h2>
                <p className="text-sm text-on-surface-variant mt-1">We'll prioritize content that matches your learning style</p>
              </div>
              <div className="space-y-3">
                {learningPreferences.map(pref => (
                  <button
                    key={pref.id}
                    onClick={() => setLearningPref(pref.id)}
                    className={cn(
                      'w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between',
                      learningPref === pref.id
                        ? 'border-primary-300 bg-primary-50 ring-2 ring-primary-200'
                        : 'border-outline-light hover:border-outline'
                    )}
                  >
                    <div>
                      <p className={cn('text-sm font-semibold', learningPref === pref.id ? 'text-primary-700' : 'text-on-surface')}>{pref.label}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{pref.desc}</p>
                    </div>
                    {learningPref === pref.id && <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[32px] text-success-500">check_circle</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-on-surface">Your personalized competency assessment is ready</h2>
                <p className="text-sm text-on-surface-variant mt-2 max-w-sm mx-auto">
                  We've prepared a tailored baseline assessment based on your goals and current competencies. This will identify your exact competency gaps.
                </p>
              </div>
                <div className="flex items-center justify-center gap-4 pt-2 text-sm text-on-surface-variant">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-primary-500 rounded-full" /> {Object.keys(selectedSkills).length} competencies selected</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-primary-500 rounded-full" /> Goal: {careerGoal || 'Statistical Officer'}</div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-surface-container-high">
            <Button
              variant="ghost"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              Back
            </Button>
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep(s => s + 1)}>
                Continue
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Button>
            ) : (
              <Button onClick={() => navigate('/quiz')}>
                Begin Assessment
                <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
