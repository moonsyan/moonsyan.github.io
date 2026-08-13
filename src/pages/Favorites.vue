<script setup lang="ts">
/** 收藏页（WEB-006 + 风格 Demo V5 柔和极简）：数据仅保存在浏览器本地，可一键清除。 */
import { computed, onMounted } from 'vue'
import { toolBySlug } from '~/tools/registry'
import { useFavoritesStore } from '~/stores/favorites'
import { usePageSeo } from '~/composables/usePageSeo'

usePageSeo({
  title: '我的收藏 · ToolKit',
  description: '收藏的工具，仅保存在本机浏览器。',
  path: '/favorites',
  noindex: true,
})

const favorites = useFavoritesStore()
onMounted(() => favorites.load())

const tools = computed(() =>
  favorites.slugs.flatMap((slug) => {
    const tool = toolBySlug.get(slug)
    return tool ? [tool] : []
  }),
)
</script>

<template>
  <section class="container section">
    <div class="page-head">
      <div>
        <h1 class="page-title">我的收藏</h1>
        <p class="local-note">收藏仅保存在本机浏览器 localStorage，不上传、不跨设备同步。</p>
      </div>
      <button v-if="tools.length" class="clear-btn" @click="favorites.clear()">全部清空</button>
    </div>

    <div v-if="tools.length === 0" class="soft-empty">
      还没有收藏任何工具，在工具卡片上点击 <b>♥</b> 即可收藏
      <br />
      <NuxtLink class="soft-empty-action" to="/">去浏览工具</NuxtLink>
    </div>

    <div v-else class="tool-grid">
      <ToolCard v-for="tool in tools" :key="tool.slug" :tool="tool" />
    </div>
  </section>
</template>

<style scoped>
.section {
  padding-top: 36px;
}
.page-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 26px;
}
.page-title {
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.015em;
  margin: 0;
}
.local-note {
  font-size: 12.5px;
  color: var(--text-3);
  margin: 8px 0 0;
}
.clear-btn {
  padding: 8px 18px;
  border: none;
  border-radius: 999px;
  background: var(--bg-card);
  color: var(--text-2);
  font-size: 13px;
  font-family: inherit;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all var(--transition);
}
.clear-btn:hover {
  color: var(--accent-deep);
  box-shadow: var(--shadow-md);
}
.tool-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
@media (max-width: 1240px) {
  .tool-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 1000px) {
  .tool-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 640px) {
  .tool-grid {
    grid-template-columns: 1fr;
  }
}
</style>
