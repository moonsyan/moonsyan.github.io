<script setup lang="ts">
/**
 * 首页（WEB-002 + 风格 Demo V5 柔和极简）：
 * 居中 Hero + 大搜索、最近使用快捷条、分类胶囊筛选与工具卡片墙、
 * 站长工具推荐（MarkdownSoft）与隐私横幅。
 * 静态版不展示没有数据依据的"热门"标签，也不拉取后台运营配置（内容红线）。
 */
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { categories } from '~/tools/categories'
import { allTools, toolBySlug } from '~/tools/registry'
import { useRecentStore } from '~/stores/recent'
import { usePageSeo } from '~/composables/usePageSeo'
import { RELEASE_URL } from '~/lib/constants'

usePageSeo({
  title: 'ToolKit · 本地运行的在线效率工具集合',
  description: `${allTools.length} 款效率工具：客户端工具浏览器内即时完成，服务端与文件任务按需执行，打开即用。`,
  path: '/',
})

const recent = useRecentStore()
const router = useRouter()
const activeCategory = ref<string>('all')
const keyword = ref('')

onMounted(() => recent.load())

const clientToolCount = computed(() => allTools.filter((t) => t.execution === 'client').length)
const serverToolCount = computed(() => allTools.length - clientToolCount.value)

const recentTools = computed(() =>
  recent.entries.slice(0, 3).flatMap((e) => {
    const tool = toolBySlug.get(e.slug)
    return tool ? [tool] : []
  }),
)

const visibleTools = computed(() =>
  allTools.filter((t) => activeCategory.value === 'all' || t.category === activeCategory.value),
)

function submitSearch() {
  const q = keyword.value.trim()
  router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
}
</script>

<template>
  <!-- Hero：一句话 + 大搜索 -->
  <section class="hero">
    <div class="container">
      <span class="hero-badge"><i class="dot" aria-hidden="true"></i>前端工具在你的浏览器里运行</span>
      <h1>简单的工具，安静地帮你做事</h1>
      <p class="hero-sub">
        {{ clientToolCount }} 款前端工具打开即用，另有 {{ serverToolCount }} 款服务端与文件工具需部署后端。
        不注册，不上传，用完即走。
      </p>
      <form class="hero-search" role="search" @submit.prevent="submitSearch">
        <span class="hs-icon" aria-hidden="true">⌕</span>
        <input
          v-model="keyword"
          type="search"
          placeholder="想找点什么？比如 JSON、时间戳、颜色…"
          aria-label="搜索工具"
        />
      </form>
    </div>
  </section>

  <!-- 最近使用快捷条：数据仅保存在本机浏览器（WEB-007） -->
  <section v-if="recentTools.length" class="container">
    <div class="quickstrip">
      <span class="quick-label">最近使用</span>
      <NuxtLink
        v-for="tool in recentTools"
        :key="tool.slug"
        :to="`/tools/${tool.slug}`"
        class="quick-chip"
      >
        {{ tool.name }}
      </NuxtLink>
      <span class="quick-note">记录仅保存在本机浏览器</span>
    </div>
  </section>

  <!-- 全部工具：分类胶囊 + 卡片墙 -->
  <section class="container section">
    <div class="pills" role="tablist" aria-label="按分类筛选">
      <button class="pill" :class="{ on: activeCategory === 'all' }" @click="activeCategory = 'all'">
        全部
      </button>
      <button
        v-for="c in categories"
        :key="c.slug"
        class="pill"
        :class="{ on: activeCategory === c.slug }"
        @click="activeCategory = c.slug"
      >
        {{ c.name }}
      </button>
    </div>

    <div class="tool-grid">
      <ToolCard v-for="tool in visibleTools" :key="tool.slug" :tool="tool" />
    </div>
  </section>

  <!-- 站长工具推荐：MarkdownSoft 产品入口 -->
  <section id="rec" class="container section">
    <div class="rec-head">
      <h2>站长工具推荐</h2>
      <p>站长自用产品，向你推荐</p>
    </div>
    <div class="rec-card">
      <span class="rec-mark" aria-hidden="true">M</span>
      <div class="rec-main">
        <div class="rec-name">MarkdownSoft</div>
        <p class="rec-slogan">本地优先 · 专注写作的 Markdown 编辑器</p>
        <p class="rec-desc">
          基于 Electron 与 Milkdown 打造，支持多文件工作区、Wiki 链接、实时预览与多格式导出。
        </p>
      </div>
      <div class="rec-actions">
        <NuxtLink class="rec-btn primary" to="/markdownsoft">查看详情</NuxtLink>
        <a class="rec-btn ghost" :href="RELEASE_URL" target="_blank" rel="noopener">下载</a>
      </div>
    </div>
  </section>

  <!-- 隐私横幅 -->
  <section class="container">
    <CommonPrivacyBanner />
  </section>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: 72px 0 8px;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12.5px;
  color: var(--accent-deep);
  background: var(--accent-tint);
  padding: 6px 16px;
  border-radius: 999px;
  margin-bottom: 26px;
}
.hero-badge .dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
}
.hero h1 {
  margin: 0 auto;
  font-size: clamp(30px, 3.8vw, 42px);
  font-weight: 600;
  letter-spacing: -0.015em;
  line-height: 1.3;
}
.hero-sub {
  margin: 18px auto 0;
  color: var(--text-2);
  font-size: 15px;
}
.hero-search {
  max-width: 520px;
  margin: 38px auto 0;
  position: relative;
}
.hs-icon {
  position: absolute;
  left: 22px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-3);
  font-size: 16px;
}
.hero-search input {
  width: 100%;
  padding: 17px 24px 17px 52px;
  font-size: 15px;
  font-family: inherit;
  color: var(--text-1);
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 999px;
  box-shadow: var(--shadow-sm);
  transition: border-color var(--transition), box-shadow var(--transition);
}
.hero-search input::placeholder {
  color: var(--text-3);
}
.hero-search input:focus {
  outline: none;
  border-color: var(--border);
  box-shadow: var(--shadow-md);
}
.quickstrip {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 34px;
  padding: 12px 18px;
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  box-shadow: var(--shadow-sm);
  font-size: 13px;
}
.quick-label {
  color: var(--text-3);
}
.quick-chip {
  padding: 5px 14px;
  border-radius: 999px;
  background: var(--bg-soft);
  color: var(--text-2);
  font-size: 13px;
  transition: all var(--transition);
}
.quick-chip:hover {
  color: var(--accent-deep);
  background: var(--accent-tint);
}
.quick-note {
  margin-left: auto;
  color: var(--text-3);
  font-size: 12px;
}
.section {
  padding-top: 40px;
}
.pills {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 9px;
  margin-bottom: 34px;
}
.pill {
  font-size: 13.5px;
  font-family: inherit;
  color: var(--text-2);
  padding: 8px 19px;
  border-radius: 999px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all var(--transition);
}
.pill:hover {
  color: var(--text-1);
  background: var(--bg-card);
  box-shadow: var(--shadow-sm);
}
.pill.on {
  background: var(--text-1);
  color: var(--bg-page);
}
.tool-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

