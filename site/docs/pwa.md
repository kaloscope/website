# 渐进式 Web 应用（PWA）

渐进式 Web 应用（Progressive Web App，PWA）是一种可安装到设备的 Web 应用形态。安装后，Kaloscope 会以独立窗口运行，拥有单独的图标和任务栏入口，体验更接近原生应用。

<img src="/screenshots/pwa-desktop.png" alt="pwa-desktop" width="1382" height="849">

## HTTPS 要求

浏览器通常要求 PWA 在 HTTPS 下才能安装。如果你已经为 Kaloscope 配置了有效的 TLS 证书（通过反向代理或其他方式），则可以直接跳到“[安装 PWA](#安装-pwa)”部分。

如果暂时不想自己部署 HTTPS，可以使用 Docker 镜像内置的自签名证书方案（见下文）。

::: tip iOS 用户
iOS Safari 的`添加到主屏幕`功能无需 HTTPS 即可使用，也会有独立图标和全屏体验，只是不会启用 Service Worker 等 PWA 特性，因此 iOS 用户也可以选择直接安装而不配置 HTTPS。
:::

## 使用自签名证书

Docker 镜像内置了 [mkcert](https://github.com/FiloSottile/mkcert)，可通过以下环境变量启用自签名 TLS：

| 变量                         | 说明                                                 |
| ---------------------------- | ---------------------------------------------------- |
| `AUTO_TLS=true`              | 启用自签名证书，服务启动时自动生成证书并启用 HTTPS   |
| `TLS_HOSTNAME=<主机名或 IP>` | 指定 TLS 证书绑定的主机名或 IP，客户端通过该地址访问 |

启用后，Kaloscope 会以 HTTPS 模式运行，mkcert 生成的根 CA 证书会保存在容器内的`/workspace/mkcert`目录，也就是宿主机挂载目录中的`mkcert`子目录。

自签名证书默认不受设备信任。安装 PWA 前，你需要先把根 CA 证书安装到每台访问 Kaloscope 的设备上。

## 安装根 CA 证书

先从宿主机挂载的`/workspace/mkcert`目录中取出根 CA 证书文件（通常为`rootCA.pem`），再按设备类型安装：

- **移动端**：不同品牌的手机步骤略有差异，通常需要在系统设置的安全或证书管理中导入`rootCA.pem`，可通过搜索引擎搜索“手机型号 + 安装证书”来获取具体步骤（例如 [https://support.google.com/pixelphone/answer/2844832](https://support.google.com/pixelphone/answer/2844832)）
- **桌面端**：
  - **方式一**：在目标机器上安装 mkcert，将`rootCA.pem`放入指定目录并设置`$CAROOT`，然后运行`mkcert -install`（详见 mkcert [其他系统安装说明](https://github.com/FiloSottile/mkcert#installing-the-ca-on-other-systems)）
  - **方式二**：不安装 mkcert，直接将`rootCA.pem`导入到操作系统或浏览器的受信任根证书列表中（可参考阿里云数字证书管理服务文档中的“[安装根证书](https://www.alibabacloud.com/help/ssl-certificate/download-a-root-certificate-and-an-intermediate-certificate#089448fd6abr1)”部分）

安装完成后，重启浏览器，再次访问 Kaloscope 时证书应显示为可信。

## 安装 PWA

确认 Kaloscope 已可通过 HTTPS 正常访问后，即可在浏览器中安装 PWA：

- **移动端**：通常可通过浏览器菜单中的`添加到主屏幕`入口完成安装
- **桌面端**：通常可通过地址栏右侧或浏览器菜单中的`安装应用`入口完成安装

不同浏览器和操作系统的安装入口略有差异，详细步骤可参考 web.dev 的 [PWA 安装指南](https://web.dev/learn/pwa/installation)。

安装后，Kaloscope 会出现在系统应用列表或主屏幕中，可直接从图标启动并以独立窗口运行，获得更流畅的全屏体验。
