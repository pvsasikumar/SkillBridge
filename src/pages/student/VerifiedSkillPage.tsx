import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useApp } from '@/context/AppContext';
import { studentSkills } from '@/data/mockData';

const allStudentSkills = studentSkills;
const verifiedFromMock = allStudentSkills.filter(s => s.verified);

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

export default function VerifiedSkillPage() {
  const { verifiedSkills, credentials, skills } = useApp();

  const allVerified = verifiedSkills.length > 0
    ? verifiedSkills
    : verifiedFromMock.map(s => ({
        id: s.id,
        skill: s.name,
        score: s.currentLevel,
        level: getLevelLabel(s.currentLevel),
        verificationDate: s.lastVerified ?? '2026-08-20',
        assessmentId: `assess_${s.id}`,
        verificationId: `SB-${s.id.replace('s', '').toUpperCase().padStart(6, '0')}`,
        evidence: [],
      }));

  const inProgressSkills = skills.length > 0
    ? skills.filter(s => s.status === 'needs-attention' && !s.verified)
    : allStudentSkills.filter(s => s.status === 'needs-attention' && !s.verified);

  const pendingVerification = inProgressSkills.slice(0, 3);

  const unverifiedSkills = allStudentSkills.filter(
    s => !s.verified && s.status !== 'needs-attention'
  ).slice(0, 3);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Verified Skills</h1>
          <p className="text-sm text-on-surface-variant mt-1">Your AI-verified competency credentials</p>
        </div>
        <Link to="/quiz">
          <Button>
            <span className="material-symbols-outlined text-[16px]">add</span>
            Take Assessment
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="flex items-start gap-4">
          <div className="w-10 h-10 bg-success-50 rounded-xl flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px] text-success-600">shield</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-on-surface">{allVerified.length}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Total Verified</p>
          </div>
        </Card>
        <Card className="flex items-start gap-4">
          <div className="w-10 h-10 bg-warning-50 rounded-xl flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px] text-warning-600">schedule</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-on-surface">{pendingVerification.length}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">In Progress</p>
          </div>
        </Card>
        <Card className="flex items-start gap-4">
          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px] text-primary">gps_fixed</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-on-surface">{unverifiedSkills.length}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Pending Verification</p>
          </div>
        </Card>
      </div>

      {allVerified.length === 0 && pendingVerification.length === 0 ? (
        <EmptyState
          icon={<span className="material-symbols-outlined text-[48px]">emoji_events</span>}
          title="No Verified Skills Yet"
          description="Complete a competency assessment to get your skills AI-verified and earn digital credentials."
          action={
            <Link to="/quiz">
              <Button>
                Take Your First Assessment
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          {allVerified.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-on-surface mb-4">Verified Skills</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allVerified.map(verified => {
                  const credential = credentials.find(c => c.skill === verified.skill);
                  return (
                    <Card key={verified.id} hover className="relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-success-400 to-success-600" />
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 bg-success-50 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px] text-success-600">check_circle</span>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-on-surface">{verified.skill}</h3>
                            <p className="text-xs text-on-surface-variant">{verified.score}% competency</p>
                          </div>
                        </div>
                        <Badge variant={getLevelVariant(verified.score)} size="sm">{verified.level}</Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                          <span className="material-symbols-outlined text-[12px]">schedule</span>
                          <span>Verified {verified.verificationDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                          <span className="material-symbols-outlined text-[12px]">shield</span>
                          <span className="font-mono">{verified.verificationId}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link to={`/credential/${credential?.id ?? verified.id}`} className="flex-1">
                          <Button variant="outline" size="sm" fullWidth>
                            <span className="material-symbols-outlined text-[13px]">visibility</span>
                            View Credential
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">
                          <span className="material-symbols-outlined text-[13px]">add</span>
                          Resume
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {pendingVerification.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-on-surface mb-4">In Progress</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingVerification.map(skill => (
                  <Card key={skill.id} hover>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-warning-50 rounded-xl flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px] text-warning-500">schedule</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-on-surface">{skill.name}</h3>
                          <p className="text-xs text-on-surface-variant">{skill.currentLevel}% current</p>
                        </div>
                      </div>
                      <Badge variant="warning" size="sm">In Progress</Badge>
                    </div>

                    <div className="space-y-2 mb-4 text-xs text-on-surface-variant">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[12px]">gps_fixed</span>
                        <span>Target: {skill.requiredLevel}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[12px]">menu_book</span>
                        <span>Complete learning modules first</span>
                      </div>
                    </div>

                    <Link to="/roadmap">
                      <Button variant="outline" size="sm" fullWidth>
                        Continue Learning
                        <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {unverifiedSkills.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-on-surface mb-4">Pending Verification</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {unverifiedSkills.map(skill => (
                  <Card key={skill.id} hover>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-surface-container rounded-xl flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px] text-outline">emoji_events</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-on-surface">{skill.name}</h3>
                          <p className="text-xs text-on-surface-variant">{skill.currentLevel}% current</p>
                        </div>
                      </div>
                      <Badge variant="default" size="sm">Unverified</Badge>
                    </div>

                    <Link to="/quiz">
                      <Button size="sm" fullWidth>
                        Take Assessment
                        <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
