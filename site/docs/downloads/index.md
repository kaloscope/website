# 下载管理

下载管理负责将搜索结果交给下载器执行，也负责创建、查看、控制已有任务，并在任务完成后按需转移文件入库。

- 通过预设的简单模式或 YAML 配置下载器名称、接口和认证信息
- 在下载页手动添加`磁力链接`、`Info Hash`、`HTTP(S) 种子链接`，或上传`.torrent`文件
- 在下载页查看任务状态，并执行暂停、继续、删除等操作
- 任务完成后可按硬链接、软链接、移动或复制方式转移到媒体库
- 与下载计划联动，把搜索结果自动提交到指定的下载器

<img src="/screenshots/download-task.png" alt="download-task" width="1382" height="849">

## 创建下载器

在**下载器管理**页面点击「新增」，选择预设后可在简单模式中填写地址、认证信息等配置，也可切换到 YAML 模式编辑。自定义下载器使用 YAML 配置。

| 字段 | 必填 | 说明                                                     |
| ---- | ---- | -------------------------------------------------------- |
| 预设 |      | 从内置预设中选择下载器类型，选中后自动填充配置模板       |
| 配置 | ✓    | 下载器配置，支持预设的简单模式或 YAML 模式（见下方说明） |

常用配置字段说明：

| 配置键          | 说明                                                         |
| --------------- | ------------------------------------------------------------ |
| `name`          | 下载器的显示名称，全局唯一                                   |
| `protocol`      | 接口协议，`http`或`https`                                    |
| `host`          | 下载器服务的主机地址                                         |
| `port`          | 下载器服务的端口号                                           |
| `path`          | 接口的路径前缀                                               |
| `auth.secret`   | 认证密钥（如不需要认证则留空）                               |
| `auth.username` | 认证用户名（如不需要认证则留空）                             |
| `auth.password` | 认证密码（如不需要认证则留空）                               |
| `auth.token`    | OpenList 的管理员 API Token                                  |
| `tool`          | OpenList 使用的离线下载工具                                  |
| `remote_root`   | OpenList 中用于离线下载的远端目录                            |
| `unix_socket`   | NAS 迅雷的 Unix Socket 文件路径，Docker 部署时填写容器内路径 |

## 支持的下载器

| 下载器                                                                                       | 接口方式              | 默认地址                                 |
| -------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------- |
| [aria2](https://aria2.github.io/manual/en/html/aria2c.html#rpc-interface)                    | JSON-RPC              | `http://127.0.0.1:6800/jsonrpc`          |
| [qBittorrent](<https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)>) | WebUI API             | `http://127.0.0.1:8080/api/v2`           |
| [Transmission](https://github.com/transmission/transmission/blob/4.0.6/docs/rpc-spec.md)     | RPC                   | `http://127.0.0.1:9091/transmission/rpc` |
| [OpenList](https://github.com/OpenListTeam/OpenList)                                         | 离线下载 API          | `http://127.0.0.1:5244/api`              |
| [NAS 迅雷](https://nas.xunlei.com/)                                                          | HTTP over Unix Socket | `http://127.0.0.1:80`（需配置 Socket）   |

::: tip 服务地址
Docker 部署时，宿主机上的下载服务可以通过`http://host.docker.internal:<端口>`访问，同一个 Docker 网络内的下载服务可以通过`http://<容器名称>:<端口>`访问。
:::

::: tip OpenList 接入注意事项
使用 OpenList 时，需先配置好网盘存储及离线下载工具，再在 Kaloscope 中填写管理员 API Token、远端目录并选择可用工具。远端目录是 OpenList 中的可写路径，下载完成后文件会拉取到任务的本地保存目录；支持的链接类型取决于所选工具。
:::

::: tip NAS 迅雷接入注意事项

以下以群晖 DSM 7 和 Docker 部署的 Kaloscope 为例，迅雷套件需已启动并登录账号。

**Socket 路径与挂载**

确认宿主机存在`/var/packages/pan-xunlei-com/target/var/pan-xunlei-com.sock`，在 Kaloscope 服务中追加以下挂载，下载目录按实际情况替换：

```yaml
volumes:
  - /var/packages/pan-xunlei-com/target/var:/run/xunlei:ro
  - /volume1/kaloscope/downloads:/volume1/kaloscope/downloads
```

「Xunlei」预设的 Unix Socket 填写容器内路径`/run/xunlei/pan-xunlei-com.sock`，服务地址和端口保留`http://127.0.0.1`与`80`。任务保存路径填写 NAS 上的绝对路径，并与容器内挂载路径保持一致。

**Socket 访问权限**

确保 Kaloscope 能连接 Socket 并访问其父目录。以`PUID=1026`、`PGID=100`为例，在 NAS 上由`root`执行以下脚本，`100`替换为实际的`PGID`：

```sh
xunlei_socket=/var/packages/pan-xunlei-com/target/var/pan-xunlei-com.sock

if [ -S "$xunlei_socket" ] &&
   [ "$(/usr/bin/stat -c '%g:%a' "$xunlei_socket")" != "100:660" ]; then
    /usr/bin/chgrp 100 "$xunlei_socket" &&
    /usr/bin/chmod 660 "$xunlei_socket"
fi
```

迅雷重启或升级后可能重建 Socket，需重新授权。可将上述脚本加入 DSM「控制面板 → 任务计划」，由`root`定期执行；Kaloscope 仍可使用`1026:100`运行。

**下载目录权限**

在 File Station「属性 → 权限」中，给系统内部用户`pan-xunlei-com`和 Kaloscope 的运行用户或用户组授予下载目录读写权限。确保父目录可访问、已有子目录已授权，并让新建内容继承权限。

任务创建后立即报「开始任务(9000)」时，先检查目标目录是否可写。修复权限后，在 Kaloscope 中删除失败任务并重新添加。

:::

## 手动添加

在**正在下载**页面点击右上角「新增下载任务」，填写以下字段：

| 字段           | 必填 | 说明                                                                     |
| -------------- | ---- | ------------------------------------------------------------------------ |
| 下载器         | ✓    | 选择执行本次下载任务的下载器                                             |
| 保存到         | ✓    | 下载文件的保存路径                                                       |
| URI / 种子文件 | ✓    | 粘贴`磁力链接`、`Info Hash`或`HTTP(S) 种子链接`，或上传`.torrent`文件    |
| 立即开始       |      | 勾选后任务提交时立即开始下载，取消勾选则以暂停状态加入队列               |
| 完成后转移     |      | 下载完成后将文件转移到指定媒体库，见[完成后转移](./plans#完成后转移)文档 |

::: tip 下载链接识别
打开新增下载任务弹窗时，浏览器会尝试读取剪贴板中的下载链接；如果链接可识别，会自动填入 URI 输入框。
:::

## 自动下载

除手动添加任务外，Kaloscope 还支持通过下载计划定时执行搜索工作流，并把结果自动送入下载器。下载计划的配置方式与列表管理，见[下载计划](./plans)文档。
