# 常见问题

## 如何升级到新版本

升级前无需备份，持久化数据均存放在挂载的 `/workspace` 目录中，不受容器重建影响。

**Docker CLI 手动升级**

```bash
# 拉取最新镜像
docker pull kaloscope/kaloscope:latest

# 停止并删除旧容器
docker stop kaloscope
docker rm kaloscope

# 用原来的启动参数重新创建容器
docker run -d \
  --name kaloscope \
  ...

# 可选：清理旧版本镜像释放空间
docker image prune -f
```

**Docker Compose 手动升级**

```bash
docker compose pull       # 拉取最新镜像
docker compose up -d      # 重建并启动容器
docker image prune -f     # 可选：清理旧版本镜像释放空间
```

**Watchtower 自动更新**

使用 [Watchtower](https://containrrr.dev/watchtower/) 实现镜像自动更新，无需手动操作。在 `docker-compose.yml` 中添加以下服务：

```yaml
services:
  watchtower:
    image: containrrr/watchtower:latest
    container_name: watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - TZ=Asia/Shanghai
      - WATCHTOWER_CLEANUP=true           # 更新后删除旧镜像
      - WATCHTOWER_POLL_INTERVAL=86400    # 检查间隔（秒）
      - WATCHTOWER_LABEL_ENABLE=true      # 仅更新带有启用标签的容器
      - DOCKER_API_VERSION=1.44           # 可选：指定 Docker API 版本
    restart: unless-stopped
```

然后在 kaloscope 服务上添加 label 标记需要自动更新：

```yaml
kaloscope:
  labels:
    - com.centurylinklabs.watchtower.enable=true
```

完成后执行 `docker compose up -d` 即可。按照当前配置，Watchtower 会每 24 小时检查一次新版本，发现更新后会自动拉取并重启容器。

> 如果不希望自动更新而只想接收通知，可将 `WATCHTOWER_LABEL_ENABLE` 替换为 `WATCHTOWER_MONITOR_ONLY=true`，并配置邮件或 Webhook 通知。

## 第三方工作流是否安全

不一定。工作流可包含任意 HTTP 请求和 Python 脚本，导入前请自行审查其行为。

## 和 Jellyfin / Emby 有什么区别

Jellyfin 等工具专注于媒体播放与流媒体分发。Kaloscope 的差异化在于通过可编辑工作流接入任意资源站，自动完成搜索、下载、整理全流程。两者定位不同，可搭配使用。

## 连接宿主机下载器时，容器内下载路径和宿主机路径不一致

::: v-pre
当 Kaloscope 以容器方式运行，而下载器部署在宿主机时，两边看到的下载目录路径可能不同，从而导致下载失败。例如容器内 `/downloads` 对应宿主机 `/data/downloads`。

该问题可以通过固定下载路径来解决。以 qBittorrent 为例，配置文件中有两处 `savepath` ，分别对应磁力链接和种子文件的下载路径：

```yaml
methods:
  add_link:
    form:
      savepath: '{{dir}}' # 改为宿主机路径，如 /data/downloads
      urls: '{{link}}'
  add_torrent:
    form:
      savepath: '{{dir}}' # 同样改为宿主机路径
      torrents: '{{torrent}}'
```

将这两处配置中的 `{{dir}}` 替换为**宿主机中的绝对路径**，下载器就能直接使用宿主机路径进行下载。
:::
