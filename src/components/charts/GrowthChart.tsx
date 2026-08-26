import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface GrowthChartProps {
  data: Record<string, string | number>[];
  lines: { key: string; color: string; label: string }[];
  xAxisKey: string;
  height?: number;
}

export function GrowthChart({ data, lines, xAxisKey, height = 300 }: GrowthChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f4" />
        <XAxis dataKey={xAxisKey} tick={{ fontSize: 12, fill: '#435060' }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#737983' }} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: '1px solid #c3c7cf', fontSize: 13, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {lines.map(line => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            strokeWidth={2}
            dot={{ r: 3, fill: line.color }}
            name={line.label}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
