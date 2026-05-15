# 本地部署

推荐使用 Docker 部署，镜像已发布至 [Docker Hub](https://hub.docker.com/r/kaloscope/kaloscope) 和 [GitHub Container Registry](https://github.com/kaloscope/kaloscope/pkgs/container/kaloscope)。

## Docker CLI

通过命令行直接拉取并运行单个 Kaloscope 容器的示例：

```bash
docker run -d \
  --name kaloscope \
  --add-host=host.docker.internal:host-gateway \
  -e PUID=1026 \
  -e PGID=100 \
  -e UMASK=022 \
  -e TZ=Asia/Shanghai \
  -e AUTO_TLS=true \
  -e TLS_HOSTNAME=192.168.31.2 \
  -e ENABLE_ARIA2=true \
  -v /volume1/kaloscope/workspace:/workspace \
  -v /volume1/kaloscope/downloads:/downloads \
  -v /volume1/kaloscope/animes:/animes \
  -p 8000:8000 \
  -p 6888:6888 \
  -p 6888:6888/udp \
  --restart unless-stopped \
  kaloscope/kaloscope:latest
```

## Docker Compose

通过创建 `docker-compose.yml` 文件，同时部署 Kaloscope 与 qBittorrent 的示例：

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
      - AUTO_TLS=true
      - TLS_HOSTNAME=192.168.31.2
      - ENABLE_ARIA2=true
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
```

## 环境变量

容器支持通过以下环境变量进行配置：

| 变量名         | 默认值  | 说明                                                                                                        |
| -------------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| `PUID`         | `0`     | 进程运行 UID，NAS 环境建议设为媒体目录所有者                                                                |
| `PGID`         | `0`     | 进程运行 GID，NAS 环境建议设为媒体目录所属用户组                                                            |
| `UMASK`        | `022`   | 文件创建掩码，影响容器内新建文件的默认权限                                                                  |
| `TZ`           | 无      | 容器时区，如 `Asia/Shanghai`、`UTC` 等                                                                      |
| `AUTO_TLS`     | `false` | 使用 [mkcert](https://github.com/FiloSottile/mkcert) 自动签发本地 TLS 证书，适合需要局域网 HTTPS 访问的用户 |
| `TLS_HOSTNAME` | 无      | 指定 TLS 证书绑定的主机名或 IP，`AUTO_TLS=true` 时生效                                                      |
| `ENABLE_ARIA2` | `false` | 在容器内启动内置的 aria2 服务，适合不想单独部署下载器的用户                                                 |
| `DEBUG_MODE`   | `false` | 以 DEBUG 模式启动，会输出更多日志，普通用户不需要开启                                                       |

## 端口映射

容器需要映射以下端口以提供服务：

| 端口   | 协议    | 说明                                                               |
| ------ | ------- | ------------------------------------------------------------------ |
| `8000` | TCP     | Kaloscope Web UI 访问端口                                          |
| `6888` | TCP/UDP | 内置 aria2 DHT 与 BT 监听端口（仅 `ENABLE_ARIA2=true` 时需要映射） |

## 数据卷

Dockerfile 唯一声明的持久化目录是 `/workspace`，**必须挂载**，以保证容器重启后数据不丢失。该目录结构如下：

| 容器内路径                | 说明                                                 |
| ------------------------- | ---------------------------------------------------- |
| `/workspace`              | 主数据目录                                           |
| `/workspace/database`     | sqlite 数据库文件目录                                |
| `/workspace/repositories` | 工作流仓库目录                                       |
| `/workspace/images`       | 图片缓存目录                                         |
| `/workspace/mkcert`       | mkcert 根 CA 证书目录（`AUTO_TLS=true` 时自动创建）  |
| `/workspace/aria2`        | aria2 会话文件目录（`ENABLE_ARIA2=true` 时自动创建） |

下载文件目录（如 `/downloads`）和媒体库目录（如 `/animes`）等没有在 Dockerfile 中显式声明，按需挂载即可。

::: tip 硬链接支持
若下载目录与媒体库目录分别映射为两个独立的宿主机路径，跨挂载点的硬链接将无法创建，转移文件时会自动降级为软链接。有硬链接需求的用户，建议将下载目录与媒体库目录统一挂载在同一个宿主机路径下（例如同属 `/volume1/media`），确保二者位于同一文件系统。
:::

::: tip 外部下载器目录映射
使用 qBittorrent 等外部下载器时，需确保下载器容器与 Kaloscope 容器对下载目录的映射路径完全一致。例如两边均挂载同一宿主机路径 `/volume1/downloads` 到容器内的 `/downloads`，否则 Kaloscope 将无法找到下载完成的文件。
:::
