# 快速开始

本页提供最短路径的上手方式，适合第一次体验 Kaloscope。

## 推荐方式：Docker 部署

最简单的方式是通过 Docker 运行，无需配置 Python 和 Node.js 环境：

```bash
docker run -d \
  --name kaloscope \
  -e ENABLE_ARIA2=true \
  -v $(pwd)/workspace:/workspace \
  -p 8000:8000 \
  -p 6888:6888 \
  -p 6888:6888/udp \
  --restart unless-stopped \
  kaloscope/kaloscope:latest
```

启动后访问 `http://localhost:8000`，首次进入需要创建管理员账号。

完整的部署配置（含 Docker Compose 示例和环境变量说明）请参见[本地部署](/docs/deployment)。

## 源码启动

如需在本地开发环境运行，需要预先安装 Git、Python 3.13+、Node.js、Poetry 和 pnpm。

```bash
git clone https://github.com/kaloscope/kaloscope.git
cd kaloscope
```

**启动后端：**

```bash
cd backend
poetry install
poetry run sanic app.main:app --fast --reload --debug
```

**启动前端**（另开终端）：

```bash
cd frontend
pnpm install
pnpm run dev
```

访问 `http://localhost:5173/` 进入开发界面。

## 初始配置

账号创建完成后，建议按顺序完成以下配置：

1. **设置 → 下载器**：添加下载器连接（aria2 / qBittorrent / Transmission）
2. **设置 → 工作流**：导入或新建工作流仓库，配置索引器
3. **设置 → 媒体库**：添加媒体库根目录

## 下一步

- [工作流](/docs/workflows)
- [资源搜索](/docs/websearch)
- [下载管理](/docs/downloads)
