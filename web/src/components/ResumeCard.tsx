import type { ResumeData } from '../types';

interface Props {
  data: ResumeData;
}

export default function ResumeCard({ data }: Props) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          fontWeight: 700,
          margin: '0 auto 16px',
        }}
      >
        {data.name ? data.name.charAt(0) : '?'}
      </div>
      <h2 style={{ fontSize: 22, marginBottom: 12 }}>{data.name || '未知'}</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: 14 }}>
        {data.phone && <span>📞 {data.phone}</span>}
        {data.email && <span>📧 {data.email}</span>}
        {data.city && <span>📍 {data.city}</span>}
      </div>
    </div>
  );
}
