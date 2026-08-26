import { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select, Textarea } from '@/components/ui/Input';
import { Progress } from '@/components/ui/Progress';
import { EmptyState } from '@/components/ui/EmptyState';
import { AIInsight } from '@/components/ui/AIInsight';
import { useApp, generateId } from '@/context/AppContext';
import { currentUser, studentSkills } from '@/data/mockData';
import { generateInterviewQuestions, evaluateInterviewResponse } from '@/lib/ai-service';
import { cn } from '@/lib/utils';
import type { InterviewCategory } from '@/types';

type InterviewType = 'technical' | 'behavioral' | 'mixed';
type SessionState = 'setup' | 'interview' | 'complete';

interface QuestionData {
  id: string;
  question: string;
  category: InterviewCategory;
  skill: string;
  difficulty: string;
}

interface EvaluationResult {
  questionId: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

const categoryConfig: Record<InterviewCategory, { label: string; icon: string; color: string }> = {
  knowledge: { label: 'Knowledge', icon: 'psychology', color: 'text-primary' },
  practical: { label: 'Practical', icon: 'gps_fixed', color: 'text-success-600' },
  'problem-solving': { label: 'Problem Solving', icon: 'lightbulb', color: 'text-warning-600' },
  communication: { label: 'Communication', icon: 'group', color: 'text-secondary-600' },
};

export default function InterviewPrepPage() {
  const { verifiedSkills, addInterviewSession } = useApp();
  const [state, setState] = useState<SessionState>('setup');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [interviewType, setInterviewType] = useState<InterviewType>('technical');
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [evaluations, setEvaluations] = useState<EvaluationResult[]>([]);
  const [evaluating, setEvaluating] = useState(false);
  const [currentEval, setCurrentEval] = useState<EvaluationResult | null>(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const availableSkills = verifiedSkills.length > 0
    ? verifiedSkills.map(v => v.skill)
    : studentSkills.filter(s => s.verified).map(s => s.name);

  const allSkills = verifiedSkills.length > 0
    ? verifiedSkills
    : studentSkills.filter(s => s.verified).map(s => ({
        id: s.id,
        skill: s.name,
        score: s.currentLevel,
        level: s.currentLevel >= 75 ? 'Proficient' : 'Developing',
        verificationDate: s.lastVerified || '2026-08-20',
        assessmentId: `assess_${s.id}`,
        verificationId: `VB-${s.id.toUpperCase()}-${Date.now()}`,
        evidence: [],
      }));

  useEffect(() => {
    if (state === 'interview' && !currentEval) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state, currentEval, currentIndex]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleGenerate = useCallback(async () => {
    if (!selectedSkill) return;
    setGenerating(true);
    try {
      const skillData = allSkills.find(v => v.skill === selectedSkill);
      const result = await generateInterviewQuestions(
        selectedSkill,
        currentUser.careerGoal || 'Full Stack Developer',
        skillData?.score || 50,
        []
      );
      if (result.questions.length > 0) {
        setQuestions(result.questions.map(q => ({
          id: q.id,
          question: q.question,
          category: q.category as InterviewCategory,
          skill: q.skill,
          difficulty: q.difficulty,
        })));
        setState('interview');
        setCurrentIndex(0);
        setTimer(0);
      }
    } finally {
      setGenerating(false);
    }
  }, [selectedSkill, allSkills]);

  const handleSubmitAnswer = useCallback(async () => {
    if (!answer.trim() || !questions[currentIndex]) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setEvaluating(true);
    try {
      const q = questions[currentIndex];
      const result = await evaluateInterviewResponse(
        q.question,
        answer,
        q.category,
        q.skill
      );
      const evalResult: EvaluationResult = {
        questionId: q.id,
        score: result.score,
        feedback: result.feedback,
        strengths: result.strengths,
        improvements: result.improvements,
      };
      setCurrentEval(evalResult);
      setEvaluations(prev => [...prev, evalResult]);
    } finally {
      setEvaluating(false);
    }
  }, [answer, questions, currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setAnswer('');
      setCurrentEval(null);
      setTimer(0);
    } else {
      handleComplete();
    }
  }, [currentIndex, questions.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setAnswer('');
      setCurrentEval(null);
      setTimer(0);
    }
  }, [currentIndex]);

  const handleComplete = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const overallScore = evaluations.length > 0
      ? Math.round(evaluations.reduce((a, e) => a + e.score, 0) / evaluations.length)
      : 0;

    const session = {
      id: generateId(),
      skill: selectedSkill,
      targetRole: currentUser.careerGoal || 'Full Stack Developer',
      questions: questions.map(q => ({
        ...q,
        category: q.category as InterviewCategory,
        difficulty: (q.difficulty || 'Medium') as 'Easy' | 'Medium' | 'Hard',
      })),
      responses: evaluations.map(e => ({
        questionId: e.questionId,
        answer: '',
        category: 'knowledge' as InterviewCategory,
      })),
      evaluations: evaluations.map(e => ({
        category: 'knowledge' as InterviewCategory,
        score: e.score,
        feedback: e.feedback,
      })),
      overallScore,
      readiness: overallScore,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
    addInterviewSession(session);
    setState('complete');
  }, [evaluations, questions, selectedSkill, addInterviewSession]);

