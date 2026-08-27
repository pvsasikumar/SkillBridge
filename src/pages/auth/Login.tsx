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
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.12),transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/10 to-transparent" />

        <div className="relative z-10 flex flex-col items-center justify-center p-12 w-full">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20">
              <span className="material-symbols-outlined text-[32px] text-white">school</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Welcome back to SkillBridge</h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Continue building India's statistical capacity. Your personalized competency development path awaits.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 text-center max-w-md">
            {[
              { val: '10K+', lbl: 'Officials' },
              { val: '500+', lbl: 'Gaps Resolved' },
              { val: '95%', lbl: 'Improvement' },
            ].map(s => (
              <div key={s.lbl}>
                <p className="text-2xl font-extrabold text-white">{s.val}</p>
                <p className="text-xs text-white/60 mt-1">{s.lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 gradient-btn rounded-lg flex items-center justify-center shadow-sm shadow-primary-500/20">
              <span className="material-symbols-outlined text-white text-[18px]">school</span>
            </div>
            <span className="text-base font-bold tracking-tight text-on-surface">SkillBridge</span>
          </div>

          <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Sign in</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">Create one</Link>
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
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-outline hover:text-on-surface-variant transition-colors">
                  {showPassword
                    ? <span className="material-symbols-outlined text-[16px]">visibility_off</span>
                    : <span className="material-symbols-outlined text-[16px]">visibility</span>}
                </button>
              }
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-on-surface-variant cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-outline-light text-primary-600 focus:ring-primary-500/20" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" fullWidth size="lg" className="shadow-lg shadow-primary-500/20">
              Sign In
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-light/60" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-surface px-3 text-on-surface-variant font-medium">Quick Demo Access</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Link to="/dashboard">
                <Button variant="outline" fullWidth size="sm">Official</Button>
              </Link>
              <Link to="/faculty">
                <Button variant="outline" fullWidth size="sm">Trainer</Button>
              </Link>
              <Link to="/recruiter">
                <Button variant="outline" fullWidth size="sm">Recruiter</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
