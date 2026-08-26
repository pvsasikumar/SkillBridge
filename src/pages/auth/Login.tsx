import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
        <div className="relative z-10 max-w-md text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-[32px] text-white">school</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Welcome back to SkillBridge</h1>
          <p className="text-primary-100 text-lg leading-relaxed">
            Continue building India's statistical capacity. Your personalized competency development path awaits.
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] text-white">school</span>
            </div>
            <span className="text-base font-bold text-on-surface">SkillBridge</span>
          </div>

          <h2 className="text-2xl font-bold text-on-surface">Sign in</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Don't have an account? <Link to="/signup" className="text-primary font-medium hover:text-primary-700">Create one</Link>
          </p>

          <form className="mt-8 space-y-5" onSubmit={e => { e.preventDefault(); window.location.href = '/dashboard'; }}>
            <Input
              label="Email"
              type="email"
              placeholder="you@gov.in"
              icon={<span className="material-symbols-outlined text-[16px]">mail</span>}
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              icon={<span className="material-symbols-outlined text-[16px]">lock</span>}
              value={password}
              onChange={e => setPassword(e.target.value)}
              trailing={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-outline hover:text-on-surface-variant">
                  {showPassword ? <span className="material-symbols-outlined text-[16px]">visibility_off</span> : <span className="material-symbols-outlined text-[16px]">visibility</span>}
                </button>
              }
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-on-surface-variant">
                <input type="checkbox" className="w-4 h-4 rounded border-outline-light text-primary" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-primary font-medium hover:text-primary-700">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" fullWidth size="lg">
              Sign In
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-light" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-surface px-3 text-outline">Quick Demo Access</span></div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Link to="/dashboard">
                <Button variant="outline" fullWidth size="sm">Official Demo</Button>
              </Link>
              <Link to="/faculty">
                <Button variant="outline" fullWidth size="sm">Trainer Demo</Button>
              </Link>
              <Link to="/recruiter">
                <Button variant="outline" fullWidth size="sm">Recruiter Demo</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
