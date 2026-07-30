// 终端 Spinner：yarn-style 进度条 + 旋转动画，输出到 stderr
// 不会污染 stdout（用于输出 JSON 结果），适用于管道和重定向场景

const 动画帧 = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const 帧间隔 = 80; // ms
const 进度条宽度 = 24;
const 填充字符 = '█';
const 空白字符 = '░';
const 流光字符 = '▓';

let 定时器 = null;
let 当前帧 = 0;
let 当前文本 = '';
let 启动时间 = 0;
let 已启动 = false;

// 判断 stderr 是否为 TTY（管道/重定向时隐藏动画，只输出文本）
function isTTY() {
  return process.stderr.isTTY !== false;
}

// 基于已运行时间来估算进度 (0-90%)，对数增长曲线，永不填满
function 估算进度() {
  const 已运行 = (Date.now() - 启动时间) / 1000; // 秒
  // 对数曲线：前 3 秒到 40%，10 秒到 70%，30 秒到 85%
  const 进度 = Math.min(0.9, Math.log10(已运行 * 3 + 1) * 0.55);
  return 进度;
}

// 构建进度条字符串
function 构建进度条() {
  const 进度 = 估算进度();
  const 已填充 = Math.floor(进度 * 进度条宽度);
  const 流光位置 = 已填充 > 0 ? 已填充 - 1 : 0;

  let 条 = '';
  for (let i = 0; i < 进度条宽度; i++) {
    if (i < 已填充) {
      条 += (i === 流光位置) ? 流光字符 : 填充字符;
    } else {
      条 += 空白字符;
    }
  }
  return 条;
}

// 构建完整输出行（pnpm 风格：百分比 + 秒数）
function 构建行(frame) {
  const 进度 = 估算进度();
  const 进度条 = 构建进度条();
  const 秒数 = ((Date.now() - 启动时间) / 1000).toFixed(1);
  const 百分比 = Math.round(进度 * 100);
  return `\r${frame} ${当前文本}  [${进度条}]  ${百分比}%  ${秒数}s`;
}

// 输出一帧动画
function render() {
  if (isTTY()) {
    const frame = 动画帧[当前帧];
    process.stderr.write(构建行(frame));
    当前帧 = (当前帧 + 1) % 动画帧.length;
  }
}

export const spinner = {
  start(text) {
    if (已启动) return;

    当前文本 = text;
    启动时间 = Date.now();
    已启动 = true;

    if (isTTY()) {
      当前帧 = 0;
      process.stderr.write('\x1B[?25l'); // 隐藏光标
      render();
      定时器 = setInterval(render, 帧间隔);
    } else {
      process.stderr.write(`[INFO]  ${text}\n`);
    }
  },

  stop(text) {
    if (!已启动) return;

    已启动 = false;
    const 耗时 = ((Date.now() - 启动时间) / 1000).toFixed(1);

    if (isTTY()) {
      if (定时器) {
        clearInterval(定时器);
        定时器 = null;
      }
      // 完成进度条：满格 100%
      const 完成条 = 填充字符.repeat(进度条宽度);
      const 完成文字 = text || 'AI 响应完成';
      process.stderr.write(`\r\x1B[K✓ ${完成文字}  [${完成条}]  100%  ${耗时}s\n`);
      process.stderr.write('\x1B[?25h'); // 恢复光标
    } else if (text) {
      process.stderr.write(`[INFO]  ✓ ${text} (${耗时}s)\n`);
    }
  },

  update(text) {
    if (!已启动) return;
    当前文本 = text;
    if (!isTTY()) {
      process.stderr.write(`[INFO]  ${text}\n`);
    }
  },
};
