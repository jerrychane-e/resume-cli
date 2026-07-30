import { AppError } from '../../utils/AppError.js';

export function apiErrorHandler(err, req, res, _next) {
  // 业务错误
  if (err instanceof AppError) {
    return res.status(400).json({ success: false, error: `错误：${err.message}` });
  }

  // multer 文件过大
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, error: '文件大小超过限制（最大 10MB）' });
  }

  // 自定义业务错误（以 错误： 开头）
  if (err.message && err.message.startsWith('错误：')) {
    return res.status(400).json({ success: false, error: err.message });
  }

  // 通用服务器错误
  res.status(500).json({ success: false, error: `服务器内部错误：${err.message}` });
}
