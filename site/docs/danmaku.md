# 弹幕设置

弹幕设置只在视频播放器中生效，用来控制弹幕显示效果、匹配方式和本地缓存等功能。

- 开启或关闭弹幕显示
- 屏蔽滚动、顶部、底部或彩色弹幕
- 调整显示区域、弹幕速度、不透明度与字号
- 支持自动匹配弹幕元数据或手动搜索确认剧集

![danmaku-settings](/screenshots/danmaku-settings.png)

## 自动匹配

当媒体库中设置了兼容[`弹弹play API`](https://api.dandanplay.net/swagger)格式的弹幕服务器地址后，播放器会在播放视频时尝试自动匹配弹幕元数据。

- 本地媒体会优先尝试自动匹配弹幕元数据
- 自动匹配不理想时，可以手动搜索并确认目标剧集
- 匹配成功后，弹幕会缓存到本地，后续播放可直接复用

![danmaku-match](/screenshots/danmaku-match.png)

## 弹幕服务器

你可以选择自己搭建弹幕服务器，也可以直接使用 Kaloscope 提供的[`弹弹play API`](https://api.dandanplay.net/swagger)代理接口，填入后即可用于弹幕匹配、搜索和加载：

```
https://danmaku.kaloscope.org
```

![new-medialib](/screenshots/new-medialib.png)
