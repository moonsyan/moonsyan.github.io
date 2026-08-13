<script setup lang="ts">
/** 最近使用页（WEB-007 + 风格 Demo V5 柔和极简）：支持单条移除与全部清空，最多 50 条。 */
import { computed, onMounted } from 'vue'
import { Clock } from '@element-plus/icons-vue'
import { toolBySlug } from '~/tools/registry'
import { useRecentStore } from '~/stores/recent'
import { usePageSeo } from '~/composables/usePageSeo'

usePageSeo({
  title: '最近使用 · ToolKit',
  description: '最近使用的工具，仅保存在本机浏览器。',
  path: '/recent',
  noindex: true,
})

const recent = useRecentStore()
onMounted(() => recent.load())

const items = computed(() =>
  recent.entries.flatMap((e) => {
    const tool = toolBySlug.get(e.slug)
    return tool ? [{ tool, at: e.at }] : []
  }),
)

function formatTime(ts: number): string {
  return new Date(ts).toLocaleString('zh-CN', { hour12: false })
}
</script>

<template>
  <section class="container section">
    <div class="page-head">
      <div class="head-main">
        <span class="page-head-icon" aria-hidden="true"><el-icon><Clock /></el-icon></span>
        <div>
          <h1 class="page-title">最近使用</h1>
          <p class="local-note">记录仅保存在本机浏览器，只记录工具与时间，不包含输入内容。</p>
        </div>
      </div>
      <button v-if="items.length" class="clear-btn" @click="recent.clear()">全部清空</button>
    </div>

    <div v-if="items.length === 0" class="soft-empty">
      还没有使用记录
      <br />
      <NuxtLink class="soft-empty-action" to="/">去浏览工具</NuxtLink>
    </div>

    <ul v-else class="recent-list">
      <li v-for="item in items" :key="item.tool.slug" class="recent-item">
        <NuxtLink :to="`/tools/${item.tool.slug}`" class="recent-link">
          <span class="recent-name">{{ item.tool.name }}</span>
          <span class="recent-desc">{{ item.tool.description }}</span>
        </NuxtLink>
        <span class="recent-time">{{ formatTime(item.at) }}</span>
        <button
          class="recent-remove"
          :aria-label="`移除 ${item.tool.name} 的使用记录`"
          @click="recent.remove(item.tool.slug)"
        >
          ✕
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.section {
  padding-top: 36px;
  max-width: 800px;
}
.page-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 26px;
}
.head-main {
  display: flex;
  align-items: center;
  gap: 16px;
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
.recent-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.recent-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 15px 20px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition), box-shadow var(--transition);
}
.recent-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
.recent-link {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.recent-name {
  font-size: 14px;
  font-weight: 600;
}
.recent-desc {
  font-size: 12.5px;
  color: var(--text-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.recent-time {
  font-size: 12px;
  color: var(--text-3);
  font-family: var(--font-mono);
  flex-shrink: 0;
}
.recent-remove {
  border: none;
  background: none;
  color: var(--text-3);
  cursor: pointer;
  padding: 5px 9px;
  border-radius: 999px;
  transition: all var(--transition);
}
.recent-remove:hover {
  color: var(--accent-deep);
  background: var(--accent-tint);
}
</style>
