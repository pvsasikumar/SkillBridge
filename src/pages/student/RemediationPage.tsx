import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { AIInsight } from '@/components/ui/AIInsight';
import { useApp } from '@/context/AppContext';
import { studentSkills } from '@/data/mockData';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'video', label: 'Video', icon: 'play_arrow' },
  { id: 'notes', label: 'Notes', icon: 'description' },
  { id: 'examples', label: 'Examples', icon: 'code' },
  { id: 'practice', label: 'Practice', icon: 'construction' },
  { id: 'assessment', label: 'Assessment', icon: 'assignment' },
] as const;

type TabId = (typeof TABS)[number]['id'];

const defaultSkill = studentSkills.find(s => s.name === 'React') ?? studentSkills[1];

export default function RemediationPage() {
  const { planId } = useParams<{ planId: string }>();
  const { learningPlans, updateLearningPlan, addVerifiedSkill, addCredential } = useApp();

  const plan = planId ? learningPlans.find(p => p.id === planId) : undefined;
  const skillName = plan?.skillGap ?? defaultSkill.name;
  const skill = studentSkills.find(s => s.name === skillName) ?? defaultSkill;
  const currentLevel = plan?.currentLevel ?? skill.currentLevel;
  const targetLevel = plan?.targetLevel ?? skill.requiredLevel;

  const [activeTab, setActiveTab] = useState<TabId>('video');
  const [completedSections, setCompletedSections] = useState<Set<TabId>>(new Set());
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const toggleSection = useCallback((tab: TabId) => {
    setCompletedSections(prev => {
      const next = new Set(prev);
      if (next.has(tab)) {
        next.delete(tab);
      } else {
        next.add(tab);
      }
      return next;
    });
  }, []);

  const completionPercent = Math.round((completedSections.size / TABS.length) * 100);
  const allComplete = completedSections.size === TABS.length;

  const handlePracticeSubmit = () => {
    if (practiceAnswer.trim().length > 0) {
      setPracticeSubmitted(true);
      toggleSection('practice');
    }
  };

  const handleQuizSubmit = () => {
    if (quizAnswer !== null) {
      setQuizSubmitted(true);
      toggleSection('assessment');
    }
  };

  const skillGaps = studentSkills.filter(s => s.requiredLevel > s.currentLevel);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/skills" className="text-sm text-outline hover:text-gray-600">Skill Gaps</Link>
            <span className="material-symbols-outlined text-[14px] text-gray-300">chevron_right</span>
            <span className="text-sm text-on-surface font-medium">Remediation</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface">{skillName} — Skill Gap Remediation</h1>
          <p className="text-sm text-on-surface-variant mt-1">Personalized learning path to close your skill gap</p>
        </div>
        <Link to="/quiz">
          <Button>
            <span className="material-symbols-outlined text-[16px]">assignment</span>
            Take Assessment
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px] text-primary">gps_fixed</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-on-surface">{skillName} Competency</h2>
                  <p className="text-sm text-on-surface-variant">Close the gap to reach your target level</p>
                </div>
              </div>
              <Badge variant={completionPercent === 100 ? 'success' : 'primary'} size="md">
                {completionPercent}% Complete
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-surface-container rounded-xl">
                <p className="text-2xl font-bold text-on-surface">{currentLevel}%</p>
                <p className="text-xs text-on-surface-variant mt-0.5">Current Level</p>
              </div>
              <div className="p-3 bg-surface-container rounded-xl">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-2xl font-bold text-danger-600">{targetLevel - currentLevel}%</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">Gap to Close</p>
              </div>
              <div className="p-3 bg-primary-50 rounded-xl">
                <p className="text-2xl font-bold text-primary">{targetLevel}%</p>
                <p className="text-xs text-on-surface-variant mt-0.5">Target Level</p>
              </div>
            </div>
          </Card>

          <Card padding="none" className="overflow-hidden">
            <div className="border-b border-outline-light px-5 py-3">
              <div className="flex items-center gap-1 overflow-x-auto">
                {TABS.map(tab => {
                  const isDone = completedSections.has(tab.id);
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors',
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-on-surface-variant hover:bg-surface-container hover:text-gray-700'
                      )}
                    >
                      {isDone ? (
                        <span className="material-symbols-outlined text-[15px] text-success-500">check_circle</span>
                      ) : (
                        <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
                      )}
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {activeTab === 'video' && (
                <div className="space-y-4">
                  <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
                    <img
                      src={`https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover opacity-70"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 glass-panel rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-[28px] text-primary ml-1">play_arrow</span>
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-xs text-white/80 bg-black/50 px-2 py-1 rounded">Video Lesson</span>
                      <span className="text-xs text-white/80 bg-black/50 px-2 py-1 rounded flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px]">schedule</span>
                        12 min
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-on-surface">Understanding useState and useEffect</h3>
                    <p className="text-sm text-on-surface-variant mt-1">
                      Learn the fundamentals of React Hooks including useState for state management and useEffect for side effects.
                      This video covers practical examples and common patterns.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant={completedSections.has('video') ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => toggleSection('video')}
                    >
                      {completedSections.has('video') ? (
                        <>
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          Completed
                        </>
                      ) : (
                        <>
                          Mark as Watched
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </>
                      )}
                    </Button>
                    <span className="text-xs text-outline">Duration: 12 minutes</span>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <article className="prose prose-sm max-w-none">
                    <h2 className="text-lg font-semibold text-on-surface">React Hooks Fundamentals</h2>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                      <h3 className="text-base font-semibold text-on-surface mt-4">What are React Hooks?</h3>
                      <p className="text-sm">
                        Hooks are functions that let you &quot;hook into&quot; React state and lifecycle features from function components.
                        They provide a more direct API to concepts you already know: props, state, context, refs, and lifecycle.
                      </p>

                      <h3 className="text-base font-semibold text-on-surface mt-4">useState</h3>
                      <p className="text-sm">
                        <code className="bg-surface-container-high px-1.5 py-0.5 rounded text-xs font-mono">useState</code> is the most basic Hook.
                        It lets you add React state to function components:
                      </p>
                      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-sm overflow-x-auto">
                        <code>{`const [count, setCount] = useState(0);

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`}</code>
                      </pre>

                      <h3 className="text-base font-semibold text-on-surface mt-4">useEffect</h3>
                      <p className="text-sm">
                        <code className="bg-surface-container-high px-1.5 py-0.5 rounded text-xs font-mono">useEffect</code> lets you perform side effects in function components.
                        Data fetching, subscriptions, or manually changing the DOM are all side effects.
                      </p>
                      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-sm overflow-x-auto">
                        <code>{`useEffect(() => {
  document.title = \`You clicked \${count} times\`;
}, [count]);`}</code>
                      </pre>

                      <h3 className="text-base font-semibold text-on-surface mt-4">Rules of Hooks</h3>
                      <ol className="list-decimal pl-5 space-y-2 text-sm">
                        <li>Only call Hooks at the top level — not inside loops, conditions, or nested functions</li>
                        <li>Only call Hooks from React functions — either from React function components or custom Hooks</li>
                      </ol>

                      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mt-4">
                        <p className="text-sm font-semibold text-primary-800">Key Takeaway</p>
                        <p className="text-sm text-primary-700 mt-1">
                          Hooks let you use state and other React features without writing a class component.
                          They make it easier to reuse stateful logic between components.
                        </p>
                      </div>
                    </div>
                  </article>
                  <Button
                    variant={completedSections.has('notes') ? 'outline' : 'primary'}
                    size="sm"
                    onClick={() => toggleSection('notes')}
                  >
                    {completedSections.has('notes') ? (
                      <>
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        Completed
                      </>
                    ) : (
                      <>
                        Mark as Read
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </>
                    )}
                  </Button>
                </div>
              )}

              {activeTab === 'examples' && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-on-surface">Code Examples: useEffect for Data Fetching</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Basic API Data Fetching with useEffect</p>
                      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-sm overflow-x-auto">
                        <code>{`import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  return <h1>{user?.name}</h1>;
}`}</code>
                      </pre>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Cleanup Function in useEffect</p>
                      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-sm overflow-x-auto">
                        <code>{`function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch(\`/api/search?q=\${query}\`, {
      signal: controller.signal,
    })
      .then(res => res.json())
      .then(data => setResults(data.results))
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      });

    return () => controller.abort();
  }, [query]);

  return (
    <ul>
      {results.map(r => <li key={r.id}>{r.title}</li>)}
    </ul>
  );
}`}</code>
                      </pre>
                    </div>
                  </div>
                  <Button
                    variant={completedSections.has('examples') ? 'outline' : 'primary'}
                    size="sm"
                    onClick={() => toggleSection('examples')}
                  >
                    {completedSections.has('examples') ? (
                      <>
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        Completed
                      </>
                    ) : (
                      <>
                        Mark as Reviewed
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </>
                    )}
                  </Button>
                </div>
              )}

              {activeTab === 'practice' && (
                <div className="space-y-4">
                  <div className="bg-warning-50 border border-warning-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-warning-700">Practice Challenge: Build a Search Component</p>
                    <p className="text-sm text-warning-600 mt-1">
                      Create a search component that uses useState for the search query and useEffect to fetch results from an API.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">Requirements:</p>
                    <ul className="space-y-2 text-sm text-on-surface-variant">
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[14px] text-success-500 mt-0.5 shrink-0">check_circle</span>
                        Input field with controlled state using useState
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[14px] text-success-500 mt-0.5 shrink-0">check_circle</span>
                        useEffect that triggers on search query changes
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[14px] text-success-500 mt-0.5 shrink-0">check_circle</span>
                        Display loading state while fetching
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[14px] text-success-500 mt-0.5 shrink-0">check_circle</span>
                        Cleanup function to abort previous requests
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Your Solution</label>
                    <textarea
                      value={practiceAnswer}
                      onChange={(e) => setPracticeAnswer(e.target.value)}
                      placeholder="Write your Search component here..."
                      className="w-full h-40 px-3.5 py-2.5 text-sm bg-gray-900 text-gray-100 font-mono rounded-xl border border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none resize-none"
                    />
                  </div>

                  {!practiceSubmitted ? (
                    <Button onClick={handlePracticeSubmit} disabled={practiceAnswer.trim().length === 0}>
                      Submit Solution
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Button>
                  ) : (
                    <div className="bg-success-50 border border-success-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-[16px] text-success-600">check_circle</span>
                        <p className="text-sm font-semibold text-success-700">Solution Submitted</p>
                      </div>
                      <p className="text-sm text-success-600">
                        Great work! You&apos;ve practiced building a search component with React Hooks.
                        This covers the essential pattern of combining useState and useEffect.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'assessment' && (
                <div className="space-y-4">
                  <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-primary-800">Quick Knowledge Check</p>
                    <p className="text-sm text-primary-700 mt-1">Test your understanding of React Hooks before proceeding to the full assessment.</p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-on-surface">
                      What is the correct way to use the useEffect cleanup function to cancel a fetch request?
                    </p>
                    <div className="space-y-2">
                      {[
                        'Return a function that calls controller.abort()',
                        'Call controller.abort() directly in useEffect',
                        'Use the finally block of the fetch promise',
                        'Set a timeout to cancel the request',
                      ].map((option, i) => (
                        <label
                          key={i}
                          className={cn(
                            'flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors',
                            quizSubmitted && i === 0
                              ? 'bg-success-50 border-success-200'
                              : quizAnswer === i
                                ? 'bg-primary-50 border-primary-200'
                                : 'bg-white border-outline-light hover:bg-surface-container'
                          )}
                        >
                          <input
                            type="radio"
                            name="quiz"
                            checked={quizAnswer === i}
                            onChange={() => setQuizAnswer(i)}
                            disabled={quizSubmitted}
                            className="mt-0.5"
                          />
                          <span className="text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {quizSubmitted && (
                    <div className="bg-success-50 border border-success-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-[16px] text-success-600">check_circle</span>
                        <p className="text-sm font-semibold text-success-700">
                          {quizAnswer === 0 ? 'Correct!' : 'Almost there — review the notes above.'}
                        </p>
                      </div>
                      <p className="text-sm text-success-600">
                        The cleanup function returned from useEffect runs when the component unmounts or when the dependency changes.
                        This is essential for preventing memory leaks and race conditions.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    {!quizSubmitted ? (
                      <Button onClick={handleQuizSubmit} disabled={quizAnswer === null}>
                        Submit Answer
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Button>
                    ) : (
                      <Button
                        variant={completedSections.has('assessment') ? 'outline' : 'primary'}
                        size="sm"
                        onClick={() => toggleSection('assessment')}
                      >
                        {completedSections.has('assessment') ? (
                          <>
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            Completed
                          </>
                        ) : (
                          <>
                            Mark Complete
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {allComplete && (
            <AIInsight
              variant="success"
              title="Module Complete!"
              message={`You've completed all sections for ${skillName} remediation. Ready to verify your improvement with a focused reassessment?`}
              actionLabel="Start Reassessment"
              onAction={() => {}}
            />
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Progress Tracker" subtitle={`${completedSections.size} of ${TABS.length} sections`} />
            <div className="space-y-3">
              {TABS.map(tab => {
                const isDone = completedSections.has(tab.id);
                return (
                  <div
                    key={tab.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer',
                      isDone ? 'bg-success-50' : 'bg-surface-container',
                      activeTab === tab.id && 'ring-2 ring-primary-200'
                    )}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-xl flex items-center justify-center shrink-0',
                      isDone ? 'bg-success-100' : 'bg-white'
                    )}>
                      {isDone ? (
                        <span className="material-symbols-outlined text-[16px] text-success-600">check_circle</span>
                      ) : (
                        <span className="material-symbols-outlined text-[16px] text-outline">{tab.icon}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm font-medium', isDone ? 'text-success-700' : 'text-gray-700')}>{tab.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-outline-light">
              <Progress value={completionPercent} size="md" showLabel />
            </div>
          </Card>

          <Card>
            <CardHeader title="Related Skill Gaps" />
            <div className="space-y-2">
              {skillGaps.filter(s => s.name !== skillName).slice(0, 4).map(s => (
                <div key={s.id} className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 bg-white rounded-xl flex items-center justify-center border border-outline-light shrink-0">
                      <span className="material-symbols-outlined text-[13px] text-outline">menu_book</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 truncate">{s.name}</span>
                  </div>
                  <span className="text-xs text-danger-600 font-medium shrink-0">Gap: {s.requiredLevel - s.currentLevel}%</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Learning Tips" />
            <div className="space-y-3 text-sm text-on-surface-variant">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[14px] text-warning-500 mt-0.5 shrink-0">star</span>
                <p>Watch the video first to build conceptual understanding before moving to practice.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[14px] text-warning-500 mt-0.5 shrink-0">star</span>
                <p>Take notes on key concepts to reinforce your learning.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[14px] text-warning-500 mt-0.5 shrink-0">star</span>
                <p>Try the practice challenges without looking at solutions first.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
