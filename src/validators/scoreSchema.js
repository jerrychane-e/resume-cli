import { z } from 'zod';

export const 评分Schema = z.object({
  overall_score:       z.number().int().min(0).max(100).default(0),
  skill_score:         z.number().int().min(0).max(100).default(0),
  experience_score:    z.number().int().min(0).max(100).default(0),
  education_score:     z.number().int().min(0).max(100).default(0),
  comment:             z.string().default(''),
  interview_questions: z.array(z.string()).default([]),
});

export function 安全解析评分(数据) {
  const 结果 = 评分Schema.safeParse(数据);
  if (结果.success) {
    return 结果.data;
  }
  return {
    overall_score:       Math.round(Number(数据?.overall_score))     || 0,
    skill_score:         Math.round(Number(数据?.skill_score))       || 0,
    experience_score:    Math.round(Number(数据?.experience_score))  || 0,
    education_score:     Math.round(Number(数据?.education_score))   || 0,
    comment:             String(数据?.comment || ''),
    interview_questions: Array.isArray(数据?.interview_questions) ? 数据.interview_questions : [],
  };
}
