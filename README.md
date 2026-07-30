# resume-cli — AI 简历解析命令行工具

从 PDF 简历中智能提取结构化信息，支持与岗位描述（JD）匹配评分，并提供浏览器可视化展示。**支持 CLI 终端 + Web 浏览器双模式**。

## 技术选型

### 后端（CLI + API 服务）

| 依赖 | 用途 |
|------|------|
| Node.js ≥ 18 (ES Module) | 运行时环境 |
| `commander` ^12 | CLI 框架，声明式子命令与自动 help |
| `pdf-parse` ^1 | 解析 PDF 文本层，提取纯文本 |
| `openai` ^4 | 调用 LLM API（兼容 OpenAI / Azure / Ollama 等） |
| `express` ^4 | Web API 服务 |
| `multer` ^2 | 处理文件上传（multipart/form-data） |
| `zod` ^3 | JSON Schema 校验与字段补缺 |
| `dotenv` ^16 | 加载 .env 环境变量 |
| `https-proxy-agent` ^7 | HTTP/HTTPS 代理支持 |
| `cors` ^2 | 跨域请求处理 |
| `vitest` ^1 | 测试框架 |

### 前端（Web 展示层）

| 依赖 | 用途 |
|------|------|
| React ^18 + TypeScript ^5 | UI 框架 |
| Vite ^5 | 构建工具，开发热更新 |
| `react-router-dom` ^6 | 前端路由 |
| `recharts` ^2 | 雷达图可视化评分维度 |
| `react-dropzone` ^14 | 文件拖拽上传 |
| `axios` ^1 | HTTP 请求 |

## 环境变量配置

| 变量名 | 说明 | 是否必填 | 默认值 |
|--------|------|----------|--------|
| `OPENAI_API_KEY` | LLM API 密钥 | **必填**（mock 模式除外） | 无 |
| `OPENAI_BASE_URL` | API 服务地址 | 可选 | `https://api.openai.com/v1` |
| `LLM_MODEL` | 模型名称 | 可选 | `gpt-4o-mini` |
| `HTTP_PROXY` | HTTP 代理地址 | 可选 | 无 |
| `HTTPS_PROXY` | HTTPS 代理地址 | 可选 | 无 |

> 复制 `.env.example` 为 `.env` 并填入真实值即可使用。

## 安装方式

### 方式一：全局安装

```bash
cd resume-cli
npm install && cd web && npm install && cd ..
npm link
resume-cli --help
```

### 方式二：npx 临时运行

```bash
npx resume-cli extract ./resume.pdf --mock
```

### 方式三：Docker 运行

```bash
docker build -t resume-cli .
docker run --rm resume-cli --help
docker run --rm -p 3000:3000 -e OPENAI_API_KEY=$OPENAI_API_KEY resume-cli serve
```

## CLI 命令说明

### `parse` — 提取 PDF 纯文本

```bash
resume-cli parse <pdf_path>

# 示例
resume-cli parse ./resume.pdf
resume-cli parse /path/to/简历.pdf
```

**错误处理：**
- 文件不存在 → `错误：文件不存在 <路径>`
- 非 PDF 文件 → `错误：不支持的文件类型，仅接受 .pdf 文件`
- 损坏/加密 → `错误：无法读取 PDF 文件，文件可能已损坏或为加密文件`
- 扫描件/空文本 → `错误：PDF 文本内容为空，可能为扫描件或图片型 PDF`

### `extract` — AI 结构化提取简历信息

```bash
resume-cli extract <pdf_path> [--output <file_path>] [--mock]

# 示例
resume-cli extract ./resume.pdf                          # 真实 AI 解析
resume-cli extract ./resume.pdf --mock                   # 演示模式
resume-cli extract ./resume.pdf --output result.json     # 保存到文件
resume-cli extract ./resume.pdf --output ./out/data.json # 自动创建目录
```

**输出 JSON 结构：**
```json
{
  "name": "张三",
  "phone": "13800138000",
  "email": "zhangsan@example.com",
  "city": "深圳",
  "education": [
    {
      "school": "清华大学",
      "major": "计算机科学与技术",
      "degree": "硕士",
      "graduation_time": "2023-06"
    }
  ],
  "skills": ["JavaScript", "React", "Node.js", "Python", "Docker"]
}
```

### `score` — JD 匹配评分

```bash
resume-cli score <pdf_path> --jd <jd_path> [--output <file_path>] [--mock]

# 示例
resume-cli score ./resume.pdf --jd ./jd.txt                      # 真实评分
resume-cli score ./resume.pdf --jd ./jd.txt --mock               # 演示模式
resume-cli score ./resume.pdf --jd ./jd.txt --output score.json  # 保存结果
```

