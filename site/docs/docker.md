# Docker 部署

Kaloscope 提供了多阶段构建的 Dockerfile，可同时构建前端静态资源与后端运行环境。

## 构建思路

Dockerfile 分为两个阶段：

1. 前端阶段基于 `node:25-slim`，使用 pnpm 安装依赖并构建前端产物。
2. 运行阶段基于 `python:3.13-slim`，安装 Poetry 与后端依赖，并复制前端构建结果。

## 运行时依赖

镜像中已安装以下关键依赖：

- `git`，供 Git 相关 Python 依赖使用
- `libxml2`、`libxslt1.1`，供 lxml 使用
- `gosu`，用于降权运行
- `aria2`，用于可选下载功能
- `curl` 与 `libnss3-tools`，用于 `mkcert` 自动 TLS
- `media-types`，用于基于扩展名推断 MIME 类型

## 默认工作目录与启动方式

- 容器工作目录为 `/app`
- 后端位于 `/app/backend`
- 前端构建产物复制到 `/app/frontend/build`
- 入口脚本为 `/app/entrypoint.sh`

最终启动命令会执行：

```bash
poetry run sanic app.main:app --host 0.0.0.0 --port 8000 --fast
```

在启用某些环境变量后，还会附加 TLS 或调试参数。

## 快速构建镜像

如果你直接使用仓库根目录中的 Dockerfile，可以执行：

```bash
git clone https://github.com/kaloscope/kaloscope.git
cd kaloscope
docker build -t kaloscope:latest .
```

镜像构建时会先编译前端，再安装后端运行依赖并复制产物到最终镜像中。

## 最小运行示例

下面是一条最小可运行命令，适合先验证容器是否能正常启动：

```bash
docker run -d \
	--name kaloscope \
	-p 8000:8000 \
	-v $(pwd)/workspace:/app/workspace \
	kaloscope:latest
```

启动后可通过 `http://localhost:8000` 访问服务。

如果你准备把下载目录或媒体库目录映射到宿主机，建议额外挂载独立目录，而不要与工作区数据混在一起。

## 可用环境变量

Dockerfile 中已定义以下环境变量：

| 变量名 | 默认值 | 说明 |
| --- | --- | --- |
| `PUID` | `0` | 运行用户 UID |
| `PGID` | `0` | 运行用户 GID |
| `UMASK` | `022` | 文件创建掩码 |
| `TLS_HOSTNAME` | 空 | 预留 TLS 主机名配置 |
| `AUTO_TLS` | `false` | 是否启用自动 TLS |
| `DEBUG_MODE` | `false` | 是否开启 Sanic 调试模式 |
| `ENABLE_ARIA2` | `false` | 是否在容器内启动 aria2 |

## 暴露端口与卷

- `8000`：Kaloscope Web 服务
- `6888/tcp` 与 `6888/udp`：aria2 DHT/监听端口
- `/app/workspace`：运行时数据卷

## Docker Compose 示例

下面是一个适合作为起点的 Compose 样例：

```yaml
services:
	kaloscope:
		build:
			context: ../kaloscope
			dockerfile: Dockerfile
		container_name: kaloscope
		ports:
			- "8000:8000"
			- "6888:6888"
			- "6888:6888/udp"
		environment:
			PUID: 1000
			PGID: 1000
			UMASK: "022"
			AUTO_TLS: "false"
			DEBUG_MODE: "false"
			ENABLE_ARIA2: "true"
		volumes:
			- ./workspace:/app/workspace
			- ./downloads:/downloads
		restart: unless-stopped
```

说明：

- `./workspace` 用于持久化数据库、缓存和工作流仓库
- `ENABLE_ARIA2=true` 时会在容器内同时启动 aria2
- 如果你不打算使用内置 aria2，可以关闭该变量并去掉 `6888` 端口

## 常见部署方式

### 单容器运行

适合先快速体验，所有状态都放在一个工作区卷中。

### 容器加反向代理

适合长期运行，通过 Nginx、Caddy 或 Traefik 统一处理域名、HTTPS 和外部访问控制。

### 容器只跑 Kaloscope，下载器单独部署

适合已经有现成 qBittorrent、Transmission 或 aria2 环境的用户。此时只需在 Kaloscope 中配置对应下载器连接信息。

## 推荐部署要点

- 将 `/app/workspace` 挂载到宿主机持久化目录
- 如需使用内置 aria2，同时映射相关端口并检查防火墙规则
- 在生产环境中通过 `PUID`、`PGID` 配置非 root 运行身份
- 如果对外提供 HTTPS，可根据环境选择 `AUTO_TLS` 或外部反向代理方案

## 与源码目录的对应关系

从 Dockerfile 可以确认以下构建关系：

- `frontend/` 会先在 Node 构建阶段打包
- 构建产物被复制到最终镜像的 `/app/frontend/build`
- `backend/` 中的 Poetry 依赖会在 Python 镜像中安装
- 启动入口最终落在 `backend/app.main:app`

这意味着镜像本质上是“前端静态产物 + 后端 API 服务 + 可选 aria2”的组合包。

## 待补充

- 反向代理配置示例
- NAS 场景下的卷映射建议
