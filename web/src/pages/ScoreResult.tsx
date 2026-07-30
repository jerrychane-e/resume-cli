import { useLocation, useNavigate } from 'react-router-dom';
import ScoreGauge from '../components/ScoreGauge';
import ScoreRadar from '../components/ScoreRadar';
import InterviewQuestions from '../components/InterviewQuestions';
import type { ScoreData } from '../types';
import { fileCache } from '../cache';

export default function ScoreResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { data?: ScoreData; mock?: boolean } | null;

  if (!state?.data) {
    return (
      <div className="container">
        <div className="empty-state">
          <p>没有评分结果，请返回上传简历和 JD</p>
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
    // 使用上传的 PDF 文件名
    const pdfName = fileCache.getFileName()?.replace(/\.pdf$/i, '') || 'score-result';
    a.download = `${pdfName}-评分.json`;
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

      {/* 综合得分 + 雷达图 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <ScoreGauge score={data.overall_score} />
        <div>
          <ScoreRadar data={data} />
        </div>
      </div>

      {/* 面试官评价 */}
      {data.comment && (
        <div className="card">
          <h3 style={{ marginBottom: 12, fontSize: 16 }}>📝 面试官评价</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
            {data.comment}
          </p>
        </div>
      )}

      {/* 面试问题 */}
      <InterviewQuestions questions={data.interview_questions} />

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
