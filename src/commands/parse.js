import { extractText } from '../services/pdfReader.js';
import { logger } from '../utils/logger.js';

export function registerParseCommand(program) {
  program
    .command('parse <pdf_path>')
    .description('从 PDF 简历中提取纯文本内容')
    .addHelpText('after', `
示例:
  $ resume-cli parse ./resume.pdf
  $ resume-cli parse /path/to/简历.pdf`)
    .action(async (pdfPath) => {
      logger.info(`正在解析 PDF: ${pdfPath}`);
      const text = await extractText(pdfPath);
      process.stdout.write(text + '\n');
    });
}
