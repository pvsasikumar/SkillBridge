import { cn } from '@/lib/utils';

interface HeatMapProps {
  data: { studentId: string; studentName: string; skills: Record<string, number> }[];
  skillLabels: string[];
}

function getHeatColor(value: number): string {
  if (value >= 75) return 'bg-success-50 text-success-700';
  if (value >= 50) return 'bg-warning-50 text-warning-600';
  if (value >= 30) return 'bg-orange-50 text-orange-600';
  return 'bg-danger-50 text-danger-600';
}

export function CompetencyHeatmap({ data, skillLabels }: HeatMapProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-outline-light">
            <th className="text-left py-3 px-4 font-medium text-on-surface-variant">Student</th>
            {skillLabels.map(skill => (
              <th key={skill} className="text-center py-3 px-4 font-medium text-on-surface-variant">{skill}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.studentId} className="border-b border-outline-light/50 hover:bg-surface-container/50 transition-colors">
              <td className="py-3 px-4 font-medium text-on-surface">{row.studentName}</td>
              {skillLabels.map(skill => {
                const value = row.skills[skill] || 0;
                return (
                  <td key={skill} className="py-3 px-4 text-center">
                    <span className={cn('inline-block px-3 py-1.5 rounded-xl text-xs font-semibold min-w-[3rem]', getHeatColor(value))}>
                      {value}%
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
