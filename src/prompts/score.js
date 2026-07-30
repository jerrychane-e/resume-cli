// JD 匹配评分 Prompt 模板

export const 评分系统提示词 = '你是一个经验丰富的技术面试官，擅长根据岗位描述评估候选人的匹配程度。严格按要求返回 JSON，不做多余解释。';

export function 构建评分用户提示词(简历文本, JD文本) {
  return `请根据以下候选人简历和岗位描述（JD），对候选人进行匹配评分。

评分规则：
- skill_score（技能匹配度）：0-100 的整数，若 JD 中出现的技能在简历中完全没有，则显著降低该分数
- experience_score（经验匹配度）：0-100 的整数
- education_score（学历匹配度）：0-100 的整数
- overall_score（综合匹配度）：按技能 50%、经验 30%、学历 20% 加权计算，四舍五入取整
- comment：简洁的中文评价，不超过 150 字，说明匹配亮点与不足
- interview_questions：2-4 个与岗位要求高度相关的中文面试问题

严格返回如下 JSON 结构，不要 markdown 代码块，不要额外文字：
{
  "overall_score": 82,
  "skill_score": 88,
  "experience_score": 80,
  "education_score": 75,
  "comment": "简洁的中文评价（不超过150字），说明匹配亮点与不足",
  "interview_questions": ["与岗位要求高度相关的中文面试问题1", "问题2"]
}

=== 候选人简历 ===
${简历文本}

=== 岗位描述（JD）===
${JD文本}`;
}
