import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { GrowthChart } from '@/components/charts/GrowthChart';
import { assessmentAnalytics, skillImprovementData } from '@/data/facultyData';
import { cn, getCompetencyColor } from '@/lib/utils';

export default function AssessmentAnalytics() {
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);
  const selectedData = selectedAssessment ? assessmentAnalytics.find(a => a.id === selectedAssessment) : null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/faculty" className="p-2 rounded-xl hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-on-surface">
            {selectedData ? selectedData.name : 'Assessment Analytics'}
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            {selectedData ? `${selectedData.skill} · ${selectedData.attempts} attempts` : 'Performance analysis across all assessments'}
          </p>
        </div>
      </div>

      {!selectedData ? (
        <>
          {/* Assessment Overview Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="text-center">
              <p className="text-3xl font-bold text-on-surface">{assessmentAnalytics.length}</p>
              <p className="text-xs text-on-surface-variant mt-1">Total Assessments</p>
            </Card>
            <Card className="text-center">
              <p className="text-3xl font-bold text-primary">
                {Math.round(assessmentAnalytics.reduce((a, b) => a + b.averageScore, 0) / assessmentAnalytics.length)}%
              </p>
              <p className="text-xs text-on-surface-variant mt-1">Average Score</p>
            </Card>
            <Card className="text-center">
              <p className="text-3xl font-bold text-success-600">
                {Math.round(assessmentAnalytics.reduce((a, b) => a + b.completionRate, 0) / assessmentAnalytics.length)}%
              </p>
              <p className="text-xs text-on-surface-variant mt-1">Completion Rate</p>
            </Card>
          </div>

          {/* Skill Improvement Chart */}
          <Card>
            <CardHeader
              title="Skill Improvement Over Time"
              subtitle="Class average competency trends"
            />
            <GrowthChart
              data={skillImprovementData[0]?.monthlyData.map((_, i) => {
                const month = skillImprovementData[0].monthlyData[i].month;
                const entry: Record<string, string | number> = { month };
                skillImprovementData.forEach(s => {
                  entry[s.skill] = s.monthlyData[i]?.score ?? 0;
                });
                return entry;
              }) || []}
              lines={skillImprovementData.map(s => ({
                key: s.skill,
                color: ['#3b82f6', '#22c55e', '#a855f7', '#f97316', '#ef4444', '#06b6d4'][skillImprovementData.indexOf(s) % 6],
                label: s.skill,
              }))}
              xAxisKey="month"
              height={300}
            />
          </Card>

          {/* Assessment List */}
          <Card>
            <CardHeader title="Assessment Details" subtitle="Click an assessment to view detailed analytics" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-light">
                    <th className="text-left py-3 px-4 font-medium text-on-surface-variant">Assessment</th>
                    <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Skill</th>
                    <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Attempts</th>
                    <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Avg Score</th>
                    <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Completion</th>
                    <th className="text-center py-3 px-4 font-medium text-on-surface-variant">Weakest Topic</th>
                    <th className="text-center py-3 px-4 font-medium text-on-surface-variant"></th>
                  </tr>
                </thead>
                <tbody>
                  {assessmentAnalytics.map(assessment => (
                    <tr
                      key={assessment.id}
                      className="border-b border-surface-container hover:bg-surface-container/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedAssessment(assessment.id)}
                    >
                      <td className="py-3 px-4 font-medium text-on-surface">{assessment.name}</td>
                      <td className="py-3 px-4 text-center"><Badge variant="default" size="sm">{assessment.skill}</Badge></td>
                      <td className="py-3 px-4 text-center text-on-surface-variant">{assessment.attempts}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={cn('font-semibold', getCompetencyColor(assessment.averageScore))}>{assessment.averageScore}%</span>
                      </td>
                      <td className="py-3 px-4 text-center text-on-surface-variant">{assessment.completionRate}%</td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-danger-600 text-xs font-medium">{assessment.mostMissedTopic}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Button variant="ghost" size="sm"><span className="material-symbols-outlined text-[14px]">visibility</span></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        <>
          <Button variant="ghost" size="sm" onClick={() => setSelectedAssessment(null)}>
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>Back to All Assessments
          </Button>

          {/* Assessment Detail */}
          <div className="grid sm:grid-cols-4 gap-4">
            <Card className="text-center">
              <p className="text-3xl font-bold text-on-surface">{selectedData.attempts}</p>
              <p className="text-xs text-on-surface-variant mt-1">Total Attempts</p>
            </Card>
            <Card className="text-center">
              <p className={cn('text-3xl font-bold', getCompetencyColor(selectedData.averageScore))}>{selectedData.averageScore}%</p>
              <p className="text-xs text-on-surface-variant mt-1">Average Score</p>
            </Card>
            <Card className="text-center">
              <p className="text-3xl font-bold text-primary">{selectedData.completionRate}%</p>
              <p className="text-xs text-on-surface-variant mt-1">Completion Rate</p>
            </Card>
            <Card className="text-center border-danger-200">
              <p className="text-lg font-bold text-danger-600">{selectedData.mostMissedTopic}</p>
              <p className="text-xs text-on-surface-variant mt-1">Most Missed Topic</p>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Difficulty Distribution */}
            <Card>
              <CardHeader title="Difficulty Distribution" />
              <div className="space-y-3">
                {Object.entries(selectedData.difficultyDistribution).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-on-surface-variant capitalize">{key}</span>
                      <span className="font-medium text-on-surface">{value}%</span>
                    </div>
                    <Progress
                      value={value}
                      size="sm"
                      color={key === 'easy' ? 'success' : key === 'medium' ? 'warning' : 'danger'}
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Score Distribution */}
            <Card>
              <CardHeader title="Score Distribution" />
              <div className="space-y-2">
                {selectedData.scoreDistribution.map(bucket => (
                  <div key={bucket.range} className="flex items-center gap-3">
                    <span className="text-sm text-on-surface-variant w-16">{bucket.range}</span>
                    <div className="flex-1 bg-surface-container-high rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${(bucket.count / selectedData.attempts) * 100}%`, minWidth: bucket.count > 0 ? '2rem' : 0 }}
                      >
                        {bucket.count > 0 && <span className="text-xs font-medium text-white">{bucket.count}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Weakest Topic Alert */}
          <Card className="border-danger-200 bg-danger-50/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-danger-800">
                  Most Difficult Question: "{selectedData.mostDifficultQuestion}"
                </p>
                <p className="text-xs text-danger-600 mt-1">
                  Most Missed Topic: {selectedData.mostMissedTopic} — Consider reviewing this area
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedAssessment(null)}>
                Create Intervention
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
