import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractText } from '../../services/pdfReader.js';
import { extractFromResume } from '../../services/resumeParser.js';
import { validateAPIKey } from '../../services/aiClient.js';
import { logger } from '../../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mock数据路径 = path.resolve(__dirname, '../../../mock/sample-responses.json');
const MOCK_DATA = JSON.parse(fs.readFileSync(mock数据路径, 'utf-8'));

const upload = multer({
  dest: '/tmp/resume-cli-uploads/',
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== '.pdf') {
      cb(new Error('错误：不支持的文件类型，仅接受 .pdf 文件'), false);
    } else {
      cb(null, true);
    }
  },
});

export function registerExtractRoute(app) {
  app.post('/api/extract', upload.single('file'), async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: '未上传文件' });
      }

      const isMock = req.body.mock === 'true' || req.body.mock === true;

      if (isMock) {
        logger.info('Mock 模式：返回演示数据');
        // 清理临时文件（mock 模式下可能为空文件）
        try { fs.unlinkSync(req.file.path); } catch {}
        return res.json({ success: true, data: MOCK_DATA.resume, mock: true });
      }

      validateAPIKey(false);
      const 简历文本 = await extractText(req.file.path, { skipExtensionCheck: true });
      const 结果 = await extractFromResume(简历文本);

      // 清理临时文件
      try { fs.unlinkSync(req.file.path); } catch {}

      res.json({ success: true, data: 结果 });
    } catch (err) {
      if (req.file) {
        try { fs.unlinkSync(req.file.path); } catch {}
      }
      next(err);
    }
  });
}
