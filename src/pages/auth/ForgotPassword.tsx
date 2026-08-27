import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-surface">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 gradient-btn rounded-lg flex items-center justify-center shadow-sm shadow-primary-500/20">
            <span className="material-symbols-outlined text-white text-[18px]">school</span>
          </div>
          <span className="text-base font-bold tracking-tight text-on-surface">SkillBridge</span>
        </div>

        <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Reset your password</h2>
        <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form className="mt-8 space-y-5" onSubmit={e => e.preventDefault()}>
          <Input
            label="Email"
            type="email"
            placeholder="you@college.edu"
            icon={<span className="material-symbols-outlined text-[16px]">mail</span>}
          />
          <Button type="submit" fullWidth size="lg" className="shadow-lg shadow-primary-500/20">
            Send Reset Link
          </Button>
        </form>

        <Link to="/login" className="mt-6 flex items-center justify-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors font-medium">
          <span className="material-symbols-outlined text-[14px]">arrow_back</span>
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
