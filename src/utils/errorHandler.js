import { AppError } from './AppError.js';
import { spinner } from './spinner.js';

// 抛出业务错误（替代直接 process.exit）
// CLI 入口层负责捕获并格式化输出；Server 层负责捕获并返回 JSON
export function handleError(错误消息, 退出码 = 1) {
  spinner.stop();
  throw new AppError(错误消息, 退出码);
}
