interface Props {
  mock: boolean;
  onChange: (mock: boolean) => void;
  hasApiKey?: boolean | null;
}

export default function MockToggle({ mock, onChange, hasApiKey }: Props) {
  const canToggle = hasApiKey !== false; // 仅当明确无 Key 时禁用
  const disabled = !canToggle;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      <label
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontSize: 14,
          color: 'var(--text-secondary)',
          userSelect: 'none',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <div
          onClick={() => { if (!disabled) onChange(!mock); }}
          style={{
            width: 40,
            height: 22,
            borderRadius: 11,
            background: mock ? 'var(--primary)' : 'var(--border)',
            position: 'relative',
            transition: 'background 0.2s',
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: '#fff',
              position: 'absolute',
              top: 2,
              left: mock ? 20 : 2,
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}
          />
        </div>
        Mock 模式（无需 API Key）
      </label>
      {hasApiKey === true && !mock && (
        <span style={{ color: '#22c55e', fontSize: 13, fontWeight: 500 }}>✅ AI 可用</span>
      )}
      {hasApiKey === true && mock && (
        <span style={{ color: '#f59e0b', fontSize: 13 }}>（AI 已配置，当前使用演示数据）</span>
      )}
      {hasApiKey === false && (
        <span style={{ color: '#94a3b8', fontSize: 13 }}>⚠️ 仅 Mock 模式（请在 .env 中配置 OPENAI_API_KEY）</span>
      )}
    </div>
  );
}
