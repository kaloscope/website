# 本地部署

推荐使用 Docker 部署，镜像已发布至 [Docker Hub](https://hub.docker.com/r/kaloscope/kaloscope)。

## Docker Compose（推荐）

```yaml
services:
  kaloscope:
    image: kaloscope/kaloscope:latest
    container_name: kaloscope
    extra_hosts:
      - host.docker.internal:host-gateway
    environment:
      - PUID=1026
      - PGID=100
      - UMASK=022
      - TZ=Asia/Shanghai
      - AUTO_TLS=false
      - TLS_HOSTNAME=192.168.31.100
      - ENABLE_ARIA2=true
      - DEBUG_MODE=false
    volumes:
      - /volume1/kaloscope/workspace:/workspace
      - /volume1/kaloscope/downloads:/downloads
      - /volume1/kaloscope/animes:/animes
    ports:
      - 8000:8000
      - 6888:6888
      - 6888:6888/udp
    restart: unless-stopped
  qbittorrent:
    image: linuxserver/qbittorrent:latest
    container_name: qbittorrent
    environment:
      - PUID=1026
      - PGID=100
      - UMASK=022
      - TZ=Asia/Shanghai
      - WEBUI_PORT=8080
      - TORRENTING_PORT=6881
    volumes:
      - /volume1/kaloscope/qbittorrent:/config
      - /volume1/kaloscope/downloads:/downloads
    ports:
      - 8080:8080
      - 6881:6881
      - 6881:6881/udp
    restart: unless-stopped
networks:
  default:
    external:
      name: syno
```

- `extra_hosts: host.docker.internal:host-gateway`：允许容器访问宿主机上的服务
- `networks.default.external.name: syno`：Synology 自定义网络，普通 Docker 环境可删除该节点
- `/workspace`：持久化数据目录，存放数据库、缓存与工作流仓库
- qBittorrent 与 Kaloscope 共享 `downloads` 目录，下载完成后可直接扫描入库

```bash
docker compose up -d
```

## Docker CLI

```bash
docker run -d \
  --name kaloscope \
  --add-host=host.docker.internal:host-gateway \
  -e PUID=1000 \
  -e PGID=1000 \
  -e UMASK=022 \
  -e TZ=Asia/Shanghai \
  -e AUTO_TLS=false \
  -e ENABLE_ARIA2=true \
  -v /path/to/workspace:/workspace \
  -v /path/to/downloads:/downloads \
  -p 8000:8000 \
  -p 6888:6888 \
  -p 6888:6888/udp \
  --restart unless-stopped \
  kaloscope/kaloscope:latest
```

## 环境变量

| 变量名 | 默认值 | 说明 |
| --- | --- | --- |
| `PUID` | `0` | 进程运行 UID，NAS 环境建议设为媒体目录所有者 |
| `PGID` | `0` | 进程运行 GID |
| `UMASK` | `022` | 文件创建掩码 |
| `TZ` | 系统默认 | 时区，如 `Asia/Shanghai` |
| `AUTO_TLS` | `false` | 启用 [mkcert](https://github.com/FiloSottile/mkcert) 自动签发本地 TLS 证书，CA 存储于 `/workspace/mkcert`，适合局域网 HTTPS |
| `TLS_HOSTNAME` | 空 | TLS 证书绑定的主机名或 IP |
| `ENABLE_ARIA2` | `false` | 在容器内启动内置 aria2，RPC 端口 `6800`（仅容器内），BT 监听端口 `6888` |
| `DEBUG_MODE` | `false` | 以 Sanic debug 模式启动 |

## 端口说明

| 端口 | 协议 | 用途 |
| --- | --- | --- |
| `8000` | TCP | Web 服务 |
| `6888` | TCP/UDP | 内置 aria2 BT 监听（仅 `ENABLE_ARIA2=true` 时需要） |

## 首次启动

访问 `http://<宿主机IP>:8000` 创建管理员账号，然后：

1. **设置 → 下载器**：添加下载器
2. **设置 → 工作流**：导入或创建索引器工作流
3. **设置 → 媒体库**：添加媒体库根目录
