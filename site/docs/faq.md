# 常见问题

## 如何升级到新版本

升级前无需备份，持久化数据均存放在挂载的 `/workspace` 目录中，不受容器重建影响。

**Docker CLI**

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

**Docker Compose**

```bash
docker compose pull       # 拉取最新镜像
docker compose up -d      # 重建并启动容器
docker image prune -f     # 可选：清理旧版本镜像释放空间
```

## 第三方工作流是否安全

不一定。工作流可包含任意 HTTP 请求和 Python 脚本，导入前请自行审查其行为。

## 和 Jellyfin / Emby 有什么区别

Jellyfin 等工具专注于媒体播放与流媒体分发。Kaloscope 的差异化在于通过可编辑工作流接入任意资源站，自动完成搜索、下载、整理全流程。两者定位不同，可搭配使用。
