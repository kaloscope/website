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
    caption: '按放送日翻看新番，挑一部想追的作品。',
    link: '/docs/websearch/',
    guide: '资源搜索'
  },
  {
    name: '工作流',
    image: 'workflow-complex.png',
    alt: 'TMDB 元数据刮削工作流中的节点、参数和连线',
    caption: '点开画布节点，抓站和刮削的每一步都清清楚楚。',
    link: '/docs/workflows/',
    guide: '工作流指南'
  },
  {
    name: '全局搜索',
    image: 'websearch-global.png',
    alt: '全局搜索页按索引器分组列出匹配的资源和文件大小',
    caption: '搜一次关键词，同时翻看多个站点的匹配结果。',
    link: '/docs/websearch/global',
    guide: '全局搜索指南'
  },
  {
    name: '下载计划',
    image: 'download-plan.png',
    alt: '新增下载计划弹窗中可预览搜索结果，设置执行间隔和下载器',
    caption: '先预览搜到的资源，再设好间隔和数量自动追更。',
    link: '/docs/downloads/plans',
    guide: '下载计划指南'
  },
  {
    name: '弹幕播放',
    image: 'danmaku-settings.png',
    alt: '视频播放器上叠加弹幕，设置面板显示区域、透明度、字号和速度',
    caption: '看片时直接调整弹幕范围、字号、速度和屏蔽类型。',
    link: '/docs/medialibs/danmaku',
    guide: '弹幕设置'
  },
  {
    name: '漫画阅读',
    image: 'image-viewer.png',
    alt: '漫画阅读器展示当前页，右侧可调整翻页方向和缩放方式',
    caption: '滚动或翻页随你选，阅读进度也会自动记下来。',
    link: '/docs/medialibs/reading',
    guide: '阅读指南'
  }
];

const selected = ref(0);
const preview = computed(() => previews[selected.value]);
const guides = [
  {
    title: 'AI 与工作流',
    detail: '让助手帮你起草索引器和刮削流程，在画布上检查节点、试运行后再发布。',
    icon: 'document-flowchart',
    link: '/docs/ai/assistant',
    tone: 'violet'
  },
  {
    title: '影视与阅读',
    detail: '电影、剧集、小说和漫画都能自动补齐元数据，按你的规则重命名整理入库。',
    icon: 'video-clip-multiple',
    link: '/docs/medialibs/',
    tone: 'amber'
  },
  {
    title: '部署到本地',
    detail: '用 Docker 跑在 NAS 或家用服务器上，再按账号分好媒体库和站点权限。',
    icon: 'desktop-arrow-down',
    link: '/docs/deployment',
    tone: 'green'
  }
];
</script>

<template>
  <div class="home">
    <section class="hero" aria-labelledby="home-title">
      <div class="glow" aria-hidden="true"></div>
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
        <p class="lead">搜索、下载和刮削，自己搭或让 AI 写都行。部署在自己的服务器上，电影、剧集、小说和漫画都能看。</p>
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
      <div class="guide-head">
        <h2 id="guides-heading">功能指南</h2>
        <a class="guide-all" :href="withBase('/docs/introduction')">浏览全部文档 <span aria-hidden="true">→</span></a>
      </div>
      <a
        v-for="guide in guides"
        :key="guide.link"
        class="guide"
        :class="'tone-' + guide.tone"
        :href="withBase(guide.link)"
      >
        <span class="guide-icon" aria-hidden="true">
          <span
            class="guide-glyph"
            :style="{ '--icon': 'url(' + withBase('/fluent--' + guide.icon + '-light.svg') + ')' }"
          ></span>
        </span>
        <span class="guide-arrow" aria-hidden="true">↗</span>
        <span class="guide-title">{{ guide.title }}</span>
        <span class="guide-detail">{{ guide.detail }}</span>
      </a>
    </nav>
  </div>
</template>

