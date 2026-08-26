import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import { useRecruiter } from '@/context/RecruiterContext';
import type { CandidateMatchResult, MatchCategory } from '@/types';

export default function CandidatesPage() {
  const [searchParams] = useSearchParams();
  const jobIdFromUrl = searchParams.get('job') || '';
  const { jobs, getJobMatches, isShortlisted, addShortlist } = useRecruiter();
  const [selectedJobId, setSelectedJobId] = useState(jobIdFromUrl || (jobs[0]?.id || ''));
  const [categoryFilter, setCategoryFilter] = useState<MatchCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);

  const matches = useMemo(() => {
    if (!selectedJobId) return [];
    return getJobMatches(selectedJobId);
  }, [selectedJobId, getJobMatches]);

  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      if (categoryFilter !== 'all' && m.category !== categoryFilter) return false;
      if (searchTerm && !m.candidateName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [matches, categoryFilter, searchTerm]);

  const eligible = matches.filter(m => m.category === 'eligible');
  const nearMatch = matches.filter(m => m.category === 'near-match');

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  const categoryConfig: Record<MatchCategory, { label: string; icon: string; color: string; bg: string }> = {
    eligible: { label: 'Eligible', icon: 'check_circle', color: 'text-success-700', bg: 'bg-success-50' },
    'near-match': { label: 'Near Match', icon: 'warning', color: 'text-warning-700', bg: 'bg-warning-50' },
    'not-eligible': { label: 'Not Eligible', icon: 'cancel', color: 'text-danger-700', bg: 'bg-danger-50' },
  };

  const handleShortlist = (match: CandidateMatchResult) => {
    addShortlist({
      id: `sl_${Date.now()}`,
      jobId: selectedJobId,
      candidateId: match.candidateId,
      candidateName: match.candidateName,
      companyId: selectedJob?.companyId || '',
      matchScore: match.skillMatchScore,
      shortlistedAt: new Date().toISOString().split('T')[0],
      recruiter: 'Meera Nair',
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Candidates</h1>
        <p className="text-sm text-on-surface-variant mt-1">Match verified candidates against your job requirements</p>
      </div>

      {/* Job Selector */}
      <Card>
        <div className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Select
            label="Select Job"
            value={selectedJobId}
            onChange={e => setSelectedJobId(e.target.value)}
            options={[{ value: '', label: 'Select a job...' }, ...jobs.map(j => ({ value: j.id, label: j.title }))]}
          />
          {selectedJob && (
            <div className="flex-1">
              <p className="text-sm font-semibold text-on-surface">{selectedJob.title}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedJob.requiredSkills.filter(s => s.type === 'required').map(sk => (
                  <Badge key={sk.id} variant="primary" size="sm">{sk.skill} &ge; {sk.minimumCompetency}%</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Category Summary */}
      {selectedJobId && (
        <div className="grid grid-cols-3 gap-4">
          {(['eligible', 'near-match', 'not-eligible'] as const).map(cat => {
            const count = matches.filter(m => m.category === cat).length;
            const cfg = categoryConfig[cat];
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)}
                className={`p-4 glass-card border-2 text-left transition-all ${
                  categoryFilter === cat ? 'border-primary bg-primary-50' : 'border-outline-light hover:border-outline'
                }`}
              >
                <div className={`w-8 h-8 ${cfg.bg} rounded-xl flex items-center justify-center mb-2`}>
                  <span className={`material-symbols-outlined text-[14px] ${cfg.color}`}>{cfg.icon}</span>
                </div>
                <p className="text-2xl font-bold text-on-surface">{count}</p>
                <p className="text-xs text-on-surface-variant">{cfg.label}</p>
              </button>
            );
          })}
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search candidates..."
            icon={<span className="material-symbols-outlined text-[16px]">search</span>}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value as MatchCategory | 'all')}
          options={[
            { value: 'all', label: 'All' },
            { value: 'eligible', label: 'Eligible' },
            { value: 'near-match', label: 'Near Match' },
            { value: 'not-eligible', label: 'Not Eligible' },
          ]}
        />
      </div>

      {/* Candidate Cards */}
      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <Card className="text-center py-12">
            <span className="material-symbols-outlined text-[40px] text-outline mx-auto mb-3 block">group</span>
            <h3 className="text-lg font-semibold text-on-surface mb-1">No candidates found</h3>
            <p className="text-sm text-on-surface-variant">Try adjusting your filters or select a different job</p>
          </Card>
        ) : (
          filteredMatches.map(match => {
            const cfg = categoryConfig[match.category];
            const expanded = expandedCandidate === match.candidateId;
            const alreadyShortlisted = isShortlisted(selectedJobId, match.candidateId);
            return (
              <Card key={match.candidateId}>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-bold text-on-surface">{match.candidateName}</h3>
                        <Badge variant={match.category === 'eligible' ? 'success' : match.category === 'near-match' ? 'warning' : 'danger'} size="sm">
                          {cfg.label}
                        </Badge>
                        <span className="text-sm font-bold text-primary-700">{match.skillMatchScore}% Skill Match</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-on-surface-variant mb-3">
                        <span>Target: {match.targetRole}</span>
                        <span>Competency: {match.overallCompetency}%</span>
                        <span>Interview Readiness: {match.interviewReadiness}%</span>
                        <span>Verified Skills: {match.verifiedSkillCount}</span>
                      </div>

                      {/* Skill breakdown preview */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {match.skillMatches.slice(0, 5).map(sm => (
                          <span key={sm.skill} className={`text-xs px-2 py-1 rounded-full ${sm.meetsRequired ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700'}`}>
                            {sm.skill}: {sm.candidateScore}% {sm.meetsRequired ? '✓' : `✗ (need ${sm.requiredScore}%)`}
                          </span>
                        ))}
                      </div>

                      {match.failsRequired.length > 0 && (
                        <p className="text-xs text-danger-600 mt-1">
                          {match.failsRequired.length} required competency below threshold
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link to={`/recruiter/candidate/${match.candidateId}?job=${selectedJobId}`}>
                        <Button variant="outline" size="sm"><span className="material-symbols-outlined text-[14px]">visibility</span> View</Button>
                      </Link>
                      {match.category === 'eligible' && !alreadyShortlisted && (
                        <Button variant="gradient" size="sm" onClick={() => handleShortlist(match)}>Shortlist</Button>
                      )}
                      {alreadyShortlisted && (
                        <Badge variant="success" size="sm">Shortlisted</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
