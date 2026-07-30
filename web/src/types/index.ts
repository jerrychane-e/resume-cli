// 教育经历
export interface Education {
  school: string;
  major: string;
  degree: string;
  graduation_time: string;
}

// 简历结构化数据
export interface ResumeData {
  name: string;
  phone: string;
  email: string;
  city: string;
  education: Education[];
  skills: string[];
}

// JD 匹配评分数据
export interface ScoreData {
  overall_score: number;
  skill_score: number;
  experience_score: number;
  education_score: number;
  comment: string;
  interview_questions: string[];
}

// API 统一响应
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  mock?: boolean;
}
