import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { allFacultyStudents } from '@/data/facultyData';
import { cn, getCompetencyColor } from '@/lib/utils';

type FilterKey = 'all' | 'support' | 'at-risk' | 'improving' | 'declining' | 'verified';

export default function StudentList() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [sortBy, setSortBy] = useState<'name' | 'competency' | 'lastActive'>('competency');

  const filtered = useMemo(() => {
    let result = [...allFacultyStudents];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.careerGoal.toLowerCase().includes(q)
      );
    }

    switch (filter) {
      case 'support': result = result.filter(s => s.atRisk || s.overallCompetency < 50); break;
      case 'at-risk': result = result.filter(s => s.atRisk); break;
      case 'improving': result = result.filter(s => s.performanceTrend === 'improving'); break;
      case 'declining': result = result.filter(s => s.performanceTrend === 'declining'); break;
      case 'verified': result = result.filter(s => s.verificationCount > 0); break;
    }

    switch (sortBy) {
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'competency': result.sort((a, b) => a.overallCompetency - b.overallCompetency); break;
      case 'lastActive': result.sort((a, b) => b.inactiveDays - a.inactiveDays); break;
    }

    return result;
  }, [search, filter, sortBy]);

  const filterCounts = {
    all: allFacultyStudents.length,
    support: allFacultyStudents.filter(s => s.atRisk || s.overallCompetency < 50).length,
    'at-risk': allFacultyStudents.filter(s => s.atRisk).length,
    improving: allFacultyStudents.filter(s => s.performanceTrend === 'improving').length,
    declining: allFacultyStudents.filter(s => s.performanceTrend === 'declining').length,
    verified: allFacultyStudents.filter(s => s.verificationCount > 0).length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/faculty" className="p-2 rounded-xl hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Students</h1>
          <p className="text-sm text-on-surface-variant mt-1">{allFacultyStudents.length} students · Filter and manage your class</p>
        </div>
      </div>

      {/* Search & Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email, or goal..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              icon={<span className="material-symbols-outlined text-[16px]">search</span>}
            />
          </div>
          <div className="flex gap-2 items-center">
            <span className="material-symbols-outlined text-[16px] text-outline shrink-0">filter_list</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 border border-outline-light rounded-xl text-sm"
            >
              <option value="competency">Sort: Competency</option>
              <option value="name">Sort: Name</option>
              <option value="lastActive">Sort: Last Active</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(Object.keys(filterCounts) as FilterKey[]).map(key => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              'px-3 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors',
              filter === key ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
            )}
          >
            {key === 'all' ? 'All Students' : key === 'support' ? 'Needs Support' : key === 'at-risk' ? 'At Risk' : key.charAt(0).toUpperCase() + key.slice(1)}
            <span className="ml-1.5 text-xs">({filterCounts[key]})</span>
          </button>
        ))}
      </div>

      {/* Student Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="text-center py-12">
            <span className="material-symbols-outlined text-[32px] text-outline mx-auto mb-3 block">group</span>
            <p className="text-sm text-on-surface-variant">No students match your filters</p>
          </Card>
        ) : (
          filtered.map(student => (
            <Link
              key={student.id}
              to={`/faculty/student/${student.id}`}
              className="block"
            >
              <Card hover className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                    student.atRisk ? 'bg-danger-50' : 'bg-primary-50'
                  )}>
                    <span className={cn('text-xs font-bold', student.atRisk ? 'text-danger-600' : 'text-primary')}>
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-on-surface truncate">{student.name}</p>
                      {student.atRisk && <Badge variant="danger" size="sm">At Risk</Badge>}
                      {student.performanceTrend === 'improving' && <span className="material-symbols-outlined text-[12px] text-success-500">trending_up</span>}
                      {student.performanceTrend === 'declining' && <span className="material-symbols-outlined text-[12px] text-danger-500">trending_down</span>}
                      {student.performanceTrend === 'stable' && <span className="material-symbols-outlined text-[12px] text-outline">remove</span>}
                    </div>
                    <p className="text-xs text-on-surface-variant">{student.careerGoal}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 sm:gap-8">
                  <div className="text-center min-w-[60px]">
                    <p className={cn('text-lg font-bold', getCompetencyColor(student.overallCompetency))}>{student.overallCompetency}%</p>
                    <p className="text-[10px] text-on-surface-variant">Competency</p>
                  </div>
                  <div className="text-center min-w-[60px]">
                    <p className="text-sm font-semibold text-on-surface">{student.assessmentsTaken}</p>
                    <p className="text-[10px] text-on-surface-variant">Assessments</p>
                  </div>
                  <div className="text-center min-w-[60px]">
                    <p className="text-sm font-semibold text-on-surface">{student.learningProgress}%</p>
                    <p className="text-[10px] text-on-surface-variant">Progress</p>
                  </div>
                  <div className="text-center min-w-[60px]">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px] text-success-500">star</span>
                      <p className="text-sm font-semibold text-on-surface">{student.verificationCount}</p>
                    </div>
                    <p className="text-[10px] text-on-surface-variant">Verified</p>
                  </div>
                  <div className="text-center min-w-[70px]">
                    <p className={cn('text-xs', student.inactiveDays > 3 ? 'text-danger-600 font-medium' : 'text-on-surface-variant')}>
                      {student.inactiveDays}d ago
                    </p>
                    <p className="text-[10px] text-on-surface-variant">Last Active</p>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-outline-light shrink-0">chevron_right</span>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>

      {/* Bulk Action */}
      {filter === 'support' && filtered.length > 0 && (
        <Card className="border-primary-200 bg-primary-50/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface">{filtered.length} students need support</p>
              <p className="text-xs text-on-surface-variant">Create a targeted intervention for these students</p>
            </div>
            <Button size="sm">
              <span className="material-symbols-outlined text-[14px]">warning</span>Assign Learning
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
