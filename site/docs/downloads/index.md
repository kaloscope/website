# 下载管理

## 支持的下载器

| 下载器                                      | 接口方式  | 默认地址                                 |
| ------------------------------------------- | --------- | ---------------------------------------- |
| [aria2](https://aria2.github.io/)           | JSON-RPC  | `http://127.0.0.1:6800/jsonrpc`          |
| [qBittorrent](https://www.qbittorrent.org/) | WebUI API | `http://127.0.0.1:8080/api/v2`           |
| [Transmission](https://transmissionbt.com/) | RPC       | `http://127.0.0.1:9091/transmission/rpc` |

## 配置下载器

在**设置 → 下载器**中添加连接：选择类型、填写地址和认证信息、点击「测试连接」验证、保存后设为默认。

> Docker 部署时，宿主机上的服务地址填 `http://host.docker.internal:<端口>`；同一 Compose 中的服务直接使用服务名。

## 手动添加任务

在**下载**页面，支持通过磁力链接（`magnet:?xt=...`）或上传 `.torrent` 文件添加任务，可指定保存目录。

## 自动化下载

除手动添加任务外，Kaloscope 还支持通过下载计划实现自动追更、定时检索和规则过滤。

下载计划的配置方式与列表管理，见[下载计划](/docs/downloads/plans)。

## 任务列表

实时展示所有任务的名称、大小、速度、进度、状态和保存路径，支持暂停、继续、删除等操作。
