import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Input, Textarea } from '@/components/ui/Input';
import { facultyLearningContent } from '@/data/facultyData';
import { cn } from '@/lib/utils';

const typeIcons: Record<string, string> = {
  video: 'play_arrow',
  notes: 'description',
  pdf: 'description',
  example: 'code',
  practice: 'menu_book',
  assessment: 'help',
};

const typeColors: Record<string, string> = {
  video: 'text-secondary-600 bg-secondary-50',
  notes: 'text-primary bg-primary-50',
  pdf: 'text-danger-600 bg-danger-50',
  example: 'text-success-600 bg-success-50',
  practice: 'text-warning-600 bg-warning-50',
  assessment: 'text-on-surface-variant bg-surface-container-high',
};

export default function LearningContent() {
  const [filterType, setFilterType] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = filterType === 'all'
    ? facultyLearningContent
    : facultyLearningContent.filter(c => c.type === filterType);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/faculty" className="p-2 rounded-xl hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Learning Content</h1>
            <p className="text-sm text-on-surface-variant mt-1">Create and manage learning materials for your students</p>
          </div>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <span className="material-symbols-outlined text-[14px]">add</span>Create Content
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Content', value: facultyLearningContent.length },
          { label: 'Published', value: facultyLearningContent.filter(c => c.status === 'published').length },
          { label: 'Drafts', value: facultyLearningContent.filter(c => c.status === 'draft').length },
          { label: 'Avg Completion', value: `${Math.round(facultyLearningContent.filter(c => c.assignedStudents > 0).reduce((a, c) => a + (c.completedStudents / c.assignedStudents) * 100, 0) / facultyLearningContent.filter(c => c.assignedStudents > 0).length)}%` },
        ].map(stat => (
          <Card key={stat.label} className="text-center">
            <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
            <p className="text-xs text-on-surface-variant mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['all', 'video', 'notes', 'practice', 'pdf', 'example', 'assessment'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={cn(
              'px-3 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors',
              filterType === type ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
            )}
          >
            {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(content => {
          const iconName = typeIcons[content.type] || 'menu_book';
          const completionPct = content.assignedStudents > 0
            ? Math.round((content.completedStudents / content.assignedStudents) * 100)
            : 0;

          return (
            <Card key={content.id} hover className="flex flex-col">
              <div className="flex items-start gap-3 mb-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', typeColors[content.type])}>
                  <span className="material-symbols-outlined text-[18px]">{iconName}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={content.status === 'published' ? 'success' : content.status === 'draft' ? 'warning' : 'default'} size="sm">
                      {content.status}
                    </Badge>
                    <Badge variant="default" size="sm">{content.difficulty}</Badge>
                  </div>
                  <h3 className="text-sm font-semibold text-on-surface mt-1 truncate">{content.title}</h3>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant mb-3 line-clamp-2">{content.description}</p>
              <div className="text-xs text-on-surface-variant space-y-1 mb-3">
                <p>Skill: <span className="font-medium text-on-surface">{content.skill}</span> · Topic: <span className="font-medium text-on-surface">{content.topic}</span></p>
                <p>Duration: {content.estimatedDuration} min</p>
              </div>
              {content.assignedStudents > 0 && (
                <div className="mt-auto pt-3 border-t border-outline-light">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-on-surface-variant">{content.completedStudents}/{content.assignedStudents} completed</span>
                    <span className="font-medium text-on-surface">{completionPct}%</span>
                  </div>
                  <Progress value={completionPct} size="sm" />
                </div>
              )}
              <div className="flex gap-2 mt-3 pt-3 border-t border-outline-light">
                <Button variant="ghost" size="sm" className="flex-1"><span className="material-symbols-outlined text-[12px]">visibility</span>View</Button>
                <Button variant="ghost" size="sm" className="flex-1"><span className="material-symbols-outlined text-[12px]">edit</span>Edit</Button>
                {content.status === 'draft' && <Button variant="primary" size="sm" className="flex-1">Publish</Button>}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative glass-card rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 glass-card px-6 py-4 border-b border-outline-light flex items-center justify-between">
              <h2 className="text-lg font-semibold text-on-surface">Create Learning Content</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-xl hover:bg-surface-container-high text-outline"><span className="material-symbols-outlined text-[18px]">close</span></button>
            </div>
            <div className="p-6 space-y-4">
              <Input label="Title" placeholder="e.g., Tree Traversal Video" />
              <Textarea label="Description" rows={3} placeholder="Describe the learning content..." />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Type</label>
                  <select className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm">
                    <option>Video</option>
                    <option>Notes</option>
                    <option>PDF</option>
                    <option>Example</option>
                    <option>Practice</option>
                    <option>Assessment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Difficulty</label>
                  <select className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Skill</label>
                  <select className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm">
                    <option>Data Structures</option>
                    <option>SQL</option>
                    <option>Python</option>
                    <option>React</option>
                    <option>Git</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Topic</label>
                  <select className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm">
                    <option>Trees</option>
                    <option>Dynamic Programming</option>
                    <option>Complex Joins</option>
                  </select>
                </div>
                <Input label="Estimated Duration (min)" type="number" defaultValue={30} />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">Learning Objectives</label>
                <Textarea rows={3} placeholder="Enter objectives, one per line..." />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button variant="secondary">Save as Draft</Button>
                <Button onClick={() => setShowCreateModal(false)}>Publish</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
