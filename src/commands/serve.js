import { createApp } from '../server/app.js';
import { logger } from '../utils/logger.js';
import { exec } from 'child_process';

export function registerServeCommand(program) {
  program
    .command('serve')
    .description('启动 Web 服务，在浏览器中可视化查看简历解析与评分结果')
    .option('-p, --port <port>', '服务端口号', '3000')
    .option('--open', '自动打开浏览器', false)
    .addHelpText('after', `
示例:
  $ resume-cli serve
  $ resume-cli serve --port 8080
  $ resume-cli serve --port 3000 --open`)
    .action(async (options) => {
      const app = createApp();
      const port = parseInt(options.port, 10);

      return new Promise((resolve) => {
        app.listen(port, () => {
          const url = `http://localhost:${port}`;
          logger.info(`========================================`);
          logger.info(`  Web 服务已启动`);
          logger.info(`  地址: ${url}`);
          logger.info(`  按 Ctrl+C 停止服务`);
          logger.info(`========================================`);

          if (options.open) {
            const 平台 = process.platform;
            const 命令 = 平台 === 'darwin'
              ? `open ${url}`
              : 平台 === 'win32'
                ? `start ${url}`
                : `xdg-open ${url}`;
            exec(命令);
          }
        });
      });
    });
}
