# 快速开始

本页提供最短路径的上手方式，适合第一次体验 Kaloscope。

## 前置要求

使用源码运行时，建议先准备以下环境：

- Git
- Python 3.13+
- Node.js
- Poetry
- pnpm

如果你更倾向于容器部署，可以直接阅读 [Docker 部署](/docs/docker)。

## 5 分钟上手流程

1. 克隆项目代码。
2. 启动后端服务。
3. 启动前端开发服务器。
4. 打开浏览器访问应用。
5. 首次使用时创建管理员账号。

## 源码启动

```bash
git clone https://github.com/kaloscope/kaloscope.git
cd kaloscope

cd backend
poetry install
poetry run sanic app.main:app --fast --reload --debug
```

另开一个终端：

```bash
cd frontend
pnpm install
pnpm run dev
```

默认前端开发地址为 `http://localhost:5173/`。

## 首次进入后建议完成的事项

- 创建管理员账号
- 新建或导入工作流仓库
- 配置至少一个索引器工作流
- 配置下载器
- 创建媒体库并绑定目录

## 下一步阅读

- [安装与运行](/docs/installation)
- [工作流系统](/docs/workflows)
- [下载与搜索](/docs/search-and-download)
