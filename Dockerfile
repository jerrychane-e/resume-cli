# =============================================
# 第一阶段：构建前端（React + Vite）
# =============================================
FROM docker.m.daocloud.io/library/node:18-alpine AS web-builder
WORKDIR /app/web
COPY web/package.json web/package-lock.json ./
RUN npm ci
COPY web/ ./
RUN npm run build
# 产出: /app/web/dist/

# =============================================
# 第二阶段：安装后端生产依赖
# =============================================
FROM docker.m.daocloud.io/library/node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production --ignore-scripts

# =============================================
# 第三阶段：生产运行镜像
# =============================================
FROM docker.m.daocloud.io/library/node:18-alpine
WORKDIR /app

# 创建非 root 用户，遵循最小权限原则
RUN addgroup -S resumecli && \
    adduser -S resumecli -G resumecli

# 复制后端依赖
COPY --from=deps /app/node_modules ./node_modules

# 复制后端源码和 mock 数据
COPY src/        ./src/
COPY mock/       ./mock/
COPY package.json ./

# 复制前端构建产物
COPY --from=web-builder /app/web/dist ./web/dist

# 链接全局可执行命令
RUN npm link

# 暴露 Web 服务端口
EXPOSE 3000

# 切换到非 root 用户
USER resumecli

# 设置入口命令
ENTRYPOINT ["resume-cli"]

# 默认展示帮助信息
CMD ["--help"]
