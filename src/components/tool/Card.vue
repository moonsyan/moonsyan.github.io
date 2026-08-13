<script setup lang="ts">
/**
 * 工具卡片（风格 Demo V5 柔和极简）：目录页与分类页共用。
 * 轻阴影 + 细边框层次，悬停柔和上浮；底部标签如实标注运行方式（本地运行 / 需部署后端）。
 * 收藏按钮仅在浏览器本地记录 slug（WEB-006）。
 */
import type { ToolManifest } from '~/tools/types'
import { computed } from 'vue'
import { useFavoritesStore } from '~/stores/favorites'

const props = defineProps<{ tool: ToolManifest }>()

const favorites = useFavoritesStore()

const iconText = computed(() => props.tool.name.slice(0, 3))
const isRemote = computed(() => props.tool.execution !== 'client')
</script>

<template>
  <NuxtLink :to="`/tools/${tool.slug}`" class="tool-card">
    <div class="tc-top">
      <span class="tc-icon" aria-hidden="true">{{ iconText }}</span>
      <ClientOnly>
        <button
          class="tc-fav"
          :class="{ on: favorites.isFavorite(tool.slug) }"
          :aria-label="favorites.isFavorite(tool.slug) ? `取消收藏 ${tool.name}` : `收藏 ${tool.name}`"
          @click.prevent="favorites.toggle(tool.slug)"
        >
          ♥
        </button>
      </ClientOnly>
    </div>
    <div class="tc-name">{{ tool.name }}</div>
    <div class="tc-desc">{{ tool.description }}</div>
    <span class="tc-tag" :class="{ remote: isRemote }">
      {{ isRemote ? '需部署后端' : '本地运行' }}
    </span>
  </NuxtLink>
</template>

<style scoped>
.tool-card {
  position: relative;
  padding: 22px 22px 18px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: transform 250ms cubic-bezier(0.25, 0.7, 0.35, 1),
    box-shadow 250ms cubic-bezier(0.25, 0.7, 0.35, 1), border-color 250ms cubic-bezier(0.25, 0.7, 0.35, 1);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--border);
}
.tc-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.tc-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: var(--accent-tint);
  color: var(--accent-deep);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 12px;
  transition: background var(--transition), color var(--transition);
}
.tool-card:hover .tc-icon {
  background: var(--accent);
  color: #fff;
}
.tc-fav {
  border: none;
  background: none;
  cursor: pointer;
  color: var(--text-3);
  font-size: 15px;
  line-height: 1;
  padding: 5px 6px;
  border-radius: 999px;
  opacity: 0;
  transition: opacity var(--transition), color var(--transition), background var(--transition);
}
.tool-card:hover .tc-fav,
.tc-fav:focus-visible,
.tc-fav.on {
  opacity: 1;
}
.tc-fav:hover {
  color: var(--accent-deep);
  background: var(--accent-tint);
}
.tc-fav.on {
  color: var(--accent);
}
.tc-name {
  font-size: 15px;
  font-weight: 600;
}
.tc-desc {
  font-size: 12.5px;
  color: var(--text-3);
  line-height: 1.6;
  /* 两行截断，保证卡片墙高度整齐 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.6em;
  margin-top: 2px;
}
.tc-tag {
  margin-top: 12px;
  align-self: flex-start;
  display: inline-block;
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--accent-tint);
  color: var(--accent-deep);
  font-weight: 500;
}
.tc-tag.remote {
  background: var(--bg-soft);
  color: var(--text-3);
}
@media (hover: none) {
  /* 触屏设备无悬停态：收藏按钮常显 */
  .tc-fav {
    opacity: 1;
  }
}
</style>
