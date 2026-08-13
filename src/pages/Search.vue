<script setup lang="ts">
/**
 * 搜索页（WEB-004 + 风格 Demo V5 柔和极简）：按名称、别名、简介和标签本地搜索。
 * 支持键盘操作、无结果状态和清除条件。
 */
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { useToolSearch } from '~/composables/useToolSearch'
import { usePageSeo } from '~/composables/usePageSeo'

const route = useRoute()
const router = useRouter()
const { search } = useToolSearch()

const keyword = ref(typeof route.query.q === 'string' ? route.query.q : '')
const results = computed(() => search(keyword.value))

function clear() {
  keyword.value = ''
  router.replace({ query: {} })
}

function submit() {
  router.replace({ query: keyword.value.trim() ? { q: keyword.value.trim() } : {} })
}

usePageSeo({
  title: '搜索工具 · ToolKit',
  description: '按名称、别名、简介和标签搜索本地效率工具。',
  path: '/search',
})
</script>

<template>
  <section class="container section">
    <div class="page-head">
      <span class="page-head-icon" aria-hidden="true"><el-icon><Search /></el-icon></span>
      <h1 class="page-title">搜索工具</h1>
    </div>
    <form class="search-row" role="search" @submit.prevent="submit">
      <span class="sr-icon" aria-hidden="true">⌕</span>
      <input
        v-model="keyword"
        type="search"
        placeholder="输入工具名称、别名或标签，如 json、时间戳…"
        aria-label="搜索工具"
        autofocus
        @keyup.enter="submit"
      />
      <button class="sr-btn" type="submit">搜索</button>
      <button v-if="keyword" class="sr-clear" type="button" @click="clear">清除条件</button>
    </form>

    <p class="result-count">找到 {{ results.length }} 款工具</p>

    <!-- 无结果状态（WEB-009：提供可恢复操作） -->
    <div v-if="results.length === 0" class="soft-empty">
      没有匹配的工具，换个关键词试试
      <br />
      <button class="soft-empty-action" @click="clear">清除条件查看全部工具</button>
    </div>

    <div v-else class="tool-grid">
      <ToolCard v-for="tool in results" :key="tool.slug" :tool="tool" />
    </div>
  </section>
</template>

<style scoped>
.section {
  padding-top: 36px;
}
.page-head {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}
.page-title {
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.015em;
  margin: 0;
}
.search-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 640px;
  margin-bottom: 14px;
}
.sr-icon {
  position: absolute;
  left: 20px;
  color: var(--text-3);
  font-size: 16px;
}
.search-row input {
  flex: 1;
  min-width: 0;
  padding: 14px 20px 14px 48px;
  font-size: 14.5px;
  font-family: inherit;
  color: var(--text-1);
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 999px;
  box-shadow: var(--shadow-sm);
  transition: border-color var(--transition), box-shadow var(--transition);
}
.search-row input::placeholder {
  color: var(--text-3);
}
.search-row input:focus {
  outline: none;
  border-color: var(--border);
  box-shadow: var(--shadow-md);
}
.sr-btn {
  padding: 12px 26px;
  border: none;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: background var(--transition), box-shadow var(--transition);
}
.sr-btn:hover {
  background: var(--accent-deep);
  box-shadow: var(--shadow-md);
}
.sr-clear {
  padding: 12px 18px;
  border: none;
  border-radius: 999px;
  background: none;
  color: var(--text-2);
  font-size: 13.5px;
  font-family: inherit;
  cursor: pointer;
  transition: color var(--transition);
}
.sr-clear:hover {
  color: var(--accent-deep);
}
.result-count {
  font-size: 13px;
  color: var(--text-3);
  margin: 0 0 20px;
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
  .search-row {
    flex-wrap: wrap;
  }
  .search-row input {
    flex-basis: 100%;
  }
}
</style>
