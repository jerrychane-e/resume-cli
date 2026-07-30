import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractText } from '../../services/pdfReader.js';
import { logger } from '../../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const upload = multer({
  dest: '/tmp/resume-cli-uploads/',
  limits: { fileSize: 10 * 1024 * 1024 },  // 10MB
  fileFilter: (_req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== '.pdf') {
      cb(new Error('错误：不支持的文件类型，仅接受 .pdf 文件'), false);
    } else {
      cb(null, true);
    }
  },
});

export function registerParseRoute(app) {
  app.post('/api/parse', upload.single('file'), async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: '未上传文件' });
      }

      const text = await extractText(req.file.path, { skipExtensionCheck: true });

      // 清理临时文件
      try { fs.unlinkSync(req.file.path); } catch {}

      res.json({ success: true, data: { text } });
    } catch (err) {
      // 清理临时文件
      if (req.file) {
        try { fs.unlinkSync(req.file.path); } catch {}
      }
      next(err);
    }
  });
}
