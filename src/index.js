#!/usr/bin/env node
import 'dotenv/config';
import { Command } from 'commander';
import { registerParseCommand } from './commands/parse.js';
import { registerExtractCommand } from './commands/extract.js';
import { registerScoreCommand } from './commands/score.js';
import { registerServeCommand } from './commands/serve.js';
import { setLogLevel } from './utils/logger.js';
import { AppError } from './utils/AppError.js';

const program = new Command();

program
  .name('resume-cli')
  .description('AI 简历解析命令行工具 — 从 PDF 简历中提取信息并与岗位描述进行匹配评分')
  .version('1.0.0')
  .option('-v, --verbose', '输出详细执行日志（等同于 --log-level info）')
  .option('--log-level <level>', '日志输出级别: silent|error|warn|info|debug', 'warn')
  .exitOverride()  // 阻止 commander 直接 process.exit，改为抛出异常
  .configureOutput({
    // 接管错误输出，由全局 catch 统一处理中文提示
    writeErr: () => {},
  })
  .hook('preAction', (thisCommand) => {
    const opts = thisCommand.opts();
    // --verbose 优先级高于 --log-level
    if (opts.verbose) {
      setLogLevel('info');
    } else {
      setLogLevel(opts.logLevel);
    }
  });

// 注册子命令（serve 命令在 P7 阶段注册）
registerParseCommand(program);
registerExtractCommand(program);
registerScoreCommand(program);
registerServeCommand(program);

// 全局错误捕获
program.parseAsync().catch((err) => {
  // 业务错误（handleError 抛出的）
  if (err instanceof AppError) {
    process.stderr.write(`错误：${err.message}\n`);
    process.exit(err.exitCode);
  }

  // commander 自身的参数错误 — 转换为中文提示
  switch (err.code) {
    case 'commander.helpDisplayed':
    case 'commander.help':
      // --help 正常输出，静默退出
      process.exit(0);
      break;
    case 'commander.version':
      // -V/--version 已输出到 stdout，静默退出
      process.exit(0);
      break;
    case 'commander.missingArgument': {
      // err.message 格式: "error: missing required argument 'pdf_path'"
      const argMatch = err.message.match(/'([^']+)'/);
      const argName = argMatch ? `<${argMatch[1]}>` : '必填参数';
      process.stderr.write(`错误：缺少必填参数 ${argName}，请使用 --help 查看用法\n`);
      break;
    }
    case 'commander.missingMandatoryOptionValue': {
      // err.message 可能包含 option 名称，如 '--jd <jd_path>'
      const optMatch = err.message.match(/--([\w-]+)/);
      if (optMatch) {
        const optName = optMatch[1];
        if (optName === 'jd') {
          process.stderr.write(`错误：缺少必填选项 --jd <jd_path>，请指定岗位描述文件路径\n`);
        } else {
          process.stderr.write(`错误：缺少必填选项 --${optName}，请使用 --help 查看用法\n`);
        }
      } else {
        process.stderr.write(`错误：${err.message}\n`);
      }
      break;
    }
    case 'commander.unknownOption': {
      // err.message 格式: "error: unknown option '--foo'"
      const optMatch = err.message.match(/'([^']+)'/);
      const optName = optMatch ? optMatch[1] : '该选项';
      process.stderr.write(`错误：未知参数 ${optName}，请使用 --help 查看支持的选项\n`);
      break;
    }
    case 'commander.unknownCommand': {
      // err.message 格式: "error: unknown command 'xxx'"
      const cmdMatch = err.message.match(/'([^']+)'/);
      const cmdName = cmdMatch ? cmdMatch[1] : '该命令';
      process.stderr.write(`错误：未知命令 ${cmdName}，请使用 --help 查看可用命令\n`);
      break;
    }
    default:
      // 其他未预期的运行时错误
      process.stderr.write(`错误：${err.message}\n`);
  }
  process.exit(1);
});
