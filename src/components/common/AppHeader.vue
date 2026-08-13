<script setup lang="ts">
/**
 * 全局头部（WEB-001 + 风格 Demo V5 柔和极简）：
 * Logo、页面导航（含 MarkdownSoft 入口）、搜索栏与主题切换。
 * 图标按钮均提供可访问名称（SEO-004）。
 * 静态版不提供匿名反馈入口（依赖服务端 API）。
 */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore, THEMES, type ThemeName } from '~/stores/theme'
import { Sunny, Moon, MostlyCloudy, Cherry, ArrowDown } from '@element-plus/icons-vue'

const theme = useThemeStore()
const router = useRouter()
const keyword = ref('')

const themeIcons = { light: Sunny, dark: Moon, ocean: MostlyCloudy, rose: Cherry } as const
const currentIcon = computed(() => themeIcons[theme.theme])
const currentLabel = computed(() => THEMES.find((t) => t.name === theme.theme)?.label ?? '亮色')

function onThemeCommand(name: ThemeName | string | number | object) {
  if (typeof name === 'string' && name in themeIcons) {
    theme.set(name as ThemeName)
  }
}

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
        <el-dropdown trigger="click" @command="onThemeCommand">
          <button class="theme-btn" :aria-label="`当前主题：${currentLabel}，点击切换`">
            <el-icon class="theme-icon" aria-hidden="true"><component :is="currentIcon" /></el-icon>
            <span class="theme-label">{{ currentLabel }}</span>
            <el-icon class="theme-caret" aria-hidden="true"><ArrowDown /></el-icon>
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="t in THEMES"
                :key="t.name"
                :command="t.name"
                :class="{ 'theme-item-on': theme.theme === t.name }"
              >
                <el-icon aria-hidden="true"><component :is="themeIcons[t.name]" /></el-icon>
                {{ t.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  height: 74px;
  background: color-mix(in srgb, var(--bg-page) 86%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 60;
  border-bottom: 1px solid var(--border-light);
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
.theme-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid var(--border-light);
  background: var(--bg-card);
  box-shadow: var(--shadow-sm);
  color: var(--text-2);
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
  transition: all var(--transition);
}
.theme-btn:hover {
  color: var(--accent-deep);
  border-color: var(--border);
}
.theme-icon {
  font-size: 15px;
  color: var(--accent);
}
.theme-caret {
  font-size: 11px;
  color: var(--text-3);
}
:deep(.theme-item-on) {
  color: var(--accent-deep);
  font-weight: 600;
}
@media (max-width: 640px) {
  .theme-label,
  .theme-caret {
    display: none;
  }
  .theme-btn {
    padding: 0 11px;
  }
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