  const handlePracticeAgain = useCallback(() => {
    setState('setup');
    setQuestions([]);
    setEvaluations([]);
    setCurrentIndex(0);
    setAnswer('');
    setCurrentEval(null);
    setTimer(0);
    setSelectedSkill('');
  }, []);

  if (allSkills.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Interview Preparation</h1>
          <p className="text-sm text-on-surface-variant mt-1">Practice with AI-powered interview questions</p>
        </div>
        <EmptyState
          icon={<span className="material-symbols-outlined text-[48px]">error</span>}
          title="No Verified Skills Found"
          description="Complete course assessments to verify your skills before starting interview practice."
          action={
            <Link to="/courses">
              <Button>
                Go to Courses
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  if (state === 'setup') {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Interview Preparation</h1>
          <p className="text-sm text-on-surface-variant mt-1">Practice with AI-powered interview questions</p>
        </div>

        <AIInsight
          message="Interview practice uses your verified skill levels to generate appropriate questions. The AI evaluates your responses across knowledge, practical skills, problem-solving, and communication."
          variant="info"
        />

        <Card className="max-w-2xl mx-auto">
          <CardHeader
            title="Setup Interview Practice"
            subtitle="Choose a skill and interview type to begin"
            action={<span className="material-symbols-outlined text-[18px] text-primary-400">auto_awesome</span>}
          />

          <div className="space-y-5">
            <Select
              label="Skill to Practice"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              options={[
                { value: '', label: 'Select a skill...' },
                ...availableSkills.map(s => ({ value: s, label: s })),
              ]}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interview Type</label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { value: 'technical' as const, label: 'Technical', desc: 'Code & concepts' },
                  { value: 'behavioral' as const, label: 'Behavioral', desc: 'Situational' },
                  { value: 'mixed' as const, label: 'Mixed', desc: 'All categories' },
                ]).map(type => (
                  <button
                    key={type.value}
                    onClick={() => setInterviewType(type.value)}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all',
                      interviewType === type.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-outline-light hover:border-gray-300'
                    )}
                  >
                    <p className={cn(
                      'text-sm font-semibold',
                      interviewType === type.value ? 'text-primary-700' : 'text-on-surface'
                    )}>
                      {type.label}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <Button
              fullWidth
              size="lg"
              onClick={handleGenerate}
              loading={generating}
              disabled={!selectedSkill}
            >
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              Generate Interview Questions
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (state === 'interview' && questions.length > 0) {
    const q = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Interview in Progress</h1>
            <p className="text-sm text-on-surface-variant mt-1">
              {selectedSkill} · {interviewType.charAt(0).toUpperCase() + interviewType.slice(1)} Interview
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-high rounded-xl">
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant">schedule</span>
              <span className="text-sm font-mono font-semibold text-gray-700">{formatTime(timer)}</span>
            </div>
            <Badge variant="primary">
              {currentIndex + 1} / {questions.length}
            </Badge>
          </div>
        </div>

        <Progress value={progress} size="sm" color="primary" />

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="primary">{categoryConfig[q.category]?.label || q.category}</Badge>
            <Badge variant={q.difficulty === 'Hard' ? 'danger' : q.difficulty === 'Medium' ? 'warning' : 'default'}>
              {q.difficulty}
            </Badge>
          </div>
          <h2 className="text-lg font-semibold text-on-surface leading-relaxed">{q.question}</h2>
        </Card>

        {!currentEval ? (
          <Card>
            <CardHeader title="Your Answer" subtitle="Take your time to think through your response" />
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={5}
              className="mb-4"
            />
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={handlePrev} disabled={currentIndex === 0}>
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                Previous
              </Button>
              <Button onClick={handleSubmitAnswer} loading={evaluating} disabled={!answer.trim()}>
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                Submit Answer
              </Button>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold',
                currentEval.score >= 75 ? 'bg-success-50 text-success-600' :
                currentEval.score >= 50 ? 'bg-warning-50 text-warning-600' :
                'bg-danger-50 text-danger-600'
              )}>
                {currentEval.score}
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">AI Evaluation</p>
                <p className="text-xs text-on-surface-variant">Score out of 100</p>
              </div>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed mb-4">{currentEval.feedback}</p>

            {currentEval.strengths.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-success-600 uppercase tracking-wide mb-1.5">Strengths</p>
                {currentEval.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1">
                    <span className="material-symbols-outlined text-[12px] text-success-500 mt-0.5 shrink-0">check_circle</span>
                    <span className="text-sm text-gray-700">{s}</span>
                  </div>
                ))}
              </div>
            )}

            {currentEval.improvements.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-warning-600 uppercase tracking-wide mb-1.5">Areas to Improve</p>
                {currentEval.improvements.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1">
                    <span className="material-symbols-outlined text-[12px] text-warning-500 mt-0.5 shrink-0">lightbulb</span>
                    <span className="text-sm text-gray-700">{s}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-outline-light">
              <Button variant="ghost" onClick={handlePrev} disabled={currentIndex === 0}>
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                Previous
              </Button>
              <Button onClick={handleNext}>
                {currentIndex < questions.length - 1 ? (
                  <>
                    Next Question
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </>
                ) : (
                  <>
                    Finish Interview
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}
      </div>
    );
  }

  if (state === 'complete') {
    const overallScore = evaluations.length > 0
      ? Math.round(evaluations.reduce((a, e) => a + e.score, 0) / evaluations.length)
      : 0;

    const categoryScores: Record<string, { total: number; count: number }> = {};
    evaluations.forEach(e => {
      const q = questions.find(q => q.id === e.questionId);
      const cat = q?.category || 'knowledge';
      if (!categoryScores[cat]) categoryScores[cat] = { total: 0, count: 0 };
      categoryScores[cat].total += e.score;
      categoryScores[cat].count += 1;
    });

    const allStrengths = [...new Set(evaluations.flatMap(e => e.strengths))];
    const allImprovements = [...new Set(evaluations.flatMap(e => e.improvements))];

    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Interview Complete</h1>
          <p className="text-sm text-on-surface-variant mt-1">{selectedSkill} · Review your performance</p>
        </div>

        <Card className="text-center py-8">
          <div className={cn(
            'w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold',
            overallScore >= 75 ? 'bg-success-50 text-success-600' :
            overallScore >= 50 ? 'bg-warning-50 text-warning-600' :
            'bg-danger-50 text-danger-600'
          )}>
            {overallScore}%
          </div>
          <h2 className="text-xl font-bold text-on-surface mb-1">Overall Interview Readiness</h2>
          <p className="text-sm text-on-surface-variant">
            {overallScore >= 75 ? 'Great performance! You are well-prepared.' :
             overallScore >= 50 ? 'Good progress. Keep practicing to improve.' :
             'Keep practicing. Focus on the areas highlighted below.'}
          </p>
        </Card>

        <div className="grid sm:grid-cols-2 gap-4">
          {Object.entries(categoryScores).map(([cat, data]) => {
            const score = Math.round(data.total / data.count);
            const config = categoryConfig[cat as InterviewCategory] || categoryConfig.knowledge;
            return (
              <Card key={cat}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center bg-surface-container', config.color)}>
                    <span className="material-symbols-outlined text-[18px]">{config.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{config.label}</p>
                    <p className="text-xs text-on-surface-variant">{data.count} questions</p>
                  </div>
                  <span className="ml-auto text-lg font-bold text-on-surface">{score}%</span>
                </div>
                <Progress value={score} size="sm" />
              </Card>
            );
          })}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {allStrengths.length > 0 && (
            <Card>
              <CardHeader title="Strengths" />
              <div className="space-y-2">
                {allStrengths.slice(0, 5).map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[14px] text-success-500 mt-0.5 shrink-0">check_circle</span>
                    <span className="text-sm text-gray-700">{s}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {allImprovements.length > 0 && (
            <Card>
              <CardHeader title="Areas to Improve" />
              <div className="space-y-2">
                {allImprovements.slice(0, 5).map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[14px] text-warning-500 mt-0.5 shrink-0">lightbulb</span>
                    <span className="text-sm text-gray-700">{s}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={handlePracticeAgain}>
            <span className="material-symbols-outlined text-[16px]">play_arrow</span>
            Practice Again
          </Button>
          <Link to="/dashboard">
            <Button>
              Back to Dashboard
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
