# 下载管理

在下载管理里，你可以接入常用的下载器，把搜索结果或手动添加的链接提交给下载器，随时查看、暂停、继续或清理任务；如果指定了目标媒体库，下载完成后还能自动转移入库。

<img src="/screenshots/download-task.png" alt="download-task" width="1382" height="849">

## 创建下载器

在**下载器管理**页面点击「新增」，选好预设后可以直接在简单模式里填地址和认证信息，也能切到 YAML 模式微调；如果用的是预设里没有的下载器，则统一通过 YAML 配置。

| 字段 | 必填 | 说明                                                   |
| ---- | ---- | ------------------------------------------------------ |
| 预设 |      | 内置几款常见下载器的模板，选中后自动填充默认配置       |
| 配置 | ✓    | 下载器配置，支持预设的简单模式或 YAML 模式（见下方说明） |

常用配置字段说明：

| 配置键          | 说明                                                         |
| --------------- | ------------------------------------------------------------ |
| `name`          | 下载器的显示名称，全局唯一                                   |
| `protocol`      | 接口协议，`http` 或 `https`                                  |
| `host`          | 下载器服务的主机地址                                         |
| `port`          | 下载器服务的端口号                                           |
| `path`          | 接口的路径前缀                                               |
| `auth.secret`   | 认证密钥（不需要认证时留空）                                 |
| `auth.username` | 认证用户名（不需要认证时留空）                               |
| `auth.password` | 认证密码（不需要认证时留空）                                 |
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
Docker 部署时，宿主机上的下载服务可通过 `http://host.docker.internal:<端口>` 访问，同一个 Docker 网络里的下载服务直接填 `http://<容器名称>:<端口>` 就行。
:::

::: tip OpenList 接入注意事项
使用 OpenList 前，先在 OpenList 那边配好网盘存储和离线下载工具，再来 Kaloscope 填管理员 API Token、远端目录并选好工具。这里的远端目录指的是 OpenList 里的可写路径，离线下载完成后，文件会被拉取到任务的本地保存目录；能下哪些类型的链接取决于 OpenList 里选用的工具。
:::

::: tip NAS 迅雷接入注意事项

下面以群晖 DSM 7 搭配 Docker 版 Kaloscope 为例，操作前请确保迅雷套件已启动并登录账号。

**Socket 路径与挂载**

先确认宿主机存在 `/var/packages/pan-xunlei-com/target/var/pan-xunlei-com.sock`，然后在 Kaloscope 服务里加上这两条挂载，下载目录按实际情况替换：

```yaml
volumes:
  - /var/packages/pan-xunlei-com/target/var:/run/xunlei:ro
  - /volume1/kaloscope/downloads:/volume1/kaloscope/downloads
```

在「Xunlei」预设里，Unix Socket 填写容器内路径 `/run/xunlei/pan-xunlei-com.sock`，服务地址和端口保留默认的 `http://127.0.0.1` 和 `80` 不动。任务保存路径填 NAS 上的绝对路径，并保证和容器内挂载路径一致。

**Socket 访问权限**

接着要让 Kaloscope 有权限连上这个 Socket 并访问它的父目录。以 `PUID=1026`、`PGID=100` 为例，在 NAS 上由 `root` 执行下面这段脚本，把 `100` 换成你实际的 `PGID`：

```sh
xunlei_socket=/var/packages/pan-xunlei-com/target/var/pan-xunlei-com.sock

if [ -S "$xunlei_socket" ] &&
   [ "$(/usr/bin/stat -c '%g:%a' "$xunlei_socket")" != "100:660" ]; then
    /usr/bin/chgrp 100 "$xunlei_socket" &&
    /usr/bin/chmod 660 "$xunlei_socket"
fi
```

迅雷重启或升级后可能会重建 Socket 文件导致权限重置。可以把上面那段脚本加入 DSM「控制面板 → 任务计划」，由 `root` 定期执行；Kaloscope 依然可以使用 `1026:100` 运行。

**下载目录权限**

在 File Station 的「属性 → 权限」里，同时给系统内部用户 `pan-xunlei-com` 和 Kaloscope 的运行用户或用户组授予下载目录的读写权限，确认父目录可访问、已有子目录已授权，并勾选让新建内容继承权限。

任务新建后如果立刻报「开始任务(9000)」，多半是目标目录没写权限。补好权限后，在 Kaloscope 里删掉失败任务重新添加一次即可。

:::

## 手动添加

在**正在下载**页面点击右上角「新增下载任务」，按说明填写：

| 字段           | 必填 | 说明                                                                       |
| -------------- | ---- | -------------------------------------------------------------------------- |
| 下载器         | ✓    | 选择执行本次任务的下载器                                                   |
| 保存到         | ✓    | 下载文件的保存路径                                                         |
| URI / 种子文件 | ✓    | 粘贴磁力链接、Info Hash 或 HTTP(S) 种子链接，也可以直接上传 `.torrent` 文件 |
| 立即开始       |      | 勾选后提交就立刻开始下；取消勾选则以暂停状态挂在队列里                     |
| 完成后转移     |      | 下载完成后自动把文件转移到指定媒体库，规则见[完成后转移](./plans#完成后转移) |

::: tip 下载链接识别
点开「新增下载任务」弹窗时，浏览器会尝试读取剪贴板里的下载链接；如果格式可识别，会自动帮你填进 URI 输入框。
:::

## 自动下载

如果不想每次都手动搜、手动加，可以配个[下载计划](./plans)，让系统定时跑搜索工作流并把命中的资源自动送进下载器。

## 通过助手管理下载

启用 [AI 助手](../ai/assistant)后，直接在对话里就能让它查任务、搜资源并发起单次下载，或者对已有任务执行暂停、恢复、重试和删除（实际能不能操作取决于对应的下载器和任务状态）。

动手前助手会先列出目标任务和操作预览，确认后再提交；涉及转移到影视库时，记得一并核对目录和文件名预览。删除任务时默认只删记录、保留文件，只有当你明确要求删掉本地文件时，它才会连同文件一起删掉。另外，如果操作结果提示「已排队」，记得等会儿再去页面上确认任务是否已经正常开始。
