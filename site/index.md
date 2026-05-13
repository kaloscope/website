---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: Kaloscope
  text: 可视化工作流驱动的媒体库管理工具
  tagline: 自由编排搜索、刮削与下载逻辑，打造完全可控的本地媒体库。
  image:
    src: /logo.svg
    alt: Kaloscope
  actions:
    - theme: brand
      text: 立即部署
      link: https://hub.docker.com/r/kaloscope/kaloscope
    - theme: alt
      text: 查看文档
      link: /docs/

features:
  - title: 工作流驱动
    details: 拖拽编排 HTTP 请求、脚本等节点，灵活对接任意资源站与元数据来源，流程可编辑、可复用。
  - title: 媒体库管理
    details: 自动扫描媒体文件、解析 NFO 元数据，内置在线播放器，支持下载计划与自动追番。
  - title: 本地优先
    details: Docker 一键部署，多用户权限隔离，支持 PWA 安装，适合 NAS 和家庭媒体服务器。
---
