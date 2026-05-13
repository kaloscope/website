import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: 'Kaloscope',
  description: '以可视化工作流驱动的媒体库管理与自动追番工具',
  cleanUrls: true,
  lastUpdated: true,
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: { src: '/favicon.ico', width: 24, height: 24 },

    socialLinks: [{ icon: 'github', link: 'https://github.com/kaloscope' }],

    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/docs/' },
      { text: '部署', link: '/docs/docker' }
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

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索'
          },
          modal: {
            displayDetails: '显示详细列表',
            resetButtonTitle: '重置搜索',
            backButtonTitle: '关闭搜索',
            noResultsText: '没有结果',
            footer: {
              selectText: '选择',
              selectKeyAriaLabel: '输入',
              navigateText: '导航',
              navigateUpKeyAriaLabel: '上箭头',
              navigateDownKeyAriaLabel: '下箭头',
              closeText: '关闭',
              closeKeyAriaLabel: 'ESC'
            }
          }
        }
      }
    },

    editLink: {
      pattern: 'https://github.com/kaloscope/website/edit/main/site/:path',
      text: '在 GitHub 上编辑此页面'
    },

    footer: {
      message: '基于 <a href="https://github.com/kaloscope/kaloscope/blob/main/LICENSE">GPLv3</a> 开源协议发布',
      copyright: '版权所有 © 2026-至今 <a href="https://github.com/C5H12O5">C5H12O5</a>'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    outline: {
      label: '页面导航'
    },

    lastUpdated: {
      formatOptions: {
        forceLocale: true
      },
      text: '最后更新于'
    },

    notFound: {
      title: '页面未找到',
      quote: '但如果你不改变方向，并且继续寻找，你可能最终会到达你所前往的地方。',
      linkLabel: '前往首页',
      linkText: '带我回首页'
    },

    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    skipToContentLabel: '跳转到内容'
  }
});
