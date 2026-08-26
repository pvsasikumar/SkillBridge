import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Input';
import { EmptyState, LoadingState } from '@/components/ui/EmptyState';
import { AIInsight } from '@/components/ui/AIInsight';
import { useApp, generateId } from '@/context/AppContext';
import { currentUser, studentSkills } from '@/data/mockData';
import { generateResumeContent } from '@/lib/ai-service';
import { cn } from '@/lib/utils';

export default function ResumeBuilderPage() {
  const { verifiedSkills, courses, credentials, setResumeProfile, resumeProfile } = useApp();
  const [summary, setSummary] = useState(resumeProfile?.summary || '');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [projects, setProjects] = useState('');
  const [experience, setExperience] = useState('');

  const allVerifiedSkills = verifiedSkills.length > 0
    ? verifiedSkills
    : studentSkills.filter(s => s.verified).map(s => ({
        id: s.id,
        skill: s.name,
        score: s.currentLevel,
        level: s.currentLevel >= 75 ? 'Proficient' : s.currentLevel >= 50 ? 'Developing' : 'Beginner',
        verificationDate: s.lastVerified || '2026-08-20',
        assessmentId: `assess_${s.id}`,
        verificationId: `VB-${s.id.toUpperCase()}-${Date.now()}`,
        evidence: ['Course completed', 'Assessment passed'],
      }));

  const education = `${currentUser.education} in ${currentUser.course} (${currentUser.year})`;
  const certifications = courses.filter(c => c.status === 'skillbridge-verified');
  const achievementSkills = allVerifiedSkills.filter(v => v.score >= 75);

  const handleGenerateAI = useCallback(async () => {
    setGenerating(true);
    try {
      const result = await generateResumeContent(
        allVerifiedSkills.map(v => ({ skill: v.skill, score: v.score, level: v.level })),
        currentUser.careerGoal || 'Full Stack Developer',
        education,
        certifications.map(c => ({ courseName: c.courseName, platform: c.platform }))
      );
      setSummary(result.summary);
    } finally {
      setGenerating(false);
    }
  }, [allVerifiedSkills, education, certifications]);

  const handleCopy = useCallback(() => {
    const resumeText = buildPlainText();
    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [summary, allVerifiedSkills, projects, experience, achievementSkills]);

  const handleSaveToPassport = useCallback(() => {
    const profile = {
      id: generateId(),
      summary,
      technicalSkills: allVerifiedSkills.map(v => ({
        name: v.skill,
        verified: true,
        score: v.score,
      })),
      verifiedSkills: allVerifiedSkills,
      education,
      certifications,
      targetRole: currentUser.careerGoal || 'Full Stack Developer',
    };
    setResumeProfile(profile);
  }, [summary, allVerifiedSkills, certifications, education]);

  function buildPlainText() {
    const lines: string[] = [
      currentUser.name,
      currentUser.email,
      currentUser.careerGoal || 'Full Stack Developer',
      '',
      'PROFESSIONAL SUMMARY',
      summary,
      '',
      'EDUCATION',
      education,
      '',
      'TECHNICAL SKILLS',
      ...allVerifiedSkills.map(v => `${v.skill} (${v.score}% — ${v.level})`),
    ];
    if (achievementSkills.length > 0) {
      lines.push('', 'ACHIEVEMENTS');
      achievementSkills.forEach(v => lines.push(`• ${v.skill}: ${v.score}% competency (${v.level})`));
    }
    if (projects.trim()) {
      lines.push('', 'PROJECTS', projects);
    }
    if (experience.trim()) {
      lines.push('', 'EXPERIENCE', experience);
    }
    return lines.join('\n');
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Build My Resume</h1>
          <p className="text-sm text-on-surface-variant mt-1">AI-powered resume built from your verified competencies</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCopy}>
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button variant="outline" disabled>
            <span className="material-symbols-outlined text-[16px]">download</span>
            Download
          </Button>
          <Button onClick={handleSaveToPassport}>
            <span className="material-symbols-outlined text-[16px]">shield</span>
            Add to Skill Passport
          </Button>
        </div>
      </div>

      <AIInsight
        message="Your resume is built from SkillBridge-verified skills, giving employers confidence in your competency levels."
        variant="success"
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Professional Summary" subtitle="AI-generated from your verified skills" />
            <div className="flex items-center justify-between mb-3">
              <Badge variant="primary" size="sm">
                <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                AI Generated
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleGenerateAI} loading={generating}>
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                Generate with AI
              </Button>
            </div>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Your professional summary will appear here..."
              rows={4}
            />
          </Card>

          <Card>
            <CardHeader title="Technical Skills" subtitle={`${allVerifiedSkills.length} verified competencies`} />
            <div className="space-y-2.5">
              {allVerifiedSkills.map(v => (
                <div key={v.id} className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-success-500">check_circle</span>
                    <span className="text-sm font-medium text-on-surface">{v.skill}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">{v.score}%</span>
                    <Badge variant="success" size="sm">
                      <span className="material-symbols-outlined text-[10px]">shield</span>
                      Verified
                    </Badge>
                  </div>
                </div>
              ))}
              {allVerifiedSkills.length === 0 && (
                <p className="text-sm text-on-surface-variant text-center py-4">
                  No verified skills yet.{' '}
                  <Link to="/courses" className="text-primary hover:underline">Add courses</Link> to build your skill profile.
                </p>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Education" />
            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container">
              <span className="material-symbols-outlined text-[18px] text-primary mt-0.5 shrink-0">school</span>
              <div>
                <p className="text-sm font-semibold text-on-surface">{currentUser.education}</p>
                <p className="text-sm text-on-surface-variant">{currentUser.course}</p>
                <p className="text-xs text-on-surface-variant mt-1">{currentUser.year}</p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Certifications"
              subtitle={`${certifications.length} verified courses`}
              action={certifications.length > 0 ? <Badge variant="success">{certifications.length}</Badge> : undefined}
            />
            {certifications.length > 0 ? (
              <div className="space-y-2.5">
                {certifications.map(c => (
                  <div key={c.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-surface-container">
                    <span className="material-symbols-outlined text-[14px] text-warning-500 mt-0.5 shrink-0">emoji_events</span>
                    <div>
                      <p className="text-sm font-medium text-on-surface">{c.courseName}</p>
                      <p className="text-xs text-on-surface-variant">{c.platform} · Completed {c.completionDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant text-center py-4">No certifications yet.</p>
            )}
          </Card>

          <Card>
            <CardHeader
              title="Projects"
              subtitle="Describe your project experience"
            />
            <Textarea
              value={projects}
              onChange={(e) => setProjects(e.target.value)}
              placeholder="Add project descriptions based on your verified skills..."
              rows={3}
            />
          </Card>

          <Card>
            <CardHeader title="Experience" subtitle="Work or internship experience" />
            <Textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Add your work experience..."
              rows={3}
            />
          </Card>

          <Card>
            <CardHeader title="Achievements" subtitle="Skills at proficiency level" />
            {achievementSkills.length > 0 ? (
              <div className="space-y-2.5">
                {achievementSkills.map(v => (
                  <div key={v.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-success-50/50">
                    <span className="material-symbols-outlined text-[14px] text-success-500 shrink-0">star</span>
                    <div>
                      <p className="text-sm font-medium text-on-surface">{v.skill}</p>
                      <p className="text-xs text-on-surface-variant">Score: {v.score}% · Level: {v.level}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant text-center py-4">
                Achievements unlock as you reach 75%+ competency on verified skills.
              </p>
            )}
          </Card>
        </div>

        <div className="lg:sticky lg:top-4 lg:self-start">
          <Card padding="none" className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[18px] text-primary-200">description</span>
                <h2 className="text-lg font-bold text-white">Resume Preview</h2>
              </div>
              <p className="text-xs text-primary-200">Live preview of your resume</p>
            </div>

            <div className="glass-card p-6 sm:p-8 space-y-6 min-h-[600px]">
              <div className="text-center border-b border-outline-light pb-4">
                <h2 className="text-xl font-bold text-on-surface">{currentUser.name}</h2>
                <p className="text-sm text-on-surface-variant mt-1">{currentUser.email}</p>
                <p className="text-sm text-primary font-medium mt-1">{currentUser.careerGoal || 'Full Stack Developer'}</p>
              </div>

              {summary && (
                <div>
                  <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 border-b border-outline-light pb-1">
                    Professional Summary
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
                </div>
              )}

              <div>
                <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 border-b border-outline-light pb-1">
                  Education
                </h3>
                <p className="text-sm font-medium text-on-surface">{currentUser.education}</p>
                <p className="text-sm text-on-surface-variant">{currentUser.course}, {currentUser.year}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 border-b border-outline-light pb-1">
                  Technical Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {allVerifiedSkills.map(v => (
                    <span
                      key={v.id}
                      className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full',
                        v.score >= 75 ? 'bg-success-50 text-success-700' : 'bg-surface-container-high text-gray-700'
                      )}
                    >
                      {v.score >= 75 && <span className="material-symbols-outlined text-[10px] text-success-500">check_circle</span>}
                      {v.skill} ({v.score}%)
                    </span>
                  ))}
                </div>
              </div>

              {achievementSkills.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 border-b border-outline-light pb-1">
                    Verified Achievements
                  </h3>
                  <div className="space-y-1.5">
                    {achievementSkills.map(v => (
                      <div key={v.id} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[12px] text-success-500 shrink-0">shield</span>
                        <span className="text-sm text-gray-700">
                          {v.skill} — SkillBridge Verified, {v.score}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {projects.trim() && (
                <div>
                  <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 border-b border-outline-light pb-1">
                    Projects
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{projects}</p>
                </div>
              )}

              {experience.trim() && (
                <div>
                  <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 border-b border-outline-light pb-1">
                    Experience
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{experience}</p>
                </div>
              )}

              <div className="pt-4 border-t border-outline-light text-center">
                <p className="text-xs text-outline">
                  Verified by SkillBridge · {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
