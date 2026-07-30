// 分级日志：日志级别由低到高为 silent < error < warn < info < debug
// 默认级别为 warn，仅输出 error 和 warn
// 由 --log-level 全局选项控制级别

const 级别映射 = { silent: 0, error: 1, warn: 2, info: 3, debug: 4 };

let 当前级别 = 'warn';

export function setLogLevel(级别) {
  if (级别映射[级别] !== undefined) {
    当前级别 = 级别;
  }
}

export function getLogLevel() {
  return 当前级别;
}

export const logger = {
  error: (msg) => {
    if (级别映射[当前级别] >= 1) process.stderr.write(`[ERROR] ${msg}\n`);
  },
  warn: (msg) => {
    if (级别映射[当前级别] >= 2) process.stderr.write(`[WARN]  ${msg}\n`);
  },
  info: (msg) => {
    if (级别映射[当前级别] >= 3) process.stderr.write(`[INFO]  ${msg}\n`);
  },
  debug: (msg) => {
    if (级别映射[当前级别] >= 4) process.stderr.write(`[DEBUG] ${msg}\n`);
  },
};
