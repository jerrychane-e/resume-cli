import { chat } from './aiClient.js';
import { 简历提取系统提示词, 构建简历提取用户提示词 } from '../prompts/extract.js';
import { 安全解析简历 } from '../validators/resumeSchema.js';
import { cleanJSONResponse } from '../utils/jsonFixer.js';
import { handleError } from '../utils/errorHandler.js';
import { logger } from '../utils/logger.js';

export async function extractFromResume(简历文本) {
  // 1. 构造消息
  const 消息列表 = [
    { role: 'system', content: 简历提取系统提示词 },
    { role: 'user',   content: 构建简历提取用户提示词(简历文本) },
  ];

  // 2. 调用 LLM
  const { content } = await chat(消息列表);

  // 3. 清洗 + 解析
  const 清洗后 = cleanJSONResponse(content);
  let 解析结果;
  try {
    解析结果 = JSON.parse(清洗后);
  } catch (解析错误) {
    logger.debug(`JSON 解析失败，原始响应: ${content.slice(0, 200)}...`);
    handleError('AI 返回结果无法解析为 JSON，已自动修复失败，请检查 API 响应内容');
  }

  // 4. 校验 + 补缺
  const 最终结果 = 安全解析简历(解析结果);
  logger.info(`简历解析完成，候选人: ${最终结果.name}，技能: ${最终结果.skills.length} 项`);
  return 最终结果;
}
