<script setup lang="ts">
import { computed, ref } from 'vue';
import { withBase } from 'vitepress';
import { VPButton } from 'vitepress/theme';
import { data as release } from '../../data/release.data';

const previews = [
  {
    name: '媒体首页',
    image: 'dashboard.png',
    alt: '首页按星期展示每日放送的番剧海报',
    caption: '按放送日浏览番剧，选择想看的作品。',
    link: '/docs/websearch/',
    guide: '资源搜索'
  },
  {
    name: '工作流',
    image: 'workflow-complex.png',
    alt: '电影元数据刮削工作流中的节点、参数和连线',
    caption: '打开节点，查看每一步如何获取和整理元数据。',
    link: '/docs/workflows/',
    guide: '工作流指南'
  },
  {
    name: '全局搜索',
    image: 'websearch-global.png',
    alt: '全局搜索页按索引器分组列出匹配的资源和文件大小',
    caption: '输入一次关键词，分站查看搜索结果。',
    link: '/docs/websearch/global',
    guide: '全局搜索指南'
  },
  {
    name: '下载计划',
    image: 'download-plan.png',
    alt: '新增下载计划弹窗中可预览搜索结果，设置执行间隔和下载器',
    caption: '预览命中的资源，设置搜索间隔和下载数量。',
    link: '/docs/downloads/plans',
    guide: '下载计划指南'
  },
  {
    name: '弹幕播放',
    image: 'danmaku-settings.png',
    alt: '视频播放器上叠加弹幕，设置面板显示区域、透明度、字号和速度',
    caption: '播放时调整弹幕的范围、字号和速度。',
    link: '/docs/medialibs/danmaku',
    guide: '弹幕设置'
  },
  {
    name: '漫画阅读',
    image: 'image-viewer.png',
    alt: '漫画阅读器展示当前页，右侧可调整翻页方向和缩放方式',
    caption: '切换滚动或翻页模式，下次从上次读到的位置继续。',
    link: '/docs/medialibs/reading',
    guide: '阅读指南'
  }
];

const selected = ref(0);
const preview = computed(() => previews[selected.value]);
const guides = [
  {
    title: 'AI 与工作流',
    detail: '用自然语言搭建索引器和刮削流程。在画布上检查节点、试运行，再发布。',
    icon: 'document-flowchart',
    link: '/docs/ai/assistant'
  },
  {
    title: '影视与阅读',
    detail: '为电影、剧集、小说和漫画补齐元数据，按自己的命名规则整理入库。',
    icon: 'video-clip-multiple',
    link: '/docs/medialibs/'
  },
  {
    title: '部署到本地',
    detail: '用 Docker 在 NAS 或家庭服务器上运行，按账号分配媒体库与索引器权限。',
    icon: 'desktop-arrow-down',
    link: '/docs/deployment'
  }
];
</script>

