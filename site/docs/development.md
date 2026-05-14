# 参与开发

## 开发流程

### 环境配置

开始前，请确保本机已安装以下工具：

- [Git](https://git-scm.com/)
- [Python](https://www.python.org/) 3.13+
- [Node.js](https://nodejs.org/) 24+
- [Poetry](https://python-poetry.org/) 2.4+
- [pnpm](https://pnpm.io/) 11+

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
pnpm install
pnpm run dev
```

4. 前后端均启动后，浏览器访问 `http://localhost:5173/` 即可进入应用界面，首次使用需创建管理员账号

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
│       ├── utils/              # 工具函数
│       └── core/               # 核心模块
│           ├── dl/             # 下载器适配
│           ├── flow/           # 工作流引擎
│           └── media/          # 媒体库管理
└── workspace/                  # 运行时数据
    ├── database/               # 数据库
    ├── images/                 # 图片缓存
    └── repositories/           # 工作流仓库
```

## 贡献指南

欢迎通过 [GitHub](https://github.com/kaloscope/kaloscope) 提交 Issue 或 Pull Request。工作流社区模板请向 [workflows](https://github.com/kaloscope/workflows) 仓库提交。

### 提交 Issue

- 提交前请先搜索现有 Issue，避免重复
- Bug 报告请说明复现步骤、预期行为与实际行为，并附上版本信息

### 提交 Pull Request

- PR 请基于 `main` 分支创建，合并目标也为 `main`
- 保持每个 PR 聚焦于单一功能或修复，便于 Review
- 向主仓库提交 PR 前请确保完成以下检查：
  - 已安装 [pre-commit](https://pre-commit.com/) hooks，提交时会自动执行代码格式化
  - 修改了后端代码：所有单元测试通过（`cd backend && poetry run pytest -v`）
  - 修改了前端代码：lint 与类型检查通过（`cd frontend && pnpm run lint && pnpm run check`）
