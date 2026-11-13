# 渐进式 Web 应用（PWA）

Kaloscope 支持作为渐进式 Web 应用（PWA）安装到手机或电脑上。装好之后它就像个独立客户端一样，有单独的桌面图标和任务栏入口，用独立窗口打开，少掉浏览器地址栏的干扰。

<img src="/screenshots/pwa-desktop.png" alt="pwa-desktop" width="1382" height="849">

## HTTPS 要求

绝大多数浏览器只允许在 HTTPS 站点下安装 PWA。如果你已经通过反向代理等方式配好了正规证书，直接往下跳到「[安装 PWA](#安装-pwa)」就行。

要是只在局域网用、暂时不想折腾域名和公网证书，Docker 镜像也内置了一套自签名证书方案（见下一节）。

::: tip iOS 用户
iOS Safari 自带的「添加到主屏幕」不需要 HTTPS 也能直接用，同样能得到独立图标和全屏效果，只是少了 Service Worker 等 PWA 特性。所以 iOS 设备也可以跳过 HTTPS 直接添加到主屏幕。
:::

## 使用自签名证书

Docker 镜像自带了 [mkcert](https://github.com/FiloSottile/mkcert)，只要加上这两个环境变量就能一键开启本地 HTTPS：

| 变量                         | 说明                                                 |
| ---------------------------- | ---------------------------------------------------- |
| `AUTO_TLS=true`              | 启用自签名证书，服务启动时自动生成证书并启用 HTTPS   |
| `TLS_HOSTNAME=<主机名或 IP>` | 指定 TLS 证书绑定的主机名或 IP，客户端通过该地址访问 |

开启后，Kaloscope 会自动切到 HTTPS 模式，生成的根 CA 证书保存在容器的 `/workspace/mkcert` 目录里（也就是宿主机挂载出来的 `mkcert` 子目录）。

不过浏览器默认不认识自己签发的证书，想顺利装上 PWA，还得先把这个根证书导入到你要访问 Kaloscope 的每台设备上。

## 安装根 CA 证书

从宿主机挂载目录的 `mkcert` 文件夹里拷出 `rootCA.pem`，按设备类型装进系统信任列表：

- **移动端**：各品牌手机的入口不太一样，通常在系统设置的「安全」或「证书管理」里导入 `rootCA.pem`，搜一下「你的手机型号 + 安装 CA 证书」就能找到对应教程（Android Pixel 可参考 [Google 帮助页面](https://support.google.com/pixelphone/answer/2844832)）
- **桌面端**：
  - **方式一**：在访问端电脑上也装一个 mkcert，把 `rootCA.pem` 放进指定目录并设置 `$CAROOT`，再运行 `mkcert -install`（详见 mkcert [其他系统安装说明](https://github.com/FiloSottile/mkcert#installing-the-ca-on-other-systems)）
  - **方式二**：不装 mkcert，直接把 `rootCA.pem` 导入系统或浏览器的受信任根证书列表（可参考阿里云文档里的「[安装根证书](https://www.alibabacloud.com/help/ssl-certificate/download-a-root-certificate-and-an-intermediate-certificate#089448fd6abr1)」步骤）

导完证书记得重启一下浏览器，重新打开 Kaloscope 页面时地址栏应该就不会再提示不安全了。

## 安装 PWA

确认 HTTPS 访问一切正常后，就能直接把页面装成应用了：

- **移动端**：在浏览器菜单里找到「添加到主屏幕」或「安装应用」
- **桌面端**：点击地址栏右侧的小安装图标，或在浏览器菜单里点「安装应用」

不同浏览器的按钮叫法略有区别，拿不准的话可以参考 web.dev 的 [PWA 安装指南](https://web.dev/learn/pwa/installation)。

装好之后，桌面上或系统应用列表里就会多出 Kaloscope 的图标，直接点开就是独立的全屏窗口。
