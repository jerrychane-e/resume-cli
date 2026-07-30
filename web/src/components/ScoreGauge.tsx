interface Props {
  score: number;
  label?: string;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'var(--success)';
  if (score >= 60) return 'var(--warning)';
  return 'var(--danger)';
}

function getScoreBg(score: number): string {
  if (score >= 80) return 'var(--success-light)';
  if (score >= 60) return 'var(--warning-light)';
  return 'var(--danger-light)';
}

export default function ScoreGauge({ score, label = '综合匹配度' }: Props) {
  const color = getScoreColor(score);
  const bg = getScoreBg(score);

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: bg,
          border: `4px solid ${color}`,
        }}
      >
        <span style={{ fontSize: 36, fontWeight: 700, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>/ 100</span>
      </div>
      <div style={{ marginTop: 12, fontSize: 15, fontWeight: 500, color: 'var(--text-secondary)' }}>
        {label}
      </div>
    </div>
  );
}
