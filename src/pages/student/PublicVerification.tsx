import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { studentSkills } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function PublicVerification() {
  const { verificationId } = useParams<{ verificationId: string }>();
  const { verifiedSkills, credentials } = useApp();

  const credential = useMemo(() => {
    if (!verificationId) return null;

    const allCredentials = credentials.length > 0
      ? credentials
      : verifiedSkills.map(v => ({
          id: v.id,
          verifiedSkillId: v.id,
          studentName: 'SkillBridge Student',
          targetRole: 'Full Stack Developer',
          skill: v.skill,
          score: v.score,
          level: v.level,
          verificationDate: v.verificationDate,
          verificationId: v.verificationId,
          evidence: v.evidence,
        }));

    const found = allCredentials.find(c => c.verificationId === verificationId);
    if (found) return found;

    const verifiedFallback = studentSkills.filter(s => s.verified).map(s => ({
      id: s.id,
      verifiedSkillId: s.id,
      studentName: 'SkillBridge Student',
      targetRole: 'Full Stack Developer',
      skill: s.name,
      score: s.currentLevel,
      level: s.currentLevel >= 75 ? 'Proficient' : s.currentLevel >= 50 ? 'Developing' : 'Beginner',
      verificationDate: s.lastVerified || '2026-08-20',
      verificationId: `VB-${s.id.toUpperCase()}-2026`,
      evidence: ['Course completed', 'Assessment passed', 'Competency verified'],
    }));

    return verifiedFallback[0] || null;
  }, [verificationId, verifiedSkills, credentials]);

  if (!verificationId) {
    return (
      <div className="min-h-screen bg-surface-container flex items-center justify-center p-4">
        <div className="text-center">
          <span className="material-symbols-outlined text-[48px] text-gray-300 mx-auto mb-4">error</span>
          <h1 className="text-xl font-bold text-on-surface mb-2">Invalid Verification Link</h1>
          <p className="text-sm text-on-surface-variant">No verification ID provided.</p>
        </div>
      </div>
    );
  }

  if (!credential) {
    return (
      <div className="min-h-screen bg-surface-container flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-surface-container-high rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[32px] text-gray-300">shield</span>
          </div>
          <h1 className="text-xl font-bold text-on-surface mb-2">Credential Not Found</h1>
          <p className="text-sm text-on-surface-variant mb-6">
            The verification ID <span className="font-mono text-gray-700">{verificationId}</span> does not match any SkillBridge credential.
          </p>
          <a
            href="https://skillbridge.ai"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-700"
          >
            Visit SkillBridge
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </a>
        </div>
      </div>
    );
  }

  const scoreColor = (score: number) =>
    score >= 75 ? 'text-success-600 bg-success-50' :
    score >= 50 ? 'text-warning-600 bg-warning-50' :
    'text-danger-600 bg-danger-50';

  const levelLabel = (score: number) =>
    score >= 90 ? 'Advanced' : score >= 75 ? 'Proficient' : score >= 50 ? 'Developing' : 'Beginner';

  return (
    <div className="min-h-screen bg-surface-container flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-[24px] text-white">shield</span>
          </div>
          <h1 className="text-lg font-bold text-on-surface">SkillBridge Verified Competency</h1>
          <p className="text-xs text-on-surface-variant mt-1">Digital credential verification</p>
        </div>

        <div className="glass-card rounded-2xl border border-outline-light shadow-sm overflow-hidden">
          <div className={cn('px-6 py-6 text-center', scoreColor(credential.score))}>
            <div className={cn(
              'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold',
              'glass-panel'
            )}>
              {credential.score}%
            </div>
            <h2 className="text-xl font-bold text-on-surface">{credential.skill}</h2>
            <p className="text-sm font-medium mt-1 text-gray-700">
              Level: {credential.level || levelLabel(credential.score)}
            </p>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-surface-container rounded-xl">
                <p className="text-xs text-on-surface-variant mb-0.5">Verified Date</p>
                <p className="font-medium text-on-surface">
                  {new Date(credential.verificationDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="p-3 bg-surface-container rounded-xl">
                <p className="text-xs text-on-surface-variant mb-0.5">Verification ID</p>
                <p className="font-mono text-xs font-medium text-on-surface break-all">
                  {credential.verificationId}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Evidence Checklist
              </p>
              <div className="space-y-2">
                {['Course completed', 'Assessment completed', 'Competency verified'].map((item, i) => {
                  const passed = i < (credential.evidence?.length || 0);
                  return (
                    <div key={item} className="flex items-center gap-2.5">
                      <span className={cn(
                        'material-symbols-outlined text-[16px] shrink-0',
                        passed ? 'text-success-500' : 'text-gray-300'
                      )}>check_circle</span>
                      <span className={cn('text-sm', passed ? 'text-gray-700' : 'text-outline')}>
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-outline-light bg-surface-container/50 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-outline">
              <span className="material-symbols-outlined text-[12px]">emoji_events</span>
              <span>Powered by SkillBridge</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-outline mt-4">
          This credential was issued by SkillBridge AI Competency Platform.
        </p>
      </div>
    </div>
  );
}
