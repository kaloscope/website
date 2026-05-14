# 快速开始

## 第一步：部署

推荐使用 [Docker Compose](/docs/deployment#docker-compose推荐) 部署，也可以选择 [Docker CLI](/docs/deployment#docker-cli)。如需从源码运行，参见[开发指南](/docs/development)。

## 第二步：访问页面

部署完成后，访问 `http://<宿主机IP>:8000`。首次访问会自动跳转到管理员账号创建页面，填写用户名与密码后即可登录。

## 下一步

登录后，建议按顺序完成以下初始配置：

- [添加下载器](/docs/settings#下载器)：连接 aria2、qBittorrent 或 Transmission
- [配置工作流](/docs/workflows)：导入工作流仓库，配置索引器与刮削逻辑
- [创建媒体库](/docs/medialibs)：指定媒体文件的根目录，开始扫描入库
