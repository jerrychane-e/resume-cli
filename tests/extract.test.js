import { describe, test, expect } from 'vitest';
import { runCLI } from './helpers.js';

/**
 * 从 stdout 中提取 JSON 行：
 * 跳过 mock 注释行（以 # 开头），取第一个非空行作为 JSON 的起始，
 * 然后拼接后续行直到 JSON 完整
 */
function extractJSON(stdout) {
  const lines = stdout.split('\n');
  // 过滤掉 mock 注释行
  const nonCommentLines = lines.filter(l => l.trim() && !l.trim().startsWith('#'));
  return nonCommentLines.join('\n');
}

describe('extract 命令 --mock 模式', () => {
  test('--mock 输出合法 JSON 且包含所有必要字段', async () => {
    const { stdout, exitCode } = await runCLI('extract', 'test.pdf', '--mock');
    expect(exitCode).toBe(0);

    const JSON文本 = extractJSON(stdout);
    expect(JSON文本).toBeTruthy();

    const 数据 = JSON.parse(JSON文本);
    // 验证必要字段存在
    expect(数据).toHaveProperty('name');
    expect(数据).toHaveProperty('phone');
    expect(数据).toHaveProperty('email');
    expect(数据).toHaveProperty('city');
    expect(Array.isArray(数据.education)).toBe(true);
    expect(Array.isArray(数据.skills)).toBe(true);
  });

  test('--mock 输出首行为 mock 模式标识注释', async () => {
    const { stdout } = await runCLI('extract', 'test.pdf', '--mock');
    const 首行 = stdout.trim().split('\n')[0];
    expect(首行).toContain('Mock 模式');
    expect(首行).toContain('演示数据');
  });

  test('--mock 模式 education 数组中每项包含必要字段', async () => {
    const { stdout } = await runCLI('extract', 'test.pdf', '--mock');
    const 数据 = JSON.parse(extractJSON(stdout));

    if (数据.education.length > 0) {
      const edu = 数据.education[0];
      expect(edu).toHaveProperty('school');
      expect(edu).toHaveProperty('major');
      expect(edu).toHaveProperty('degree');
      expect(edu).toHaveProperty('graduation_time');
    }
  });

  test('skills 数组中每项为字符串', async () => {
    const { stdout } = await runCLI('extract', 'test.pdf', '--mock');
    const 数据 = JSON.parse(extractJSON(stdout));

    expect(数据.skills.length).toBeGreaterThan(0);
    数据.skills.forEach((skill) => {
      expect(typeof skill).toBe('string');
    });
  });
});
