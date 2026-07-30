.PHONY: install test test-watch dev dev-web build-web run-mock run-mock-score run-serve clean docker-build docker-run-web

# 安装全部依赖（后端 + 前端）
install:
	npm ci && cd web && npm ci

# 运行全部测试
test:
	npm test

# 监视模式运行测试
test-watch:
	npm run test:watch

# 启动开发模式（后端 API + 前端热更新代理）
dev:
	npm run serve & npm run dev:web

# 仅启动前端开发服务器
dev-web:
	cd web && npm run dev

# 构建前端生产包
build-web:
	cd web && npm run build

# 使用 mock 模式演示 CLI extract 命令
run-mock:
	node src/index.js extract ./tests/fixtures/sample.pdf --mock

# 使用 mock 模式演示 CLI score 命令
run-mock-score:
	node src/index.js score ./tests/fixtures/sample.pdf --jd ./tests/fixtures/sample-jd.txt --mock

# 启动 Web 服务（需先构建前端）
run-serve: build-web
	node src/index.js serve --port 3000 --open

# 构建 Docker 镜像
docker-build:
	docker build -t resume-cli .

# Docker 运行 Web 服务
docker-run-web:
	docker run --rm -p 3000:3000 -e OPENAI_API_KEY=${OPENAI_API_KEY} resume-cli serve --port 3000

# 清理
clean:
	rm -rf node_modules web/node_modules web/dist dist coverage
