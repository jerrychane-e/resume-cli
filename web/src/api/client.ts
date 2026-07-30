import axios from 'axios';
import type { APIResponse, ResumeData, ScoreData } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 120000,
});

// 检测服务端 API Key 是否可用
export interface StatusData {
  hasApiKey: boolean;
}

export async function getStatus(): Promise<StatusData> {
  const { data } = await api.get<APIResponse<StatusData>>('/status');
  return data.data!;
}

// 上传 PDF 并提取简历
export async function extractResume(
  file: File,
  mock = false
): Promise<APIResponse<ResumeData>> {
  const form = new FormData();
  form.append('file', file);
  form.append('mock', String(mock));
  const { data } = await api.post<APIResponse<ResumeData>>('/extract', form);
  return data;
}

// 上传 PDF + JD 并评分
export async function scoreResume(
  file: File,
  jd: string,
  mock = false
): Promise<APIResponse<ScoreData>> {
  const form = new FormData();
  form.append('file', file);
  form.append('jd', jd);
  form.append('mock', String(mock));
  const { data } = await api.post<APIResponse<ScoreData>>('/score', form);
  return data;
}
