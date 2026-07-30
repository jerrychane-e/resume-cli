import fs from 'fs';
import path from 'path';
import { extractText } from '../services/pdfReader.js';
import { extractFromResume } from '../services/resumeParser.js';
import { validateAPIKey } from '../services/aiClient.js';
import { logger } from '../utils/logger.js';
import { spinner } from '../utils/spinner.js';

// 读取 mock 数据（模块加载时缓存）
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const mock数据路径 = path.resolve(__dirname, '../../mock/sample-responses.json');
const MOCK_DATA = JSON.parse(fs.readFileSync(mock数据路径, 'utf-8'));

export function registerExtractCommand(program) {
  program
    .command('extract <pdf_path>')
    .description('调用 AI 从 PDF 简历中提取结构化信息')
    .option('-o, --output <file_path>', '将 JSON 结果写入指定文件')
    .option('--mock', '使用演示数据，不调用 AI 接口')
    .addHelpText('after', `
示例:
  $ resume-cli extract ./resume.pdf
  $ resume-cli extract ./resume.pdf --mock
  $ resume-cli extract ./resume.pdf --output result.json
  $ resume-cli extract ./resume.pdf --output ./out/result.json`)
    .action(async (pdfPath, options) => {
      let 结果;

      if (options.mock) {
        logger.info('Mock 模式：使用演示数据');
        process.stdout.write('# Mock 模式：以下为演示数据，非真实解析结果\n');
        结果 = MOCK_DATA.resume;
      } else {
        validateAPIKey(false);
        spinner.start('正在读取 PDF 文件...');
        const 简历文本 = await extractText(pdfPath);
        spinner.stop(`PDF 解析完成，提取文本 ${简历文本.length} 字符`);
        结果 = await extractFromResume(简历文本);
      }

      const JSON输出 = JSON.stringify(结果, null, 2) + '\n';

      if (options.output) {
        const 目录 = path.dirname(path.resolve(options.output));
        if (!fs.existsSync(目录)) {
          fs.mkdirSync(目录, { recursive: true });
          logger.info(`创建目录: ${目录}`);
        }
        fs.writeFileSync(options.output, JSON输出, 'utf-8');
        logger.info(`结果已写入: ${options.output}`);
        // 写入文件时也输出到 stdout 提示
        process.stdout.write(`结果已保存到: ${options.output}\n`);
      } else {
        process.stdout.write(JSON输出);
      }
    });
}
