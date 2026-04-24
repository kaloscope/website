# 下载与搜索

搜索与下载是 Kaloscope 自动化体验的重要组成部分。

## 资源搜索

README 中说明，索引器能力完全由工作流驱动，因此搜索模块具备较强扩展性：

- 可对接任意资源站点
- 支持关键词搜索
- 支持详情预览
- 支持登录认证等完整交互流程
- 支持全局搜索，同时聚合多个索引器的结果

这意味着搜索模块本身更像一个工作流运行入口，而不是固定写死的站点列表。

## 下载器支持

当前已明确支持以下下载器：

- aria2
- qBittorrent
- Transmission

下载器配置通过 YAML 定义，后端会读取 `backend/static/downloaders` 目录下的预设文件并将其作为适配器配置加载，因此理论上可以扩展更多适配器。

## 当前内置预设

从代码和静态配置文件可以确认，当前内置了三份预设：

- `aria2.yaml`
- `qBittorrent.yaml`
- `Transmission.yaml`

这些 YAML 预设统一描述了：

- 连接协议、主机、端口、路径
- 鉴权方式
- 版本探测接口
- 添加链接、添加种子、列出任务、暂停、继续、删除等方法映射

这套设计的价值是把“下载器协议差异”从业务代码中抽离出来，方便后续继续支持更多客户端。

## 三种下载器的差异

### aria2

- 使用 JSON-RPC 接口
- 默认地址为 `http://127.0.0.1:6800/jsonrpc`
- 通过 `secret` 做令牌认证
- 提供 `addUri`、`addTorrent`、`tellActive`、`tellStatus` 等方法映射

### qBittorrent

- 使用 WebUI API
- 默认地址为 `http://127.0.0.1:8080/api/v2`
- 通过用户名和密码登录
- 通过 `torrents/add`、`torrents/info`、`torrents/start`、`torrents/stop` 等接口工作

### Transmission

- 使用 RPC 接口
- 默认地址为 `http://127.0.0.1:9091/transmission/rpc`
- 支持会话级 CSRF Header
- 通过 `torrent-add`、`torrent-get`、`torrent-start`、`torrent-stop`、`torrent-remove` 等方法工作

## 添加下载任务时系统会做什么

结合后端服务实现，可以确认下载流程大致如下：

1. 读取并解析下载器 YAML 配置。
2. 根据配置创建适配器实例。
3. 对磁力链接或种子文件提取 info hash。
4. 检查 info hash 是否已存在，避免重复任务。
5. 调用对应下载器的 `add_link` 或 `add_torrent` 方法。
6. 记录下载目录、任务状态和传输参数。

## 下载计划

README 中已列出以下能力：

- 按关键词和过滤规则自动抓取资源
- 将资源自动推送给下载器
- 支持手动添加磁力链接或种子文件

## 与 Docker 部署的关系

Dockerfile 中内置了可选的 aria2 运行逻辑，通过 `ENABLE_ARIA2=true` 可以在容器内启动 aria2 RPC 服务。相关端口与会话文件路径已经在镜像中预留。

详情可见 [Docker 部署](/docs/docker)。

## 后续建议补充的内容

如果你准备把这一部分补成完整使用手册，建议优先增加：

- 三种下载器的最小可用 YAML 示例
- 常见连接错误与认证失败排查
- 下载目录与媒体库目录分离建议
- 下载计划中的过滤规则示例

## 待补充

- 搜索结果过滤字段说明
- 下载计划执行顺序与失败重试策略
- 索引器登录态和 Cookie 管理方式
