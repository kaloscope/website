import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: 'Kaloscope',
  description: '以可视化工作流驱动的媒体库管理与自动追番工具',
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: { src: '/favicon.ico', width: 24, height: 24 },

    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/docs/' },
      { text: '部署', link: '/docs/docker' },
      { text: 'GitHub', link: 'https://github.com/kaloscope/kaloscope' }
    ],

    sidebar: [
      {
        text: '开始使用',
        items: [
          { text: '文档总览', link: '/docs/' },
          { text: '项目简介', link: '/docs/introduction' },
          { text: '快速开始', link: '/docs/getting-started' },
          { text: '安装与运行', link: '/docs/installation' }
        ]
      },
      {
        text: '核心功能',
        items: [
          { text: '工作流系统', link: '/docs/workflows' },
          { text: '媒体库管理', link: '/docs/media-library' },
          { text: '下载与搜索', link: '/docs/search-and-download' },
          { text: '播放器与用户系统', link: '/docs/player-and-users' }
        ]
      },
      {
        text: '部署与开发',
        items: [
          { text: 'Docker 部署', link: '/docs/docker' },
          { text: '配置说明', link: '/docs/configuration' },
          { text: '开发指南', link: '/docs/development' },
          { text: '常见问题', link: '/docs/faq' }
        ]
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/kaloscope/kaloscope' }],
    search: {
      provider: 'local'
    },
    editLink: {
      pattern: 'https://github.com/kaloscope/website/edit/main/site/:path',
      text: '在 GitHub 上编辑此页'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    footer: {
      message: '基于 VitePress 构建，文档内容遵循项目当前实现持续更新。',
      copyright: 'Copyright © 2026 Kaloscope Contributors'
    },
    outline: {
      level: [2, 3],
      label: '本页内容'
    }
  }
});
