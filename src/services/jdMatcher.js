import { chat } from './aiClient.js';
import { 评分系统提示词, 构建评分用户提示词 } from '../prompts/score.js';
import { 安全解析评分 } from '../validators/scoreSchema.js';
import { cleanJSONResponse } from '../utils/jsonFixer.js';
import { handleError } from '../utils/errorHandler.js';
import { logger } from '../utils/logger.js';

export async function scoreResume(简历文本, JD文本) {
  const 消息列表 = [
    { role: 'system', content: 评分系统提示词 },
    { role: 'user',   content: 构建评分用户提示词(简历文本, JD文本) },
  ];

  const { content } = await chat(消息列表, { maxTokens: 1500 });

  const 清洗后 = cleanJSONResponse(content);
  let 解析结果;
  try {
    解析结果 = JSON.parse(清洗后);
  } catch {
    logger.debug(`评分 JSON 解析失败: ${content.slice(0, 200)}...`);
    handleError('AI 返回结果无法解析为 JSON，已自动修复失败，请检查 API 响应内容');
  }

  const 最终结果 = 安全解析评分(解析结果);
  logger.info(`评分完成，综合得分: ${最终结果.overall_score}`);
  return 最终结果;
}
