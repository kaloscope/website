---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: Kaloscope
  text: AI 与可视化工作流驱动的媒体库管理工具
  tagline: 用自然语言编排搜索、刮削与下载，在画布上掌控流程，管理影视、小说与漫画。
  image:
    src: /logo.svg
    alt: Kaloscope
  actions:
    - theme: brand
      text: 立即部署
      link: https://hub.docker.com/r/kaloscope/kaloscope
    - theme: alt
      text: 快速开始
      link: /docs/getting-started

features:
  - icon:
      dark: /fluent--document-flowchart-dark.svg
      light: /fluent--document-flowchart-light.svg
    title: AI 与工作流
    details: 通过助手或拖拽节点编排流程，实时检查画布修改；支持 AI 节点与 MCP 外部接入，发布由你决定。
  - icon:
      dark: /fluent--video-clip-multiple-dark.svg
      light: /fluent--video-clip-multiple-light.svg
    title: 媒体库管理
    details: 管理电影、电视剧、小说和漫画，刮削元数据并按模板整理，支持在线播放、在线阅读、进度续接与自动追更。
  - icon:
      dark: /fluent--desktop-arrow-down-dark.svg
      light: /fluent--desktop-arrow-down-light.svg
    title: 本地优先
    details: Docker 一键部署，多用户权限隔离，支持 PWA 安装，适合 NAS 和家庭媒体服务器。
---

<script setup>
import { onMounted } from 'vue'
import { data as release } from './.vitepress/data/release.data'

onMounted(() => {
  const btn = document.querySelector('a.VPButton.brand[href*="kaloscope/kaloscope"]')
  if (btn && release.version) {
    btn.textContent = `立即部署 ${release.version}`
  }
})
</script>