<template>
  <div class="home">
    <section class="hero" aria-labelledby="home-title">
      <div class="prism" aria-hidden="true">
        <svg viewBox="-100 -100 200 200" :style="{ transform: 'rotate(' + selected * 22.5 + 'deg)' }">
          <g v-for="sector in 8" :key="sector" :transform="'rotate(' + sector * 45 + ')'">
            <path d="M 0 -98 L 26 -62 L 0 -36 L -26 -62 Z" fill="var(--facet-a)" />
            <path d="M 0 -98 L 0 -36 L -26 -62 Z" fill="var(--facet-b)" />
            <path d="M 0 -36 L 26 -62 L 24 -28 L 0 -12 Z" fill="var(--facet-c)" />
          </g>
        </svg>
      </div>
      <div class="intro">
        <h1 id="home-title">
          <span class="wordmark"><img :src="withBase('/logo.svg')" alt="" width="64" height="64" />Kaloscope</span>
          <span class="title">用工作流整理<br /><em>你的媒体库</em></span>
        </h1>
        <p class="lead">让 AI 帮你编排搜索、下载与刮削。在自己的服务器上看电影、追剧，也读小说和漫画。</p>
        <div class="actions">
          <VPButton theme="brand" href="https://hub.docker.com/r/kaloscope/kaloscope">
            立即部署<span v-if="release.version">&nbsp;{{ release.version }}</span>
          </VPButton>
          <VPButton theme="alt" :href="withBase('/docs/getting-started')" text="快速开始" />
        </div>
      </div>

      <figure class="showcase" aria-label="Kaloscope 界面预览">
        <div class="preview-controls" role="group" aria-label="选择预览界面">
          <button
            v-for="(item, index) in previews"
            :key="item.name"
            type="button"
            :aria-pressed="selected === index"
            aria-controls="product-preview"
            @click="selected = index"
          >
            {{ item.name }}
          </button>
        </div>
        <div id="product-preview" class="screen">
          <img
            :key="preview.image"
            :src="withBase('/screenshots/' + preview.image)"
            :alt="preview.alt"
            width="1382"
            height="849"
          />
        </div>
        <figcaption aria-live="polite">
          <span>{{ preview.caption }}</span>
          <a :href="withBase(preview.link)">{{ preview.guide }} <span aria-hidden="true">↗</span></a>
        </figcaption>
      </figure>
    </section>

    <nav class="guide-list" aria-labelledby="guides-heading">
      <h2 id="guides-heading">功能指南</h2>
      <a v-for="guide in guides" :key="guide.link" class="guide" :href="withBase(guide.link)">
        <span class="guide-top">
          <img
            class="icon-light"
            :src="withBase('/fluent--' + guide.icon + '-light.svg')"
            width="32"
            height="32"
            alt=""
          />
          <img
            class="icon-dark"
            :src="withBase('/fluent--' + guide.icon + '-dark.svg')"
            width="32"
            height="32"
            alt=""
          />
          <span class="guide-arrow" aria-hidden="true">↗</span>
        </span>
        <span class="guide-title">{{ guide.title }}</span>
        <span class="guide-detail">{{ guide.detail }}</span>
      </a>
    </nav>
  </div>
</template>

