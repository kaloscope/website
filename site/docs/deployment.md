# 本地部署

推荐使用 Docker 部署，镜像已同时发布在 [Docker Hub](https://hub.docker.com/r/kaloscope/kaloscope) 和 [GitHub Container Registry](https://github.com/kaloscope/kaloscope/pkgs/container/kaloscope)。

## Docker CLI

用 Docker CLI 直接启动单个 Kaloscope 容器：

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
  -v /volume1/kaloscope/anime:/anime \
  -p 8000:8000 \
  -p 6888:6888 \
  -p 6888:6888/udp \
  --restart unless-stopped \
  kaloscope/kaloscope:latest
```

## Docker Compose

下面这份 `docker-compose.yml` 示例可以同时拉起 Kaloscope 和 qBittorrent：

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
      - /volume1/kaloscope/anime:/anime
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

常用环境变量说明：

| 变量名         | 默认值  | 说明                                                                                                 |
| -------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `PUID`         | `0`     | 进程运行 UID，NAS 环境建议设为媒体目录的所有者                                                       |
| `PGID`         | `0`     | 进程运行 GID，NAS 环境建议设为媒体目录所属的用户组                                                   |
| `UMASK`        | `022`   | 文件创建掩码，影响容器内新建文件的默认权限                                                           |
| `TZ`           | 无      | 容器时区，如 `Asia/Shanghai`、`UTC` 等                                                               |
| `AUTO_TLS`     | `false` | 使用 [mkcert](https://github.com/FiloSottile/mkcert) 自动签发本地 TLS 证书，方便在局域网开启 HTTPS   |
| `TLS_HOSTNAME` | 无      | 指定 TLS 证书绑定的主机名或 IP，仅在 `AUTO_TLS=true` 时生效                                          |
| `ENABLE_ARIA2` | `false` | 在容器内同时启动内置的 aria2 服务，省去单独部署下载器的步骤                                          |
| `DEBUG_MODE`   | `false` | 开启调试模式并输出更详细的日志，日常使用无需开启                                                     |

## 端口映射

| 端口   | 协议    | 说明                                                            |
| ------ | ------- | --------------------------------------------------------------- |
| `8000` | TCP     | Kaloscope Web UI 访问端口                                       |
| `6888` | TCP/UDP | aria2 DHT 与 BT 监听端口（仅 `ENABLE_ARIA2=true` 时需要映射） |

## 数据卷

Dockerfile 中声明的持久化目录只有 `/workspace`，**启动时务必挂载**，否则容器重建后配置与数据都会丢失。目录内各子路径用途如下：

| 容器内路径                | 说明                                                  |
| ------------------------- | ----------------------------------------------------- |
| `/workspace`              | 主数据目录                                            |
| `/workspace/database`     | SQLite 数据库目录                                     |
| `/workspace/cache`        | HTTP 缓存数据库目录                                   |
| `/workspace/images`       | 图片缓存目录                                          |
| `/workspace/transcoded`   | 视频转码后的 HLS 文件目录                             |
| `/workspace/repositories` | 工作流仓库目录                                        |
| `/workspace/mkcert`       | mkcert 根 CA 证书目录（`AUTO_TLS=true` 时自动创建）   |
| `/workspace/aria2`        | aria2 会话文件目录（`ENABLE_ARIA2=true` 时自动创建）  |

至于下载目录（如 `/downloads`）和媒体库目录（如 `/anime`），镜像未作固定声明，按自己的实际路径挂载即可。

::: tip 硬链接支持
如果把下载目录和媒体库目录分别挂载到两个独立的宿主机路径，跨挂载点无法创建硬链接，文件转移时只能退回软链接。想用硬链接实现不占双份空间的瞬间转移，建议把它们放在同一个宿主机父目录下（例如都挂在 `/volume1/media` 下），确保处于同一文件系统。
:::

::: tip 外部下载器目录映射
配合 qBittorrent 等外部下载器使用时，下载器容器和 Kaloscope 容器里的下载路径映射必须完全一致（例如两边都将宿主机的 `/volume1/downloads` 映射到容器内的 `/downloads`），否则 Kaloscope 会找不到下载完成的文件。
:::
