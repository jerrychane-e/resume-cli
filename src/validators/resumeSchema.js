import { z } from 'zod';

// 教育经历子 Schema
const 教育经历Schema = z.object({
  school:          z.string().default(''),
  major:           z.string().default(''),
  degree:          z.string().default(''),
  graduation_time: z.string().default(''),
});

// 简历主体 Schema
export const 简历Schema = z.object({
  name:      z.string().default(''),
  phone:     z.string().default(''),
  email:     z.string().default(''),
  city:      z.string().default(''),
  education: z.array(教育经历Schema).default([]),
  skills:    z.array(z.string()).default([]),
});

// 安全解析：校验失败时返回补缺后的默认值对象
export function 安全解析简历(数据) {
  const 结果 = 简历Schema.safeParse(数据);
  if (结果.success) {
    return 结果.data;
  }
  // 逐字段补缺
  return {
    name:      数据?.name      || '',
    phone:     数据?.phone     || '',
    email:     数据?.email     || '',
    city:      数据?.city      || '',
    education: Array.isArray(数据?.education) ? 数据.education : [],
    skills:    Array.isArray(数据?.skills)    ? 数据.skills    : [],
  };
}
