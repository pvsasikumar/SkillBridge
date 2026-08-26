import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';

interface CompetencyChartProps {
  data: { skill: string; current: number; required: number }[];
  height?: number;
}

export function CompetencyChart({ data, height = 300 }: CompetencyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="#c3c7cf" />
        <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fill: '#435060' }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#737983' }} />
        <Radar name="Current" dataKey="current" stroke="#006948" fill="#006948" fillOpacity={0.2} strokeWidth={2} />
        <Radar name="Required" dataKey="required" stroke="#c3c7cf" fill="#c3c7cf" fillOpacity={0.05} strokeWidth={1.5} strokeDasharray="5 5" />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
