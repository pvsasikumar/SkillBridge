import { useState, useCallback } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { allCompetencies } from '@/data/competencyFramework';
import type { BankQuestion } from '@/types';

const mockQuestions: BankQuestion[] = [
  { id: 'bq-1', question: 'Which sampling method gives every unit in the population an equal probability of selection?', options: ['Convenience Sampling', 'Simple Random Sampling', 'Judgment Sampling', 'Quota Sampling'], correctIndex: 1, explanation: 'Simple random sampling gives each eligible unit an equal probability of selection according to the sampling design.', competency: 'Sampling Techniques', topic: 'Random Sampling', difficulty: 'Easy', questionType: 'mcq', sourceMaterial: 'Survey Sampling Methods Guide', createdBy: 'Dr. Priya Sharma', isAiGenerated: false, approvalStatus: 'approved', createdAt: '2026-08-24' },
  { id: 'bq-2', question: 'What is the primary advantage of stratified sampling over simple random sampling?', options: ['Lower cost', 'Ensures representation from all subgroups', 'Faster data collection', 'No need for a sampling frame'], correctIndex: 1, explanation: 'Stratified sampling ensures proportional representation from each stratum, improving precision for subgroup estimates.', competency: 'Sampling Techniques', topic: 'Stratified Sampling', difficulty: 'Medium', questionType: 'mcq', sourceMaterial: 'Survey Sampling Methods Guide', createdBy: 'AI Generator', isAiGenerated: true, approvalStatus: 'approved', createdAt: '2026-08-24' },
  { id: 'bq-3', question: 'In a multi-stage cluster sample, the PSU is selected using:', options: ['Simple random sampling', 'Systematic sampling', 'Either simple random or systematic sampling', 'Convenience sampling'], correctIndex: 2, explanation: 'Primary sampling units (PSUs) can be selected using either simple random or systematic sampling in multi-stage designs.', competency: 'Sampling Techniques', topic: 'Cluster Sampling', difficulty: 'Hard', questionType: 'mcq', createdBy: 'Dr. Priya Sharma', isAiGenerated: false, approvalStatus: 'approved', createdAt: '2026-08-23' },
  { id: 'bq-4', question: 'True or False: Non-response bias can be completely eliminated through weighting adjustments.', options: ['True', 'False'], correctIndex: 1, explanation: 'Weighting can reduce but not completely eliminate non-response bias, as some groups may be systematically underrepresented.', competency: 'Data Quality Assurance', topic: 'Data Validation', difficulty: 'Medium', questionType: 'true-false', createdBy: 'AI Generator', isAiGenerated: true, approvalStatus: 'pending', createdAt: '2026-08-24' },
  { id: 'bq-5', question: 'A survey officer finds that 15% of sampled households are not available during the first visit. What is the recommended approach?', options: ['Replace them with nearby households', 'Record them as non-respondents', 'Make repeat visits as per the survey protocol', 'Skip them and adjust the sample size'], correctIndex: 2, explanation: 'Survey protocols typically require multiple follow-up visits before classifying a household as non-respondent.', competency: 'Survey Methodology', topic: 'Field Operations', difficulty: 'Easy', questionType: 'scenario', sourceMaterial: 'NSSO Survey Methods Handbook', createdBy: 'Dr. Priya Sharma', isAiGenerated: false, approvalStatus: 'approved', createdAt: '2026-08-22' },
  { id: 'bq-6', question: 'Which data quality dimension ensures that the data accurately represents the real-world phenomenon it is intended to measure?', options: ['Timeliness', 'Completeness', 'Accuracy', 'Consistency'], correctIndex: 2, explanation: 'Accuracy refers to the degree to which data correctly reflects the real-world entity or event being measured.', competency: 'Data Quality Assurance', topic: 'Quality Dimensions', difficulty: 'Easy', questionType: 'mcq', createdBy: 'AI Generator', isAiGenerated: true, approvalStatus: 'approved', createdAt: '2026-08-23' },
];

const difficultyColors = { Easy: 'success', Medium: 'warning', Hard: 'danger' } as const;
const statusColors = { pending: 'warning', approved: 'success', rejected: 'danger', 'needs-revision': 'primary' } as const;

