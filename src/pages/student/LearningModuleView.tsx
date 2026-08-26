import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { AIInsight } from '@/components/ui/AIInsight';
import { useApp } from '@/context/AppContext';
import { learningModules, studentSkills } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface Section {
  id: string;
  type: 'video' | 'notes' | 'examples' | 'practice' | 'quiz';
  title: string;
  icon: string;
}

const defaultSections: Section[] = [
  { id: 'sec-1', type: 'video', title: 'Video Introduction', icon: 'play_arrow' },
  { id: 'sec-2', type: 'notes', title: 'Concept Notes', icon: 'description' },
  { id: 'sec-3', type: 'examples', title: 'Code Examples', icon: 'code' },
  { id: 'sec-4', type: 'practice', title: 'Practice Challenge', icon: 'construction' },
  { id: 'sec-5', type: 'quiz', title: 'Knowledge Check', icon: 'assignment' },
];

export default function LearningModuleView() {
  const { planId } = useParams<{ planId: string }>();
  const { learningPlans, updateLearningPlan } = useApp();

  const plan = planId ? learningPlans.find(p => p.id === planId) : undefined;
  const moduleData = planId ? learningModules.find(m => m.id === planId) : learningModules[1];
  const skillName = plan?.skillGap ?? moduleData?.skill ?? 'JavaScript';
  const moduleTitle = moduleData?.title ?? 'Async JavaScript';

  const sections = defaultSections;
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);

  const activeSection = sections[activeSectionIndex];
  const completionPercent = Math.round((completedSections.size / sections.length) * 100);
  const allComplete = completedSections.size === sections.length;

  const completeSection = useCallback((sectionId: string) => {
    setCompletedSections(prev => {
      const next = new Set(prev);
      next.add(sectionId);
      return next;
    });
  }, []);

  const goToNext = () => {
    if (activeSectionIndex < sections.length - 1) {
      setActiveSectionIndex(prev => prev + 1);
    }
  };

  const goToPrev = () => {
    if (activeSectionIndex > 0) {
      setActiveSectionIndex(prev => prev - 1);
    }
  };

  const handlePracticeSubmit = () => {
    if (practiceAnswer.trim().length > 0) {
      setPracticeSubmitted(true);
      completeSection('sec-4');
    }
  };

  const handleQuizSubmit = () => {
    if (quizAnswer !== null) {
      setQuizSubmitted(true);
      completeSection('sec-5');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/learning" className="text-sm text-outline hover:text-gray-600">Learning</Link>
            <span className="material-symbols-outlined text-[14px] text-gray-300">chevron_right</span>
            <span className="text-sm text-on-surface font-medium">{moduleTitle}</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface">{moduleTitle}</h1>
          <div className="flex items-center gap-3 mt-1">
            <Badge variant="primary" size="sm">{skillName}</Badge>
            {moduleData && <span className="text-sm text-on-surface-variant">{moduleData.estimatedTime} min</span>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-on-surface-variant shrink-0">{completionPercent}%</span>
          <div className="w-32">
            <Progress value={completionPercent} size="md" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card padding="none" className="overflow-hidden">
            <div className="p-3">
              <p className="text-xs font-semibold text-outline uppercase tracking-wider px-2 mb-2">Sections</p>
              <div className="space-y-1">
                {sections.map((section, i) => {
                  const isActive = i === activeSectionIndex;
                  const isDone = completedSections.has(section.id);
                  const isPast = i < activeSectionIndex;

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSectionIndex(i)}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left',
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : isDone
                            ? 'text-success-700 hover:bg-success-50'
                            : 'text-on-surface-variant hover:bg-surface-container'
                      )}
                    >
                      <div className="shrink-0">
                        {isDone ? (
                          <span className="material-symbols-outlined text-[16px] text-success-500">check_circle</span>
                        ) : isActive ? (
                          <div className="w-4 h-4 rounded-full border-2 border-primary-500 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                          </div>
                        ) : (
                          <span className="material-symbols-outlined text-[16px] text-gray-300">radio_button_unchecked</span>
                        )}
                      </div>
                      <span className="truncate">{section.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Module Progress" />
            <Progress value={completionPercent} size="md" showLabel />
            <p className="text-xs text-on-surface-variant mt-2">{completedSections.size} of {sections.length} sections complete</p>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] text-primary">{activeSection.icon}</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-on-surface">{activeSection.title}</h2>
                <p className="text-sm text-on-surface-variant">Section {activeSectionIndex + 1} of {sections.length}</p>
              </div>
            </div>

            {activeSection.type === 'video' && (
              <div className="space-y-4">
                <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 glass-panel rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-[28px] text-primary ml-1">play_arrow</span>
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="text-xs text-white/80 bg-black/50 px-2 py-1 rounded flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px]">schedule</span>
                      15 min
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-on-surface">{moduleTitle}</h3>
                  <p className="text-sm text-on-surface-variant mt-1">
                    Watch this video to understand the core concepts of {skillName}.
                    Pay attention to the key patterns and best practices demonstrated.
                  </p>
                </div>
              </div>
            )}

            {activeSection.type === 'notes' && (
              <div className="space-y-4">
                <article className="prose prose-sm max-w-none">
                  <h2 className="text-lg font-semibold text-on-surface">{skillName} Fundamentals</h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <h3 className="text-base font-semibold text-on-surface mt-4">Core Concepts</h3>
                    <p className="text-sm">
                      Understanding the fundamental concepts of {skillName} is essential for building robust applications.
                      This section covers the key principles, patterns, and best practices you need to master.
                    </p>

                    <h3 className="text-base font-semibold text-on-surface mt-4">Key Principles</h3>
                    <ol className="list-decimal pl-5 space-y-2 text-sm">
                      <li><strong>Understand the Basics</strong> — Master the core building blocks before moving to advanced topics</li>
                      <li><strong>Practice Regularly</strong> — Consistent practice helps solidify your understanding</li>
                      <li><strong>Build Projects</strong> — Apply what you learn in real-world scenarios</li>
                    </ol>

                    <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-sm overflow-x-auto">
                      <code>{`// Example: Core pattern
function use${skillName.replace(/[^a-zA-Z]/g, '')}(config) {
  const [state, setState] = useState(null);

  useEffect(() => {
    initialize(config);
  }, [config]);

  return { state, update: setState };
}`}</code>
                    </pre>

                    <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mt-4">
                      <p className="text-sm font-semibold text-primary-800">Key Takeaway</p>
                      <p className="text-sm text-primary-700 mt-1">
                        Mastering {skillName} fundamentals provides a strong foundation for building
                        scalable and maintainable applications. Focus on understanding the &quot;why&quot; behind each concept.
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            )}

            {activeSection.type === 'examples' && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-on-surface">Code Examples</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Basic Usage Pattern</p>
                    <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-sm overflow-x-auto">
                      <code>{`// Practical example with ${skillName}
import { useState, useEffect } from 'react';

function DataFetcher({ endpoint }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(endpoint, {
          signal: controller.signal,
        });
        const json = await response.json();
        setData(json);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return () => controller.abort();
  }, [endpoint]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  return <DataDisplay data={data} />;
}`}</code>
                    </pre>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Advanced Pattern</p>
                    <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-sm overflow-x-auto">
                      <code>{`// Custom hook pattern
function useFetch(url) {
  const [state, dispatch] = useReducer(fetchReducer, {
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) {
          dispatch({ type: 'SUCCESS', payload: data });
        }
      })
      .catch(err => {
        if (!cancelled) {
          dispatch({ type: 'ERROR', payload: err.message });
        }
      });

    return () => { cancelled = true; };
  }, [url]);

  return state;
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {activeSection.type === 'practice' && (
              <div className="space-y-4">
                <div className="bg-warning-50 border border-warning-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-warning-700">Practice Challenge</p>
                  <p className="text-sm text-warning-600 mt-1">
                    Build a component that demonstrates your understanding of {skillName} concepts.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">Requirements:</p>
                  <ul className="space-y-2 text-sm text-on-surface-variant">
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[14px] text-success-500 mt-0.5 shrink-0">check_circle</span>
                      Implement proper state management
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[14px] text-success-500 mt-0.5 shrink-0">check_circle</span>
                      Handle side effects correctly
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[14px] text-success-500 mt-0.5 shrink-0">check_circle</span>
                      Include cleanup logic where needed
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[14px] text-success-500 mt-0.5 shrink-0">check_circle</span>
                      Handle loading and error states
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Your Solution</label>
                  <textarea
                    value={practiceAnswer}
                    onChange={(e) => setPracticeAnswer(e.target.value)}
                    placeholder="Write your component here..."
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
                      Great work! Your solution demonstrates understanding of {skillName} patterns.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeSection.type === 'quiz' && (
              <div className="space-y-4">
                <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-primary-800">Knowledge Check</p>
                  <p className="text-sm text-primary-700 mt-1">Test your understanding of the concepts covered in this module.</p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-on-surface">
                    Which of the following is the correct way to handle cleanup in useEffect?
                  </p>
                  <div className="space-y-2">
                    {[
                      'Return a cleanup function from the effect callback',
                      'Use the componentWillUnmount lifecycle method',
                      'Call cleanup() inside the effect',
                      'Set a timeout to clean up after the effect',
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
                          name="module-quiz"
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
                        {quizAnswer === 0 ? 'Correct!' : 'Review the notes section for more details.'}
                      </p>
                    </div>
                    <p className="text-sm text-success-600">
                      Cleanup functions returned from useEffect run on unmount or when dependencies change.
                      This prevents memory leaks and handles subscriptions.
                    </p>
                  </div>
                )}

                {!quizSubmitted ? (
                  <Button onClick={handleQuizSubmit} disabled={quizAnswer === null}>
                    Submit Answer
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Button>
                ) : null}
              </div>
            )}

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-outline-light">
              <Button
                variant="ghost"
                disabled={activeSectionIndex === 0}
                onClick={goToPrev}
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {!completedSections.has(activeSection.id) && activeSection.type !== 'quiz' && activeSection.type !== 'practice' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => completeSection(activeSection.id)}
                  >
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Complete Section
                  </Button>
                )}

                {activeSectionIndex < sections.length - 1 ? (
                  <Button onClick={goToNext}>
                    Next
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </Button>
                ) : (
                  <Link to="/skills">
                    <Button>
                      <span className="material-symbols-outlined text-[16px]">gps_fixed</span>
                      Take Assessment
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </Card>

          {allComplete && (
            <AIInsight
              variant="success"
              title="Module Complete!"
              message={`Congratulations! You've completed all sections of "${moduleTitle}". You're now ready to verify your improvement with a competency reassessment.`}
              actionLabel="Start Reassessment"
              onAction={() => {}}
            />
          )}

          {!allComplete && completedSections.size > 0 && (
            <AIInsight
              variant="info"
              message={`You've completed ${completedSections.size} of ${sections.length} sections. Keep going — you're making great progress on ${skillName}!`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
