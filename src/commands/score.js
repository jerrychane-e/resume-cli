import fs from 'fs';
import path from 'path';
import { extractText } from '../services/pdfReader.js';
import { scoreResume } from '../services/jdMatcher.js';
import { validateAPIKey } from '../services/aiClient.js';
import { logger } from '../utils/logger.js';
import { spinner } from '../utils/spinner.js';
import { handleError } from '../utils/errorHandler.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const mock数据路径 = path.resolve(__dirname, '../../mock/sample-responses.json');
const MOCK_DATA = JSON.parse(fs.readFileSync(mock数据路径, 'utf-8'));

export function registerScoreCommand(program) {
  program
    .command('score <pdf_path>')
    .description('根据岗位描述（JD）对候选人简历进行匹配评分')
    .requiredOption('--jd <jd_path>', '岗位描述（JD）文本文件路径')
    .option('-o, --output <file_path>', '将评分结果写入指定文件')
    .option('--mock', '使用演示数据，不调用 AI 接口')
    .addHelpText('after', `
示例:
  $ resume-cli score ./resume.pdf --jd ./jd.txt
  $ resume-cli score ./resume.pdf --jd ./jd.txt --mock
  $ resume-cli score ./resume.pdf --jd ./jd.txt --output score.json`)
    .action(async (pdfPath, options) => {
      // 校验 JD 文件
      const jdPath = options.jd;
      if (!fs.existsSync(jdPath)) {
        handleError(`文件不存在 ${jdPath}`);
      }
      if (path.extname(jdPath).toLowerCase() !== '.txt') {
        handleError('不支持的文件类型，仅接受 .txt 文件');
      }
      const JD文本 = fs.readFileSync(jdPath, 'utf-8').trim();
      if (!JD文本) {
        handleError('JD 文件内容为空');
      }

      let 结果;

      if (options.mock) {
        logger.info('Mock 模式：使用演示数据');
        process.stdout.write('# Mock 模式：以下为演示数据，非真实解析结果\n');
        结果 = MOCK_DATA.score;
      } else {
        validateAPIKey(false);
        spinner.start('正在读取 PDF 文件...');
        const 简历文本 = await extractText(pdfPath);
        spinner.stop(`PDF 解析完成，提取文本 ${简历文本.length} 字符`);
        结果 = await scoreResume(简历文本, JD文本);
      }

      const JSON输出 = JSON.stringify(结果, null, 2) + '\n';

      if (options.output) {
        const 目录 = path.dirname(path.resolve(options.output));
        if (!fs.existsSync(目录)) {
          fs.mkdirSync(目录, { recursive: true });
          logger.info(`创建目录: ${目录}`);
        }
        fs.writeFileSync(options.output, JSON输出, 'utf-8');
        logger.info(`评分结果已写入: ${options.output}`);
        process.stdout.write(`结果已保存到: ${options.output}\n`);
      } else {
        process.stdout.write(JSON输出);
      }
    });
}
