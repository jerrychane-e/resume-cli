import { useLocation, useNavigate } from 'react-router-dom';
import ResumeCard from '../components/ResumeCard';
import EducationTimeline from '../components/EducationTimeline';
import SkillTags from '../components/SkillTags';
import type { ResumeData } from '../types';
import { fileCache } from '../cache';

export default function ResumeResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { data?: ResumeData; mock?: boolean } | null;

  if (!state?.data) {
    return (
      <div className="container">
        <div className="empty-state">
          <p>没有解析结果，请返回上传简历</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            ← 返回上传
          </button>
        </div>
      </div>
    );
  }

  const { data, mock } = state;

  function handleCopyJSON() {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  }

  function handleDownloadJSON() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.name || 'resume'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/')}>
          ← 返回上传
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {fileCache.getFileName() && (
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              📄 {fileCache.getFileName()}
            </span>
          )}
          {mock && <span className="mock-badge">⚠️ Mock 模式 — 演示数据</span>}
        </div>
      </div>

      <ResumeCard data={data} />
      <EducationTimeline education={data.education} />
      <SkillTags skills={data.skills} />

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
        <button className="btn btn-secondary btn-sm" onClick={handleCopyJSON}>
          📋 复制 JSON
        </button>
        <button className="btn btn-secondary btn-sm" onClick={handleDownloadJSON}>
          💾 下载 JSON
        </button>
      </div>
    </div>
  );
}
