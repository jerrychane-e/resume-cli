import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { handleError } from '../utils/errorHandler.js';
import { logger } from '../utils/logger.js';

// 从 PDF 文件中提取纯文本，内部完成全部文件校验
// 所有异常通过 handleError 处理，直接退出进程
// options.skipExtensionCheck: 跳过扩展名检查（用于服务器端 multer 已校验的场景）
export async function extractText(文件路径, options = {}) {
  // 1. 校验文件存在
  if (!fs.existsSync(文件路径)) {
    handleError(`文件不存在 ${文件路径}`);
  }

  // 2. 校验扩展名（不区分大小写），可跳过（multer 已校验时）
  if (!options.skipExtensionCheck && path.extname(文件路径).toLowerCase() !== '.pdf') {
    handleError('不支持的文件类型，仅接受 .pdf 文件');
  }

  // 3. 读取并解析 PDF
  let 原始数据;
  try {
    原始数据 = fs.readFileSync(文件路径);
    logger.info(`正在读取 PDF 文件: ${文件路径}`);
  } catch {
    handleError('无法读取 PDF 文件，文件可能已损坏或为加密文件');
  }

  // 文件大小检查（超过 10MB 给出警告）
  const 文件大小MB = (原始数据.length / (1024 * 1024)).toFixed(2);
  if (原始数据.length > 10 * 1024 * 1024) {
    logger.warn(`PDF 文件较大 (${文件大小MB}MB)，解析可能需要较长时间`);
  }

  let 解析结果;
  try {
    解析结果 = await pdfParse(原始数据);
  } catch {
    handleError('无法读取 PDF 文件，文件可能已损坏或为加密文件');
  }

  // 4. 校验文本非空
  const 文本 = (解析结果.text || '').trim();
  if (!文本) {
    handleError('PDF 文本内容为空，可能为扫描件或图片型 PDF');
  }

  logger.info(`PDF 解析成功，提取文本 ${文本.length} 字符`);
  return 文本;
}
