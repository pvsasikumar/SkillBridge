import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { EmptyState, LoadingState } from '@/components/ui/EmptyState';
import { AIInsight } from '@/components/ui/AIInsight';
import { useApp, generateId } from '@/context/AppContext';
import { currentUser, studentSkills } from '@/data/mockData';
import {
  generateCompetencyAssessment,
  evaluateAssessmentAnswer,
} from '@/lib/ai-service';
import type {
  AssessmentQuestion,
  AssessmentAttempt,
  CompetencyAssessment,
  CompetencyReport,
  QuestionType,
} from '@/types';

type AssessmentState = 'setup' | 'loading' | 'assessment' | 'review' | 'complete';

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function getLevelFromScore(score: number): CompetencyAssessment['level'] {
  if (score >= 85) return 'Advanced';
  if (score >= 65) return 'Proficient';
  if (score >= 40) return 'Developing';
  return 'Novice';
}

function getLevelColor(level: string): string {
  switch (level) {
    case 'Advanced':
      return 'success';
    case 'Proficient':
      return 'primary';
    case 'Developing':
      return 'warning';
    default:
      return 'danger';
  }
}

interface QuestionTimerRef {
  start: number;
}

export default function CompetencyAssessmentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    courses,
    skills,
    addAssessment,
    addCompetencyReport,
    competencyReports,
    updateSkillLevel,
  } = useApp();

  const [state, setState] = useState<AssessmentState>('setup');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState<AssessmentAttempt[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string | number>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const [feedbackExplanation, setFeedbackExplanation] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [warnings, setWarnings] = useState(0);
  const [assessmentId, setAssessmentId] = useState('');
  const [competencyEstimate, setCompetencyEstimate] = useState(50);
  const [questionTimer, setQuestionTimer] = useState<QuestionTimerRef>({ start: 0 });
  const [currentDifficulty, setCurrentDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [topicScores, setTopicScores] = useState<Record<string, { correct: number; total: number }>>({});

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bodyRef = useRef(document.body);

  const reportId = searchParams.get('reportId');
  const existingReport = reportId
    ? competencyReports.find((_, i) => `${i}` === reportId || true)
    : null;

  useEffect(() => {
    if (state === 'assessment') {
      document.body.classList.add('assessment-active');
    } else {
      document.body.classList.remove('assessment-active');
    }
    return () => {
      document.body.classList.remove('assessment-active');
    };
  }, [state]);

  useEffect(() => {
    if (state === 'assessment') {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state]);

  useEffect(() => {
    if (state !== 'assessment') return;

    const handleVisibility = () => {
      if (document.hidden) {
        handleWarning('Tab switch detected');
      }
    };

    const handleBlur = () => {
      handleWarning('Window lost focus');
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      handleWarning('Right-click blocked');
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      handleWarning('Copy action blocked');
    };

    const handleSelect = (e: Event) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a')
      ) {
        e.preventDefault();
        handleWarning('Keyboard shortcut blocked');
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    bodyRef.current.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    bodyRef.current.addEventListener('selectstart', handleSelect);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      bodyRef.current.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      bodyRef.current.removeEventListener('selectstart', handleSelect);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [state, warnings]);

  const handleWarning = useCallback(
    (reason: string) => {
      if (state !== 'assessment') return;
      setWarnings(prev => {
        const next = prev + 1;
        if (next >= 3) {
          setState('complete');
        }
        return next;
      });
    },
    [state]
  );

  const toggleSkill = useCallback((skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  }, []);

  const handleGenerate = useCallback(async () => {
    if (selectedSkills.length === 0) return;
    setState('loading');

    const competencyProfile: Record<string, number> = {};
    skills.forEach(s => {
      competencyProfile[s.name] = s.currentLevel;
    });

    try {
      const result = await generateCompetencyAssessment(
        selectedSkills,
        currentUser.careerGoal ?? 'Full Stack Developer',
        competencyProfile
      );

      if (result.questions.length === 0) {
        setState('setup');
        return;
      }

      const typedQuestions: AssessmentQuestion[] = result.questions.map(q => ({
        id: q.id,
        question: q.question,
        type: q.type as QuestionType,
        level: q.level as 'knowledge' | 'application' | 'practical',
        options: q.options,
        correctIndex: q.correctIndex,
        code: q.code,
        scenario: q.scenario,
        rubric: q.rubric,
        explanation: q.explanation,
        topic: q.topic,
        difficulty: q.difficulty as 'Easy' | 'Medium' | 'Hard',
      }));

      const shuffled = shuffleArray(typedQuestions);
      setQuestions(shuffled);
      setCurrentIndex(0);
      setAttempts([]);
      setElapsedSeconds(0);
      setWarnings(0);
      setCompetencyEstimate(50);
      setCurrentDifficulty('Easy');
      setTopicScores({});

      const newId = generateId();
      setAssessmentId(newId);

      setQuestionTimer({ start: Date.now() });
      setState('assessment');
    } catch {
      setState('setup');
    }
  }, [selectedSkills, skills]);

  const handleAnswer = useCallback(async () => {
    if (currentIndex >= questions.length) return;

    const question = questions[currentIndex];
    const timeSpent = Math.round((Date.now() - questionTimer.start) / 1000);

    setQuestionTimer({ start: Date.now() });

    try {
      const result = await evaluateAssessmentAnswer(
        {
          id: question.id,
          question: question.question,
          type: question.type,
          correctIndex: question.correctIndex,
          explanation: question.explanation,
          topic: question.topic,
        },
        currentAnswer,
        selectedSkills[0] ?? ''
      );

      const attempt: AssessmentAttempt = {
        id: generateId(),
        questionId: question.id,
        answer: currentAnswer,
        correct: result.correct,
        timeSpent,
        difficulty: question.difficulty,
        topic: question.topic,
      };

      setAttempts(prev => [...prev, attempt]);
      setFeedbackCorrect(result.correct);
      setFeedbackExplanation(result.explanation);
      setShowFeedback(true);

      setTopicScores(prev => {
        const topic = question.topic;
        const current = prev[topic] ?? { correct: 0, total: 0 };
        return {
          ...prev,
          [topic]: {
            correct: current.correct + (result.correct ? 1 : 0),
            total: current.total + 1,
          },
        };
      });

      setCompetencyEstimate(prev => {
        const delta = result.correct ? 5 : -3;
        return Math.max(0, Math.min(100, prev + delta));
      });

      if (result.correct) {
        if (currentDifficulty === 'Easy') setCurrentDifficulty('Medium');
        else if (currentDifficulty === 'Medium') setCurrentDifficulty('Hard');
      } else {
        if (currentDifficulty === 'Hard') setCurrentDifficulty('Medium');
        else if (currentDifficulty === 'Medium') setCurrentDifficulty('Easy');
      }
    } catch {
      const attempt: AssessmentAttempt = {
        id: generateId(),
        questionId: question.id,
        answer: currentAnswer,
        correct: false,
        timeSpent,
        difficulty: question.difficulty,
        topic: question.topic,
      };
      setAttempts(prev => [...prev, attempt]);
      setFeedbackCorrect(false);
      setFeedbackExplanation(question.explanation);
      setShowFeedback(true);

      setTopicScores(prev => {
        const topic = question.topic;
        const current = prev[topic] ?? { correct: 0, total: 0 };
        return {
          ...prev,
          [topic]: {
            correct: current.correct,
            total: current.total + 1,
          },
        };
      });
    }
  }, [currentIndex, questions, currentAnswer, questionTimer, currentDifficulty, selectedSkills]);

  const handleNext = useCallback(() => {
    setShowFeedback(false);
    setCurrentAnswer('');

    if (currentIndex + 1 >= questions.length) {
      setState('complete');

      const totalCorrect = attempts.filter(a => a.correct).length + (feedbackCorrect ? 1 : 0);
      const score = Math.round((totalCorrect / questions.length) * 100);
      const level = getLevelFromScore(score);

      const topicBreakdown = Object.entries({
        ...topicScores,
        ...(feedbackCorrect !== undefined
          ? {
              [questions[currentIndex]?.topic ?? 'General']: {
                correct:
                  (topicScores[questions[currentIndex]?.topic ?? 'General']?.correct ?? 0) +
                  (feedbackCorrect ? 1 : 0),
                total:
                  (topicScores[questions[currentIndex]?.topic ?? 'General']?.total ?? 0) + 1,
              },
            }
          : {}),
      }).map(([topic, data]) => ({
        topic,
        score: Math.round((data.correct / data.total) * 100),
        status: data.correct / data.total >= 0.7 ? 'strong' : data.correct / data.total >= 0.4 ? 'developing' : 'needs-attention',
        assessment: `${data.correct}/${data.total} correct`,
      }));

      const priorityGaps = skills
        .filter(s => selectedSkills.includes(s.name) && s.currentLevel < s.requiredLevel)
        .map(s => ({
          skill: s.name,
          current: s.currentLevel,
          target: s.requiredLevel,
          gap: s.requiredLevel - s.currentLevel,
        }));

      const report: CompetencyReport = {
        skill: selectedSkills[0] ?? 'General',
        score,
        level,
        topicBreakdown,
        overallCompetency: score,
        overallLevel: level,
        priorityGaps,
      };

      addCompetencyReport(report);

      const assessment: CompetencyAssessment = {
        id: assessmentId,
        skill: selectedSkills[0] ?? 'General',
        questions,
        attempts: [
          ...attempts,
          ...(showFeedback
            ? []
            : [
                {
                  id: generateId(),
                  questionId: questions[currentIndex]?.id ?? '',
                  answer: currentAnswer,
                  correct: feedbackCorrect,
                  timeSpent: 0,
                  difficulty: questions[currentIndex]?.difficulty ?? 'Easy',
                  topic: questions[currentIndex]?.topic ?? '',
                },
              ]),
        ],
        competencyEstimate: score,
        status: warnings >= 3 ? 'terminated' : 'completed',
        startedAt: new Date(Date.now() - elapsedSeconds * 1000).toISOString(),
        completedAt: new Date().toISOString(),
        warnings,
        maxWarnings: 3,
        level,
      };

      addAssessment(assessment);

      selectedSkills.forEach(skillName => {
        const skillData = skills.find(s => s.name === skillName);
        if (skillData) {
          const newLevel = Math.min(100, Math.max(0, skillData.currentLevel + (score > 50 ? 5 : -2)));
          updateSkillLevel(skillName, newLevel);
        }
      });
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [
    currentIndex,
    questions,
    attempts,
    currentAnswer,
    feedbackCorrect,
    topicScores,
    skills,
    selectedSkills,
    assessmentId,
    warnings,
    elapsedSeconds,
    showFeedback,
    addAssessment,
    addCompetencyReport,
    updateSkillLevel,
  ]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progressPercent = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  if (existingReport) {
    navigate(`/report/0`, { replace: true });
    return null;
  }

  if (state === 'setup') {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Competency Assessment</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Select skills to assess your competency level
          </p>
        </div>

        <Card>
          <CardHeader
            title="Select Skills to Assess"
            subtitle="Choose the skills you want to be evaluated on"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {studentSkills.map(skill => {
              const isSelected = selectedSkills.includes(skill.name);
              return (
                <button
                  key={skill.id}
                  onClick={() => toggleSkill(skill.name)}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all',
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-outline-light bg-white hover:border-gray-300'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold',
                      isSelected ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'
                    )}
                  >
                    {skill.currentLevel}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{skill.name}</p>
                    <p className="text-xs text-on-surface-variant">
                      {skill.category} · {skill.status === 'strong' ? 'Strong' : skill.status === 'developing' ? 'Developing' : 'Needs Attention'}
                    </p>
                  </div>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[16px] text-primary ml-auto shrink-0">check_circle</span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-outline-light flex justify-between items-center">
            <p className="text-sm text-on-surface-variant">
              {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} selected
            </p>
            <Button
              onClick={handleGenerate}
              disabled={selectedSkills.length === 0}
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              Generate Assessment
            </Button>
          </div>
        </Card>

        <AIInsight
          variant="info"
          title="Assessment Guidelines"
          message="The assessment adapts to your skill level. Answer correctly to receive harder questions. You have a maximum of 3 integrity warnings before the assessment terminates. Cheating detection is active."
        />
      </div>
    );
  }

  if (state === 'loading') {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <Card>
          <LoadingState message="Generating personalized assessment questions..." />
        </Card>
      </div>
    );
  }

  if (state === 'assessment' && currentQuestion) {
    return (
      <div className="min-h-screen bg-surface-container">
        <div className="glass-panel border-b border-outline-light px-4 sm:px-6 py-3 sticky top-0 z-40">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px] text-primary">shield</span>
              <span className="text-sm font-semibold text-on-surface">
                Assessment Active
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                <span className="font-mono">{formatTime(elapsedSeconds)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <span
                  className={cn(
                    'material-symbols-outlined text-[14px]',
                    warnings > 0 ? 'text-danger-500' : 'text-outline'
                  )}
                >warning</span>
                <span
                  className={cn(
                    'font-medium',
                    warnings > 0 ? 'text-danger-600' : 'text-on-surface-variant'
                  )}
                >
                  {warnings}/3
                </span>
              </div>
            </div>
          </div>
          <div className="max-w-4xl mx-auto mt-2">
            <Progress value={progressPercent} size="sm" color="primary" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">
                {currentQuestion.topic}
              </Badge>
              <Badge
                variant={
                  currentQuestion.difficulty === 'Easy'
                    ? 'success'
                    : currentQuestion.difficulty === 'Medium'
                    ? 'warning'
                    : 'danger'
                }
                size="sm"
              >
                {currentQuestion.difficulty}
              </Badge>
            </div>
            <span className="text-sm text-on-surface-variant">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
          </div>

          <Card className="mb-6">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-on-surface leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            {currentQuestion.code && (
              <div className="mb-6 bg-gray-900 text-gray-100 rounded-xl p-4 overflow-x-auto">
                <pre className="text-sm font-mono leading-relaxed whitespace-pre-wrap">
                  {currentQuestion.code}
                </pre>
              </div>
            )}

            {currentQuestion.scenario && (
              <div className="mb-6 bg-primary-50 border border-primary-200 rounded-xl p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {currentQuestion.scenario}
                </p>
              </div>
            )}

            {currentQuestion.type === 'mcq' && currentQuestion.options && (
              <div className="space-y-2">
                {currentQuestion.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (!showFeedback) setCurrentAnswer(i);
                    }}
                    disabled={showFeedback}
                    className={cn(
                      'w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all',
                      currentAnswer === i
                        ? showFeedback
                          ? feedbackCorrect
                            ? 'border-success-500 bg-success-50'
                            : i === currentQuestion.correctIndex
                            ? 'border-success-500 bg-success-50'
                            : 'border-danger-500 bg-danger-50'
                          : 'border-primary-500 bg-primary-50'
                        : showFeedback && i === currentQuestion.correctIndex
                        ? 'border-success-500 bg-success-50'
                        : 'border-outline-light hover:border-gray-300'
                    )}
                  >
                    <div
                      className={cn(
                        'w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-semibold shrink-0',
                        currentAnswer === i
                          ? 'border-primary-500 bg-primary-500 text-white'
                          : 'border-gray-300 text-on-surface-variant'
                      )}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="text-sm text-gray-700">{option}</span>
                    {showFeedback && i === currentQuestion.correctIndex && (
                      <span className="material-symbols-outlined text-[16px] text-success-500 ml-auto shrink-0">check_circle</span>
                    )}
                    {showFeedback &&
                      currentAnswer === i &&
                      !feedbackCorrect &&
                      i !== currentQuestion.correctIndex && (
                        <span className="material-symbols-outlined text-[16px] text-danger-500 ml-auto shrink-0">close</span>
                      )}
                  </button>
                ))}
              </div>
            )}

            {(currentQuestion.type === 'scenario' || currentQuestion.type === 'code' || currentQuestion.type === 'debug' || currentQuestion.type === 'short-answer') && (
              <textarea
                value={typeof currentAnswer === 'string' ? currentAnswer : ''}
                onChange={e => {
                  if (!showFeedback) setCurrentAnswer(e.target.value);
                }}
                disabled={showFeedback}
                placeholder={
                  currentQuestion.type === 'code' || currentQuestion.type === 'debug'
                    ? 'Write your code here...'
                    : 'Type your answer here...'
                }
                className={cn(
                  'w-full px-4 py-3 text-sm bg-surface-container border border-outline-light rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors',
                  (currentQuestion.type === 'code' || currentQuestion.type === 'debug') &&
                    'font-mono text-sm'
                )}
                rows={8}
              />
            )}
          </Card>

          {showFeedback && (
            <Card
              className={cn(
                'mb-6 border-2',
                feedbackCorrect
                  ? 'border-success-300 bg-success-50/50'
                  : 'border-danger-300 bg-danger-50/50'
              )}
            >
              <div className="flex items-start gap-3">
                {feedbackCorrect ? (
                  <span
                    className="material-symbols-outlined text-[20px] text-success-600 mt-0.5 shrink-0"
                  >check_circle</span>
                ) : (
                  <span
                    className="material-symbols-outlined text-[20px] text-danger-600 mt-0.5 shrink-0"
                  >close</span>
                )}
                <div>
                  <p
                    className={cn(
                      'text-sm font-semibold',
                      feedbackCorrect ? 'text-success-700' : 'text-danger-700'
                    )}
                  >
                    {feedbackCorrect ? 'Correct!' : 'Incorrect'}
                  </p>
                  <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                    {feedbackExplanation}
                  </p>
                </div>
              </div>
            </Card>
          )}

          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={() => {
                if (currentIndex > 0) {
                  setCurrentIndex(prev => prev - 1);
                  setShowFeedback(false);
                  setCurrentAnswer('');
                }
              }}
              disabled={currentIndex === 0}
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              Previous
            </Button>
            {showFeedback ? (
              <Button onClick={handleNext}>
                {currentIndex + 1 >= totalQuestions ? 'View Results' : 'Next Question'}
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Button>
            ) : (
              <Button
                onClick={handleAnswer}
                disabled={
                  currentQuestion.type === 'mcq'
                    ? currentAnswer === ''
                    : !currentAnswer
                }
              >
                Submit Answer
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (state === 'complete') {
    const totalCorrect = attempts.filter(a => a.correct).length;
    const score = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const level = getLevelFromScore(score);
    const terminated = warnings >= 3;

    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {terminated ? (
              <span className="material-symbols-outlined text-[28px] text-danger-500">error</span>
            ) : (
              <span className="material-symbols-outlined text-[28px] text-primary">emoji_events</span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-on-surface">
            {terminated ? 'Assessment Terminated' : 'Assessment Complete'}
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            {terminated
              ? 'The assessment was terminated due to integrity violations.'
              : 'Your competency has been evaluated.'}
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <Card className="text-center">
            <p className="text-3xl font-bold text-on-surface">{score}%</p>
            <p className="text-xs text-on-surface-variant mt-1">Score</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-on-surface">
              {totalCorrect}/{totalQuestions}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">Correct</p>
          </Card>
          <Card className="text-center">
            <Badge variant={getLevelColor(level) as any} size="md">
              {level}
            </Badge>
            <p className="text-xs text-on-surface-variant mt-2">Competency Level</p>
          </Card>
        </div>

        <Card>
          <CardHeader title="Topic Breakdown" />
          <div className="space-y-3">
            {Object.entries(topicScores).map(([topic, data]) => {
              const topicScore = Math.round((data.correct / data.total) * 100);
              return (
                <div key={topic}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{topic}</span>
                    <span className="text-xs text-on-surface-variant">
                      {data.correct}/{data.total} · {topicScore}%
                    </span>
                  </div>
                  <Progress
                    value={topicScore}
                    size="sm"
                    color={topicScore >= 70 ? 'success' : topicScore >= 40 ? 'warning' : 'danger'}
                  />
                </div>
              );
            })}
          </div>
        </Card>

        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => {
            setState('setup');
            setSelectedSkills([]);
            setQuestions([]);
            setAttempts([]);
            setCurrentIndex(0);
          }}>
            Retake Assessment
          </Button>
          {competencyReports.length > 0 && (
            <Button onClick={() => navigate(`/report/${competencyReports.length - 1}`)}>
              <span className="material-symbols-outlined text-[16px]">description</span>
              View Competency Report
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
