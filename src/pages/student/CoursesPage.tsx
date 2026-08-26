import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { EmptyState, LoadingState } from '@/components/ui/EmptyState';
import { AIInsight } from '@/components/ui/AIInsight';
import { useApp, generateId } from '@/context/AppContext';
import { extractSkillsFromCourse } from '@/lib/ai-service';
import type { CourseSubmission, CoursePlatform, ExtractedSkill } from '@/types';

const platformOptions = [
  { value: 'Udemy', label: 'Udemy' },
  { value: 'Coursera', label: 'Coursera' },
  { value: 'NPTEL', label: 'NPTEL' },
  { value: 'edX', label: 'edX' },
  { value: 'Other', label: 'Other' },
];

interface CourseForm {
  platform: CoursePlatform;
  courseName: string;
  courseUrl: string;
  certificateUrl: string;
  completionDate: string;
  skillsInput: string;
}

const emptyForm: CourseForm = {
  platform: 'Udemy',
  courseName: '',
  courseUrl: '',
  certificateUrl: '',
  completionDate: '',
  skillsInput: '',
};

interface ExtractedSkillState {
  courseId: string;
  skills: ExtractedSkill[];
}

export default function CoursesPage() {
  const { courses, addCourse, updateCourse } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<CourseForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [extractingCourseId, setExtractingCourseId] = useState<string | null>(null);
  const [extractedSkillsState, setExtractedSkillsState] = useState<ExtractedSkillState[]>([]);

  const updateForm = useCallback((field: keyof CourseForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setForm(emptyForm);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!form.courseName.trim()) return;
    setSubmitting(true);

    const skillsLearned = form.skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const newCourse: CourseSubmission = {
      id: generateId(),
      platform: form.platform,
      courseName: form.courseName.trim(),
      courseUrl: form.courseUrl.trim(),
      certificateUrl: form.certificateUrl.trim(),
      completionDate: form.completionDate,
      skillsLearned,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    };

    addCourse(newCourse);
    setShowModal(false);
    resetForm();
    setSubmitting(false);

    setExtractingCourseId(newCourse.id);
    try {
      const extracted = await extractSkillsFromCourse(
        newCourse.courseName,
        newCourse.platform,
        skillsLearned
      );
      setExtractedSkillsState(prev => [
        ...prev,
        { courseId: newCourse.id, skills: extracted },
      ]);
      updateCourse(newCourse.id, {
        skillsLearned: extracted.map(s => s.name),
      });
    } catch {
      setExtractedSkillsState(prev => [
        ...prev,
        {
          courseId: newCourse.id,
          skills: skillsLearned.map(name => ({
            name,
            confidence: 0.8,
            category: 'General',
          })),
        },
      ]);
    } finally {
      setExtractingCourseId(null);
    }
  }, [form, addCourse, resetForm, updateCourse]);

  const toggleExtractedSkill = useCallback(
    (courseId: string, skillName: string) => {
      setExtractedSkillsState(prev =>
        prev.map(entry => {
          if (entry.courseId !== courseId) return entry;
          const course = courses.find(c => c.id === courseId);
          const currentSkills = course?.skillsLearned ?? [];
          const isRemoving = currentSkills.includes(skillName);
          const newSkills = isRemoving
            ? currentSkills.filter(s => s !== skillName)
            : [...currentSkills, skillName];
          updateCourse(courseId, { skillsLearned: newSkills });
          return {
            ...entry,
            skills: entry.skills.map(s =>
              s.name === skillName ? s : s
            ),
          };
        })
      );
    },
    [courses, updateCourse]
  );

  const removeExtractedSkill = useCallback(
    (courseId: string, skillName: string) => {
      const course = courses.find(c => c.id === courseId);
      if (!course) return;
      const newSkills = course.skillsLearned.filter(s => s !== skillName);
      updateCourse(courseId, { skillsLearned: newSkills });
      setExtractedSkillsState(prev =>
        prev.map(entry =>
          entry.courseId === courseId
            ? {
                ...entry,
                skills: entry.skills.filter(s => s.name !== skillName),
              }
            : entry
        )
      );
    },
    [courses, updateCourse]
  );

  const getExtractedSkills = (courseId: string) =>
    extractedSkillsState.find(e => e.courseId === courseId);

  const totalSkillsLearned = courses.reduce(
    (acc, c) => acc + c.skillsLearned.length,
    0
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">
            Learning & Certifications
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Submit your completed courses and verified certifications
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <span className="material-symbols-outlined text-[16px]">add</span>
          Add Course
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className={cn('space-y-6', courses.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3')}>
          {courses.length === 0 ? (
            <Card>
              <EmptyState
                icon={<span className="material-symbols-outlined text-[48px]">menu_book</span>}
                title="No courses added yet"
                description="Add courses and certifications you've completed to extract and verify your skills."
                action={
                  <Button onClick={() => setShowModal(true)}>
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    Add Your First Course
                  </Button>
                }
              />
            </Card>
          ) : (
            <div className="space-y-4">
              {courses.map(course => {
                const extracted = getExtractedSkills(course.id);
                const isExtracting = extractingCourseId === course.id;

                return (
                  <Card key={course.id}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px] text-primary">emoji_events</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-semibold text-on-surface truncate">
                              {course.courseName}
                            </h3>
                            <Badge variant="primary" size="sm">
                              {course.platform}
                            </Badge>
                            <Badge variant="success" size="sm">
                              <span className="material-symbols-outlined text-[10px] mr-1">check_circle</span>
                              Certificate Submitted
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-on-surface-variant">
                            {course.completionDate && (
                              <span>
                                Completed{' '}
                                {new Date(course.completionDate).toLocaleDateString(
                                  'en-US',
                                  { month: 'short', day: 'numeric', year: 'numeric' }
                                )}
                              </span>
                            )}
                            {course.courseUrl && (
                              <a
                                href={course.courseUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-primary hover:text-primary-700"
                                onClick={e => e.stopPropagation()}
                              >
                                View Course
                                <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {course.skillsLearned.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-outline-light">
                        <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wide mb-2">
                          Skills Learned
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {course.skillsLearned.map(skill => (
                            <span
                              key={skill}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-high text-gray-700 text-xs font-medium rounded-xl group"
                            >
                              <span className="material-symbols-outlined text-[10px]">sell</span>
                              {skill}
                              <button
                                onClick={() => removeExtractedSkill(course.id, skill)}
                                className="ml-0.5 text-outline hover:text-danger-500 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <span className="material-symbols-outlined text-[12px]">close</span>
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {isExtracting && (
                      <div className="mt-4 pt-3 border-t border-outline-light">
                        <LoadingState message="Extracting skills from course..." />
                      </div>
                    )}

                    {extracted && extracted.skills.length > 0 && !isExtracting && (
                      <div className="mt-4 pt-3 border-t border-outline-light">
                        <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wide mb-2">
                          Confirmed Skills
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {extracted.skills.map(skill => {
                            const isConfirmed = course.skillsLearned.includes(skill.name);
                            return (
                              <button
                                key={skill.name}
                                onClick={() =>
                                  isConfirmed
                                    ? removeExtractedSkill(course.id, skill.name)
                                    : toggleExtractedSkill(course.id, skill.name)
                                }
                                className={cn(
                                  'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-xl transition-all border',
                                  isConfirmed
                                    ? 'bg-success-50 text-success-700 border-success-200 hover:bg-success-100'
                                    : 'bg-white text-on-surface-variant border-outline-light hover:border-primary-300 hover:text-primary'
                                )}
                              >
                                {isConfirmed && <span className="material-symbols-outlined text-[10px]">check_circle</span>}
                                {skill.name}
                                <span className="text-[10px] opacity-60">
                                  {Math.round(skill.confidence * 100)}%
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Quick Stats" />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Courses Submitted</span>
                <span className="text-sm font-semibold text-on-surface">
                  {courses.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Skills Extracted</span>
                <span className="text-sm font-semibold text-on-surface">
                  {totalSkillsLearned}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Status</span>
                <Badge variant="success" size="sm">
                  Pending Verification
                </Badge>
              </div>
            </div>
          </Card>

          <AIInsight
            variant="info"
            title="Verify What You Learned"
            message="After submitting courses, take a competency assessment to verify your skills. Our AI will generate personalized questions based on your learning."
            actionLabel="Start Competency Assessment"
            onAction={() => {}}
          />

          <Card className="bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-200">
            <div className="text-center py-2">
              <span className="material-symbols-outlined text-[32px] text-primary mx-auto mb-3">verified_user</span>
              <h3 className="text-sm font-semibold text-on-surface mb-1">
                Skill Verification
              </h3>
              <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                Submit your certificates and our AI will extract and verify
                the skills you've learned through competency assessments.
              </p>
              <Link to="/assessment/new">
                <Button fullWidth size="sm">
                  Start Competency Assessment
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title="Add Course / Certification"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              label="Platform"
              value={form.platform}
              onChange={e => updateForm('platform', e.target.value)}
              options={platformOptions}
            />
            <Input
              label="Course Name"
              value={form.courseName}
              onChange={e => updateForm('courseName', e.target.value)}
              placeholder="e.g. React - The Complete Guide"
            />
          </div>
          <Input
            label="Course URL"
            type="url"
            value={form.courseUrl}
            onChange={e => updateForm('courseUrl', e.target.value)}
            placeholder="https://www.udemy.com/course/..."
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Certificate URL or ID"
              value={form.certificateUrl}
              onChange={e => updateForm('certificateUrl', e.target.value)}
              placeholder="Certificate link or ID"
            />
            <Input
              label="Completion Date"
              type="date"
              value={form.completionDate}
              onChange={e => updateForm('completionDate', e.target.value)}
            />
          </div>
          <Textarea
            label="Skills Learned (comma-separated)"
            value={form.skillsInput}
            onChange={e => updateForm('skillsInput', e.target.value)}
            placeholder="React Hooks, State Management, JSX, Component Lifecycle"
            rows={3}
          />
          <div className="border-2 border-dashed border-outline-light rounded-xl p-6 text-center hover:border-primary-300 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[24px] text-outline mx-auto mb-2">upload</span>
            <p className="text-sm font-medium text-gray-700">
              Upload Certificate Image
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              Optional — PNG, JPG up to 5MB
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              loading={submitting}
              disabled={!form.courseName.trim()}
            >
              <span className="material-symbols-outlined text-[16px]">upload</span>
              Submit Course
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
