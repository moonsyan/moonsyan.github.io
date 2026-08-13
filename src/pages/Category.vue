<script setup lang="ts">
/**
 * 分类页（WEB-003）：按分类展示已启用工具，稳定 URL。
 * 未知分类或空分类：不渲染公开页面，展示空状态。
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { categoryBySlug } from '~/tools/categories'
import { toolsByCategory } from '~/tools/registry'
import { usePageSeo } from '~/composables/usePageSeo'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const category = computed(() => categoryBySlug.get(slug.value))
const tools = computed(() => toolsByCategory(slug.value))
const notFound = computed(() => !category.value || tools.value.length === 0)

usePageSeo(
  category.value
    ? {
        title: `${category.value.name} · ToolKit`,
        description: category.value.description ?? '',
        path: `/category/${slug.value}`,
      }
    : {
        title: '分类不存在 · ToolKit',
        description: '分类不存在或暂无工具。',
        path: `/category/${slug.value}`,
        noindex: true,
      },
)
</script>

<template>
  <section class="container section">
    <div v-if="notFound" class="soft-empty">
      分类不存在或暂无工具
      <br />
      <NuxtLink class="soft-empty-action" to="/">返回全部工具</NuxtLink>
    </div>

    <template v-else>
      <nav class="crumb" aria-label="面包屑">
        <NuxtLink to="/">全部工具</NuxtLink>
        <span aria-hidden="true">/</span>
        <span>{{ category?.name }}</span>
      </nav>
      <h1 class="page-title">{{ category?.name }}</h1>
      <p class="page-desc">{{ category?.description }} · {{ tools.length }} 款工具</p>

      <div class="tool-grid">
        <ToolCard v-for="tool in tools" :key="tool.slug" :tool="tool" />
      </div>
    </template>
  </section>
</template>

<style scoped>
.section {
  padding-top: 36px;
}
.crumb {
  display: flex;
  gap: 8px;
  font-size: 13px;
  color: var(--text-3);
  margin-bottom: 14px;
}
.crumb a {
  color: var(--text-2);
  transition: color var(--transition);
}
.crumb a:hover {
  color: var(--accent-deep);
}
.page-title {
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.015em;
  margin: 0 0 6px;
}
.page-desc {
  font-size: 13.5px;
  color: var(--text-2);
  margin: 0 0 28px;
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
