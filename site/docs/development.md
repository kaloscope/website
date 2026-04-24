# 开发指南

本页面向希望参与 Kaloscope 开发或进行二次扩展的用户。

## 技术栈概览

根据 README 与项目徽章，可以确认主要技术栈包括：

- 前端：Svelte
- 工作流画布：xyflow
- 后端：Sanic
- 语言：Python 3.13+

## 项目结构

README 中给出的结构摘要如下：

```text
frontend/
  src/routes/
  src/lib/
  static/

backend/app/
  main.py
  routes/
  services/
  models/
  utils/
  core/
    dl/
    flow/
    media/
```

从命名上看：

- `routes/` 主要承载接口层
- `services/` 负责业务逻辑
- `models/` 负责数据模型
- `core/flow/`、`core/media/`、`core/dl/` 分别对应工作流、媒体库和下载相关核心能力

## 本地开发流程

### 后端

```bash
cd backend
poetry install
poetry run sanic app.main:app --fast --reload --debug
```

### 前端

```bash
cd frontend
pnpm install
pnpm run dev
```

## 建议补充的开发文档

本页后续建议继续补充：

- 前后端目录职责细化
- API 约定
- 工作流节点开发规范
- 数据模型与迁移策略
- 提交规范与发布流程

## 贡献前建议

- 先确认改动属于核心功能、适配层还是文档层
- 尽量避免把站点逻辑直接写死到核心模块中
- 对工作流、脚本执行和外部请求相关改动做额外安全审查
