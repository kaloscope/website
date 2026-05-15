import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: 'Kaloscope',
  description: '以可视化工作流驱动的本地媒体库管理工具',
  cleanUrls: true,
  lastUpdated: true,
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: { src: '/favicon.ico', width: 24, height: 24 },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/kaloscope' },
      { icon: 'telegram', link: 'https://t.me/kaloscope_official' }
    ],

    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/docs/introduction' }
    ],

    sidebar: [
      {
        text: '开始使用',
        items: [
          { text: '项目简介', link: '/docs/introduction' },
          { text: '快速开始', link: '/docs/getting-started' },
          { text: '本地部署', link: '/docs/deployment' }
        ]
      },
      {
        text: '功能说明',
        items: [
          {
            text: '工作流',
            link: '/docs/workflows/',
            items: [
              { text: '流程模板', link: '/docs/workflows/templates' },
              { text: '全局变量', link: '/docs/workflows/variables' },
              { text: '定时调度', link: '/docs/workflows/schedule' }
            ]
          },
          {
            text: '资源搜索',
            link: '/docs/websearch/',
            items: [{ text: '全局搜索', link: '/docs/websearch/global' }]
          },
          {
            text: '下载管理',
            link: '/docs/downloads/',
            items: [{ text: '下载计划', link: '/docs/downloads/plans' }]
          },
          { text: '媒体库', link: '/docs/medialibs' },
          { text: '弹幕设置', link: '/docs/danmaku' },
          { text: '网络设置', link: '/docs/network' },
          { text: '用户管理', link: '/docs/users' },
          { text: 'PWA 安装', link: '/docs/pwa' }
        ]
      },
      {
        text: '其它',
        items: [
          { text: '常见问题', link: '/docs/faq' },
          { text: '参与开发', link: '/docs/development' }
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
