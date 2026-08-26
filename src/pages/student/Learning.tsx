import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import {
  AITutorChatbox,
  AITutorToggle,
} from '@/components/AITutorChatbox';
import { learningModules, currentUser, studentSkills, assessmentResults } from '@/data/mockData';
import type { AIContext } from '@/types';
import { cn } from '@/lib/utils';

const sections = [
  { id: 'concept', label: 'Concept', icon: 'menu_book' },
  { id: 'example', label: 'Example', icon: 'code' },
  { id: 'practice', label: 'Practice', icon: 'help' },
  { id: 'check', label: 'Quick Check', icon: 'check_circle' },
];

export default function Learning() {
  const [activeModule] = useState(learningModules[1]);
  const [activeSection, setActiveSection] = useState('concept');
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const currentModuleIndex = learningModules.indexOf(activeModule);
  const currentSectionIndex = sections.findIndex((s) => s.id === activeSection);

  const aiContext: AIContext = useMemo(() => {
    const skillGaps = studentSkills
      .filter((s) => s.status === 'needs-attention')
      .map((s) => s.name);

    const competencies: Record<string, number> = {};
    studentSkills.forEach((s) => {
      competencies[s.name] = s.currentLevel;
    });

    const recentQuiz = assessmentResults
      .filter((r) => r.type === 'adaptive')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    return {
      student: {
        name: currentUser.name,
        targetRole: currentUser.careerGoal || 'Developer',
      },
      competencies,
      skillGaps,
      currentTopic: activeModule.skill,
      currentLesson: activeModule.title,
      recentPerformance: {
        quizScore: recentQuiz?.score ?? 0,
        recentMistakes: [
          'useEffect dependency handling',
        ],
      },
    };
  }, [activeModule]);

  return (
    <div className="h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-4rem)] flex flex-col">
      <div className="border-b border-outline-light glass-panel px-4 sm:px-6 py-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs text-outline">
              Step {currentModuleIndex + 1} of {learningModules.length}
            </span>
            <h1 className="text-sm sm:text-base font-semibold text-on-surface">
              {activeModule.title}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-on-surface-variant hidden sm:block">
              Progress: {activeModule.progress}%
            </span>
            <div className="w-24 hidden sm:block">
              <Progress value={activeModule.progress} size="sm" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="hidden lg:block w-56 border-r border-outline-light glass-panel shrink-0 overflow-y-auto">
          <div className="p-3 space-y-1">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider px-3 mb-2">
              Sections
            </p>
            {sections.map((section, i) => {
              const isActive = activeSection === section.id;
              const isDone = i < currentSectionIndex;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  )}
                >
                  {isDone ? (
                    <span className="material-symbols-outlined text-[16px] text-success-500 shrink-0">check_circle</span>
                  ) : (
                    <span className={`material-symbols-outlined text-[16px] shrink-0 ${isActive ? 'text-primary-500' : 'text-outline'}`}>{section.icon}</span>
                  )}
                  <span className="truncate">{section.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-3 border-t border-outline-light mt-2">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider px-3 mb-2">
              Other Topics
            </p>
            {learningModules.slice(0, 4).map((m) => (
              <div
                key={m.id}
                className={cn(
                  'px-3 py-2 rounded-xl text-sm cursor-pointer transition-colors',
                  m.id === activeModule.id
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-on-surface-variant hover:bg-surface-container'
                )}
              >
                <p className="truncate">{m.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8">
            <div className="flex gap-1 mb-6 lg:hidden overflow-x-auto pb-2">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap',
                    activeSection === s.id
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-high text-on-surface-variant'
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {activeSection === 'concept' && (
              <article className="prose prose-sm max-w-none">
                <h1 className="text-2xl font-bold text-on-surface">JavaScript Promises</h1>
                <div className="mt-6 space-y-4 text-gray-700 leading-relaxed">
                  <h2 className="text-lg font-semibold text-on-surface">
                    What are JavaScript Promises?
                  </h2>
                  <p>
                    A <strong>Promise</strong> is an object representing the eventual completion
                    or failure of an asynchronous operation.
                  </p>

                  <h3 className="text-base font-semibold text-on-surface mt-6">The Three States</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li>
                      <strong>Pending</strong> — Initial state, neither fulfilled nor rejected
                    </li>
                    <li>
                      <strong>Fulfilled</strong> — The operation completed successfully
                    </li>
                    <li>
                      <strong>Rejected</strong> — The operation failed
                    </li>
                  </ol>

                  <h3 className="text-base font-semibold text-on-surface mt-6">
                    Creating a Promise
                  </h3>
                  <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-sm overflow-x-auto">
                    <code>{`const myPromise = new Promise((resolve, reject) => {
  const data = fetchUserData(123);

  if (data) {
    resolve(data);    // Success!
  } else {
    reject(new Error('User not found'));
  }
});`}</code>
                  </pre>

                  <h3 className="text-base font-semibold text-on-surface mt-6">
                    Using .then() and .catch()
                  </h3>
                  <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-sm overflow-x-auto">
                    <code>{`myPromise
  .then(data => console.log(data))
  .catch(error => console.error(error));`}</code>
                  </pre>

                  <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mt-6">
                    <p className="text-sm font-semibold text-primary-800">Key Takeaway</p>
                    <p className="text-sm text-primary-700 mt-1">
                      Promises provide a structured way to handle asynchronous operations,
                      avoiding callback hell and making code more readable and maintainable.
                    </p>
                  </div>
                </div>
              </article>
            )}

            {activeSection !== 'concept' && (
              <div className="text-center py-16">
                <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-[20px] text-outline">menu_book</span>
                </div>
                <p className="text-sm text-on-surface-variant">Section content coming soon</p>
              </div>
            )}

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-outline-light">
              <Button
                variant="ghost"
                disabled={currentSectionIndex === 0}
                onClick={() =>
                  setActiveSection(sections[currentSectionIndex - 1]?.id)
                }
              >
                Previous
              </Button>
              {currentSectionIndex < sections.length - 1 ? (
                <Button
                  onClick={() =>
                    setActiveSection(sections[currentSectionIndex + 1]?.id)
                  }
                >
                  Next Section
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </Button>
              ) : (
                <Button>Complete Topic</Button>
              )}
            </div>
          </div>
        </div>

        <div className="hidden lg:flex w-80 border-l border-outline-light shrink-0">
          <AITutorChatbox context={aiContext} className="w-full" />
        </div>
      </div>

      <AITutorToggle
        isOpen={mobileChatOpen}
        onClick={() => setMobileChatOpen((prev) => !prev)}
      />
      {mobileChatOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/30" onClick={() => setMobileChatOpen(false)}>
          <div
            className="absolute inset-x-0 bottom-0 top-14 glass-panel flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <AITutorChatbox
              context={aiContext}
              isMobileOpen={mobileChatOpen}
              onMobileClose={() => setMobileChatOpen(false)}
              className="h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
