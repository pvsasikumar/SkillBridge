import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { currentUser } from '@/data/mockData';
import { Avatar } from '@/components/ui/Avatar';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { label: 'Training Resources', path: '/igot-courses', icon: 'description' },
  { label: 'Competencies', path: '/skills', icon: 'gps_fixed' },
  { label: 'Learning', path: '/learning', icon: 'menu_book' },
  { label: 'Assessments', path: '/quiz', icon: 'assignment' },
  { label: 'Verified Skills', path: '/verified-skills', icon: 'check_circle' },
  { label: 'Progress', path: '/progress', icon: 'trending_up' },
  { label: 'Skill Passport', path: '/passport', icon: 'emoji_events' },
];

export function StudentLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col glass-panel border-r border-outline-light">
        <div className="flex h-16 items-center gap-2.5 px-5 border-b border-outline-light">
          <div className="w-8 h-8 gradient-btn rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[18px]">school</span>
          </div>
          <span className="text-base font-bold text-on-surface">SkillBridge</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                )}
              >
                <span className={cn('material-symbols-outlined text-[18px]', isActive ? 'text-primary-500' : 'text-outline')}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-outline-light">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar name={currentUser.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-on-surface truncate">{currentUser.name}</p>
              <p className="text-xs text-on-surface-variant truncate">{currentUser.education || 'Statistical Officer'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 glass-panel border-b border-outline-light flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 gradient-btn rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[15px]">school</span>
          </div>
          <span className="text-sm font-bold text-on-surface">SkillBridge</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/notifications" className="p-2 rounded-xl hover:bg-surface-container relative">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-xl hover:bg-surface-container">
            {mobileOpen ? <span className="material-symbols-outlined text-[18px]">close</span> : <span className="material-symbols-outlined text-[18px]">menu</span>}
          </button>
        </div>
      </div>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-on-surface/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 right-0 glass-panel shadow-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 gradient-btn rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[18px]">school</span>
                </div>
                <span className="text-base font-bold text-on-surface">SkillBridge</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-surface-container">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <nav className="space-y-1">
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

      {/* Main content */}
      <div className="lg:pl-64">
        <header className="hidden lg:flex h-16 items-center justify-between border-b border-outline-light glass-panel sticky top-0 z-30 px-8">
          <div />
          <div className="flex items-center gap-4">
            <Link to="/notifications" className="p-2 rounded-xl hover:bg-surface-container relative transition-colors">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
            </Link>
            <Link to="/profile" className="flex items-center gap-3 hover:bg-surface-container rounded-xl px-2 py-1.5 transition-colors">
              <Avatar name={currentUser.name} size="sm" />
              <div className="hidden xl:block">
                <p className="text-sm font-medium text-on-surface">{currentUser.name}</p>
                <p className="text-xs text-on-surface-variant">{currentUser.education || 'Statistical Officer'}</p>
              </div>
            </Link>
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