<style scoped>
.home {
  /* palette sampled from the logo blocks */
  --k-blue: #5170ff;
  --k-violet: #8b4fd8;
  --k-magenta: #cb6ce6;
  --k-orange: #ff914d;
  --k-yellow: #ffde59;
  --k-green: #00bf63;

  --ink: #251b36;
  --accent: #643aa0;
  --wash: #f6f2fc;
  --surface: #ffffff;
  --rule: #e4dbef;
  --facet-a: #e6dbf6;
  --facet-b: #d9c8ef;
  --facet-c: #efe6f9;
  --glow-strength: 30%;
  --shadow: 0 1px 2px rgb(48 30 80 / 0.06), 0 8px 24px -12px rgb(48 30 80 / 0.22);
  color: var(--ink);
  max-width: 1456px;
  margin-inline: auto;
  padding: clamp(20px, 3vw, 48px) clamp(16px, 3.5vw, 56px) clamp(56px, 6vw, 96px);
}
.dark .home {
  --ink: #f2eafa;
  --accent: #c5a3f9;
  --wash: #1d1828;
  --surface: #221c2e;
  --rule: #3a3049;
  --facet-a: #2f2540;
  --facet-b: #3b2d4f;
  --facet-c: #2a2138;
  --glow-strength: 22%;
  --shadow: 0 1px 2px rgb(0 0 0 / 0.3), 0 12px 32px -16px rgb(0 0 0 / 0.7);
}

