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

4. 前后端都启动后，浏览器打开 `http://localhost:5173/` 即可访问应用界面，首次使用同样需要创建管理员账号

### 项目结构

```text
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

AI 相关功能（模型提供商、内置助手和 MCP）的后端入口分别位于 `backend/app/services/ai.py`、`backend/app/services/assistant.py` 和 `backend/app/mcp.py`。如果想扩展新工具，请尽量复用现有 service 层逻辑，同时别绕开账号权限校验、只读/读写令牌限制以及「先预览再确认」的机制。

欢迎到 [GitHub](https://github.com/kaloscope/kaloscope) 提 Issue 或 Pull Request；如果是分享新的工作流模板，请直接向 [workflows](https://github.com/kaloscope/workflows) 仓库提交。

### 提交 Issue

1. 提交前先搜一下现有 Issue，看看是不是已经有人报过
2. 反馈 Bug 时尽量写清复现步骤、你期望的效果和实际现象，并附上当前版本号

### 提交 Pull Request

1. 从 `main` 分支拉出新分支，分支名建议用 `feature/xxx` 或 `fix/xxx` 格式
2. 改完推送到你 Fork 的仓库
3. 在 GitHub 上发起 Pull Request，合并目标选主仓库的 `main` 分支
4. PR 标题和描述请说清楚改了什么、为什么要这样改
5. 每个 PR 尽量只解决一件事，改动小而专注会更容易 Review
6. 按改动范围跑完下面的检查，并把实际结果写进 PR 描述里；改了前端界面记得贴上截图

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

只改了后端某几个模块时，可以先只跑相关的测试文件；涉及公共数据模型、底层基础设施或跨模块改动，则请跑一遍完整测试集。前端目前没有单独的 `test` 脚本，界面修改记得结合实际页面交互确认。

仓库用 prek 管理 Git hooks，在 `backend` 目录执行 `poetry run prek install` 即可安装。提交前钩子会按根目录的 `.pre-commit-config.yaml` 运行检查，必要时可能会格式化文件或更新锁文件，记得留意提交前的 diff；如果只是改改文档，核对好路径、命令和说明，再跑一下 `git diff --check` 就行。

另外提醒一下，本地开发和测试请务必使用独立的 `workspace` 目录。启动完整后端时会自动跑数据库迁移，并开启下载同步和媒体库监控，不要直接拿正在使用的媒体库和下载任务数据来做测试。
