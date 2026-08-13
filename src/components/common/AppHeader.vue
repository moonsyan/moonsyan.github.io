<script setup lang="ts">
/**
 * 全局头部（WEB-001 + 风格 Demo V5 柔和极简）：
 * Logo、页面导航（含 MarkdownSoft 入口）、搜索栏与主题切换。
 * 图标按钮均提供可访问名称（SEO-004）。
 * 静态版不提供匿名反馈入口（依赖服务端 API）。
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '~/stores/theme'

const theme = useThemeStore()
const router = useRouter()
const keyword = ref('')

function submitSearch() {
  const q = keyword.value.trim()
  router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
}
</script>

<template>
  <header class="topbar">
    <div class="container topbar-inner">
      <NuxtLink to="/" class="logo" aria-label="ToolKit 首页">
        <span class="logo-mark">T</span>
        ToolKit
      </NuxtLink>

      <nav class="topnav" aria-label="页面导航">
        <NuxtLink to="/">工具</NuxtLink>
        <NuxtLink to="/recent">最近使用</NuxtLink>
        <NuxtLink to="/favorites">收藏</NuxtLink>
        <NuxtLink to="/faq">常见问题</NuxtLink>
        <NuxtLink to="/markdownsoft">MarkdownSoft</NuxtLink>
      </nav>

      <form class="topbar-search" role="search" @submit.prevent="submitSearch">
        <span class="s-icon" aria-hidden="true">⌕</span>
        <input
          v-model="keyword"
          type="search"
          placeholder="搜索工具，如 JSON 格式化…"
          aria-label="搜索工具"
        />
        <button class="s-btn" type="submit">搜索</button>
      </form>

      <div class="topbar-actions">
        <button
          class="icon-btn"
          :aria-label="theme.theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'"
          @click="theme.toggle()"
        >
          ◐
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  height: 68px;
  background: color-mix(in srgb, var(--bg-page) 88%, transparent);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 60;
}
.topbar-inner {
  display: flex;
  align-items: center;
  gap: 18px;
  height: 100%;
}
.logo {
  display: flex;
  align-items: center;
  gap: 9px;
  font-weight: 600;
  font-size: 15px;
  flex-shrink: 0;
}
.logo-mark {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background: var(--accent-tint);
  color: var(--accent-deep);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}
.topnav {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}
.topnav a {
  padding: 7px 14px;
  border-radius: 999px;
  color: var(--text-2);
  font-size: 13.5px;
  transition: all var(--transition);
}
.topnav a:hover {
  color: var(--text-1);
  background: var(--bg-card);
  box-shadow: var(--shadow-sm);
}
.topnav a.router-link-active {
  color: var(--accent-deep);
  font-weight: 600;
  background: var(--accent-tint);
}
.topbar-search {
  flex: 1;
  max-width: 400px;
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px 4px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 999px;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition);
}
.topbar-search:focus-within {
  border-color: var(--border);
  box-shadow: var(--shadow-md);
}
.s-icon {
  color: var(--text-3);
  font-size: 14px;
}
.topbar-search input {
  flex: 1;
  border: none;
  outline: none;
  background: none;
  font-size: 13.5px;
  color: var(--text-1);
  min-width: 0;
  font-family: inherit;
}
.topbar-search input::placeholder {
  color: var(--text-3);
}
.s-btn {
  padding: 7px 16px;
  border: none;
  border-radius: 999px;
  background: var(--text-1);
  color: var(--bg-page);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background var(--transition);
  flex-shrink: 0;
}
.s-btn:hover {
  background: var(--accent-deep);
  color: #fff;
}
.topbar-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}
.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: none;
  background: none;
  color: var(--text-2);
  cursor: pointer;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
}
.icon-btn:hover {
  color: var(--accent-deep);
  background: var(--accent-tint);
}
@media (max-width: 1000px) {
  .topnav {
    display: none;
  }
}
@media (max-width: 640px) {
  .s-btn {
    display: none;
  }
}
</style>
