# 常见问题

## Kaloscope 适合做什么

适合在 NAS 或家庭媒体服务器上运行，用于本地媒体库管理、自动追更、工作流驱动的资源站搜索与下载自动化。

## 和 Jellyfin / Emby 等工具有什么区别

Jellyfin 等工具专注于媒体播放与流媒体分发，Kaloscope 的差异化在于通过可编辑工作流接入任意资源站，自动完成搜索、下载、整理的全流程。两者定位不同，可以搭配使用。

## 第三方工作流是否安全

不一定。工作流中可以包含任意 HTTP 请求和 Python 脚本，导入社区或第三方工作流前，请自行审查其行为，确认不含恶意代码或未经授权的网络访问。

## Docker 镜像是否内置 aria2

是。设置 `ENABLE_ARIA2=true` 后，容器启动时会同时启动内置 aria2 RPC 服务（监听容器内部 6800 端口），无需额外安装。

## 可以使用外部下载器吗

可以。在**设置 → 下载器**中添加外部 qBittorrent、Transmission 或 aria2 实例的连接信息即可。Docker 部署时，宿主机上的服务地址填写 `host.docker.internal:<端口>`。

## 首次启动后无法访问

检查以下几点：

- 确认容器已正常启动（`docker logs kaloscope`）
- 确认 `8000` 端口已正确映射
- 首次进入需要在页面上创建管理员账号

## 如何升级到新版本

```bash
docker compose pull
docker compose up -d
```

数据库和工作流仓库均存储在 `/workspace` 卷中，升级不会丢失数据。

## TZ 设置不生效

确认在 `environment` 中设置了 `TZ=Asia/Shanghai`（或你所在时区），并重启容器。时区影响日志时间戳和工作流定时触发时间。
