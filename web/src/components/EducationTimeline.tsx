import type { Education } from '../types';

interface Props {
  education: Education[];
}

const 学位颜色映射: Record<string, string> = {
  '博士': 'var(--primary)',
  '硕士': 'var(--success)',
  '本科': '#2563EB',
  '大专': 'var(--warning)',
};

export default function EducationTimeline({ education }: Props) {
  if (!education || education.length === 0) {
    return (
      <div className="card">
        <h3 style={{ marginBottom: 16, fontSize: 16 }}>🎓 教育背景</h3>
        <div className="empty-state"><p>暂无教育经历信息</p></div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: 20, fontSize: 16 }}>🎓 教育背景</h3>
      <div style={{ position: 'relative', paddingLeft: 24 }}>
        {/* 时间线竖线 */}
        <div
          style={{
            position: 'absolute',
            left: 6,
            top: 4,
            bottom: 4,
            width: 2,
            background: 'var(--border)',
          }}
        />
        {education.map((edu, i) => (
          <div key={i} style={{ position: 'relative', marginBottom: i < education.length - 1 ? 24 : 0 }}>
            {/* 时间线圆点 */}
            <div
              style={{
                position: 'absolute',
                left: -20,
                top: 6,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: 学位颜色映射[edu.degree] || 'var(--primary)',
                border: '2px solid var(--card-bg)',
                zIndex: 1,
              }}
            />
            <div style={{ fontWeight: 600, fontSize: 15 }}>{edu.school}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 2 }}>
              {edu.major} · {edu.degree}
            </div>
            {edu.graduation_time && (
              <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>
                {edu.graduation_time} 毕业
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
