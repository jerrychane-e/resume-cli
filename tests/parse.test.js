import { describe, test, expect } from 'vitest';
import { runCLI } from './helpers.js';

describe('parse 命令', () => {
  test('文件不存在时应输出错误信息到 stderr 并以 exit code 1 退出', async () => {
    const { stderr, exitCode } = await runCLI('parse', '不存在的文件.pdf');
    expect(exitCode).toBe(1);
    expect(stderr).toContain('错误：文件不存在');
    expect(stderr).toContain('不存在的文件.pdf');
  });

  test('非 PDF 文件扩展名应被拒绝', async () => {
    // 使用一个真实存在的非 PDF 文件
    const { stderr, exitCode } = await runCLI('parse', 'helpers.js');
    expect(exitCode).toBe(1);
    expect(stderr).toContain('不支持的文件类型');
    expect(stderr).toContain('.pdf');
  });

  test('PDF 文件扩展名不区分大小写 (.PDF 应被接受为合法扩展名)', async () => {
    // 使用不存在的 .PDF 文件 — 应进入"文件不存在"而非"不支持的文件类型"
    const { stderr } = await runCLI('parse', 'nonexistent.PDF');
    // 应进入"文件不存在"分支，而不是"不支持的文件类型"
    expect(stderr).not.toContain('不支持的文件类型');
    expect(stderr).toContain('文件不存在');
  });
});
