import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { registerParseRoute } from './routes/parse.js';
import { registerExtractRoute } from './routes/extract.js';
import { registerScoreRoute } from './routes/score.js';
import { apiErrorHandler } from './middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  // 中间件
  app.use(cors());
  app.use(express.json());

  // API 路由
  registerParseRoute(app);
  registerExtractRoute(app);
  registerScoreRoute(app);

  // 服务状态检测（前端检测 API Key 是否可用）
  app.get('/api/status', (_req, res) => {
    const hasApiKey = !!process.env.OPENAI_API_KEY;
    res.json({ success: true, data: { hasApiKey } });
  });

  // 托管前端静态文件（如果已构建）
  const 前端目录 = path.resolve(__dirname, '../../web/dist');
  if (fs.existsSync(前端目录)) {
    app.use(express.static(前端目录));
    logger.info(`前端静态文件目录: ${前端目录}`);

    // SPA fallback：所有非 /api 路由返回 index.html
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(前端目录, 'index.html'));
      }
    });
  } else {
    logger.warn('前端构建产物不存在，仅提供 API 服务。请运行 npm run build:web 构建前端。');
  }

  // 全局错误处理
  app.use(apiErrorHandler);

  return app;
}