/* 站长工具推荐 */
.rec-head h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}
.rec-head p {
  font-size: 13px;
  color: var(--text-3);
  margin: 4px 0 0;
}
.rec-card {
  display: flex;
  align-items: center;
  gap: 22px;
  padding: 28px 30px;
  margin-top: 18px;
  background: var(--bg-card);
  border-radius: 22px;
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition);
}
.rec-card:hover {
  box-shadow: var(--shadow-md);
}
.rec-mark {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 16px;
  background: var(--accent-tint);
  color: var(--accent-deep);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
}
.rec-main {
  flex: 1;
  min-width: 0;
}
.rec-name {
  font-size: 17px;
  font-weight: 600;
}
.rec-slogan {
  font-size: 13.5px;
  color: var(--accent-deep);
  margin: 3px 0 0;
}
.rec-desc {
  font-size: 12.5px;
  color: var(--text-3);
  margin: 5px 0 0;
}
.rec-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}
.rec-btn {
  padding: 10px 22px;
  border-radius: 999px;
  font-size: 13.5px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
}
.rec-btn.primary {
  background: var(--text-1);
  color: var(--bg-page);
}
.rec-btn.primary:hover {
  background: var(--accent-deep);
  color: #fff;
}
.rec-btn.ghost {
  background: transparent;
  color: var(--text-2);
  border: 1px solid var(--border);
}
.rec-btn.ghost:hover {
  color: var(--accent-deep);
  border-color: var(--accent);
}

@media (max-width: 1000px) {
  .tool-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 720px) {
  .rec-card {
    flex-direction: column;
    align-items: flex-start;
  }
  .rec-actions {
    width: 100%;
  }
  .rec-btn {
    flex: 1;
  }
}
@media (max-width: 640px) {
  .hero {
    padding-top: 48px;
  }
  .tool-grid {
    grid-template-columns: 1fr;
  }
  .quick-note {
    margin-left: 0;
    width: 100%;
  }
}
</style>
