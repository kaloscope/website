# 参与开发

本页面向希望参与 Kaloscope 开发或进行二次扩展的开发者。

## 技术栈

| 层 | 技术 |
| --- | --- |
| 前端框架 | [Svelte 5](https://svelte.dev/) |
| 工作流画布 | [xyflow](https://xyflow.com/) |
| 后端框架 | [Sanic](https://sanic.dev/) |
| ORM | [Tortoise ORM](https://tortoise.github.io/) |
| 语言 | Python 3.13+ |
| 包管理 | Poetry（后端）、pnpm（前端） |

## 项目结构

```text
kaloscope/
├── frontend/
│   ├── src/
│   │   ├── routes/         # 页面路由（SvelteKit）
│   │   └── lib/            # 组件与工具库
│   └── static/             # 静态资源
└── backend/
    └── app/
        ├── main.py         # 应用入口
        ├── config.toml     # 配置文件
        ├── routes/         # API 路由层
        ├── services/       # 业务逻辑层
        ├── models/         # 数据模型
        ├── utils/          # 工具函数
        └── core/
            ├── flow/       # 工作流引擎
            ├── media/      # 媒体库管理
            └── dl/         # 下载器适配
```

## 本地启动

**后端**

```bash
cd backend
poetry install
poetry run sanic app.main:app --fast --reload --debug
```

**前端**（另开终端）

```bash
cd frontend
pnpm install
pnpm run dev
```

前后端均启动后，访问 `http://localhost:5173/` 进入开发界面。

## 贡献指南

欢迎通过 [GitHub](https://github.com/kaloscope/kaloscope) 提交 Issue 或 Pull Request。提交前请先阅读项目根目录中的 README 与许可证说明。

工作流社区模板请向 [workflows 仓库](https://github.com/kaloscope/workflows) 提交。

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
