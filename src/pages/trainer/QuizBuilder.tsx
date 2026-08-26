import { useState, useCallback } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/lib/utils';
import { allCompetencies } from '@/data/competencyFramework';
import type { BuiltQuiz, BankQuestion } from '@/types';

const mockQuizzes: BuiltQuiz[] = [
  { id: 'quiz-1', title: 'Survey Sampling Fundamentals Quiz', competency: 'Sampling Techniques', topics: ['Random Sampling', 'Stratified Sampling', 'Cluster Sampling'], questionCount: 10, passingScore: 70, timeLimit: 30, attemptLimit: 3, questions: [], status: 'published', createdBy: 'Dr. Priya Sharma', createdAt: '2026-08-24' },
  { id: 'quiz-2', title: 'Data Quality Assessment', competency: 'Data Quality Assurance', topics: ['Data Validation', 'Quality Metrics', 'Error Detection'], questionCount: 15, passingScore: 75, timeLimit: 45, attemptLimit: 2, questions: [], status: 'draft', createdBy: 'Dr. Priya Sharma', createdAt: '2026-08-23' },
  { id: 'quiz-3', title: 'Official Statistics Framework', competency: 'Official Statistics', topics: ['NSO Framework', 'Data Dissemination'], questionCount: 8, passingScore: 70, timeLimit: 20, attemptLimit: 3, questions: [], status: 'published', createdBy: 'Dr. Priya Sharma', createdAt: '2026-08-22' },
];

export default function QuizBuilder() {
  const [quizzes, setQuizzes] = useState<BuiltQuiz[]>(mockQuizzes);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newQuiz, setNewQuiz] = useState({ title: '', competency: '', topics: '', questionCount: 10, passingScore: 70, timeLimit: 30, attemptLimit: 3 });

  const handleCreate = useCallback(() => {
    if (!newQuiz.title || !newQuiz.competency) return;
    const quiz: BuiltQuiz = {
      id: `quiz-${Date.now()}`,
      title: newQuiz.title,
      competency: newQuiz.competency,
      topics: newQuiz.topics.split(',').map(t => t.trim()).filter(Boolean),
      questionCount: newQuiz.questionCount,
      passingScore: newQuiz.passingScore,
      timeLimit: newQuiz.timeLimit,
      attemptLimit: newQuiz.attemptLimit,
      questions: [],
      status: 'draft',
      createdBy: 'Current Trainer',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setQuizzes(prev => [...prev, quiz]);
    setShowCreateModal(false);
    setNewQuiz({ title: '', competency: '', topics: '', questionCount: 10, passingScore: 70, timeLimit: 30, attemptLimit: 3 });
  }, [newQuiz]);

  const handlePublish = useCallback((id: string) => {
    setQuizzes(prev => prev.map(q => q.id === id ? { ...q, status: 'published' as const } : q));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setQuizzes(prev => prev.filter(q => q.id !== id));
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Quiz Builder</h1>
          <p className="text-sm text-on-surface-variant mt-1">Create and manage competency quizzes</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <span className="material-symbols-outlined text-[16px]">add</span>
          Create Quiz
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Quizzes', value: quizzes.length, iconName: 'description', color: 'text-primary', bg: 'bg-primary-50' },
          { label: 'Published', value: quizzes.filter(q => q.status === 'published').length, iconName: 'check_circle', color: 'text-success-600', bg: 'bg-success-50' },
          { label: 'Drafts', value: quizzes.filter(q => q.status === 'draft').length, iconName: 'edit', color: 'text-warning-600', bg: 'bg-warning-50' },
          { label: 'Competencies', value: [...new Set(quizzes.map(q => q.competency))].length, iconName: 'gps_fixed', color: 'text-secondary-600', bg: 'bg-secondary-50' },
        ].map(stat => (
          <Card key={stat.label} className="flex items-start gap-4">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center shrink-0`}>
              <span className={cn('material-symbols-outlined text-[18px]', stat.color)}>{stat.iconName}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map(quiz => (
          <Card key={quiz.id} className="flex flex-col">
            <div className="p-4 flex-1">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px] text-primary">description</span>
                </div>
                <Badge variant={quiz.status === 'published' ? 'success' : 'warning'} size="sm">{quiz.status}</Badge>
              </div>
              <h3 className="text-sm font-semibold text-on-surface mb-2">{quiz.title}</h3>
              <div className="flex flex-wrap gap-1 mb-3">
                <Badge variant="primary" size="sm">{quiz.competency}</Badge>
                {quiz.topics.slice(0, 2).map(t => (
                  <Badge key={t} variant="default" size="sm">{t}</Badge>
                ))}
              </div>
              <div className="space-y-1.5 text-xs text-on-surface-variant">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">description</span>{quiz.questionCount} questions</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">schedule</span>{quiz.timeLimit} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Passing: {quiz.passingScore}%</span>
                  <span>Attempts: {quiz.attemptLimit}</span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-outline-light flex items-center justify-between">
              <span className="text-xs text-outline">by {quiz.createdBy}</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm"><span className="material-symbols-outlined text-[14px]">visibility</span></Button>
                {quiz.status === 'draft' && (
                  <Button variant="ghost" size="sm" onClick={() => handlePublish(quiz.id)}>
                    <span className="material-symbols-outlined text-[14px] text-success-500">check_circle</span>
                    Publish
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => handleDelete(quiz.id)}>
                  <span className="material-symbols-outlined text-[14px] text-danger-400">delete</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Quiz Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCreateModal(false)} />
          <div className="relative glass-card rounded-2xl shadow-xl max-w-lg w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-on-surface mb-4">Create New Quiz</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">Quiz Title</label>
                <input type="text" value={newQuiz.title} onChange={e => setNewQuiz(prev => ({ ...prev, title: e.target.value }))} placeholder="e.g., Survey Sampling Assessment" className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">Competency</label>
                <select value={newQuiz.competency} onChange={e => setNewQuiz(prev => ({ ...prev, competency: e.target.value }))} className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm">
                  <option value="">Select competency</option>
                  {allCompetencies.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">Topics (comma separated)</label>
                <input type="text" value={newQuiz.topics} onChange={e => setNewQuiz(prev => ({ ...prev, topics: e.target.value }))} placeholder="e.g., Random Sampling, Stratified Sampling" className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Questions</label>
                  <select value={newQuiz.questionCount} onChange={e => setNewQuiz(prev => ({ ...prev, questionCount: +e.target.value }))} className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm">
                    {[5, 10, 15, 20, 30].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Passing Score (%)</label>
                  <select value={newQuiz.passingScore} onChange={e => setNewQuiz(prev => ({ ...prev, passingScore: +e.target.value }))} className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm">
                    {[50, 60, 65, 70, 75, 80].map(n => <option key={n} value={n}>{n}%</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Time Limit (min)</label>
                  <input type="number" value={newQuiz.timeLimit} onChange={e => setNewQuiz(prev => ({ ...prev, timeLimit: +e.target.value }))} className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Attempt Limit</label>
                  <select value={newQuiz.attemptLimit} onChange={e => setNewQuiz(prev => ({ ...prev, attemptLimit: +e.target.value }))} className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm">
                    {[1, 2, 3, 5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={!newQuiz.title || !newQuiz.competency}>Create Quiz</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
