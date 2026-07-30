// JSON 清洗修复工具：多级策略修复 LLM 返回的非标准 JSON

/**
 * 修复常见的 JSON 语法错误（第 4 级修复，加分项）
 * - 移除尾部逗号: ,} → }  ,] → ]
 * - 修正键名大小写: Name → name, Phone → phone 等
 */
function repairCommonErrors(文本) {
  let 结果 = 文本;

  // 移除尾部逗号（在 } 或 ] 前）
  结果 = 结果.replace(/,(\s*[}\]])/g, '$1');

  // 修正常见键名大小写（LLM 有时会返回大写开头的键名）
  const 键名映射 = {
    'Name': 'name',
    'Phone': 'phone',
    'Email': 'email',
    'City': 'city',
    'Education': 'education',
    'School': 'school',
    'Major': 'major',
    'Degree': 'degree',
    'Graduation_time': 'graduation_time',
    'Skills': 'skills',
    'Overall_score': 'overall_score',
    'Skill_score': 'skill_score',
    'Experience_score': 'experience_score',
    'Education_score': 'education_score',
    'Comment': 'comment',
    'Interview_questions': 'interview_questions',
  };

  for (const [错误键名, 正确键名] of Object.entries(键名映射)) {
    // 仅替换 JSON 键名（带引号的）
    const 正则 = new RegExp(`"${错误键名}"`, 'g');
    结果 = 结果.replace(正则, `"${正确键名}"`);
  }

  return 结果;
}

/**
 * 对 LLM 返回的原始文本执行多级清洗
 * 第 0 级：原样返回（由调用方直接 JSON.parse）
 * 第 1 级：去除首尾空白
 * 第 2 级：移除 Markdown 代码块标记
 * 第 3 级：截取首个 { 到最后一个 }
 * 第 4 级：修复常见 JSON 语法错误
 */
export function cleanJSONResponse(原始响应) {
  let 文本 = 原始响应;

  // 第 1 级：去除首尾空白
  文本 = 文本.trim();

  // 第 2 级：移除 Markdown 代码块标记
  文本 = 文本.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');

  // 再次 trim
  文本 = 文本.trim();

  // 第 3 级：截取首个 { 到最后一个 }
  const 起始 = 文本.indexOf('{');
  const 结束 = 文本.lastIndexOf('}');
  if (起始 !== -1 && 结束 !== -1 && 起始 < 结束) {
    文本 = 文本.slice(起始, 结束 + 1);
  }

  // 第 4 级：修复常见 JSON 语法错误
  文本 = repairCommonErrors(文本);

  return 文本;
}
