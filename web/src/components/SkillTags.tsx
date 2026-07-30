interface Props {
  skills: string[];
}

const 颜色列表 = [
  { bg: '#EEF2FF', color: '#4F46E5' },
  { bg: '#ECFDF5', color: '#059669' },
  { bg: '#FEF3C7', color: '#D97706' },
  { bg: '#FCE7F3', color: '#DB2777' },
  { bg: '#E0E7FF', color: '#4338CA' },
  { bg: '#D1FAE5', color: '#047857' },
  { bg: '#FEE2E2', color: '#DC2626' },
  { bg: '#E0F2FE', color: '#0284C7' },
];

export default function SkillTags({ skills }: Props) {
  if (!skills || skills.length === 0) {
    return (
      <div className="card">
        <h3 style={{ marginBottom: 16, fontSize: 16 }}>💡 技能</h3>
        <div className="empty-state"><p>暂无技能信息</p></div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: 16, fontSize: 16 }}>💡 技能</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {skills.map((skill, i) => {
          const 颜色 = 颜色列表[i % 颜色列表.length];
          return (
            <span
              key={i}
              style={{
                background: 颜色.bg,
                color: 颜色.color,
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {skill}
            </span>
          );
        })}
      </div>
    </div>
  );
}
