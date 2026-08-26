import { useParams, Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { currentUser, studentSkills } from '@/data/mockData';
import { cn } from '@/lib/utils';

function getLevelLabel(score: number): string {
  if (score >= 90) return 'Expert';
  if (score >= 75) return 'Advanced';
  if (score >= 60) return 'Proficient';
  return 'Developing';
}

function getLevelVariant(score: number): 'success' | 'primary' | 'warning' | 'default' {
  if (score >= 90) return 'success';
  if (score >= 75) return 'primary';
  if (score >= 60) return 'warning';
  return 'default';
}

export default function CredentialPage() {
  const { credentialId } = useParams<{ credentialId: string }>();
  const { credentials, verifiedSkills } = useApp();

  const credential = credentialId
    ? credentials.find(c => c.id === credentialId) ?? verifiedSkills.find(v => v.id === credentialId)
    : undefined;

  const skillName = credential?.skill ?? 'React';
  const score = credential?.score ?? studentSkills.find(s => s.name === skillName)?.currentLevel ?? 78;
  const level = getLevelLabel(score);
  const verificationId = credential?.verificationId ?? 'SB-4A7F2C';
  const verificationDate = credential?.verificationDate ?? '2026-08-25';

  const verificationSteps = [
    { label: 'Course Certificate Submitted', completed: true },
    { label: 'Skills Extracted & Verified', completed: true },
    { label: 'Competency Assessment Passed', completed: true },
    { label: 'AI Verification Complete', completed: true },
    { label: 'Credential Issued', completed: true },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link to="/verified-skills" className="p-2 rounded-xl hover:bg-surface-container-high text-outline hover:text-gray-600 transition-colors">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Digital Credential</h1>
          <p className="text-sm text-on-surface-variant mt-0.5">SkillBridge verified competency credential</p>
        </div>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 px-6 sm:px-10 py-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[20px] text-primary-200">shield</span>
              <span className="text-primary-200 text-sm font-semibold tracking-wider uppercase">SkillBridge Verified</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">{currentUser.name}</h2>
            <p className="text-primary-200 text-sm">{currentUser.careerGoal}</p>

            <div className="mt-6 flex flex-wrap items-center gap-6">
              <div>
                <p className="text-xs text-primary-300 uppercase tracking-wider mb-1">Skill</p>
                <p className="text-lg font-bold text-white">{skillName}</p>
              </div>
              <div className="h-10 w-px bg-primary-400/40" />
              <div>
                <p className="text-xs text-primary-300 uppercase tracking-wider mb-1">Competency</p>
                <p className="text-lg font-bold text-white">{score}%</p>
              </div>
              <div className="h-10 w-px bg-primary-400/40" />
              <div>
                <p className="text-xs text-primary-300 uppercase tracking-wider mb-1">Level</p>
                <Badge variant={getLevelVariant(score)} size="md">{level}</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 sm:px-10 py-6 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Verification Details</h3>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-[15px] text-outline shrink-0">calendar_today</span>
                  <span className="text-on-surface-variant">Issued:</span>
                  <span className="font-medium text-on-surface">{verificationDate}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-[15px] text-outline shrink-0">tag</span>
                  <span className="text-on-surface-variant">Verification ID:</span>
                  <span className="font-mono font-medium text-on-surface">{verificationId}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-[15px] text-outline shrink-0">emoji_events</span>
                  <span className="text-on-surface-variant">Issued by:</span>
                  <span className="font-medium text-on-surface">SkillBridge AI Platform</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Verification Checklist</h3>
              <div className="space-y-2">
                {verificationSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[15px] text-success-500 shrink-0">check_circle</span>
                    <span className="text-sm text-gray-700">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-outline-light pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-24 h-24 bg-surface-container-high rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 shrink-0">
                <div className="text-center">
                  <span className="material-symbols-outlined text-[28px] text-outline mx-auto">qr_code_2</span>
                  <span className="text-xs text-outline mt-1 block">QR</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 mb-1">Scan to Verify</p>
                <p className="text-xs text-on-surface-variant">
                  Scan this QR code or visit the verification link to confirm the authenticity of this credential.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 sm:px-10 py-4 border-t border-outline-light bg-surface-container/50 flex flex-wrap items-center gap-2">
          <p className="text-xs text-outline mr-auto">SkillBridge Verified Credential · {verificationId}</p>
          <div className="flex items-center gap-1 text-xs text-primary">
            <span className="material-symbols-outlined text-[12px]">open_in_new</span>
            <span>skillbridge.ai</span>
          </div>
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Link to={`/verify/${verificationId}`}>
          <Button variant="outline" fullWidth>
            <span className="material-symbols-outlined text-[15px]">shield</span>
            Verify Credential
          </Button>
        </Link>
        <Button variant="outline" fullWidth>
          <span className="material-symbols-outlined text-[15px]">download</span>
          Download
        </Button>
        <Button variant="outline" fullWidth>
          <span className="material-symbols-outlined text-[15px]">add</span>
          Add to Resume
        </Button>
        <Button variant="outline" fullWidth>
          <span className="material-symbols-outlined text-[15px]">share</span>
          Share Profile
        </Button>
      </div>
    </div>
  );
}
