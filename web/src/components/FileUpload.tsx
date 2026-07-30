import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface Props {
  onFileSelect: (file: File) => void;
  onRemove?: () => void;
  selectedFile: File | null;
  accept?: Record<string, string[]>;
  placeholder?: string;
  hint?: string;
}

export default function FileUpload({
  onFileSelect,
  onRemove,
  selectedFile,
  accept = { 'application/pdf': ['.pdf'] },
  placeholder = '拖拽 PDF 文件到此处，或点击选择文件',
  hint = '支持 .pdf 格式',
}: Props) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) {
        onFileSelect(accepted[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: `2px dashed ${isDragActive ? 'var(--primary)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        padding: '40px 20px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        background: isDragActive ? 'var(--primary-light)' : 'var(--card-bg)',
      }}
    >
      <input {...getInputProps()} />
      {selectedFile ? (
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄</div>
          <div style={{ fontWeight: 500, color: 'var(--text)' }}>{selectedFile.name}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {(selectedFile.size / 1024).toFixed(1)} KB
          </div>
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              title="删除文件"
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: '1px solid var(--border)',
                background: 'var(--card-bg)',
                cursor: 'pointer',
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#fee2e2';
                e.currentTarget.style.color = '#dc2626';
                e.currentTarget.style.borderColor = '#fca5a5';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'var(--card-bg)';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              ✕
            </button>
          )}
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📁</div>
          <div style={{ fontWeight: 500, color: 'var(--text)' }}>{placeholder}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            {hint}
          </div>
        </div>
      )}
    </div>
  );
}
