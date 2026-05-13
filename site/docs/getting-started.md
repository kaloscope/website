# 快速开始

## Docker 部署

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

启动后访问 `http://localhost:8000`，首次进入需要创建管理员账号。完整部署配置参见[本地部署](/docs/deployment)。

## 源码启动

依赖：Git、Python 3.13+、Node.js、Poetry、pnpm

```bash
git clone https://github.com/kaloscope/kaloscope.git
cd kaloscope
```

**后端：**

```bash
cd backend
poetry install
poetry run sanic app.main:app --fast --reload --debug
```

**前端**（另开终端）：

```bash
cd frontend
pnpm install
pnpm run dev
```

访问 `http://localhost:5173/`。

## 初始配置

账号创建后，按顺序完成：

1. **设置 → 下载器**：添加下载器连接（aria2 / qBittorrent / Transmission）
2. **设置 → 工作流**：导入仓库，配置索引器
3. **设置 → 媒体库**：添加媒体库根目录
