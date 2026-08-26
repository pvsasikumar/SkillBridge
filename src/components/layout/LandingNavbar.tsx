import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-outline-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 gradient-btn rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[18px]">school</span>
            </div>
            <span className="text-base font-bold text-on-surface">SkillBridge</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">How It Works</a>
            <a href="#benefits" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">Benefits</a>
            <a href="#roles" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">Career Roles</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="gradient" size="sm">Get Started</Button>
            </Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-xl hover:bg-surface-container">
            {mobileOpen ? <span className="material-symbols-outlined text-[20px]">close</span> : <span className="material-symbols-outlined text-[20px]">menu</span>}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-outline-light glass-panel px-4 py-4 space-y-3">
          <a href="#how-it-works" className="block text-sm text-on-surface-variant py-2">How It Works</a>
          <a href="#benefits" className="block text-sm text-on-surface-variant py-2">Benefits</a>
          <a href="#roles" className="block text-sm text-on-surface-variant py-2">Career Roles</a>
          <div className="pt-3 border-t border-outline-light flex flex-col gap-2">
            <Link to="/login"><Button variant="outline" fullWidth size="sm">Log In</Button></Link>
            <Link to="/signup"><Button variant="gradient" fullWidth size="sm">Get Started</Button></Link>
          </div>
        </div>
      )}
    </nav>
  );
}
