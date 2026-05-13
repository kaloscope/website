# 本地部署

Kaloscope 推荐使用 Docker 进行部署，镜像已发布至 [Docker Hub](https://hub.docker.com/r/kaloscope/kaloscope)。

## Docker Compose（推荐）

下面是一个完整的 Compose 示例，包含 Kaloscope 主服务与 qBittorrent 下载器，适合 NAS 或家庭媒体服务器场景：

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

几点说明：

- `extra_hosts: host.docker.internal:host-gateway` 允许容器通过 `host.docker.internal` 访问宿主机上的服务（如外部下载器）
- `networks.default.external.name: syno` 是 Synology NAS 的自定义网络，普通 Docker 环境可直接删除该 `networks` 节点
- `/workspace` 是 Kaloscope 的持久化数据目录，存放数据库、图片缓存和工作流仓库
- qBittorrent 与 Kaloscope 共享同一个 `downloads` 目录，方便下载完成后直接扫描入库
- `/animes` 等媒体目录可根据实际库结构自行添加或修改

启动：

```bash
docker compose up -d
```

## Docker CLI

如果不使用 Compose，可以用 `docker run` 单独启动 Kaloscope：

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

将 `/path/to/workspace` 和 `/path/to/downloads` 替换为宿主机上的实际目录。

## 环境变量

| 变量名 | 默认值 | 说明 |
| --- | --- | --- |
| `PUID` | `0` | 以指定 UID 运行进程，设为 `0` 时以 root 运行 |
| `PGID` | `0` | 以指定 GID 运行进程 |
| `UMASK` | `022` | 文件创建掩码，影响新建文件的默认权限 |
| `TZ` | 系统默认 | 容器时区，如 `Asia/Shanghai`、`UTC` |
| `AUTO_TLS` | `false` | 设为 `true` 时由 mkcert 自动签发本地 TLS 证书 |
| `TLS_HOSTNAME` | 空 | 指定 TLS 证书绑定的主机名或 IP |
| `ENABLE_ARIA2` | `false` | 设为 `true` 时在容器内启动内置 aria2 RPC 服务 |
| `DEBUG_MODE` | `false` | 设为 `true` 时以 Sanic debug 模式启动，会输出更多日志 |

**关于 `PUID` / `PGID`**：在 NAS 等多用户环境中，建议将其设置为拥有媒体目录读写权限的用户 UID/GID，避免权限问题。

**关于 `AUTO_TLS`**：该选项使用 [mkcert](https://github.com/FiloSottile/mkcert) 自动生成本地信任证书，CA 根证书存储于 `/workspace/mkcert`。适合局域网 HTTPS 场景，不适用于公网部署。

**关于 `ENABLE_ARIA2`**：内置 aria2 监听 RPC 端口 `6800`（仅容器内部），DHT 与监听端口为 `6888`（需对外映射）。如使用外部 aria2 或其他下载器，无需开启此选项。

## 端口说明

| 端口 | 协议 | 用途 |
| --- | --- | --- |
| `8000` | TCP | Kaloscope Web 服务 |
| `6888` | TCP/UDP | 内置 aria2 DHT 与 BT 监听端口（仅 `ENABLE_ARIA2=true` 时需要） |

## 首次启动

容器启动成功后，访问 `http://<宿主机IP>:8000`，首次进入时需要创建管理员账号。

完成账号创建后，建议继续完成以下初始配置：

1. 在**设置 → 下载器**中添加并配置下载器
2. 在**设置 → 工作流**中导入或创建索引器工作流
3. 在**设置 → 媒体库**中添加媒体库根目录
