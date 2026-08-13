<script setup lang="ts">
/**
 * 工具详情页（WEB-005）：名称、用途、执行方式标注、工具运行区与相关工具。
 * 客户端工具加载真实组件；服务端/文件工具在静态版显示"需部署后端"提示，
 * 不展示未实现功能（内容红线）。打开详情页记录最近使用（仅 slug 与时间，WEB-007）。
 * 静态版不提供反馈入口与安全分享（依赖服务端 API）。
 */
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { toolBySlug, toolsByCategory } from '~/tools/registry'
import { toolViewComponents } from '~/tools/views'
import { categoryBySlug } from '~/tools/categories'
import { useRecentStore } from '~/stores/recent'
import { usePageSeo } from '~/composables/usePageSeo'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const tool = computed(() => toolBySlug.get(slug.value))

const category = computed(() => (tool.value ? categoryBySlug.get(tool.value.category) : undefined))
const related = computed(() =>
  tool.value
    ? toolsByCategory(tool.value.category)
        .filter((t) => t.slug !== tool.value!.slug)
        .slice(0, 3)
    : [],
)

// 执行模式如实标注（内容红线：不展示未实现能力）
const executionTag = computed(() => {
  switch (tool.value?.execution) {
    case 'client':
      return '本地运行 · 输入不上传'
    case 'server':
      return '服务端执行 · 仅参数上传'
    case 'async':
      return '服务端任务 · 文件临时存储 24h'
    default:
      return ''
  }
})

// 动态加载工具运行区组件（SEO-005：按需拆包）；服务端/文件工具静态版不挂载组件。
// 用 computed + key 保证 /tools/a → /tools/b 这类同路由参数跳转时组件随 slug 重建。
const viewLoader = computed(() => (tool.value ? toolViewComponents[tool.value.slug] : undefined))
const ToolView = computed(() => (viewLoader.value ? defineAsyncComponent(viewLoader.value) : null))

usePageSeo(
  tool.value
    ? {
        title: tool.value.seo?.title ?? `${tool.value.name} · ToolKit`,
        description: tool.value.seo?.description ?? tool.value.description,
        path: `/tools/${tool.value.slug}`,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: tool.value.name,
          description: tool.value.seo?.description ?? tool.value.description,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Web Browser',
          offers: { '@type': 'Offer', price: '0' },
        },
      }
    : {
        title: '工具不存在 · ToolKit',
        description: '工具不存在或已下架。',
        path: `/tools/${slug.value}`,
        noindex: true,
      },
)

onMounted(() => {
  if (tool.value) {
    useRecentStore().touch(tool.value.slug)
  }
})
</script>

<template>
  <section class="container section">
    <!-- 未找到工具：不渲染伪造页面（内容红线） -->
    <div v-if="!tool" class="soft-empty">
      工具不存在或已下架
      <br />
      <NuxtLink class="soft-empty-action" to="/">返回全部工具</NuxtLink>
    </div>

    <template v-else>
      <nav class="crumb" aria-label="面包屑">
        <NuxtLink to="/">全部工具</NuxtLink>
        <span aria-hidden="true">/</span>
        <NuxtLink v-if="category" :to="`/category/${category.slug}`">{{ category.name }}</NuxtLink>
        <span aria-hidden="true">/</span>
        <span>{{ tool.name }}</span>
      </nav>

      <header class="tool-head">
        <h1>{{ tool.name }}</h1>
        <p>{{ tool.description }}</p>
        <div class="head-tags">
          <span class="tag-local">{{ executionTag }}</span>
          <span v-for="tag in tool.tags" :key="tag" class="tag-plain">{{ tag }}</span>
        </div>
      </header>

      <!-- 工具运行区：客户端工具加载组件；服务端/文件工具静态版如实提示需部署后端 -->
      <div class="run-panel">
        <component :is="ToolView" v-if="ToolView" :key="tool.slug" />
        <div v-else-if="tool.execution !== 'client'" class="soft-empty static-note">
          <b>{{ tool.name }}</b> 属于「{{ executionTag }}」工具，需要后端服务支持
          <br />
          当前站点为纯静态部署，部署后端（FastAPI）后即可在此使用该工具
          <br />
          <NuxtLink class="soft-empty-action" to="/">返回全部工具</NuxtLink>
        </div>
        <el-empty v-else description="该工具正在开发中，尚未开放使用">
          <el-button type="primary" @click="$router.push('/')">返回全部工具</el-button>
        </el-empty>
      </div>

      <!-- 相关工具 -->
      <section v-if="related.length" class="related">
        <h2>同类工具</h2>
        <div class="related-grid">
          <ToolCard v-for="t in related" :key="t.slug" :tool="t" />
        </div>
      </section>
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
  margin-bottom: 18px;
}
.crumb a {
  color: var(--text-2);
  transition: color var(--transition);
}
.crumb a:hover {
  color: var(--accent-deep);
}
.tool-head {
  margin-bottom: 24px;
}
.tool-head h1 {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.015em;
  margin: 0 0 6px;
}
.tool-head p {
  font-size: 14px;
  color: var(--text-2);
  margin: 0 0 14px;
}
.head-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}
.tag-plain {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--bg-soft);
  color: var(--text-3);
}
.run-panel {
  background: var(--bg-card);
  border-radius: 22px;
  box-shadow: var(--shadow-sm);
  padding: 28px;
}
.static-note {
  background: var(--bg-page);
}
.related {
  margin-top: 44px;
}
.related h2 {
  font-size: 17px;
  font-weight: 600;
  margin: 0 0 16px;
}
.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 768px) {
  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>