<style scoped>
.home {
  --ink: #302341;
  --accent: #643aa0;
  --wash: #f3effa;
  --rule: #d8cee5;
  --facet-a: #dfd2f2;
  --facet-b: #d0bee9;
  --facet-c: #eadff5;
  color: var(--ink);
  max-width: 1456px;
  margin-inline: auto;
  padding: clamp(20px, 3vw, 48px) clamp(16px, 3.5vw, 56px) 0;
}
.dark .home {
  --ink: #f2eafa;
  --accent: #c5a3f9;
  --wash: #251f30;
  --rule: #493c58;
  --facet-a: #392d48;
  --facet-b: #493658;
  --facet-c: #34293f;
}
.hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
  align-items: center;
  gap: clamp(28px, 3.4vw, 50px);
  padding: clamp(32px, 4.3vw, 72px);
  background: var(--wash);
  border-radius: 18px;
}
.prism {
  position: absolute;
  z-index: -1;
  right: -8%;
  top: -35%;
  width: 57%;
  pointer-events: none;
}
.prism svg {
  width: 100%;
  height: auto;
}
.wordmark {
  display: inline-flex;
  align-items: center;
  gap: 0.2em;
  font-size: clamp(28px, 2.6vw, 40px);
  line-height: 1;
  font-weight: 750;
  letter-spacing: -0.035em;
}
.wordmark img {
  width: 0.95em;
  height: 0.95em;
}
.title {
  display: block;
  margin-top: clamp(16px, 1.8vw, 28px);
  font-size: clamp(42px, 4.5vw, 70px);
  line-height: 1.15;
  font-weight: 750;
  letter-spacing: -0.035em;
}
.title em {
  font-style: normal;
  color: var(--accent);
}
.lead {
  color: var(--vp-c-text-2);
  margin-top: 18px;
  max-width: 25em;
  font-size: clamp(16px, 1.35vw, 19px);
  line-height: 1.75;
}
.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 24px;
  flex-wrap: wrap;
  --vp-button-brand-bg: #643aa0;
  --vp-button-brand-hover-bg: #512e83;
  --vp-button-brand-active-bg: #44266e;
  --vp-button-alt-bg: var(--vp-c-bg);
  --vp-button-alt-text: var(--ink);
}
.showcase {
  container-type: inline-size;
  margin: 0;
  min-width: 0;
}
.preview-controls {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  column-gap: 12px;
  align-items: center;
  margin: 0 2% 6px;
}
.preview-controls button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  font-weight: 600;
  min-height: 44px;
  padding: 0;
  white-space: nowrap;
}
.preview-controls button::before {
  content: '';
  width: 8px;
  height: 8px;
  border: 1.5px solid currentColor;
  border-radius: 50%;
  background: var(--wash);
}
.preview-controls button + button::after {
  content: '';
  position: absolute;
  left: -12px;
  top: 50%;
  width: 12px;
  height: 1px;
  background: var(--rule);
}
.preview-controls button[aria-pressed='true'],
.preview-controls button:hover {
  color: var(--accent);
}
.preview-controls button[aria-pressed='true']::before {
  background: var(--accent);
}
@container (max-width: 36rem) {
  .preview-controls {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .preview-controls button:nth-child(3n + 1)::after {
    display: none;
  }
}
.screen {
  position: relative;
}
.screen img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1382 / 849;
  object-fit: contain;
}
figcaption {
  padding: 2px 2% 0;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.65;
}
figcaption a {
  color: var(--accent);
  font-weight: 600;
  white-space: nowrap;
}
figcaption a:hover {
  text-decoration: underline;
}
.guide-list {
  margin: clamp(28px, 3vw, 48px) clamp(0px, 2vw, 32px) 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: clamp(18px, 3vw, 48px);
}
.guide-list h2 {
  grid-column: 1/-1;
  margin-bottom: 14px;
  font-size: 21px;
  font-weight: 650;
  letter-spacing: -0.02em;
}
.guide {
  position: relative;
  display: grid;
  grid-template-columns: 30px 1fr;
  gap: 6px 12px;
  align-content: start;
  border-top: 1px solid var(--rule);
  padding: 18px 25px 8px 0;
}
.guide-top {
  grid-row: span 2;
}
.guide-top img {
  width: 28px;
  height: 28px;
}
.guide-arrow {
  position: absolute;
  right: 0;
  top: 18px;
  color: var(--accent);
}
.guide-title {
  font-size: 18px;
  line-height: 1.45;
  font-weight: 650;
}
.guide-detail {
  color: var(--vp-c-text-2);
  font-size: 15px;
  line-height: 1.65;
}
.guide:hover .guide-title {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 4px;
}
.icon-dark,
.dark .icon-light {
  display: none;
}
.dark .icon-dark {
  display: block;
}
.home :is(button, a):focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
@media (prefers-reduced-motion: no-preference) {
  .prism svg {
    transition: transform 650ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .screen img {
    animation: reveal 320ms ease-out;
  }
  .preview-controls button[aria-pressed='true']::before {
    animation: connect 420ms ease-out;
  }
  @keyframes reveal {
    from {
      opacity: 0.65;
      transform: translateY(5px);
    }
  }
  @keyframes connect {
    from {
      box-shadow: 0 0 0 5px color-mix(in srgb, var(--accent) 26%, transparent);
    }
    to {
      box-shadow: 0 0 0 0 transparent;
    }
  }
}
@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .title br {
    display: none;
  }
  .lead {
    max-width: 31em;
  }
  .showcase {
    width: min(100%, 680px);
    justify-self: center;
  }
  .prism {
    width: 62%;
    right: -16%;
    top: -10%;
  }
}
@media (max-width: 640px) {
  .home {
    padding: 12px 12px 0;
  }
  .hero {
    padding: 26px 18px 20px;
    gap: 20px;
  }
  .wordmark {
    font-size: 30px;
  }
  .title {
    font-size: clamp(32px, 8.4vw, 44px);
  }
  .title br {
    display: initial;
  }
  .lead {
    margin-top: 12px;
  }
  .actions {
    margin-top: 18px;
  }
  .prism {
    width: 83%;
    top: -9%;
    right: -32%;
  }
  .preview-controls {
    margin: 0;
  }
  .preview-controls button {
    padding: 0 4px;
    font-size: 13px;
  }
  .preview-controls button + button::after {
    left: -12px;
    width: 10px;
  }
  figcaption {
    flex-wrap: wrap;
    gap: 3px 12px;
    font-size: 13px;
  }
  .guide-list {
    grid-template-columns: 1fr;
    margin-inline: 10px;
  }
  .guide {
    padding-block: 16px;
  }
  .guide-list h2 {
    margin-bottom: 10px;
  }
}
</style>
