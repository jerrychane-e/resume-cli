import { describe, test, expect } from 'vitest';
import { cleanJSONResponse } from '../src/utils/jsonFixer.js';

describe('jsonFixer', () => {
  test('去除 Markdown 代码块标记', () => {
    const input = '```json\n{"name": "test"}\n```';
    const result = cleanJSONResponse(input);
    expect(JSON.parse(result)).toEqual({ name: 'test' });
  });

  test('去除 JSON 前后的说明文字', () => {
    const input = '这是解析结果：\n{"name": "test"}\n希望对你有帮助';
    const result = cleanJSONResponse(input);
    expect(JSON.parse(result)).toEqual({ name: 'test' });
  });

  test('修复尾部逗号', () => {
    const input = '{"name": "test",}';
    const result = cleanJSONResponse(input);
    expect(JSON.parse(result)).toEqual({ name: 'test' });
  });

  test('修正常见键名大小写', () => {
    const input = '{"Name": "张三", "Phone": "13800138000", "Email": "test@test.com", "City": "北京", "Skills": ["JS"], "Education": []}';
    const result = cleanJSONResponse(input);
    const parsed = JSON.parse(result);
    expect(parsed).toHaveProperty('name', '张三');
    expect(parsed).toHaveProperty('phone', '13800138000');
    expect(parsed).toHaveProperty('email', 'test@test.com');
    expect(parsed).toHaveProperty('city', '北京');
    expect(parsed).toHaveProperty('skills');
    expect(parsed).toHaveProperty('education');
  });

  test('标准 JSON 直接通过', () => {
    const input = '{"name": "test", "value": 123}';
    const result = cleanJSONResponse(input);
    expect(JSON.parse(result)).toEqual({ name: 'test', value: 123 });
  });

  test('空字符串原样返回', () => {
    const result = cleanJSONResponse('');
    expect(result).toBe('');
  });
});
