# 常见问题

<details class="faq-item">
<summary>1. 如何升级到新版本</summary>

<br>

正常升级只需保留原来的`/workspace`挂载目录，容器重建不会影响其中的数据。升级前仍建议先备份`/workspace`，尤其是`/workspace/database`下的数据库文件，方便在异常情况下回滚。

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

使用 [Watchtower](https://containrrr.dev/watchtower/) 实现镜像自动更新，无需手动操作。在`docker-compose.yml`中添加以下服务：

```yaml
services:
  watchtower:
    image: containrrr/watchtower:latest
    container_name: watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - TZ=Asia/Shanghai
      - WATCHTOWER_CLEANUP=true # 更新后删除旧镜像
      - WATCHTOWER_POLL_INTERVAL=86400 # 检查间隔（秒）
      - WATCHTOWER_LABEL_ENABLE=true # 仅更新带有启用标签的容器
      - DOCKER_API_VERSION=1.44 # 可选：指定 Docker API 版本
    restart: unless-stopped
```

然后在 kaloscope 服务上添加 label 标记需要自动更新：

```yaml
kaloscope:
  labels:
    - com.centurylinklabs.watchtower.enable=true
```

完成后执行`docker compose up -d`即可。按照当前配置，Watchtower 会每 24 小时检查一次新版本，发现更新后会自动拉取并重启容器。

> 如果不希望自动更新而只想接收通知，可将`WATCHTOWER_LABEL_ENABLE`替换为`WATCHTOWER_MONITOR_ONLY=true`，并配置邮件或 Webhook 通知。

</details>

<details class="faq-item">
<summary>2. 第三方工作流是否安全</summary>

<br>

不一定。工作流可包含任意 HTTP 请求和 Python 脚本，导入前请自行审查其行为。

</details>

<details class="faq-item">
<summary>3. 和 Jellyfin / Emby 有什么区别</summary>

<br>

Jellyfin 等工具专注于媒体播放与流媒体分发。Kaloscope 的差异化在于通过可编辑工作流接入任意资源站，自动完成搜索、下载、整理全流程。两者定位不同，可搭配使用。

</details>

<details class="faq-item">
<summary>4. 连接宿主机下载器时，下载路径不一致</summary>

<br>

::: v-pre
当 Kaloscope 以容器方式运行，而下载器部署在宿主机时，两边看到的下载目录路径可能不同，从而导致下载失败。例如容器`/downloads`对应宿主机`/data/downloads`。

该问题可以通过固定下载路径来解决。以 qBittorrent 为例，配置文件中有两处`savepath`，分别对应磁力链接和种子文件的下载路径：

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

将这两处配置中的`{{dir}}`替换为**宿主机中的绝对路径**，下载器就能直接使用宿主机路径进行下载。
:::

</details>

<details class="faq-item">
<summary>5. 部署后无法通过 http://&lt;宿主机IP&gt;:8000 访问</summary>

<br>

如果确认容器已经正常启动，但访问`http://<宿主机IP>:8000`无法打开页面，可以检查是否开启了`AUTO_TLS=true`。开启该选项后，服务会使用 HTTPS，此时需要通过`https://<宿主机IP>:8000`访问。

> 如果没有 PWA 安装需求，一般不需要开启`AUTO_TLS`。

</details>

<details class="faq-item">
<summary>6. 流程模板处导入数据源失败怎么办</summary>

<br>

流程模板的数据源托管在 GitHub，直连不稳定时可能会请求失败。可以先重试几次，通常可以成功；如果配置了代理，建议在「网络设置」页面将`https://*github.com`绑定到代理，这样会更稳定。

如果仍然无法成功，也可以通过下载模板仓库源码来手动导入。可前往模板仓库的 GitHub 页面，例如 [kaloscope/workflows](https://github.com/kaloscope/workflows)，点击「Code」->「Download ZIP」下载源码压缩包。下载完成后，在「流程定义」页面点击右上角导入按钮，选择该 ZIP 文件即可导入。

</details>

<details class="faq-item">
<summary>7. 关闭启动扫描后，新增文件还会入库吗</summary>

<br>

会。「启动时全量扫描」只控制重启时是否扫描全部文件，不关闭运行期间的实时监控。创建媒体库时也始终会扫描一次。服务停止期间增删媒体文件或修改 NFO、OPF、ComicInfo 后，需要下次启动扫描或[手动扫描](./medialibs/#扫描与实时监控)才能补齐。

管理员可以在媒体库管理页执行扫描，也可以点击媒体库侧栏名称右侧的扫描按钮。扫描完成后，后台刮削与整理可能还在继续。

</details>

<details class="faq-item">
<summary>8. 设置重命名模板后，为什么文件没有变化</summary>

<br>

保存模板不会立即整理全部旧文件。自动整理由入库和元数据处理触发；已有条目可重新刮削，或更新对应的 NFO、OPF 或 ComicInfo 后等待处理。扫描不会强制重处理未变化的元数据。

如果仍未整理，检查所需 NFO 字段是否齐全、目标路径是否冲突，以及是否属于暂不支持自动整理的多分段电影。具体规则和示例见[自动整理](./medialibs/organization)。

</details>

<details class="faq-item">
<summary>9. 如何查看扫描、整理或播放失败的原因</summary>

<br>

管理员可进入**设置 → 系统监控 → 系统日志**查看实时日志，按日志级别筛选，或点击「跟随」定位到最新记录。定位扫描、自动整理、下载转移和转码失败时，可结合媒体路径与报错时间查找原因。

如果涉及工作流刮削或定时任务，还应查看对应工作流的执行日志；转码任务状态可在[系统监控 → 转码任务](./medialibs/transcode#转码任务)中查看。

</details>

<details class="faq-item">
<summary>10. 没有配置 AI，还能正常使用吗</summary>

<br>

可以。AI 是可选功能，原有工作流、搜索、下载、播放和阅读不依赖模型服务。需要启用时，管理员在[模型提供商](./ai/)中添加连接，再选择模型打开助手或配置 AI 节点。外部 MCP 客户端使用独立访问令牌，无需配置内置模型。

</details>

<details class="faq-item">
<summary>11. 测试连接成功，为什么助手或 AI 节点仍报错</summary>

<br>

「测试连接」检查的是模型列表接口。实际调用还取决于模型 ID、调用权限和接口能力：助手需要工具调用，开启原生 JSON 结构约束需要模型服务支持对应参数。当前调用使用 OpenAI 兼容 Chat Completions 接口，仅提供其他原生协议的地址不能直接调用。

Docker 中的 `127.0.0.1` 指向容器自身；连接宿主机的 Ollama 或 LM Studio 时，请使用容器可访问的地址。配置与排错见[模型提供商](./ai/)。

</details>

<details class="faq-item">
<summary>12. 小说或漫画没有出现，或提示内容未就绪</summary>

<br>

先核对[目录要求](./medialibs/reading#支持格式与目录)：小说每个作品目录只能有一个 TXT 或 EPUB；漫画每个阅读单元应使用图片或单个 CBZ/ZIP，不能把正文直接堆在媒体库根目录。新文件需要在稳定后建立索引，请等待后台处理；仍有问题时手动扫描并查看系统日志。

小说使用 OPF，漫画使用 ComicInfo，影视库的 NFO 规则不适用于阅读元数据。文件内容变更后，旧阅读位置可能失效，阅读器会提示并从可用章节继续。

</details>
