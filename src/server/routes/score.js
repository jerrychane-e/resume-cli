import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractText } from '../../services/pdfReader.js';
import { scoreResume } from '../../services/jdMatcher.js';
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

export function registerScoreRoute(app) {
  app.post('/api/score', upload.single('file'), async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: '未上传文件' });
      }

      const jd内容 = (req.body.jd || '').trim();
      if (!jd内容) {
        try { fs.unlinkSync(req.file.path); } catch {}
        return res.status(400).json({ success: false, error: 'JD 文件内容为空' });
      }

      const isMock = req.body.mock === 'true' || req.body.mock === true;

      if (isMock) {
        logger.info('Mock 模式：返回演示评分数据');
        try { fs.unlinkSync(req.file.path); } catch {}
        return res.json({ success: true, data: MOCK_DATA.score, mock: true });
      }

      validateAPIKey(false);
      const 简历文本 = await extractText(req.file.path, { skipExtensionCheck: true });
      const 结果 = await scoreResume(简历文本, jd内容);

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
