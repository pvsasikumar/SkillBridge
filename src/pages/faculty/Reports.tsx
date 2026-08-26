import { Link } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { departmentComparison, skillGapData, allFacultyStudents, verifiedSkillsData } from '@/data/facultyData';
import { cn, getCompetencyColor } from '@/lib/utils';

const reportTypes = [
  { id: 'class-competency', title: 'Class Competency Report', description: 'Overview of class-wide competency levels, trends, and distribution', iconName: 'bar_chart', color: 'text-primary bg-primary-50' },
  { id: 'skill-gap', title: 'Skill Gap Report', description: 'Detailed analysis of skill gaps across all tracked skills', iconName: 'gps_fixed', color: 'text-danger-600 bg-danger-50' },
  { id: 'student-progress', title: 'Student Progress Report', description: 'Individual student progress, competency, and learning analytics', iconName: 'group', color: 'text-success-600 bg-success-50' },
  { id: 'assessment', title: 'Assessment Report', description: 'Assessment performance, completion rates, and topic analysis', iconName: 'menu_book', color: 'text-warning-600 bg-warning-50' },
  { id: 'intervention-impact', title: 'Intervention Impact Report', description: 'Before vs after analysis of learning interventions', iconName: 'trending_up', color: 'text-secondary-600 bg-secondary-50' },
  { id: 'verified-skills', title: 'Verified Skills Report', description: 'SkillBridge verification statistics and progress', iconName: 'star', color: 'text-success-600 bg-success-50' },
  { id: 'career-readiness', title: 'Career Readiness Report', description: 'Class career preparation and interview readiness analysis', iconName: 'school', color: 'text-indigo-600 bg-indigo-50' },
];

export default function Reports() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/faculty" className="p-2 rounded-xl hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Reports</h1>
          <p className="text-sm text-on-surface-variant mt-1">Generate and export comprehensive analytics reports</p>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <Card>
        <CardHeader title="Quick Summary" subtitle="Current class snapshot" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-surface-container rounded-xl">
            <p className="text-2xl font-bold text-on-surface">{allFacultyStudents.length}</p>
            <p className="text-xs text-on-surface-variant">Students</p>
          </div>
          <div className="text-center p-3 bg-surface-container rounded-xl">
            <p className="text-2xl font-bold text-primary">
              {Math.round(allFacultyStudents.reduce((a, s) => a + s.overallCompetency, 0) / allFacultyStudents.length)}%
            </p>
            <p className="text-xs text-on-surface-variant">Avg Competency</p>
          </div>
          <div className="text-center p-3 bg-surface-container rounded-xl">
            <p className="text-2xl font-bold text-danger-600">
              {skillGapData.filter(s => s.status === 'critical').length}
            </p>
            <p className="text-xs text-on-surface-variant">Critical Gaps</p>
          </div>
          <div className="text-center p-3 bg-surface-container rounded-xl">
            <p className="text-2xl font-bold text-success-600">
              {verifiedSkillsData.reduce((a, s) => a + s.verifiedStudents, 0)}
            </p>
            <p className="text-xs text-on-surface-variant">Verified Skills</p>
          </div>
        </div>
      </Card>

      {/* Report Types */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map(report => (
          <Card key={report.id} hover className="flex flex-col">
            <div className="flex items-start gap-3 mb-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', report.color)}>
                <span className="material-symbols-outlined text-[18px]">{report.iconName}</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-on-surface">{report.title}</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">{report.description}</p>
              </div>
            </div>
            <div className="mt-auto flex gap-2 pt-3 border-t border-outline-light">
              <Button variant="outline" size="sm" className="flex-1">
                <span className="material-symbols-outlined text-[12px]">description</span>Preview
              </Button>
              <Button variant="ghost" size="sm">
                <span className="material-symbols-outlined text-[12px]">download</span>PDF
              </Button>
              <Button variant="ghost" size="sm">
                <span className="material-symbols-outlined text-[12px]">download</span>Excel
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Department Comparison */}
      <Card>
        <CardHeader title="Department / Class Comparison" subtitle="Performance across authorized classes" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-light">
                <th className="text-left py-3 px-4 font-medium text-on-surface-variant">Class</th>
                <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Students</th>
                <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Avg Competency</th>
                <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Verified Skills</th>
              </tr>
            </thead>
            <tbody>
              {departmentComparison.map(cls => (
                <tr key={cls.class} className="border-b border-surface-container hover:bg-surface-container/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-on-surface">{cls.class}</td>
                  <td className="py-3 px-4 text-center text-on-surface-variant">{cls.studentCount}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={cn('font-semibold', getCompetencyColor(cls.averageCompetency))}>{cls.averageCompetency}%</span>
                  </td>
                  <td className="py-3 px-4 text-center text-on-surface-variant">{cls.verifiedSkills}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
