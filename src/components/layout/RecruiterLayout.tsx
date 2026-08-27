import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { recruiterUser } from '@/data/recruiterData';
import { Avatar } from '@/components/ui/Avatar';

const navItems = [
  { label: 'Overview', path: '/recruiter', icon: 'dashboard' },
  { label: 'Company Profile', path: '/recruiter/company', icon: 'business' },
  { label: 'Jobs', path: '/recruiter/jobs', icon: 'work' },
  { label: 'Candidates', path: '/recruiter/candidates', icon: 'group' },
  { label: 'Shortlisted', path: '/recruiter/shortlisted', icon: 'how_to_reg' },
  { label: 'Interviews', path: '/recruiter/interviews', icon: 'calendar_today' },
  { label: 'Interview Feedback', path: '/recruiter/feedback', icon: 'chat' },
  { label: 'AI Assistant', path: '/recruiter/ai-assistant', icon: 'chat' },
  { label: 'Analytics', path: '/recruiter/analytics', icon: 'bar_chart' },
];

export function RecruiterLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col bg-white border-r border-outline-light/60">
        <div className="flex h-16 items-center gap-2.5 px-5 border-b border-outline-light/60">
          <div className="w-8 h-8 gradient-btn rounded-lg flex items-center justify-center shadow-sm shadow-primary-500/20">
            <span className="material-symbols-outlined text-white text-[18px]">school</span>
          </div>
          <span className="text-base font-bold tracking-tight text-on-surface">SkillBridge</span>
          <span className="ml-auto text-[10px] font-bold bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full border border-primary-200/50">Recruiter</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const isActive = location.pathname === item.path || (item.path !== '/recruiter' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary-50 text-primary-700 sidebar-active'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                )}
              >
                <span className={cn('material-symbols-outlined text-[18px]', isActive ? 'text-primary-600' : 'text-outline')}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-outline-light/60">
          <Link to="/recruiter/company" className="flex items-center gap-3 px-3 py-2 hover:bg-surface-container rounded-xl transition-colors">
            <Avatar name={recruiterUser.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-on-surface truncate">{recruiterUser.name}</p>
              <p className="text-xs text-on-surface-variant">Recruiter</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b border-outline-light/60 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 gradient-btn rounded-lg flex items-center justify-center shadow-sm shadow-primary-500/20">
            <span className="material-symbols-outlined text-white text-[15px]">school</span>
          </div>
          <span className="text-sm font-bold tracking-tight text-on-surface">SkillBridge</span>
          <span className="text-[10px] font-bold bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded-full border border-primary-200/50">Recruiter</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/notifications" className="p-2 rounded-xl hover:bg-surface-container relative transition-colors">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">notifications</span>
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-xl hover:bg-surface-container transition-colors">
            {mobileOpen ? <span className="material-symbols-outlined text-[18px]">close</span> : <span className="material-symbols-outlined text-[18px]">menu</span>}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 right-0 bg-white shadow-xl p-4 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-bold tracking-tight text-on-surface">Recruiter Portal</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <nav className="space-y-0.5">
              {navItems.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                      isActive ? 'bg-primary-50 text-primary-700' : 'text-on-surface-variant hover:bg-surface-container'
                    )}
                  >
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="hidden lg:flex h-16 items-center justify-between border-b border-outline-light/60 bg-white/80 backdrop-blur-xl sticky top-0 z-30 px-8">
          <div />
          <div className="flex items-center gap-4">
            <Link to="/notifications" className="p-2 rounded-xl hover:bg-surface-container relative transition-colors">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full ring-2 ring-white" />
            </Link>
            <div className="flex items-center gap-3">
              <Avatar name={recruiterUser.name} size="sm" />
              <div className="hidden xl:block">
                <p className="text-sm font-semibold text-on-surface">{recruiterUser.name}</p>
                <p className="text-xs text-on-surface-variant">ABC Technologies</p>
              </div>
            </div>
            <Link to="/" className="p-2 rounded-xl hover:bg-surface-container text-outline hover:text-on-surface-variant transition-colors">
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </Link>
          </div>
        </header>

        <main className="min-h-[calc(100vh-3.5rem)] lg:min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
