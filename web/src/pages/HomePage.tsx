import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import MockToggle from '../components/MockToggle';
import { extractResume, scoreResume, getStatus } from '../api/client';
import type { ResumeData, ScoreData } from '../types';
import { fileCache } from '../cache';

type Mode = 'extract' | 'score';

export default function HomePage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>(() => fileCache.getMode());
  const [file, setFile] = useState<File | null>(() => fileCache.getFile());
  const [jd, setJd] = useState('');
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [mock, setMock] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 检测服务端 API Key 状态
  useEffect(() => {
    getStatus()
      .then((status) => {
        setHasApiKey(status.hasApiKey);
        // 有 Key 时默认关 mock，使用真实 AI 模式
        if (status.hasApiKey) {
          setMock(false);
        }
      })
      .catch(() => {
        setHasApiKey(false);
      });
  }, []);

  const canSubmit = file && (mode === 'extract' || jd.trim());

  // 文件选择时同步写入缓存
  const handleFileSelect = useCallback((f: File) => {
    setFile(f);
    fileCache.setFile(f);
  }, []);

  // 模式切换时同步写入缓存
  const handleModeChange = useCallback((m: Mode) => {
    setMode(m);
    fileCache.setMode(m);
  }, []);

  // 删除文件时清空状态和缓存
  const handleFileRemove = useCallback(() => {
    setFile(null);
    fileCache.setFile(null);
  }, []);

  async function handleSubmit() {
    if (!file || loading) return;

    setLoading(true);
    setError('');

    try {
      if (mode === 'extract') {
        const result = await extractResume(file, mock);
        if (result.success && result.data) {
          // 缓存解析出的姓名，供评分页下载 JSON 时使用
          fileCache.setName((result.data as ResumeData).name || null);
          navigate('/resume', {
            state: { data: result.data as ResumeData, mock: result.mock },
          });
        } else {
          setError(result.error || '解析失败');
        }
      } else {
        const result = await scoreResume(file, jd, mock);
        if (result.success && result.data) {
          navigate('/score', {
            state: { data: result.data as ScoreData, mock: result.mock },
          });
        } else {
          setError(result.error || '评分失败');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '未知错误';
      setError(`请求失败：${msg}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>AI 简历解析工具</h1>
        <p>上传 PDF 简历，智能提取信息并匹配岗位要求</p>
      </div>

      {/* 模式切换 */}
      <div className="card">
        <div className="tabs">
          <button
            className={`tab ${mode === 'extract' ? 'active' : ''}`}
            onClick={() => handleModeChange('extract')}
          >
            📋 简历解析
          </button>
          <button
            className={`tab ${mode === 'score' ? 'active' : ''}`}
            onClick={() => handleModeChange('score')}
          >
            🎯 JD 匹配评分
          </button>
        </div>

        {/* 文件上传 */}
        <FileUpload
          onFileSelect={handleFileSelect}
          onRemove={handleFileRemove}
          selectedFile={file}
        />

        {/* JD 文本输入（score 模式） */}
        {mode === 'score' && (
          <div style={{ marginTop: 20 }}>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: 8, fontSize: 14 }}>
              岗位描述（JD）
            </label>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="请粘贴岗位描述文本..."
              rows={6}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: 14,
                lineHeight: 1.6,
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
          </div>
        )}

        {/* Mock 切换 */}
        <div style={{ marginTop: 20 }}>
          <MockToggle mock={mock} onChange={setMock} hasApiKey={hasApiKey} />
        </div>

        {/* 错误展示 */}
        {error && <div className="error-message" style={{ marginTop: 16 }}>{error}</div>}

        {/* 提交按钮 */}
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          style={{ marginTop: 20, width: '100%' }}
        >
          {loading ? (
            <>
              <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
              {mode === 'extract' ? '正在解析简历...' : '正在匹配评分...'}
            </>
          ) : (
            <>{mode === 'extract' ? '🚀 开始解析' : '🚀 开始评分'}</>
          )}
        </button>
      </div>
    </div>
  );
}
