import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import type { ScoreData } from '../types';

interface Props {
  data: ScoreData;
}

export default function ScoreRadar({ data }: Props) {
  const chartData = [
    { 维度: '技能匹配', 分数: data.skill_score, fullMark: 100 },
    { 维度: '经验匹配', 分数: data.experience_score, fullMark: 100 },
    { 维度: '学历匹配', 分数: data.education_score, fullMark: 100 },
  ];

  return (
    <div className="card">
      <h3 style={{ marginBottom: 8, fontSize: 16, textAlign: 'center' }}>📊 维度评分</h3>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <RadarChart data={chartData}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis
              dataKey="维度"
              tick={{ fill: 'var(--text)', fontSize: 13 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
            />
            <Radar
              name="评分"
              dataKey="分数"
              stroke="var(--primary)"
              fill="var(--primary)"
              fillOpacity={0.2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      {/* 分数明细 */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 8 }}>
        {chartData.map((item) => (
          <div key={item.维度} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary)' }}>
              {item.分数}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.维度}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
