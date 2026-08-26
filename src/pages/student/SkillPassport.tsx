import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Avatar } from '@/components/ui/Avatar';
import { currentUser, studentSkills } from '@/data/mockData';
import { cn } from '@/lib/utils';

const verifiedSkills = studentSkills.filter(s => s.verified);
const overallCompetency = Math.round(studentSkills.reduce((a, s) => a + s.currentLevel, 0) / studentSkills.length);

export default function SkillPassport() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">AI Skill Passport</h1>
          <p className="text-sm text-on-surface-variant mt-1">Your verified digital competency profile</p>
        </div>
        <Button variant="outline">
          <span className="material-symbols-outlined text-[16px]">download</span>
          Download Skill Passport
        </Button>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 sm:px-8 py-8">
          <div className="flex items-center gap-4">
            <Avatar name={currentUser.name} size="xl" />
            <div className="text-white">
              <h2 className="text-xl font-bold">{currentUser.name}</h2>
              <p className="text-primary-200 text-sm mt-0.5">{currentUser.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="material-symbols-outlined text-[14px] text-primary-200">gps_fixed</span>
                <span className="text-sm text-primary-100">{currentUser.careerGoal}</span>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{overallCompetency}%</p>
              <p className="text-xs text-primary-200 mt-0.5">Overall Competency</p>
            </div>
            <div className="h-10 w-px bg-primary-400/50" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{verifiedSkills.length}</p>
              <p className="text-xs text-primary-200 mt-0.5">Verified Skills</p>
            </div>
            <div className="h-10 w-px bg-primary-400/50" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{studentSkills.length}</p>
              <p className="text-xs text-primary-200 mt-0.5">Total Skills</p>
            </div>
          </div>
        </div>

        <div className="px-6 sm:px-8 py-6">
          <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-4">Skill Competencies</h3>
          <div className="space-y-4">
            {studentSkills.map(skill => (
              <div key={skill.id} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-on-surface">{skill.name}</span>
                      {skill.verified && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-success-50 text-success-700 text-xs font-medium rounded-full">
                          <span className="material-symbols-outlined text-[10px]">shield</span>
                          AI Verified
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-bold text-on-surface">{skill.currentLevel}%</span>
                  </div>
                  <Progress value={skill.currentLevel} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 sm:px-8 py-4 border-t border-outline-light bg-surface-container/50">
          <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Verification Details</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {verifiedSkills.map(skill => (
              <div key={skill.id} className="flex items-start gap-3 p-3 glass-card rounded-xl border border-outline-light">
                <span className="material-symbols-outlined text-[16px] text-success-500 mt-0.5 shrink-0">check_circle</span>
                <div>
                  <p className="text-sm font-medium text-on-surface">{skill.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-on-surface-variant">
                    <span>Assessment completed</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px]">calendar_today</span>
                      {skill.lastVerified}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 sm:px-8 py-4 border-t border-outline-light flex items-center justify-between">
          <p className="text-xs text-outline">Generated by SkillBridge AI · Last updated: August 25, 2026</p>
          <div className="flex items-center gap-1.5 text-xs text-primary">
            <span className="material-symbols-outlined text-[12px]">open_in_new</span>
            <span>Share Profile</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
