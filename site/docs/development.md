# 参与开发

## 开发流程

### 环境配置

开始前，请确保本机已安装以下工具：

- [Git](https://git-scm.com/)
- [Python](https://www.python.org/) 3.13+
- [Node.js](https://nodejs.org/) 24+
- [Poetry](https://python-poetry.org/) 2.4+
- [pnpm](https://pnpm.io/) 11+
- FFmpeg 与 ffprobe：用于媒体探测、内嵌字幕、章节和转码

### 安装运行

1. [Fork](https://github.com/kaloscope/kaloscope/fork) 主仓库并克隆到本地

```bash
git clone https://github.com/<your-username>/kaloscope.git
cd kaloscope
```

2. 安装后端依赖并启动

```bash
cd backend
poetry install
poetry run sanic app.main:app --fast --reload --debug
```

3. 另开一个终端，安装前端依赖并启动

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm run dev
```

4. 前后端均启动后，浏览器访问`http://localhost:5173/`即可进入应用界面，首次使用需创建管理员账号

### 项目结构

```
kaloscope/
├── frontend/
│   ├── src/                    # 前端代码
│   │   ├── routes/             # 页面路由
│   │   │   ├── login/          # 登录页
│   │   │   ├── setup/          # 初始设置页
│   │   │   └── (app)/          # 主功能页面
│   │   │       ├── dashboard/  # 首页
│   │   │       ├── websearch/  # 搜索
│   │   │       ├── medialibs/  # 媒体库
│   │   │       ├── downloads/  # 下载
│   │   │       └── settings/   # 设置
│   │   └── lib/                # 组件与工具库
│   └── static/                 # 静态资源
├── backend/
│   └── app/                    # 后端代码
│       ├── main.py             # 应用入口
│       ├── config.toml         # 配置文件
│       ├── routes/             # API 路由
│       ├── services/           # 业务逻辑
│       ├── models/             # 数据模型
│       ├── migrations/         # 数据库迁移
│       ├── utils/              # 工具函数
│       └── core/               # 核心模块
│           ├── ai/             # 模型调用、工具与工作流草稿支持
│           ├── dl/             # 下载器适配
│           ├── flow/           # 工作流引擎
│           ├── media/          # 影视与阅读媒体的扫描、入库、索引和整理
│           └── transcode/      # 转码与能力探测
└── workspace/                  # 运行时数据
    ├── database/               # 数据库
    ├── cache/                  # HTTP 缓存
    ├── images/                 # 图片缓存
    ├── transcoded/             # 转码目录
    └── repositories/           # 工作流仓库
```

## 贡献指南

模型提供商、助手和 MCP 的业务入口分别位于 `backend/app/services/ai.py`、`backend/app/services/assistant.py` 和 `backend/app/mcp.py`。扩展工具时应复用已有服务，并保留账号权限、只读与读写令牌的限制，以及变更预览和确认流程。

欢迎通过 [GitHub](https://github.com/kaloscope/kaloscope) 提交 Issue 或 Pull Request。工作流模板请向 [workflows](https://github.com/kaloscope/workflows) 仓库提交。

### 提交 Issue

1. 提交前请先搜索现有 Issue，避免重复
2. Bug 报告请说明复现步骤、预期行为与实际行为，并附上版本信息

### 提交 Pull Request

1. 从`main`分支创建功能分支，分支名建议使用`feature/xxx`或`fix/xxx`格式
2. 在分支上进行开发，完成后推送到你 Fork 的仓库
3. 在 GitHub 上发起 Pull Request，合并目标选择主仓库的`main`分支
4. PR 标题和描述请清晰说明改了什么、为什么这样改
5. 每个 PR 应聚焦于单一功能或修复，保持改动范围小且专注，便于 Review
6. 根据改动范围完成下面的检查，并在 PR 中说明实际结果；修改界面时附上截图

### 检查与测试

前端在 `frontend` 目录执行：

```bash
pnpm run check
pnpm run lint
# 涉及路由、依赖、构建配置、静态资源或 PWA 时补充构建
pnpm run build
```

后端在 `backend` 目录执行：

```bash
poetry run pytest -v
poetry run ruff check .
poetry run ruff format --check .
```

局部后端修改可先运行相关测试文件；公共模型、共享基础设施和跨模块修改应运行完整测试集。前端目前没有 `test` 脚本，界面修改需结合实际页面交互验证。

仓库使用 prek 管理 Git hooks，可在 `backend` 目录执行 `poetry run prek install`。钩子沿用根目录的 `.pre-commit-config.yaml`，可能格式化文件或更新锁文件，运行后应检查差异。仅修改文档时，核对路径、命令和说明，并执行 `git diff --check` 即可。

开发和验证请使用独立的 `workspace`。启动完整后端会自动迁移数据库，并开启下载同步和媒体库监控，不应直接使用实际媒体库与下载任务的数据进行测试。