/* hero */
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
  border: 1px solid var(--rule);
  border-radius: 24px;
}
.glow {
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  background:
    radial-gradient(
      42% 60% at 0% 0%,
      color-mix(in srgb, var(--k-blue) var(--glow-strength), transparent),
      transparent 70%
    ),
    radial-gradient(
      36% 50% at 8% 100%,
      color-mix(in srgb, var(--k-orange) calc(var(--glow-strength) * 0.7), transparent),
      transparent 70%
    ),
    radial-gradient(
      50% 70% at 78% 40%,
      color-mix(in srgb, var(--k-magenta) var(--glow-strength), transparent),
      transparent 70%
    ),
    radial-gradient(
      30% 40% at 100% 100%,
      color-mix(in srgb, var(--k-green) calc(var(--glow-strength) * 0.5), transparent),
      transparent 70%
    );
}
.glow::after {
  /* faint dot grid that fades toward the text column */
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(color-mix(in srgb, var(--ink) 14%, transparent) 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: linear-gradient(105deg, transparent 30%, #000 75%);
  opacity: 0.55;
}
.prism {
  position: absolute;
  z-index: -1;
  right: 4%;
  top: 50%;
  width: min(54%, 720px);
  translate: 0 -50%;
  opacity: 0.7;
  pointer-events: none;
}
.prism svg {
  width: 100%;
  height: auto;
}
.wordmark {
  display: inline-flex;
  align-items: center;
  gap: 0.24em;
  font-size: clamp(26px, 2.4vw, 36px);
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
  margin-top: clamp(18px, 2vw, 30px);
  font-size: clamp(42px, 4.5vw, 70px);
  line-height: 1.14;
  font-weight: 800;
  letter-spacing: -0.035em;
  text-wrap: balance;
}
.title em {
  font-style: normal;
  color: var(--accent);
  background: linear-gradient(100deg, var(--k-blue) 0%, var(--k-violet) 45%, var(--k-magenta) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.dark .title em {
  background-image: linear-gradient(100deg, #8ea0ff 0%, #b58cf5 45%, #e7a0f6 100%);
}
.lead {
  color: var(--vp-c-text-2);
  margin-top: 20px;
  max-width: 26em;
  font-size: clamp(16px, 1.35vw, 19px);
  line-height: 1.75;
  text-wrap: pretty;
}
.actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 30px;
  flex-wrap: wrap;
  --vp-button-brand-bg: #643aa0;
  --vp-button-brand-hover-bg: #512e83;
  --vp-button-brand-active-bg: #44266e;
  --vp-button-alt-bg: var(--surface);
  --vp-button-alt-border: var(--rule);
  --vp-button-alt-hover-border: var(--rule);
  --vp-button-alt-text: var(--ink);
}
.actions :deep(.VPButton) {
  border-radius: 12px;
  padding: 0 22px;
  line-height: 44px;
  font-size: 15px;
}
.actions :deep(.VPButton.brand) {
  box-shadow: 0 8px 20px -8px rgb(100 58 160 / 0.7);
}
.actions :deep(.VPButton.alt) {
  box-shadow: var(--shadow);
}

/* preview */
.showcase {
  container-type: inline-size;
  margin: 0;
  min-width: 0;
}
.preview-controls {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 4px;
  margin: 0 2.4% 8px;
  padding: 4px;
  background: color-mix(in srgb, var(--surface) 72%, transparent);
  border: 1px solid var(--rule);
  border-radius: 14px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.preview-controls button {
  color: var(--vp-c-text-2);
  font-size: 14px;
  font-weight: 600;
  min-height: 38px;
  padding: 0 6px;
  border-radius: 10px;
  white-space: nowrap;
  transition:
    color 0.2s,
    background-color 0.2s,
    box-shadow 0.2s;
}
.preview-controls button:hover {
  color: var(--accent);
}
.preview-controls button[aria-pressed='true'] {
  color: var(--accent);
  background: var(--surface);
  box-shadow: var(--shadow);
}
@container (max-width: 36rem) {
  .preview-controls {
    grid-template-columns: repeat(3, minmax(0, 1fr));
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
  padding: 2px 2.4% 0;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.65;
}
figcaption a,
.guide-all {
  color: var(--accent);
  font-weight: 600;
  white-space: nowrap;
}
figcaption a:hover,
.guide-all:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* guides */
.guide-list {
  margin-top: clamp(40px, 4.5vw, 72px);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(14px, 1.6vw, 24px);
}
.guide-head {
  grid-column: 1/-1;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 4px;
  padding-inline: 4px;
}
.guide-head h2 {
  font-size: clamp(22px, 1.8vw, 26px);
  font-weight: 700;
  letter-spacing: -0.02em;
}
.guide-all {
  font-size: 14px;
}
.guide {
  --tone: var(--k-violet);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px 24px 26px;
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: 18px;
  transition:
    border-color 0.25s,
    box-shadow 0.25s,
    transform 0.25s;
}
.guide.tone-amber {
  --tone: #f07a2c;
}
.guide.tone-green {
  --tone: #00a656;
}
.dark .guide {
  --tone: #b58cf5;
}
.dark .guide.tone-amber {
  --tone: #ffad73;
}
.dark .guide.tone-green {
  --tone: #4fd892;
}
.guide-icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  margin-bottom: 8px;
  border-radius: 13px;
  background: color-mix(in srgb, var(--tone) 13%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--tone) 22%, transparent);
}
.guide-glyph {
  width: 26px;
  height: 26px;
  background: var(--tone);
  mask: var(--icon) center / contain no-repeat;
  -webkit-mask: var(--icon) center / contain no-repeat;
}
.guide-arrow {
  position: absolute;
  right: 22px;
  top: 22px;
  color: var(--vp-c-text-3);
  transition:
    color 0.25s,
    translate 0.25s;
}
.guide-title {
  font-size: 18px;
  line-height: 1.45;
  font-weight: 700;
}
.guide-detail {
  color: var(--vp-c-text-2);
  font-size: 15px;
  line-height: 1.7;
}
.guide:hover {
  border-color: color-mix(in srgb, var(--tone) 45%, var(--rule));
  box-shadow: 0 18px 40px -24px color-mix(in srgb, var(--tone) 70%, transparent);
}
.guide:hover .guide-arrow {
  color: var(--tone);
  translate: 2px -2px;
}
.home :is(button, a):focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

/* motion */
@media (prefers-reduced-motion: no-preference) {
  .prism svg {
    transition: transform 650ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .screen img {
    animation: reveal 360ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .guide:hover {
    transform: translateY(-3px);
  }
  @keyframes reveal {
    from {
      opacity: 0.5;
      transform: translateY(6px) scale(0.995);
    }
  }
}

/* responsive */
@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 28px;
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
    width: 70%;
    right: -14%;
    top: 68%;
  }
  .guide-list {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 640px) {
  .home {
    padding: 12px 12px 48px;
  }
  .hero {
    padding: 28px 16px 20px;
    gap: 22px;
    border-radius: 20px;
  }
  .wordmark {
    font-size: 28px;
  }
  .title {
    font-size: clamp(32px, 8.4vw, 44px);
  }
  .title br {
    display: initial;
  }
  .lead {
    margin-top: 14px;
  }
  .actions {
    margin-top: 22px;
  }
  .prism {
    width: 100%;
    right: -30%;
  }
  .preview-controls {
    margin: 0 0 6px;
  }
  .preview-controls button {
    font-size: 13px;
  }
  figcaption {
    flex-wrap: wrap;
    gap: 3px 12px;
    font-size: 13px;
  }
  .guide {
    display: grid;
    grid-template-columns: 46px minmax(0, 1fr);
    gap: 4px 14px;
    padding: 18px 18px 20px;
  }
  .guide-icon {
    grid-row: span 2;
    margin-bottom: 0;
  }
  .guide-title {
    padding-right: 20px;
  }
  .guide-arrow {
    right: 16px;
    top: 18px;
  }
}
</style>
