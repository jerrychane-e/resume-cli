import { describe, test, expect } from 'vitest';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { runCLI } from './helpers.js';

const fixturesDir = path.join(import.meta.dirname, 'fixtures');

// 确保 fixtures 目录存在
try { mkdirSync(fixturesDir, { recursive: true }); } catch {}

/**
 * 从 stdout 中提取 JSON（跳过 mock 注释行）
 */
function extractJSON(stdout) {
  const lines = stdout.split('\n');
  const nonCommentLines = lines.filter(l => l.trim() && !l.trim().startsWith('#'));
  return nonCommentLines.join('\n');
}

describe('score 命令', () => {
  const jdPath = path.join(fixturesDir, 'temp-jd.txt');

  test('--mock 模式下 score 输出合法评分 JSON', async () => {
    writeFileSync(jdPath, '前端开发工程师 JD\n需要 React 和 Node.js 经验', 'utf-8');

    const { stdout, exitCode } = await runCLI('score', 'test.pdf', '--jd', jdPath, '--mock');
    expect(exitCode).toBe(0);
    const 数据 = JSON.parse(extractJSON(stdout));
    expect(数据).toHaveProperty('overall_score');
    expect(数据).toHaveProperty('skill_score');
    expect(数据).toHaveProperty('experience_score');
    expect(数据).toHaveProperty('education_score');
    expect(数据).toHaveProperty('comment');
    expect(Array.isArray(数据.interview_questions)).toBe(true);
  });

  test('评分各项分数在 0-100 范围内', async () => {
    writeFileSync(jdPath, '测试 JD', 'utf-8');

    const { stdout } = await runCLI('score', 'test.pdf', '--jd', jdPath, '--mock');
    const 数据 = JSON.parse(extractJSON(stdout));

    expect(数据.overall_score).toBeGreaterThanOrEqual(0);
    expect(数据.overall_score).toBeLessThanOrEqual(100);
    expect(数据.skill_score).toBeGreaterThanOrEqual(0);
    expect(数据.skill_score).toBeLessThanOrEqual(100);
    expect(数据.experience_score).toBeGreaterThanOrEqual(0);
    expect(数据.experience_score).toBeLessThanOrEqual(100);
    expect(数据.education_score).toBeGreaterThanOrEqual(0);
    expect(数据.education_score).toBeLessThanOrEqual(100);
  });

  test('JD 文件不存在应提示错误', async () => {
    const { stderr, exitCode } = await runCLI('score', 'test.pdf', '--jd', '不存在的jd.txt');
    expect(exitCode).toBe(1);
    expect(stderr).toContain('文件不存在');
  });

  test('未提供 --jd 参数应提示错误', async () => {
    const { stderr, exitCode } = await runCLI('score', 'test.pdf');
    expect(exitCode).toBe(1);
  });
});
