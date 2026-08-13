<script setup lang="ts">
/**
 * MarkdownSoft 产品详情页（站长工具推荐栏目）：
 * 面包屑 → Hero（标语 / 描述 / 下载 CTA）→ 8 项功能特性 → 相关推荐（站内真实工具）。
 * 文案沿用 MarkdownSoft 官网文案（本地优先 · 专注写作），图标统一使用 @element-plus/icons-vue。
 * 无截图占位、无版本标签、无虚构数据（内容红线）。
 */
import {
  EditPen,
  FolderOpened,
  Link as LinkIcon,
  Brush,
  View,
  Download,
  Lock,
  DataLine,
} from '@element-plus/icons-vue'
import { usePageSeo } from '~/composables/usePageSeo'
import { toolBySlug } from '~/tools/registry'
import { RELEASE_URL } from '~/lib/constants'

usePageSeo({
  title: 'MarkdownSoft · 本地优先的 Markdown 编辑器',
  description:
    '基于 Electron 与 Milkdown 打造的桌面 Markdown 编辑器：多文件工作区、Wiki 双链、实时预览与多格式导出，数据只存在你的电脑上。',
  path: '/markdownsoft',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'MarkdownSoft',
    description: '本地优先 · 专注写作的 Markdown 编辑器',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Windows, macOS, Linux',
    offers: { '@type': 'Offer', price: '0' },
  },
})

const features = [
  { icon: EditPen, title: '富文本编辑', desc: 'GFM、表格、任务列表、代码块，所见即所得' },
  { icon: FolderOpened, title: '多文件工作区', desc: '文件夹即工作区，文件树、拖拽导入、全文搜索' },
  { icon: LinkIcon, title: 'Wiki 链接', desc: '[[双链]] 跳转与自动补全，笔记互联' },
  { icon: Brush, title: '多主题系统', desc: '内置四套主题，支持导入自定义 CSS' },
  { icon: View, title: '分栏实时预览', desc: '编辑与预览同步滚动，所见即所得' },
  { icon: Download, title: '多格式导出', desc: 'HTML / PDF / Word / EPUB / LaTeX' },
  { icon: Lock, title: '本地优先', desc: '数据只存在你的电脑上，无需联网' },
  { icon: DataLine, title: '写作统计', desc: '实时字数、阅读时长、30 天写作历史' },
]

const mdPreview = toolBySlug.get('markdown-preview')
</script>

<template>
  <section class="container section">
    <nav class="crumb" aria-label="面包屑">
      <NuxtLink to="/">全部工具</NuxtLink>
      <span aria-hidden="true">/</span>
      <NuxtLink to="/#rec">站长工具推荐</NuxtLink>
      <span aria-hidden="true">/</span>
      <span>MarkdownSoft</span>
    </nav>

    <!-- Hero -->
    <header class="hero">
      <span class="hero-mark" aria-hidden="true">M</span>
      <h1>MarkdownSoft</h1>
      <p class="hero-slogan">本地优先 · 专注写作的 Markdown 编辑器</p>
      <p class="hero-desc">
        基于 Electron 与 Milkdown 打造，支持多文件工作区、Wiki 链接、实时预览与多格式导出。
        你的数据只存在自己的电脑上。
      </p>
      <div class="hero-actions">
        <a class="btn primary" :href="RELEASE_URL" target="_blank" rel="noopener">下载 MarkdownSoft</a>
        <NuxtLink class="btn ghost" to="/tools/markdown-preview">在线体验 Markdown 预览</NuxtLink>
      </div>
      <p class="hero-note">免费 · Windows / macOS / Linux</p>
    </header>

    <!-- 功能特性 -->
    <section class="features">
      <h2>功能特性</h2>
      <div class="grid">
        <article v-for="f in features" :key="f.title" class="card">
          <span class="card-icon"><component :is="f.icon" /></span>
          <h3>{{ f.title }}</h3>
          <p>{{ f.desc }}</p>
        </article>
      </div>
    </section>

    <!-- 相关推荐：站内真实工具（不放置截图占位） -->
    <section v-if="mdPreview" class="related">
      <h2>相关推荐</h2>
      <p class="related-note">先在浏览器里体验 Markdown 在线预览，再下载桌面版。</p>
      <div class="related-card">
        <ToolCard :tool="mdPreview" />
      </div>
    </section>
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

.hero {
  text-align: center;
  padding: 48px 0 8px;
}
.hero-mark {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: var(--accent-tint);
  color: var(--accent-deep);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 24px;
}
.hero h1 {
  margin: 0;
  font-size: clamp(30px, 3.8vw, 42px);
  font-weight: 600;
  letter-spacing: -0.015em;
  line-height: 1.3;
}
.hero-slogan {
  margin: 12px 0 0;
  font-size: 16px;
  color: var(--accent-deep);
}
.hero-desc {
  margin: 14px auto 0;
  max-width: 34em;
  color: var(--text-2);
  font-size: 14.5px;
}
.hero-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 30px;
  flex-wrap: wrap;
}
.btn {
  padding: 12px 28px;
  border-radius: 999px;
  font-size: 14.5px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
}
.btn.primary {
  background: var(--text-1);
  color: var(--bg-page);
}
.btn.primary:hover {
  background: var(--accent-deep);
  color: #fff;
  transform: translateY(-1px);
}
.btn.ghost {
  background: transparent;
  color: var(--text-2);
  border: 1px solid var(--border);
}
.btn.ghost:hover {
  color: var(--accent-deep);
  border-color: var(--accent);
}
.hero-note {
  margin: 16px 0 0;
  font-size: 13px;
  color: var(--text-3);
}

.features {
  padding-top: 64px;
}
.features h2 {
  font-size: 22px;
  font-weight: 600;
  text-align: center;
  margin: 0 0 32px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px 26px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition), box-shadow var(--transition);
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}
.card-icon {
  width: 44px;
  height: 44px;
  border-radius: 13px;
  background: var(--accent-tint);
  color: var(--accent-deep);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
.card h3 {
  font-size: 15.5px;
  font-weight: 600;
  margin: 0;
}
.card p {
  font-size: 13px;
  color: var(--text-2);
  margin: 0;
}

.related {
  padding-top: 64px;
}
.related h2 {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 6px;
}
.related-note {
  font-size: 13px;
  color: var(--text-3);
  margin: 0 0 18px;
}
.related-card {
  max-width: 380px;
}

@media (max-width: 720px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
