# 快速开始

## 第一步：部署服务

参考[部署指南](/docs/deployment)完成本地部署，推荐使用 [Docker Compose](/docs/deployment#docker-compose) 方式同时部署 Kaloscope 与下载器。

## 第二步：访问页面

部署完成后，可通过浏览器访问 `http://<宿主机IP>:8000`（若启用 TLS 则改为 `https`）打开 Kaloscope 界面。首次访问时会跳转到管理员账号创建页面，注册完成后即可登录。

## 第三步：初始配置

登录成功后，建议按顺序完成以下配置：

- [添加下载器](/docs/downloads)：连接 aria2、qBittorrent 或 Transmission
- [配置工作流](/docs/workflows)：导入工作流仓库，配置索引器与刮削逻辑
- [创建媒体库](/docs/medialibs)：指定媒体文件的根目录，开始扫描入库
