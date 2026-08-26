import { useState, useCallback } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { mockIGOTCourses, internalCourses } from '@/data/competencyFramework';
import type { ExternalCourse } from '@/types';

const allCourses: ExternalCourse[] = [...mockIGOTCourses, ...internalCourses];

const difficultyColors = { Beginner: 'success', Intermediate: 'warning', Advanced: 'danger' } as const;

export default function IGOTCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const filtered = allCourses.filter(course => {
    const matchesSearch = !searchQuery || course.title.toLowerCase().includes(searchQuery.toLowerCase()) || course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvider = selectedProvider === 'All' || course.providerType === selectedProvider;
    const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;
    return matchesSearch && matchesProvider && matchesDifficulty;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Training Resources</h1>
          <p className="text-sm text-on-surface-variant mt-1">iGOT Karmayogi and internal learning resources</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="flex items-start gap-4">
          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-[18px] text-primary">language</span></div>
          <div>
            <p className="text-2xl font-bold text-on-surface">{mockIGOTCourses.length}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">iGOT Karmayogi (Demo)</p>
          </div>
        </Card>
        <Card className="flex items-start gap-4">
          <div className="w-10 h-10 bg-success-50 rounded-xl flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-[18px] text-success-600">business</span></div>
          <div>
            <p className="text-2xl font-bold text-on-surface">{internalCourses.length}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Internal Library</p>
          </div>
        </Card>
        <Card className="flex items-start gap-4">
          <div className="w-10 h-10 bg-secondary-50 rounded-xl flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-[18px] text-secondary-600">gps_fixed</span></div>
          <div>
            <p className="text-2xl font-bold text-on-surface">{[...new Set(allCourses.flatMap(c => c.competencies))].length}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Competencies Covered</p>
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="material-symbols-outlined text-[16px] absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input type="text" placeholder="Search courses..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-outline-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
        </div>
        <select value={selectedProvider} onChange={e => setSelectedProvider(e.target.value)} className="px-3 py-2 border border-outline-light rounded-xl text-sm">
          <option value="All">All Providers</option>
          <option value="igot">iGOT Karmayogi</option>
          <option value="internal">Internal Library</option>
        </select>
        <select value={selectedDifficulty} onChange={e => setSelectedDifficulty(e.target.value)} className="px-3 py-2 border border-outline-light rounded-xl text-sm">
          <option value="All">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(course => (
          <Card key={course.id} className="flex flex-col">
            <div className="p-4 flex-1">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    {course.providerType === 'igot' ? 'language' : course.providerType === 'internal' ? 'business' : 'open_in_new'}
                  </span>
                </div>
                <Badge variant={course.providerType === 'igot' ? 'primary' : 'success'} size="sm">
                  {course.provider}
                </Badge>
              </div>
              <h3 className="text-sm font-semibold text-on-surface mb-2 line-clamp-2">{course.title}</h3>
              <p className="text-xs text-on-surface-variant mb-3 line-clamp-2">{course.description}</p>
              <div className="flex items-center gap-3 text-xs text-on-surface-variant mb-3">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">schedule</span>{course.duration}</span>
                <Badge variant={difficultyColors[course.difficulty]} size="sm">{course.difficulty}</Badge>
              </div>
              <div className="flex flex-wrap gap-1">
                {course.competencies.map(c => (
                  <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">{c}</span>
                ))}
              </div>
              {course.relevanceScore && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-on-surface-variant">Relevance:</span>
                  <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', course.relevanceScore >= 90 ? 'bg-success-500' : course.relevanceScore >= 75 ? 'bg-primary-500' : 'bg-warning-500')} style={{ width: `${course.relevanceScore}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{course.relevanceScore}%</span>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-outline-light">
              <Button fullWidth variant="outline" size="sm" onClick={() => window.open(course.url, '_blank')}>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                {course.providerType === 'igot' ? 'Open in iGOT Karmayogi' : 'View Resource'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="text-center py-12">
          <span className="material-symbols-outlined text-[32px] text-gray-300 mx-auto mb-3">menu_book</span>
          <p className="text-sm text-on-surface-variant">No courses match your search</p>
        </Card>
      )}
    </div>
  );
}
