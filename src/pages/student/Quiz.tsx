import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Modal } from '@/components/ui/Modal';
import { quizQuestions } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function Quiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showGapAlert, setShowGapAlert] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const question = quizQuestions[currentQ];
  const isCorrect = selected === question.correctIndex;
  const score = answers.filter((a, i) => a === quizQuestions[i].correctIndex).length;

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    setAnswers(prev => {
      const next = [...prev];
      next[currentQ] = selected;
      return next;
    });

    if (!isCorrect && currentQ > 0 && answers[currentQ - 1] !== quizQuestions[currentQ - 1].correctIndex) {
      if (currentQ > 1 && answers[currentQ - 2] !== quizQuestions[currentQ - 2].correctIndex) {
        setShowGapAlert(true);
      }
    }
  };

  const handleNext = () => {
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      setQuizComplete(true);
    }
  };

  if (quizComplete) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        <Card padding="lg">
          <div className="text-center py-8 space-y-6">
            <div className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center mx-auto',
              percentage >= 70 ? 'bg-success-50' : 'bg-warning-50'
            )}>
              {percentage >= 70 ? (
                <span className="material-symbols-outlined text-[32px] text-success-500">check_circle</span>
              ) : (
                <span className="material-symbols-outlined text-[32px] text-warning-500">warning</span>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-on-surface">Assessment Complete</h2>
              <p className="text-on-surface-variant mt-1">Here's how you performed</p>
            </div>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{score}/{quizQuestions.length}</p>
                <p className="text-sm text-on-surface-variant">Correct</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-on-surface">{percentage}%</p>
                <p className="text-sm text-on-surface-variant">Score</p>
              </div>
            </div>
            <Progress value={percentage} size="lg" />
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link to="/skills">
                <Button variant="outline">
                  View Skill Gaps
                </Button>
              </Link>
              <Link to="/roadmap">
                <Button>
                  Continue Learning
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-on-surface">JavaScript — Adaptive Assessment</h1>
          <p className="text-sm text-on-surface-variant mt-1">Question {currentQ + 1} of {quizQuestions.length}</p>
        </div>
        <Badge variant="primary">{question.difficulty}</Badge>
      </div>

      <Progress value={currentQ + 1} max={quizQuestions.length} size="sm" />

      <Card padding="lg">
        <p className="text-sm text-on-surface-variant mb-2">Concept: {question.concept}</p>
        <h2 className="text-lg font-semibold text-on-surface mb-6">{question.question}</h2>

        <div className="space-y-3">
          {question.options.map((option, i) => {
            const isSelected = selected === i;
            const isAnswer = i === question.correctIndex;
            const showResult = submitted;

            return (
              <button
                key={i}
                onClick={() => !submitted && setSelected(i)}
                disabled={submitted}
                className={cn(
                  'w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3',
                  !submitted && isSelected && 'border-primary-300 bg-primary-50 ring-2 ring-primary-200',
                  !submitted && !isSelected && 'border-outline-light hover:border-gray-300',
                  showResult && isAnswer && 'border-success-300 bg-success-50',
                  showResult && isSelected && !isAnswer && 'border-danger-300 bg-danger-50',
                  showResult && !isSelected && !isAnswer && 'border-outline-light opacity-50',
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 border',
                  showResult && isAnswer ? 'bg-success-500 text-white border-success-500' :
                  showResult && isSelected ? 'bg-danger-500 text-white border-danger-500' :
                  isSelected ? 'bg-primary text-white border-primary' :
                  'bg-white text-on-surface-variant border-gray-300'
                )}>
                  {showResult && isAnswer ? <span className="material-symbols-outlined text-[16px]">check_circle</span> :
                   showResult && isSelected ? <span className="material-symbols-outlined text-[16px]">close</span> :
                   String.fromCharCode(65 + i)}
                </div>
                <span className={cn(
                  'text-sm',
                  showResult && isAnswer && 'font-semibold text-success-700',
                  showResult && isSelected && !isAnswer && 'text-danger-700',
                  !showResult && 'text-gray-700'
                )}>
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {submitted && (
          <div className={cn(
            'mt-6 p-4 rounded-xl border',
            isCorrect ? 'bg-success-50 border-success-200' : 'bg-danger-50 border-danger-200'
          )}>
            <div className="flex items-start gap-2">
              {isCorrect ? (
                <span className="material-symbols-outlined text-[18px] text-success-500 mt-0.5 shrink-0">check_circle</span>
              ) : (
                <span className="material-symbols-outlined text-[18px] text-danger-500 mt-0.5 shrink-0">close</span>
              )}
              <div>
                <p className={cn('text-sm font-semibold', isCorrect ? 'text-success-700' : 'text-danger-700')}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </p>
                <p className="text-sm text-on-surface-variant mt-1">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6 pt-4 border-t border-outline-light">
          {!submitted ? (
            <Button onClick={handleSubmit} disabled={selected === null}>
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {currentQ < quizQuestions.length - 1 ? 'Next Question' : 'Complete Assessment'}
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
