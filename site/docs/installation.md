# 安装与运行

本页说明如何通过源码方式运行 Kaloscope，以及推荐的目录准备方式。

## 开发环境依赖

根据项目 README，开发机需要安装以下工具：

- Git
- Python
- Node.js
- Poetry
- pnpm

## 后端启动

```bash
cd backend
poetry install
poetry run sanic app.main:app --fast --reload --debug
```

说明：

- `poetry install` 用于安装 Python 依赖
- `sanic app.main:app` 用于启动后端应用
- `--reload` 和 `--debug` 更适合开发环境

## 前端启动

```bash
cd frontend
pnpm install
pnpm run dev
```

说明：

- 前端使用 pnpm 管理依赖
- 启动后访问本地开发服务器即可进入界面

## 推荐目录规划

运行时通常需要预留一个工作区目录，用于存放：

- 数据库文件
- 图片缓存
- 下载内容
- 工作流仓库

README 中给出的典型结构如下：

```text
workspace/
├── database/
├── images/
├── downloads/
└── repositories/
```

## 生产环境建议

- 使用独立用户运行服务，避免长期以 root 身份运行
- 将下载目录、媒体库目录和工作区目录分开挂载
- 在公网访问场景下配合反向代理、TLS 与鉴权方案使用

## 待补充

后续可以继续补充以下内容：

- Windows、macOS、Linux 的差异化启动说明
- 外部数据库或存储方案支持情况
- 首次初始化向导截图
