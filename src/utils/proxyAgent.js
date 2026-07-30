// 读取 HTTP_PROXY / HTTPS_PROXY 环境变量，创建对应代理 agent
// 若未配置代理则返回 undefined，SDK 将直连

import { HttpsProxyAgent } from 'https-proxy-agent';

export function createProxyAgent() {
  const 代理地址 = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  if (代理地址) {
    return new HttpsProxyAgent(代理地址);
  }
  return undefined;
}
