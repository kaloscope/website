# 常见问题

<details class="faq-item">
<summary>1. 如何升级到新版本</summary>

<br>

只要保留好原来的 `/workspace` 挂载目录，重建容器后配置与数据都会完好保留。升级前仍建议备份一下 `/workspace`，尤其是 `/workspace/database` 下的数据库文件，方便异常时回滚。

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

不想每次手动拉镜像时，可以用 [Watchtower](https://containrrr.dev/watchtower/) 自动检查并更新容器。在 `docker-compose.yml` 里加入下面的服务：

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

然后在 kaloscope 服务上加上对应的 label：

```yaml
kaloscope:
  labels:
    - com.centurylinklabs.watchtower.enable=true
```

改完执行 `docker compose up -d` 即可。按上面的配置，Watchtower 会每 24 小时检查一次新版本，发现更新就自动拉取并重启容器。

> 如果只想接收更新通知而不想自动重启容器，可以把 `WATCHTOWER_LABEL_ENABLE` 换成 `WATCHTOWER_MONITOR_ONLY=true`，再配上邮件或 Webhook 通知。

</details>

<details class="faq-item">
<summary>2. 第三方工作流是否安全</summary>

<br>

不一定。工作流里可以包含任意 HTTP 请求和脚本代码，导入前请先自行查看并确认它的行为。

</details>

<details class="faq-item">
<summary>3. 和 Jellyfin / Emby 有什么区别</summary>

<br>

Jellyfin 和 Emby 更专注于成熟的媒体播放和流媒体分发；Kaloscope 的重点则是用可编辑的工作流接入各类资源站，把搜索、下载、刮削入库这一整套流程串起来，同时提供在线播放与阅读。两者并不冲突，完全可以搭配使用——比如用 Kaloscope 负责找资源、下载和整理入库，再把媒体库目录直接接给 Jellyfin 或 Emby 播放。

</details>

<details class="faq-item">
<summary>4. 连接宿主机下载器时，下载路径不一致</summary>

<br>

::: v-pre
当 Kaloscope 跑在容器里而下载器装在宿主机上时，两边看到的下载目录路径可能对不上（例如容器里的 `/downloads` 对应宿主机 `/data/downloads`），直接下发路径就会导致下载失败。

最直接的办法是在下载器配置里把保存路径固定下来。以 qBittorrent 为例，YAML 配置里有两处 `savepath`，分别对应磁力链接和种子文件的下载路径：

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

把这两处配置里的 `{{dir}}` 直接替换成**宿主机上的绝对路径**，下载器就能按宿主机路径正常下载了。
:::

</details>

<details class="faq-item">
<summary>5. 部署后无法通过 http://&lt;宿主机IP&gt;:8000 访问</summary>

<br>

确认容器已经正常启动但打不开 `http://<宿主机IP>:8000` 时，检查一下是不是开启了 `AUTO_TLS=true`。开启该选项后服务会切到 HTTPS 模式，需要改用 `https://<宿主机IP>:8000` 访问。

> 如果没有安装 PWA 的需求，一般没必要开启 `AUTO_TLS`。

</details>

<details class="faq-item">
<summary>6. 流程模板处导入数据源失败怎么办</summary>

<br>

流程模板仓库托管在 GitHub 上，直连不稳定时很容易请求失败。可以先重试几次，通常都能拉下来；如果配了代理，建议去「网络设置」把 `https://*github.com` 绑到代理上，会稳得多。

实在拉不下来时，也可以手动下载压缩包导入：打开模板仓库的 GitHub 页面（比如 [kaloscope/workflows](https://github.com/kaloscope/workflows)），点「Code」→「Download ZIP」下载源码包，再到 Kaloscope 的「流程定义」页点右上角导入按钮，选择这个 ZIP 文件即可。

</details>

<details class="faq-item">
<summary>7. 关闭启动扫描后，新增文件还会入库吗</summary>

<br>

会的。「启动时全量扫描」只控制重启服务时要不要把全部文件扫一遍，不会关掉运行期间的实时监控；创建媒体库时也始终会先扫一次。只有当服务停止期间你手动增删了媒体文件，或者改过 NFO、OPF、ComicInfo 时，才需要等下次启动扫描或[手动扫描](./medialibs/#扫描与实时监控)来补齐。

管理员可以在媒体库管理页点扫描，也能点击媒体库侧栏名称右侧的扫描按钮。扫描结束不代表后台刮削和整理也已经全部跑完。

</details>

<details class="faq-item">
<summary>8. 设置重命名模板后，为什么文件没有变化</summary>

<br>

因为保存模板不会立刻去重命名库里所有的旧文件。自动整理只在入库和元数据更新时触发；想让已有条目按新模板整理，可以对它重新刮削，或者更新对应的 NFO、OPF、ComicInfo 后等后台处理。普通扫描不会强行重处理没变过的元数据。

如果还是没整理，检查这几项：NFO 里的所需字段是不是齐全、目标路径有没有同名文件占用，以及它是不是暂不支持自动整理的多分段电影。具体规则和例子看[自动整理](./medialibs/organization)。

</details>

<details class="faq-item">
<summary>9. 如何查看扫描、整理或播放失败的原因</summary>

<br>

管理员可进入 **设置 → 系统监控 → 系统日志** 查看实时日志，按日志级别筛选，或点「跟随」定位到最新记录。遇到扫描、自动整理、下载转移或转码失败时，结合媒体路径和报错时间一搜通常就能找到原因。

如果问题出在工作流刮削或定时任务上，记得再去看看对应工作流的执行日志；转码任务的状态则可以在 [系统监控 → 转码任务](./medialibs/transcode#转码任务) 里查看。

</details>

<details class="faq-item">
<summary>10. 没有配置 AI，还能正常使用吗</summary>

<br>

完全可以。AI 是可选功能，原有的工作流、搜索、下载、播放和阅读都不依赖模型服务。需要用到时，让管理员在[模型提供商](./ai/)里加好连接，再选模型打开助手或配 AI 节点就行。外部 MCP 客户端使用的是独立访问令牌，不依赖内置模型配置。

</details>

<details class="faq-item">
<summary>11. 测试连接成功，为什么助手或 AI 节点仍报错</summary>

<br>

「测试连接」检查的只是模型列表接口通不通。实际调用还要看模型 ID、权限和接口能力：助手要求模型支持工具调用，AI 节点开启「原生结构约束」需要服务端支持对应参数；另外目前只支持 OpenAI 兼容的 Chat Completions 接口，只提供其他原生协议的地址没法直接调用。

需要注意，Docker 容器里的 `127.0.0.1` 指向的是容器自身；如果要连接宿主机上的 Ollama 或 LM Studio，请换成 `host.docker.internal` 或其他容器能访问到的地址，具体看[模型提供商](./ai/)。

</details>

<details class="faq-item">
<summary>12. 小说或漫画没有出现，或提示内容未就绪</summary>

<br>

先核对一遍[目录要求](./medialibs/reading#支持格式与目录)：小说每个作品目录只能放一个 TXT 或 EPUB；漫画每个阅读单元要用纯图片或单个 CBZ/ZIP，不能把正文直接堆在媒体库根目录下。新拷进去的文件要等写入稳定并建好正文索引才能读，先稍等一会儿；如果还是没有出现，手动扫描一次并查看系统日志。

另外，小说使用 OPF，漫画使用 ComicInfo，影视库的 NFO 规则不适用于阅读元数据。文件内容变动后如果导致原阅读位置失效，阅读器会提示并从当前可用章节的开头继续。

</details>
