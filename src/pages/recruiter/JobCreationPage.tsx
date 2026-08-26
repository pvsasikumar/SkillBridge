import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useRecruiter } from '@/context/RecruiterContext';
import { companyProfile } from '@/data/recruiterData';
import { generateId } from '@/context/AppContext';
import type { SkillRequirement, JobStatus } from '@/types';

const workModes = ['On-site', 'Hybrid', 'Remote'] as const;
const experienceLevels = ['Fresher', '0-1 years', '1-3 years', '3-5 years', '5+ years'] as const;
const availableSkills = [
  'React', 'JavaScript', 'Node.js', 'SQL', 'Python', 'TypeScript',
  'Java', 'C++', 'HTML/CSS', 'Angular', 'Vue.js', 'Express.js',
  'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Git', 'REST APIs',
  'GraphQL', 'Machine Learning', 'Data Analysis', 'TensorFlow',
  'Data Structures', 'Algorithms', 'System Design', 'Problem Solving',
  'Tailwind CSS', 'Redis', 'Kubernetes',
];

export default function JobCreationPage() {
  const navigate = useNavigate();
  const { addJob } = useRecruiter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState<string>('Hybrid');
  const [experience, setExperience] = useState<string>('Fresher');
  const [requiredSkills, setRequiredSkills] = useState<SkillRequirement[]>([]);
  const [showSkillPicker, setShowSkillPicker] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newMinComp, setNewMinComp] = useState(70);
  const [newSkillType, setNewSkillType] = useState<'required' | 'optional'>('required');

  const addSkill = () => {
    if (!newSkill) return;
    if (requiredSkills.some(s => s.skill === newSkill)) return;
    setRequiredSkills(prev => [...prev, {
      id: generateId(),
      skill: newSkill,
      minimumCompetency: newMinComp,
      type: newSkillType,
    }]);
    setNewSkill('');
    setNewMinComp(70);
    setShowSkillPicker(false);
  };

  const removeSkill = (id: string) => {
    setRequiredSkills(prev => prev.filter(s => s.id !== id));
  };

  const handleCreate = () => {
    if (!title || !description || !location || requiredSkills.length === 0) return;
    addJob({
      id: generateId(),
      companyId: companyProfile.id,
      title,
      description,
      location,
      workMode: workMode as 'On-site' | 'Hybrid' | 'Remote',
      experience: experience as 'Fresher' | '0-1 years' | '1-3 years' | '3-5 years' | '5+ years',
      status: 'published' as JobStatus,
      requiredSkills,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    });
    navigate('/recruiter/jobs');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-surface-container text-outline hover:text-on-surface-variant">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Create Job Opening</h1>
          <p className="text-sm text-on-surface-variant mt-1">Define requirements and skill criteria for candidates</p>
        </div>
      </div>

      <Card>
        <CardHeader title="Job Details" subtitle="Basic information about the position" />
        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div className="md:col-span-2">
            <Input label="Job Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Junior Full Stack Developer" icon={<span className="material-symbols-outlined text-[16px]">work</span>} />
          </div>
          <div className="md:col-span-2">
            <Textarea label="Job Description" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the role, responsibilities, and what you're looking for..." />
          </div>
          <Input label="Location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Chennai, India" />
          <Select label="Work Mode" value={workMode} onChange={e => setWorkMode(e.target.value)} options={workModes.map(m => ({ value: m, label: m }))} />
          <Select label="Experience Level" value={experience} onChange={e => setExperience(e.target.value)} options={experienceLevels.map(e => ({ value: e, label: e }))} />
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Skill Requirements"
          subtitle="Define required and optional skills with minimum competency thresholds"
          action={
            <Button size="sm" variant="outline" onClick={() => setShowSkillPicker(true)}>
              <span className="material-symbols-outlined text-[14px]">add</span> Add Skill
            </Button>
          }
        />
        <div className="p-6">
          {requiredSkills.length === 0 ? (
            <p className="text-sm text-on-surface-variant text-center py-6">No skills added yet. Click "Add Skill" to define requirements.</p>
          ) : (
            <div className="space-y-2">
              {requiredSkills.map(sk => (
                <div key={sk.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-container">
                  <div className="flex items-center gap-3">
                    <Badge variant={sk.type === 'required' ? 'primary' : 'default'} size="sm">
                      {sk.type === 'required' ? 'Required' : 'Optional'}
                    </Badge>
                    <span className="text-sm font-medium text-on-surface">{sk.skill}</span>
                    <span className="text-sm text-on-surface-variant">&ge; {sk.minimumCompetency}%</span>
                  </div>
                  <button onClick={() => removeSkill(sk.id)} className="p-1 rounded hover:bg-surface-container-high text-outline hover:text-danger-500">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {showSkillPicker && (
            <div className="mt-4 p-4 border border-outline-light rounded-xl glass-card space-y-4">
              <h4 className="text-sm font-semibold text-on-surface">Add Skill Requirement</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <Select
                  label="Skill"
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  options={[{ value: '', label: 'Select skill...' }, ...availableSkills.filter(s => !requiredSkills.some(rs => rs.skill === s)).map(s => ({ value: s, label: s }))]}
                />
                <Input
                  label="Minimum Competency (%)"
                  type="number"
                  value={newMinComp}
                  onChange={e => setNewMinComp(Number(e.target.value))}
                  min={0}
                  max={100}
                />
                <Select
                  label="Type"
                  value={newSkillType}
                  onChange={e => setNewSkillType(e.target.value as 'required' | 'optional')}
                  options={[{ value: 'required', label: 'Required' }, { value: 'optional', label: 'Optional' }]}
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={addSkill} disabled={!newSkill}>Add</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowSkillPicker(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        <Button onClick={handleCreate} disabled={!title || !description || !location || requiredSkills.length === 0}>
          <span className="material-symbols-outlined text-[16px]">save</span> Create & Publish
        </Button>
      </div>
    </div>
  );
}
