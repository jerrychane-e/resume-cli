import OpenAI from 'openai';
import { createProxyAgent } from '../utils/proxyAgent.js';
import { handleError } from '../utils/errorHandler.js';
import { logger } from '../utils/logger.js';
import { spinner } from '../utils/spinner.js';

let 客户端实例 = null;

// 获取或创建 AI 客户端单例（懒初始化）
export function getAIClient(覆盖配置 = {}) {
  if (客户端实例 && !覆盖配置.apiKey && !覆盖配置.baseURL) {
    return 客户端实例;
  }

  const apiKey = 覆盖配置.apiKey || process.env.OPENAI_API_KEY;
  const baseURL = 覆盖配置.baseURL || process.env.OPENAI_BASE_URL;
  const model = 覆盖配置.model || process.env.LLM_MODEL || 'gpt-4o-mini';

  if (!apiKey) {
    handleError('未配置 OPENAI_API_KEY 环境变量，请设置后重试（或使用 --mock 模式）');
  }

  const openai = new OpenAI({
    apiKey,
    baseURL,
    httpAgent: createProxyAgent(),
    timeout: 60000,     // 60 秒超时
    maxRetries: 2,      // 最多重试 2 次
  });

  客户端实例 = { openai, model, baseURL };
  return 客户端实例;
}

// 核心方法：发送消息到 LLM 并获取回复
export async function chat(消息列表, 选项 = {}) {
  const { openai, model } = getAIClient();

  logger.info(`正在调用 AI 接口，模型: ${model}`);
  logger.debug(`System Prompt: ${消息列表[0]?.content?.slice(0, 100)}...`);

  spinner.start('正在调用 AI 接口，请稍候...');

  try {
    const 响应 = await openai.chat.completions.create({
      model,
      messages: 消息列表,
      temperature: 选项.temperature ?? 0.1,  // 低温度保证输出稳定
      max_tokens: 选项.maxTokens ?? 2000,
    });

    const 内容 = 响应.choices[0]?.message?.content || '';
    spinner.stop(`AI 响应完成，${内容.length} 字符`);
    logger.info(`AI 响应成功，长度: ${内容.length} 字符`);

    return {
      content: 内容,
      usage: 响应.usage,
    };
  } catch (err) {
    spinner.stop();
    logger.error(`AI 接口调用失败: ${err.message}`);
    if (err.status === 401 || err.status === 403) {
      handleError('API Key 无效或权限不足，请检查 OPENAI_API_KEY 配置');
    } else if (err.status === 429) {
      handleError('API 调用频率超限，请稍后重试');
    } else if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      handleError('无法连接到 AI 服务，请检查网络或 OPENAI_BASE_URL 配置');
    } else {
      handleError(`AI 接口调用失败: ${err.message}`);
    }
  }
}

// 校验是否已配置 API Key
// mock 模式下可以跳过校验
export function validateAPIKey(是否为Mock模式) {
  if (是否为Mock模式) return;
  if (!process.env.OPENAI_API_KEY) {
    handleError('未配置 OPENAI_API_KEY 环境变量，请设置后重试（或使用 --mock 模式）');
  }
}