**输出 JSON 结构：**
```json
{
  "overall_score": 82,
  "skill_score": 88,
  "experience_score": 80,
  "education_score": 75,
  "comment": "匹配度较高，技能栈契合主技术方向...",
  "interview_questions": ["请举例说明...", "你在项目中..."]
}
```

### `serve` — 启动 Web 可视化服务

```bash
resume-cli serve [--port <port>] [--open]

# 示例
resume-cli serve                           # 默认端口 3000
resume-cli serve --port 8080               # 指定端口
resume-cli serve --port 3000 --open         # 自动打开浏览器
```

打开浏览器访问 `http://localhost:3000`，即可：
- 📋 **简历解析模式**：拖拽上传 PDF → 结构化卡片展示（姓名、联系方式、教育时间线、技能标签云）
- 🎯 **JD 匹配模式**：上传 PDF + 输入 JD → 雷达图 + 综合得分仪表盘 + 面试问题列表

> 提示：使用 Web 模式前需先构建前端：`npm run build:web` 或 `make build-web`

## 示例输入输出

无需配置 API Key，直接使用 mock 模式体验：

```bash
# 简历解析演示
$ resume-cli extract ./resume.pdf --mock
# Mock 模式：以下为演示数据，非真实解析结果
{
  "name": "张三",
  "phone": "13800138000",
  "email": "zhangsan@example.com",
  "city": "深圳",
  ...
}

# JD 匹配评分演示
$ resume-cli score ./resume.pdf --jd ./jd.txt --mock
# Mock 模式：以下为演示数据，非真实解析结果
{
  "overall_score": 82,
  "skill_score": 88,
  ...
}
```

## 已实现功能清单

### 核心功能
- [x] `parse` — PDF 纯文本提取，含 4 种错误分类
- [x] `extract` — LLM 结构化简历解析（姓名/电话/邮箱/城市/教育/技能）
- [x] `score` — LLM 多维匹配评分（技能 50% + 经验 30% + 学历 20%）
- [x] `serve` — Web 可视化服务（React + Express）

### 加分项
- [x] `--output` 保存结果（extract + score 均支持）
- [x] `--mock` 演示模式
- [x] JSON 自动修复（5 级策略：去空白 → 去 markdown → 截取 JSON → 修复尾部逗号 → 修正键名）
- [x] `--log-level` 五级日志（silent/error/warn/info/debug）
- [x] `--verbose` 快捷详细日志
- [x] Dockerfile 多阶段构建（含前端）
- [x] Makefile 快捷命令
- [x] 前端可视化：简历卡片 + 教育时间线 + 技能标签云 + 雷达图 + 仪表盘 + 面试问题

### 工程化
- [x] 中文错误提示 + stderr 输出 + 非零退出码
- [x] 每个命令独立 `--help`
- [x] `HTTP_PROXY` / `HTTPS_PROXY` 代理支持
- [x] `.env.example` 环境变量模板
- [x] Zod Schema 校验 + 字段补缺
- [x] vitest 自动化测试（17 个测试用例）

## 已知问题或未完成内容

- 仅支持文本层可读的 PDF，扫描件/图片型 PDF 会报错提示
- 批量处理（目录输入）功能未实现
- 前端评分页面移动端响应式适配有限，建议桌面端使用
- recharts 打包体积较大（~600KB），如需优化可替换为轻量 SVG 实现

## AI 工具使用说明

本项目开发过程中使用了以下 AI 编码助手：

- **Claude Code**（Anthropic）：用于需求分析、架构设计、代码生成、测试编写、文档生成等全流程。AI 辅助完成了：
  - 项目结构与模块划分设计
  - 所有后端代码（utils/services/commands/server/Prompts/validators）
  - 所有前端代码（React 组件/页面/样式/类型定义）
  - 测试用例编写
  - Dockerfile/Makefile/README.md

---

## 项目结构

```
resume-cli/
├── src/                     # 后端源码
│   ├── commands/            # CLI 命令（parse/extract/score/serve）
│   ├── server/              # Express API + 路由 + 中间件
│   ├── services/            # 核心业务（pdfReader/aiClient/resumeParser/jdMatcher）
│   ├── prompts/             # LLM Prompt 模板
│   ├── validators/          # Zod Schema 校验
│   ├── utils/               # 工具函数（error/logger/proxy/jsonFixer）
│   └── index.js             # CLI 入口
├── web/                     # 前端源码（React + TypeScript + Vite）
│   └── src/
│       ├── api/client.ts    # API 客户端
│       ├── components/      # UI 组件（9 个）
│       ├── pages/           # 页面（首页/简历结果/评分结果）
│       └── types/           # TypeScript 类型
├── tests/                   # 测试用例（4 个测试文件，17 个用例）
├── mock/                    # Mock 演示数据
├── Dockerfile               # 三阶段构建
├── Makefile                 # 常用命令
├── .env.example             # 环境变量模板
└── README.md                # 本文档
```
