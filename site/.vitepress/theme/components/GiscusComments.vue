<script setup lang="ts">
import { useData, useRoute } from 'vitepress';
import { nextTick, onMounted, ref, watch } from 'vue';

const { isDark } = useData();
const route = useRoute();
const container = ref<HTMLElement | null>(null);

const giscusConfig = {
  repo: 'kaloscope/website',
  repoId: 'R_kgDOR9oQ_Q',
  category: 'Comments',
  categoryId: 'DIC_kwDOR9oQ_c4C_l6n',
  mapping: 'pathname',
  strict: '0',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'bottom',
  lang: 'zh-CN'
};

function getTheme() {
  return isDark.value ? 'dark' : 'light';
}

function setDataAttribute(script: HTMLScriptElement, key: string, value: string) {
  script.setAttribute(`data-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`, value);
}

async function renderGiscus() {
  await nextTick();

  if (!container.value) return;

  container.value.innerHTML = '';

  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.async = true;
  script.crossOrigin = 'anonymous';

  for (const [key, value] of Object.entries(giscusConfig)) {
    setDataAttribute(script, key, value);
  }

  setDataAttribute(script, 'theme', getTheme());
  container.value.appendChild(script);
}

function updateGiscusTheme() {
  const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');

  iframe?.contentWindow?.postMessage(
    {
      giscus: {
        setConfig: {
          theme: getTheme()
        }
      }
    },
    'https://giscus.app'
  );
}

onMounted(renderGiscus);

watch(() => route.path, renderGiscus);
watch(isDark, updateGiscusTheme);
</script>

<template>
  <div ref="container" class="giscus-comments" />
</template>

<style scoped>
.giscus-comments {
  margin-top: 48px;
}
</style>