export default function QuestionBank() {
  const [questions, setQuestions] = useState<BankQuestion[]>(mockQuestions);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCompetency, setFilterCompetency] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [viewingQuestion, setViewingQuestion] = useState<BankQuestion | null>(null);

  const filtered = questions.filter(q => {
    const matchesSearch = !searchQuery || q.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompetency = filterCompetency === 'All' || q.competency === filterCompetency;
    const matchesDifficulty = filterDifficulty === 'All' || q.difficulty === filterDifficulty;
    const matchesStatus = filterStatus === 'All' || q.approvalStatus === filterStatus;
    return matchesSearch && matchesCompetency && matchesDifficulty && matchesStatus;
  });

  const handleApprove = useCallback((id: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, approvalStatus: 'approved' as const } : q));
  }, []);

  const handleReject = useCallback((id: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, approvalStatus: 'rejected' as const } : q));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  }, []);

  const stats = {
    total: questions.length,
    pending: questions.filter(q => q.approvalStatus === 'pending').length,
    approved: questions.filter(q => q.approvalStatus === 'approved').length,
    aiGenerated: questions.filter(q => q.isAiGenerated).length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Question Bank</h1>
          <p className="text-sm text-on-surface-variant mt-1">Manage and review assessment questions</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Questions', value: stats.total, iconName: 'lightbulb', color: 'text-primary', bg: 'bg-primary-50' },
          { label: 'Pending Review', value: stats.pending, iconName: 'shield', color: 'text-warning-600', bg: 'bg-warning-50' },
          { label: 'Approved', value: stats.approved, iconName: 'check_circle', color: 'text-success-600', bg: 'bg-success-50' },
          { label: 'AI Generated', value: stats.aiGenerated, iconName: 'refresh', color: 'text-secondary-600', bg: 'bg-secondary-50' },
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

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3 p-4">
          <div className="relative flex-1">
            <span className="material-symbols-outlined text-[16px] absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input type="text" placeholder="Search questions..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-outline-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary" />
          </div>
          <select value={filterCompetency} onChange={e => setFilterCompetency(e.target.value)} className="px-3 py-2 border border-outline-light rounded-xl text-sm">
            <option value="All">All Competencies</option>
            {allCompetencies.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <select value={filterDifficulty} onChange={e => setFilterDifficulty(e.target.value)} className="px-3 py-2 border border-outline-light rounded-xl text-sm">
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 border border-outline-light rounded-xl text-sm">
            <option value="All">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </Card>

      {/* Questions Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-light">
                <th className="text-left py-3 px-4 font-medium text-on-surface-variant w-8">#</th>
                <th className="text-left py-3 px-4 font-medium text-on-surface-variant">Question</th>
                <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Competency</th>
                <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Difficulty</th>
                <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Type</th>
                <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Source</th>
                <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Status</th>
                <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((q, i) => (
                <tr key={q.id} className="border-b border-surface-container hover:bg-surface-container/50 transition-colors">
                  <td className="py-3 px-4 text-outline">{i + 1}</td>
                  <td className="py-3 px-4">
                    <p className="text-sm font-medium text-on-surface line-clamp-2 max-w-md">{q.question}</p>
                    {q.isAiGenerated && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary-50 text-secondary-600 mt-1 inline-block">AI Generated</span>}
                  </td>
                  <td className="py-3 px-4 text-center"><Badge variant="primary" size="sm">{q.competency}</Badge></td>
                  <td className="py-3 px-4 text-center"><Badge variant={difficultyColors[q.difficulty]} size="sm">{q.difficulty}</Badge></td>
                  <td className="py-3 px-4 text-center text-xs text-on-surface-variant uppercase">{q.questionType}</td>
                  <td className="py-3 px-4 text-center text-xs text-on-surface-variant max-w-[120px] truncate" title={q.sourceMaterial || 'Manual'}>{q.sourceMaterial || 'Manual'}</td>
                  <td className="py-3 px-4 text-center"><Badge variant={statusColors[q.approvalStatus]} size="sm">{q.approvalStatus}</Badge></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setViewingQuestion(q)} className="p-1.5 rounded-xl hover:bg-surface-container-high"><span className="material-symbols-outlined text-[14px] text-on-surface-variant">visibility</span></button>
                      {q.approvalStatus === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(q.id)} className="p-1.5 rounded-xl hover:bg-success-50"><span className="material-symbols-outlined text-[14px] text-success-500">check_circle</span></button>
                          <button onClick={() => handleReject(q.id)} className="p-1.5 rounded-xl hover:bg-danger-50"><span className="material-symbols-outlined text-[14px] text-danger-500">error</span></button>
                        </>
                      )}
                      <button onClick={() => handleDelete(q.id)} className="p-1.5 rounded-xl hover:bg-danger-50"><span className="material-symbols-outlined text-[14px] text-danger-400">delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-[32px] text-outline mx-auto mb-3 block">lightbulb</span>
            <p className="text-sm text-on-surface-variant">No questions match your filters</p>
          </div>
        )}
      </Card>

      {/* View Question Modal */}
      <Modal open={!!viewingQuestion} onClose={() => setViewingQuestion(null)} title="Question Details" size="lg">
        {viewingQuestion && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">{viewingQuestion.competency}</Badge>
              <Badge variant={difficultyColors[viewingQuestion.difficulty]} size="sm">{viewingQuestion.difficulty}</Badge>
              <Badge variant={statusColors[viewingQuestion.approvalStatus]} size="sm">{viewingQuestion.approvalStatus}</Badge>
            </div>
            <p className="text-sm font-medium text-on-surface">{viewingQuestion.question}</p>
            <div className="space-y-2">
              {viewingQuestion.options.map((opt, i) => (
                <div key={i} className={cn('flex items-center gap-2 p-3 rounded-xl text-sm', i === viewingQuestion.correctIndex ? 'bg-success-50 border border-success-200' : 'bg-surface-container')}>
                  <span className={cn('w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold', i === viewingQuestion.correctIndex ? 'bg-success-500 text-white' : 'bg-surface-container-high text-on-surface-variant')}>{String.fromCharCode(65 + i)}</span>
                  <span className={cn(i === viewingQuestion.correctIndex && 'font-medium text-success-700')}>{opt}</span>
                  {i === viewingQuestion.correctIndex && <span className="material-symbols-outlined text-[14px] text-success-500 ml-auto">check_circle</span>}
                </div>
              ))}
            </div>
            <div className="p-3 bg-primary-50 border border-primary-200 rounded-xl">
              <p className="text-xs font-semibold text-primary-800 mb-1">Explanation</p>
              <p className="text-sm text-primary-700">{viewingQuestion.explanation}</p>
            </div>
            <div className="text-xs text-on-surface-variant">Topic: {viewingQuestion.topic} · Created by: {viewingQuestion.createdBy} · {viewingQuestion.createdAt}</div>
          </div>
        )}
      </Modal>
    </div>
  );
}
