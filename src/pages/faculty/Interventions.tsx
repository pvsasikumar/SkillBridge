import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { interventions, type Intervention, type InterventionStatus } from '@/data/facultyData';
import { cn } from '@/lib/utils';

const statusConfig: Record<InterventionStatus, { label: string; variant: 'success' | 'warning' | 'primary' | 'default'; iconName: string }> = {
  upcoming: { label: 'Upcoming', variant: 'default', iconName: 'schedule' },
  active: { label: 'Active', variant: 'primary', iconName: 'warning' },
  completed: { label: 'Completed', variant: 'success', iconName: 'check_circle' },
};

export default function Interventions() {
  const [activeTab, setActiveTab] = useState<'all' | InterventionStatus>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [createStep, setCreateStep] = useState(1);

  const filtered = activeTab === 'all' ? interventions : interventions.filter(i => i.status === activeTab);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/faculty" className="p-2 rounded-xl hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Interventions</h1>
            <p className="text-sm text-on-surface-variant mt-1">Manage learning interventions for your class</p>
          </div>
        </div>
        <Button onClick={() => { setShowCreateModal(true); setCreateStep(1); }}>
          <span className="material-symbols-outlined text-[14px]">add</span>Create Intervention
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2">
        {(['all', 'upcoming', 'active', 'completed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-3 py-1.5 rounded-xl text-sm font-medium transition-colors',
              activeTab === tab ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
            )}
          >
            {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="ml-1.5 text-xs">({tab === 'all' ? interventions.length : interventions.filter(i => i.status === tab).length})</span>
          </button>
        ))}
      </div>

      {/* Intervention Cards */}
      <div className="space-y-4">
        {filtered.map(intervention => {
          const statusCfg = statusConfig[intervention.status];
          const completionPct = intervention.assignedStudents > 0
            ? Math.round((intervention.completedStudents / intervention.assignedStudents) * 100)
            : 0;

          return (
            <Card key={intervention.id} hover onClick={() => setSelectedIntervention(intervention)}>
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={statusCfg.variant} size="sm">{statusCfg.label}</Badge>
                    <Badge variant="default" size="sm">{intervention.skill}</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-on-surface mb-1">{intervention.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-on-surface-variant flex-wrap">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">calendar_today</span>{intervention.startDate} — {intervention.endDate}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">group</span>{intervention.assignedStudents} students</span>
                    {intervention.improvement > 0 && (
                      <span className="flex items-center gap-1 text-success-600"><span className="material-symbols-outlined text-[12px]">trending_up</span>+{intervention.improvement} pts</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6 lg:gap-8 shrink-0">
                  <div className="text-center min-w-[60px]">
                    <p className="text-sm font-semibold text-on-surface">{intervention.startedStudents}/{intervention.assignedStudents}</p>
                    <p className="text-[10px] text-on-surface-variant">Started</p>
                  </div>
                  <div className="text-center min-w-[60px]">
                    <p className="text-sm font-semibold text-on-surface">{intervention.completedStudents}</p>
                    <p className="text-[10px] text-on-surface-variant">Completed</p>
                  </div>
                  <div className="text-center min-w-[60px]">
                    <p className="text-sm font-semibold text-on-surface">{intervention.assessmentTaken}</p>
                    <p className="text-[10px] text-on-surface-variant">Assessed</p>
                  </div>
                  {intervention.averageAfter > 0 && (
                    <div className="text-center min-w-[70px]">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-outline">{intervention.averageBefore}%</span>
                        <span className="material-symbols-outlined text-[10px] text-outline-light">chevron_right</span>
                        <span className="text-sm font-bold text-success-600">{intervention.averageAfter}%</span>
                      </div>
                      <p className="text-[10px] text-on-surface-variant">Before → After</p>
                    </div>
                  )}
                  <div className="w-24">
                    <Progress value={completionPct} size="sm" />
                    <p className="text-[10px] text-on-surface-variant text-center mt-1">{completionPct}%</p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Intervention Detail Modal */}
      <Modal
        open={!!selectedIntervention}
        onClose={() => setSelectedIntervention(null)}
        title={selectedIntervention?.title || ''}
        size="lg"
      >
        {selectedIntervention && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-surface-container rounded-xl">
                <p className="text-xl font-bold text-on-surface">{selectedIntervention.assignedStudents}</p>
                <p className="text-xs text-on-surface-variant">Assigned</p>
              </div>
              <div className="text-center p-3 bg-surface-container rounded-xl">
                <p className="text-xl font-bold text-primary">{selectedIntervention.completedStudents}</p>
                <p className="text-xs text-on-surface-variant">Completed</p>
              </div>
              <div className="text-center p-3 bg-surface-container rounded-xl">
                <p className="text-xl font-bold text-on-surface">{selectedIntervention.assessmentTaken}</p>
                <p className="text-xs text-on-surface-variant">Assessed</p>
              </div>
              <div className="text-center p-3 bg-surface-container rounded-xl">
                <p className="text-xl font-bold text-success-600">+{selectedIntervention.improvement}</p>
                <p className="text-xs text-on-surface-variant">Improvement</p>
              </div>
            </div>

            {selectedIntervention.averageAfter > 0 && (
              <div className="p-4 bg-success-50 rounded-xl border border-success-200">
                <p className="text-sm font-medium text-success-800 mb-2">Before vs After</p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-on-surface-variant">Before</p>
                    <p className="text-2xl font-bold text-on-surface">{selectedIntervention.averageBefore}%</p>
                  </div>
                  <span className="material-symbols-outlined text-[20px] text-success-500">chevron_right</span>
                  <div>
                    <p className="text-xs text-on-surface-variant">After</p>
                    <p className="text-2xl font-bold text-success-600">{selectedIntervention.averageAfter}%</p>
                  </div>
                  <div className="ml-auto">
                    <Badge variant="success" size="md">+{selectedIntervention.improvement} points</Badge>
                  </div>
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-on-surface mb-2">Learning Content</p>
              <div className="space-y-2">
                {selectedIntervention.learningContent.map((content, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-surface-container rounded-xl">
                    <Badge variant="default" size="sm">{content.type}</Badge>
                    <span className="text-sm text-on-surface">{content.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setSelectedIntervention(null)}>Close</Button>
              <Button variant="secondary"><span className="material-symbols-outlined text-[14px]">edit</span>Edit</Button>
              <Button><span className="material-symbols-outlined text-[14px]">visibility</span>View Students</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Intervention Modal */}
      <Modal open={showCreateModal} onClose={() => { setShowCreateModal(false); setCreateStep(1); }} title="Create Intervention" size="lg">
        <div className="space-y-4">
          {createStep === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
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
                    <option>Graphs</option>
                    <option>Complex Joins</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Students below threshold</label>
                  <select className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm">
                    <option>60%</option>
                    <option>50%</option>
                    <option>40%</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Target Score</label>
                  <select className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm">
                    <option>75%</option>
                    <option>70%</option>
                    <option>65%</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Start Date" type="date" defaultValue="2026-09-01" />
                <Input label="Duration (days)" type="number" defaultValue={7} />
              </div>
              <div className="p-3 bg-surface-container rounded-xl">
                <p className="text-sm text-on-surface-variant">Students matched: <span className="font-bold text-on-surface">17</span></p>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button onClick={() => setCreateStep(2)}>Next: Add Content</Button>
              </div>
            </>
          )}
          {createStep === 2 && (
            <>
              <p className="text-sm font-medium text-on-surface">Add Learning Content</p>
              <div className="space-y-2">
                {[
                  { type: 'video', label: 'Video Lesson', checked: true },
                  { type: 'notes', label: 'Study Notes', checked: true },
                  { type: 'practice', label: 'Practice Problems', checked: true },
                  { type: 'pdf', label: 'PDF Materials', checked: false },
                ].map(item => (
                  <label key={item.type} className="flex items-center gap-3 p-3 bg-surface-container rounded-xl cursor-pointer">
                    <input type="checkbox" defaultChecked={item.checked} className="rounded border-outline-light" />
                    <span className="text-sm text-on-surface">{item.label}</span>
                  </label>
                ))}
              </div>
              <Input label="Assessment Questions" type="number" defaultValue={15} />
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setCreateStep(1)}>Back</Button>
                <Button onClick={() => { setShowCreateModal(false); setCreateStep(1); }}>Review & Assign</Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
