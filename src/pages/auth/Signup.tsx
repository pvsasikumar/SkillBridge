import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
        <div className="relative z-10 max-w-md text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-[32px] text-white">school</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Start Your Skill Journey</h1>
          <p className="text-primary-100 text-lg leading-relaxed">
            Create your account, identify your skill gaps, and get a personalized roadmap to reach your career goals.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] text-white">school</span>
            </div>
            <span className="text-base font-bold text-on-surface">SkillBridge</span>
          </div>

          <h2 className="text-2xl font-bold text-on-surface">Create your account</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:text-primary-700">Sign in</Link>
          </p>

          <form className="mt-8 space-y-4" onSubmit={e => { e.preventDefault(); window.location.href = '/onboarding'; }}>
            <Input label="Full Name" placeholder="Enter your name" icon={<span className="material-symbols-outlined text-[16px]">person</span>} />
            <Input label="Email" type="email" placeholder="you@college.edu" icon={<span className="material-symbols-outlined text-[16px]">mail</span>} />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              icon={<span className="material-symbols-outlined text-[16px]">lock</span>}
              trailing={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-outline hover:text-on-surface-variant">
                  {showPassword ? <span className="material-symbols-outlined text-[16px]">visibility_off</span> : <span className="material-symbols-outlined text-[16px]">visibility</span>}
                </button>
              }
            />
            <Select
              label="Education"
              options={[
                { value: '', label: 'Select education level' },
                { value: 'high-school', label: 'High School' },
                { value: 'diploma', label: 'Diploma' },
                { value: 'bachelors', label: "Bachelor's Degree" },
                { value: 'masters', label: "Master's Degree" },
                { value: 'phd', label: 'PhD' },
              ]}
            />
            <Input label="Current Course / Program" placeholder="e.g. B.Tech CSE" />
            <Select
              label="Experience Level"
              options={[
                { value: '', label: 'Select experience' },
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
              ]}
            />

            <div className="pt-2">
              <Button type="submit" fullWidth size="lg">
                Create Account
              </Button>
            </div>
          </form>

          <p className="mt-6 text-xs text-outline text-center leading-relaxed">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
