---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Kaloscope"
  text: "以可视化工作流驱动的媒体库管理与自动追番工具"
  tagline: 用工作流定义搜索、刮削、下载与整理逻辑，而不是把站点规则硬编码在程序里。
  image:
    src: /logo.svg
    alt: Kaloscope
  actions:
    - theme: brand
      text: 开始阅读文档
      link: /docs/
    - theme: alt
      text: 查看 GitHub
      link: https://github.com/kaloscope/kaloscope

features:
  - title: 工作流驱动
    details: 通过可视化节点编排 HTTP 请求、Python 脚本、条件分支和循环，让资源站接入与自动化流程可配置、可复用。
  - title: 面向媒体库
    details: 围绕电影、电视剧等媒体场景设计，支持媒体文件扫描、NFO 元数据解析、在线播放与下载计划。
  - title: 本地优先
    details: 支持多用户、PWA、国际化以及 Docker 部署，适合在家庭媒体服务器或个人 NAS 环境中运行。
---

## 版本与技术栈

- 前端界面基于 Svelte 5
- 工作流画布基于 xyflow 1.5.2
- 后端服务基于 Sanic 25.12.0
- 运行环境要求 Python 3.13+

## 你可以用它做什么

- 把资源站点接入逻辑做成可维护、可复用的工作流模板
- 同时管理搜索、下载、入库、播放这几条常见媒体处理链路
- 在本地服务器、迷你主机或 NAS 中长期运行，持续维护个人媒体库

## 项目定位

Kaloscope 是一个面向本地媒体收藏与自动追番场景的开源项目。它把搜索、刮削、下载、入库等环节拆成可编辑的工作流节点，避免把具体站点逻辑直接写死在程序中。

这使得项目更适合以下场景：

- 需要对接不同资源站、元数据源或认证流程
- 希望把资源搜索和下载任务做成可重复执行的自动化流程
- 希望在同一套系统中统一管理媒体库、下载器和在线播放体验

## 文档内容

- [文档总览](/docs/)
- [快速开始](/docs/getting-started)
- [安装与运行](/docs/installation)
- [Docker 部署](/docs/docker)
- [工作流系统](/docs/workflows)
- [下载与搜索](/docs/search-and-download)
- [开发指南](/docs/development)

## 推荐阅读路径

### 我想先跑起来

从 [快速开始](/docs/getting-started) 和 [Docker 部署](/docs/docker) 开始。

### 我想知道项目能做什么

先看 [项目简介](/docs/introduction)、[工作流系统](/docs/workflows) 和 [媒体库管理](/docs/media-library)。

### 我想参与开发或扩展

继续阅读 [配置说明](/docs/configuration) 与 [开发指南](/docs/development)。

## 当前状态

文档已按开源项目常见结构完成基础骨架，部分章节以目录和说明为主，便于后续逐步补充更细的配置、截图和操作示例。
