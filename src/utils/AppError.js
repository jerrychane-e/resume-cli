// 业务错误类，用于区分可预期的用户错误和系统异常
// CLI 模式：捕获后格式化输出到 stderr 并退出
// Server 模式：捕获后返回 JSON 错误响应
export class AppError extends Error {
  constructor(message, exitCode = 1) {
    super(message);
    this.name = 'AppError';
    this.exitCode = exitCode;
  }
}
