# 官网 v1 (moonsyan.github.io) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `D:\project\github_io` 构建 MarkdownSoft 官网 v1:Vue 3 + Vite + TS 单页落地页,中英双语切换、四套主题切换、截图占位组件,经 GitHub Actions 部署到 `https://moonsyan.github.io/`。

**Architecture:** 轻量自研 SPA。`App.vue` 持有 `locale`(zh/en)与 `theme`(light/dark/rose/ocean)两个响应式状态;`useI18n`/`useTheme` 两个 composable 管理状态、localStorage 持久化与 `<html>` 属性同步;四套主题只以 CSS 变量形式覆盖;页面由 HeroSection(含截图占位)、FeatureGrid、DownloadSection、SiteFooter 四个区块组件拼成;`deploy.yml` 用官方 deploy-pages 动作发布 `dist/`。

**Tech Stack:** Vue 3(`<script setup>` + TS)、Vite、vue-tsc、vitest(jsdom 环境)、GitHub Actions(deploy-pages)。**不引入** vue-router、vue-i18n。

**设计文档:** `docs/superpowers/specs/2026-08-13-moonsyan-github-io-design.md`

## Global Constraints

- vite 配置 `base: '/'`(用户站点根路径,无需子路径)
- **本仓库正常跟踪 package-lock.json**(与 mkEditor 仓库约定不同);CI 用 `npm ci` + setup-node `cache: npm`
- 所有面向用户的文案一律放在 `src/locales/zh.ts` 与 `src/locales/en.ts`(键名一一对应),组件内不写死文案
- localStorage 键名固定:`site-locale`、`site-theme`
- 默认语言 `zh`;默认主题跟随 `prefers-color-scheme`(仅 light/dark 两值)
- 主题由 `<html data-theme>` 属性驱动,恰好 4 套:`light` / `dark` / `rose` / `ocean`
- 下载按钮静态链接到 `https://github.com/moonsyan/mkEditor/releases/latest`(不做动态拉取)
- 截图区域为占位组件;真实截图后续放入 `public/screenshots/`
- 本仓库推送需走代理(已在仓库级 `git config http.proxy = http://127.0.0.1:10809`,无需处理)
- 若本机 `npm install` 网络超时,改用 `npm install --registry=https://registry.npmmirror.com`

---

### Task 1: 项目脚手架

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `.gitignore`
- Create: `src/main.ts`
- Create: `src/App.vue`(占位版)
- Create: `public/screenshots/.gitkeep`
- Copy: `D:\project\markdown\github\resources\icon.png` → `public/icon.png`(站点 favicon)

**Interfaces:**
- Consumes: 无
- Produces: 可运行的空站点骨架;`npm run dev` 出页面、`npm run build` 出 `dist/`

- [ ] **Step 1: 写 `package.json`**

```json
{
  "name": "moonsyan-github-io",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "MarkdownSoft official website",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview",
    "typecheck": "vue-tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "vue": "^3.5.13"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.1",
    "jsdom": "^25.0.1",
    "typescript": "^5.7.2",
    "vite": "^6.0.5",
    "vitest": "^2.1.9",
    "vue-tsc": "^2.2.0"
  }
}
```

- [ ] **Step 2: 写 `vite.config.ts`**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/',
  test: {
    environment: 'jsdom'
  }
})
```

- [ ] **Step 3: 写 `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "strict": true,
    "noEmit": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["vite/client"]
  },
  "include": ["src/**/*.ts", "src/**/*.vue", "vite.config.ts"]
}
```

- [ ] **Step 4: 写 `index.html`**(内联脚本在渲染前设置 `data-theme`,避免主题闪烁 FOUC)

```html
<!doctype html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="MarkdownSoft - 本地优先的桌面 Markdown 编辑器 / Local-first Markdown editor for desktop" />
    <link rel="icon" type="image/png" href="/icon.png" />
    <title>MarkdownSoft</title>
    <script>
      ;(function () {
        var themes = ['light', 'dark', 'rose', 'ocean']
        try {
          var t = localStorage.getItem('site-theme')
          if (themes.indexOf(t) !== -1) {
            document.documentElement.setAttribute('data-theme', t)
            return
          }
        } catch (e) {}
        var dark =
          window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
      })()
    </script>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 5: 写 `.gitignore`**

```
node_modules
dist
```

- [ ] **Step 6: 写 `src/main.ts` 与占位 `src/App.vue`**

`src/main.ts`:

```ts
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

`src/App.vue`(占位,Task 4 会重写):

```vue
<template>
  <h1>MarkdownSoft</h1>
</template>
```

- [ ] **Step 7: 复制 favicon**

复制 `D:\project\markdown\github\resources\icon.png` 到 `public/icon.png`;创建 `public/screenshots/.gitkeep`。

- [ ] **Step 8: 安装依赖并验证构建**

Run: `npm install`(超时则加 `--registry=https://registry.npmmirror.com`)
Run: `npm run build`
Expected: 构建成功,生成 `dist/index.html` 与静态资源

- [ ] **Step 9: 提交**(**必须提交 package-lock.json**)

```bash
git add package.json package-lock.json vite.config.ts tsconfig.json index.html .gitignore src public
git commit -m "feat: 项目脚手架(Vue3 + Vite + TS)"
```

---

### Task 2: useI18n 与文案字典(TDD)

**Files:**
- Create: `src/composables/useI18n.ts`
- Create: `src/composables/useI18n.test.ts`
- Create: `src/locales/zh.ts`
- Create: `src/locales/en.ts`

**Interfaces:**
- Consumes: 无
- Produces:
  - `type Locale = 'zh' | 'en'`
  - `useI18n(): { locale: Ref<Locale>, setLocale(l: Locale): void, t(key: string): string }` — 单例;`t` 对未知 key 回退返回 key 本身;`setLocale` 同步 localStorage(`site-locale`)与 `<html lang>`

- [ ] **Step 1: 写文案字典(完整文案,两种语言键一一对应)**

`src/locales/zh.ts`:

```ts
export default {
  'header.language': '语言',
  'header.theme': '主题',
  'hero.tagline': '本地优先 · 专注写作的 Markdown 编辑器',
  'hero.desc': '基于 Electron 与 Milkdown 打造,支持多文件工作区、Wiki 链接、实时预览与多格式导出。',
  'hero.cta': '下载 MarkdownSoft',
  'hero.ctaSub': '免费 · Windows / macOS / Linux',
  'placeholder.caption': '截图待补充',
  'features.title': '功能特性',
  'features.editor.title': '富文本编辑',
  'features.editor.desc': 'GFM、表格、任务列表、代码块,所见即所得',
  'features.workspace.title': '多文件工作区',
  'features.workspace.desc': '文件夹即工作区,文件树、拖拽导入、全文搜索',
  'features.wiki.title': 'Wiki 链接',
  'features.wiki.desc': '[[双链]] 跳转与自动补全,笔记互联',
  'features.themes.title': '多主题系统',
  'features.themes.desc': '内置四套主题,支持导入自定义 CSS',
  'features.preview.title': '分栏实时预览',
  'features.preview.desc': '编辑与预览同步滚动,所见即所得',
  'features.export.title': '多格式导出',
  'features.export.desc': 'HTML / PDF / Word / EPUB / LaTeX',
  'features.local.title': '本地优先',
  'features.local.desc': '数据只存在你的电脑上,无需联网',
  'features.stats.title': '写作统计',
  'features.stats.desc': '实时字数、阅读时长、30 天写作历史',
  'download.title': '下载',
  'download.desc': '前往 GitHub Releases 获取各平台最新版本。',
  'download.cta': '查看 Releases',
  'footer.copyright': '© 2026 moonsyan · MarkdownSoft',
  'footer.source': 'GitHub 源码'
} satisfies Record<string, string>
```

`src/locales/en.ts`(与 zh 键完全一致):

```ts
export default {
  'header.language': 'Language',
  'header.theme': 'Theme',
  'hero.tagline': 'Local-first Markdown editor for focused writing',
  'hero.desc': 'Built with Electron and Milkdown: multi-file workspaces, wiki links, live preview, and multi-format export.',
  'hero.cta': 'Download MarkdownSoft',
  'hero.ctaSub': 'Free · Windows / macOS / Linux',
  'placeholder.caption': 'Screenshot coming soon',
  'features.title': 'Features',
  'features.editor.title': 'Rich text editing',
  'features.editor.desc': 'GFM, tables, task lists and code blocks, WYSIWYG',
  'features.workspace.title': 'Multi-file workspace',
  'features.workspace.desc': 'A folder becomes a workspace: file tree, drag & drop, full-text search',
  'features.wiki.title': 'Wiki links',
  'features.wiki.desc': '[[wikilinks]] with autocomplete, notes connected',
  'features.themes.title': 'Theme system',
  'features.themes.desc': 'Four built-in themes plus custom CSS import',
  'features.preview.title': 'Split live preview',
  'features.preview.desc': 'Sync-scrolled editing and preview',
  'features.export.title': 'Multi-format export',
  'features.export.desc': 'HTML, PDF, Word, EPUB, LaTeX',
  'features.local.title': 'Local-first',
  'features.local.desc': 'Your data stays on your machine, no cloud needed',
  'features.stats.title': 'Writing stats',
  'features.stats.desc': 'Word counts, reading time, 30-day history',
  'download.title': 'Download',
  'download.desc': 'Get the latest version for each platform on GitHub Releases.',
  'download.cta': 'View Releases',
  'footer.copyright': '© 2026 moonsyan · MarkdownSoft',
  'footer.source': 'Source on GitHub'
} satisfies Record<string, string>
```

- [ ] **Step 2: 写失败测试 `src/composables/useI18n.test.ts`**

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('useI18n', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  async function load() {
    const mod = await import('./useI18n')
    return mod.useI18n()
  }

  it('默认语言为 zh', async () => {
    const { locale } = await load()
    expect(locale.value).toBe('zh')
  })

  it('setLocale 切换语言并持久化', async () => {
    const { locale, setLocale, t } = await load()
    setLocale('en')
    expect(locale.value).toBe('en')
    expect(localStorage.getItem('site-locale')).toBe('en')
    expect(t('hero.cta')).toBe('Download MarkdownSoft')
  })

  it('从 localStorage 恢复上次语言', async () => {
    localStorage.setItem('site-locale', 'en')
    const { locale } = await load()
    expect(locale.value).toBe('en')
  })

  it('未知 key 回退返回 key 本身', async () => {
    const { t } = await load()
    expect(t('no.such.key')).toBe('no.such.key')
  })
})
```

- [ ] **Step 3: 运行测试确认失败**

Run: `npx vitest run src/composables/useI18n.test.ts`
Expected: FAIL(模块不存在)

- [ ] **Step 4: 写实现 `src/composables/useI18n.ts`**

```ts
import { ref } from 'vue'
import zh from '../locales/zh'
import en from '../locales/en'

export type Locale = 'zh' | 'en'

const STORAGE_KEY = 'site-locale'
const dicts: Record<Locale, Record<string, string>> = { zh, en }

function loadLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'zh' || saved === 'en') return saved
  } catch {
    /* localStorage 不可用时忽略 */
  }
  return 'zh'
}

const locale = ref<Locale>(loadLocale())

export function useI18n() {
  function setLocale(l: Locale) {
    locale.value = l
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* 忽略 */
    }
    document.documentElement.lang = l
  }

  function t(key: string): string {
    return dicts[locale.value][key] ?? key
  }

  return { locale, setLocale, t }
}
```

- [ ] **Step 5: 运行测试确认通过**

Run: `npx vitest run src/composables/useI18n.test.ts`
Expected: 4 tests PASS

- [ ] **Step 6: 提交**

```bash
git add src/composables/useI18n.ts src/composables/useI18n.test.ts src/locales
git commit -m "feat: useI18n 双语切换与文案字典"
```

---

### Task 3: useTheme 与四套主题变量(TDD)

**Files:**
- Create: `src/composables/useTheme.ts`
- Create: `src/composables/useTheme.test.ts`
- Create: `src/themes/light.css`
- Create: `src/themes/dark.css`
- Create: `src/themes/rose.css`
- Create: `src/themes/ocean.css`

**Interfaces:**
- Consumes: 无
- Produces:
  - `type Theme = 'light' | 'dark' | 'rose' | 'ocean'`
  - `const THEMES: Theme[] = ['light', 'dark', 'rose', 'ocean']`(供切换控件遍历)
  - `useTheme(): { theme: Ref<Theme>, setTheme(t: Theme): void }` — 单例;`setTheme` 同步 localStorage(`site-theme`)与 `<html data-theme>`
  - 主题 CSS 变量(每套主题都定义全套):
    `--bg` `--bg-card` `--bg-soft` `--text` `--text-muted` `--border` `--accent` `--accent-contrast`

- [ ] **Step 1: 写失败测试 `src/composables/useTheme.test.ts`**

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    vi.resetModules()
  })

  async function load() {
    const mod = await import('./useTheme')
    return mod.useTheme()
  }

  it('默认浅色主题', async () => {
    const { theme } = await load()
    expect(theme.value).toBe('light')
  })

  it('系统深色偏好时默认深色主题', async () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true
    } as MediaQueryList)
    const { theme } = await load()
    expect(theme.value).toBe('dark')
    vi.restoreAllMocks()
  })

  it('setTheme 切换并同步 html 属性与 localStorage', async () => {
    const { theme, setTheme } = await load()
    setTheme('ocean')
    expect(theme.value).toBe('ocean')
    expect(document.documentElement.getAttribute('data-theme')).toBe('ocean')
    expect(localStorage.getItem('site-theme')).toBe('ocean')
  })

  it('localStorage 非法值回退到系统偏好', async () => {
    localStorage.setItem('site-theme', 'neon')
    const { theme } = await load()
    expect(['light', 'dark']).toContain(theme.value)
  })

  it('THEMES 导出恰好四套主题', async () => {
    const { THEMES } = await import('./useTheme')
    expect(THEMES).toEqual(['light', 'dark', 'rose', 'ocean'])
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/composables/useTheme.test.ts`
Expected: FAIL(模块不存在)

- [ ] **Step 3: 写实现 `src/composables/useTheme.ts`**

```ts
import { ref } from 'vue'

export type Theme = 'light' | 'dark' | 'rose' | 'ocean'
export const THEMES: Theme[] = ['light', 'dark', 'rose', 'ocean']

const STORAGE_KEY = 'site-theme'
const isTheme = (v: unknown): v is Theme => THEMES.includes(v as Theme)

function loadTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isTheme(saved)) return saved
  } catch {
    /* localStorage 不可用时忽略 */
  }
  const dark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  return dark ? 'dark' : 'light'
}

const theme = ref<Theme>(loadTheme())
document.documentElement.setAttribute('data-theme', theme.value)

export function useTheme() {
  function setTheme(t: Theme) {
    theme.value = t
    document.documentElement.setAttribute('data-theme', t)
    try {
      localStorage.setItem(STORAGE_KEY, t)
    } catch {
      /* 忽略 */
    }
  }

  return { theme, setTheme }
}
```

- [ ] **Step 4: 写四套主题 CSS(只含变量覆盖)**

`src/themes/light.css`(默认,同时兜底无 `data-theme` 的情况):

```css
:root,
:root[data-theme='light'] {
  --bg: #f7f6f4;
  --bg-card: #ffffff;
  --bg-soft: #efede9;
  --text: #33302b;
  --text-muted: #8f8980;
  --border: #e3dfd8;
  --accent: #4f6df5;
  --accent-contrast: #ffffff;
}
```

`src/themes/dark.css`:

```css
:root[data-theme='dark'] {
  --bg: #1a1a1e;
  --bg-card: #232328;
  --bg-soft: #2b2b31;
  --text: #ececec;
  --text-muted: #9b98a0;
  --border: #34343b;
  --accent: #8fa3ff;
  --accent-contrast: #14141a;
}
```

`src/themes/rose.css`:

```css
:root[data-theme='rose'] {
  --bg: #faf5f6;
  --bg-card: #ffffff;
  --bg-soft: #f6e9ec;
  --text: #3a2f33;
  --text-muted: #a08a90;
  --border: #ecd8de;
  --accent: #e5688e;
  --accent-contrast: #ffffff;
}
```

`src/themes/ocean.css`:

```css
:root[data-theme='ocean'] {
  --bg: #f2f6f9;
  --bg-card: #ffffff;
  --bg-soft: #e7eef3;
  --text: #26313a;
  --text-muted: #7d8f9c;
  --border: #d7e2ea;
  --accent: #2f8fba;
  --accent-contrast: #ffffff;
}
```

- [ ] **Step 5: 在 `src/main.ts` 引入主题样式**

`src/main.ts` 改为:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import './themes/light.css'
import './themes/dark.css'
import './themes/rose.css'
import './themes/ocean.css'
import './styles/global.css'

createApp(App).mount('#app')
```

(注意:此时 `src/styles/global.css` 尚不存在,Task 4 创建;若先跑构建会报错,先执行 Step 6 测试即可,构建留到 Task 4)

- [ ] **Step 6: 运行测试确认通过**

Run: `npx vitest run src/composables/useTheme.test.ts`
Expected: 5 tests PASS

- [ ] **Step 7: 提交**

```bash
git add src/composables/useTheme.ts src/composables/useTheme.test.ts src/themes
git commit -m "feat: useTheme 四主题切换与主题变量"
```

---

### Task 4: 全局样式与 App 骨架(头部切换控件)

**Files:**
- Create: `src/styles/global.css`
- Rewrite: `src/App.vue`

**Interfaces:**
- Consumes: `useI18n()`(Task 2)、`useTheme()` + `THEMES`(Task 3)
- Produces: 页面骨架——头部(品牌 + 语言切换 中/EN + 主题四点切换)与四个区块占位(Hero / Features / Download / Footer 区域用注释或空 div 标出,Task 5/6 填充)

- [ ] **Step 1: 写 `src/styles/global.css`**

```css
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  color-scheme: light;
}
:root[data-theme='dark'] {
  color-scheme: dark;
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Microsoft YaHei', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  transition: background-color 0.3s ease, color 0.3s ease;
}

a {
  color: var(--accent);
  text-decoration: none;
}

.container {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 24px;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(8px);
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  border-bottom: 1px solid var(--border);
}

.site-header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 16px;
  color: var(--text);
}

.brand img {
  width: 24px;
  height: 24px;
  border-radius: 6px;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.lang-toggle button {
  background: var(--bg-soft);
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.lang-toggle button.active {
  background: var(--accent);
  color: var(--accent-contrast);
  border-color: var(--accent);
}

.theme-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
}

.theme-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--border);
  cursor: pointer;
  padding: 0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.theme-dot:hover {
  transform: scale(1.2);
}

.theme-dot.active {
  box-shadow: 0 0 0 2px var(--accent);
}

.site-main {
  padding: 48px 0 24px;
}
```

- [ ] **Step 2: 重写 `src/App.vue`**

```vue
<script setup lang="ts">
import { useI18n } from './composables/useI18n'
import { useTheme, THEMES } from './composables/useTheme'
import type { Theme } from './composables/useTheme'
import type { Locale } from './composables/useI18n'

const { locale, setLocale, t } = useI18n()
const { theme, setTheme } = useTheme()

const DOT_STYLE: Record<Theme, string> = {
  light: '#f7f6f4',
  dark: '#1a1a1e',
  rose: '#e5688e',
  ocean: '#2f8fba'
}
</script>

<template>
  <header class="site-header">
    <div class="container">
      <a class="brand" href="#">
        <img src="/icon.png" alt="MarkdownSoft" />
        <span>MarkdownSoft</span>
      </a>
      <div class="header-controls">
        <div class="lang-toggle" :aria-label="t('header.language')">
          <button :class="{ active: locale === 'zh' }" @click="setLocale('zh')">中</button>
          <button :class="{ active: locale === 'en' }" @click="setLocale('en')">EN</button>
        </div>
        <div class="theme-toggle" :aria-label="t('header.theme')">
          <button
            v-for="th in THEMES"
            :key="th"
            class="theme-dot"
            :class="{ active: theme === th }"
            :style="{ background: DOT_STYLE[th] }"
            :aria-label="th"
            @click="setTheme(th)"
          />
        </div>
      </div>
    </div>
  </header>

  <main class="site-main">
    <!-- Task 5: HeroSection -->
    <!-- Task 6: FeatureGrid / DownloadSection -->
  </main>

  <footer class="site-footer">
    <!-- Task 6: SiteFooter -->
  </footer>
</template>
```

- [ ] **Step 3: 验证**

Run: `npm run build`
Expected: vue-tsc 无错误,vite 构建成功
Run: `npm run dev` 手动检查:头部渲染、点「EN」文案变英文、点四个色点页面背景切换(浅/深/玫瑰/海洋)
Run: `npx vitest run`
Expected: 全部 PASS(回归)

- [ ] **Step 4: 提交**

```bash
git add src/styles/global.css src/App.vue src/main.ts
git commit -m "feat: 全局样式与 App 骨架(语言/主题切换)"
```

---

### Task 5: Hero 区与截图占位组件

**Files:**
- Create: `src/lib/constants.ts`
- Create: `src/components/HeroSection.vue`
- Create: `src/components/ScreenshotPlaceholder.vue`

**Interfaces:**
- Consumes: `useI18n().t`(键:`hero.tagline`、`hero.desc`、`hero.cta`、`hero.ctaSub`、`placeholder.caption`)
- Produces: `src/lib/constants.ts` 导出 `RELEASE_URL = 'https://github.com/moonsyan/mkEditor/releases/latest'`(Task 6 复用);`HeroSection`(含 `ScreenshotPlaceholder`);真实截图后续放入 `public/screenshots/` 后替换占位组件

- [ ] **Step 1: 写 `src/lib/constants.ts`**

```ts
export const RELEASE_URL = 'https://github.com/moonsyan/mkEditor/releases/latest'
```

- [ ] **Step 2: 写 `src/components/ScreenshotPlaceholder.vue`**(CSS 绘制编辑器窗口骨架,自适应主题变量)

```vue
<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()
</script>

<template>
  <figure class="screenshot">
    <div class="window">
      <div class="window-bar">
        <span class="dot red" />
        <span class="dot yellow" />
        <span class="dot green" />
        <span class="window-title">untitled.md — MarkdownSoft</span>
      </div>
      <div class="window-body">
        <div class="sidebar">
          <div v-for="n in 5" :key="n" class="sidebar-item" />
        </div>
        <div class="editor">
          <div v-for="n in 7" :key="n" class="line" :style="{ width: 85 - (n % 3) * 12 + '%' }" />
        </div>
        <div class="preview">
          <div class="preview-title" />
          <div v-for="n in 5" :key="n" class="line" :style="{ width: 90 - (n % 3) * 15 + '%' }" />
        </div>
      </div>
    </div>
    <figcaption>{{ t('placeholder.caption') }}</figcaption>
  </figure>
</template>

<style scoped>
.screenshot {
  margin: 40px auto 0;
  max-width: 720px;
  text-align: center;
}

.window {
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg-card);
  box-shadow: 0 20px 50px color-mix(in srgb, var(--text) 12%, transparent);
}

.window-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--bg-soft);
  border-bottom: 1px solid var(--border);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot.red { background: #ff5f57; }
.dot.yellow { background: #febc2e; }
.dot.green { background: #28c840; }

.window-title {
  margin-left: 8px;
  font-size: 12px;
  color: var(--text-muted);
}

.window-body {
  display: grid;
  grid-template-columns: 64px 1fr 1fr;
  height: 320px;
}

.sidebar {
  background: var(--bg-soft);
  padding: 14px 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidebar-item {
  height: 10px;
  border-radius: 3px;
  background: var(--border);
}

.editor,
.preview {
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview {
  border-left: 1px solid var(--border);
  background: var(--bg-card);
}

.preview-title {
  height: 14px;
  width: 40%;
  border-radius: 3px;
  background: var(--accent);
  opacity: 0.7;
}

.line {
  height: 10px;
  border-radius: 3px;
  background: var(--border);
}

figcaption {
  margin-top: 12px;
  font-size: 13px;
  color: var(--text-muted);
}
</style>
```

- [ ] **Step 2: 写 `src/components/HeroSection.vue`**

```vue
<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import { RELEASE_URL } from '../lib/constants'
import ScreenshotPlaceholder from './ScreenshotPlaceholder.vue'

const { t } = useI18n()
</script>

<template>
  <section class="hero">
    <div class="container">
      <h1 class="hero-title">MarkdownSoft</h1>
      <p class="hero-tagline">{{ t('hero.tagline') }}</p>
      <p class="hero-desc">{{ t('hero.desc') }}</p>
      <div class="hero-cta">
        <a class="btn-primary" :href="RELEASE_URL" target="_blank" rel="noopener">
          {{ t('hero.cta') }}
        </a>
        <p class="cta-sub">{{ t('hero.ctaSub') }}</p>
      </div>
      <ScreenshotPlaceholder />
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 72px 0 32px;
  text-align: center;
}

.hero-title {
  font-size: 44px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.hero-tagline {
  margin-top: 16px;
  font-size: 20px;
  color: var(--text-muted);
}

.hero-desc {
  margin: 12px auto 0;
  max-width: 560px;
  font-size: 15px;
  color: var(--text-muted);
}

.hero-cta {
  margin-top: 28px;
}

.btn-primary {
  display: inline-block;
  background: var(--accent);
  color: var(--accent-contrast);
  padding: 12px 32px;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 600;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  opacity: 0.92;
}

.cta-sub {
  margin-top: 10px;
  font-size: 13px;
  color: var(--text-muted);
}
</style>
```

- [ ] **Step 3: 挂载到 App.vue**

`App.vue` 的 `<main>` 内加入:

```vue
<HeroSection />
```

并在 `<script setup>` 中 `import HeroSection from './components/HeroSection.vue'`。

- [ ] **Step 4: 验证**

Run: `npm run build` → 成功
Run: `npm run dev` 手动检查:Hero 标题、标语、下载按钮跳转 Releases、占位窗口随主题切换变色
Run: `npx vitest run` → 全部 PASS

- [ ] **Step 5: 提交**

```bash
git add src/components/HeroSection.vue src/components/ScreenshotPlaceholder.vue src/App.vue
git commit -m "feat: Hero 区与截图占位组件"
```

---

### Task 6: 功能卡片、下载区与页脚

**Files:**
- Create: `src/components/FeatureGrid.vue`
- Create: `src/components/DownloadSection.vue`
- Create: `src/components/SiteFooter.vue`
- Modify: `src/App.vue`(挂载三个组件)

**Interfaces:**
- Consumes: `useI18n().t`;`RELEASE_URL`(从 HeroSection 导出,`import { RELEASE_URL } from './HeroSection.vue'`);主题 CSS 变量
- Produces: 完整首页

- [ ] **Step 1: 写 `src/components/FeatureGrid.vue`**

```vue
<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()

const features = [
  { icon: '✍️', titleKey: 'features.editor.title', descKey: 'features.editor.desc' },
  { icon: '📂', titleKey: 'features.workspace.title', descKey: 'features.workspace.desc' },
  { icon: '🔗', titleKey: 'features.wiki.title', descKey: 'features.wiki.desc' },
  { icon: '🎨', titleKey: 'features.themes.title', descKey: 'features.themes.desc' },
  { icon: '📐', titleKey: 'features.preview.title', descKey: 'features.preview.desc' },
  { icon: '🖨️', titleKey: 'features.export.title', descKey: 'features.export.desc' },
  { icon: '🔒', titleKey: 'features.local.title', descKey: 'features.local.desc' },
  { icon: '📊', titleKey: 'features.stats.title', descKey: 'features.stats.desc' }
]
</script>

<template>
  <section class="features">
    <div class="container">
      <h2 class="section-title">{{ t('features.title') }}</h2>
      <div class="grid">
        <article v-for="f in features" :key="f.titleKey" class="card">
          <span class="card-icon">{{ f.icon }}</span>
          <h3>{{ t(f.titleKey) }}</h3>
          <p>{{ t(f.descKey) }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features {
  padding: 64px 0;
}

.section-title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 36px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 24px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px color-mix(in srgb, var(--text) 8%, transparent);
}

.card-icon {
  font-size: 26px;
}

.card h3 {
  margin-top: 12px;
  font-size: 17px;
}

.card p {
  margin-top: 6px;
  font-size: 14px;
  color: var(--text-muted);
}
</style>
```

- [ ] **Step 2: 写 `src/components/DownloadSection.vue`**

```vue
<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import { RELEASE_URL } from '../lib/constants'

const { t } = useI18n()
</script>

<template>
  <section class="download">
    <div class="container">
      <h2 class="section-title">{{ t('download.title') }}</h2>
      <p class="download-desc">{{ t('download.desc') }}</p>
      <div class="platforms">
        <span class="platform">Windows</span>
        <span class="platform">macOS</span>
        <span class="platform">Linux</span>
      </div>
      <a class="btn-primary" :href="RELEASE_URL" target="_blank" rel="noopener">
        {{ t('download.cta') }}
      </a>
    </div>
  </section>
</template>

<style scoped>
.download {
  padding: 64px 0;
  text-align: center;
  background: var(--bg-soft);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.section-title {
  font-size: 28px;
}

.download-desc {
  margin: 12px 0 24px;
  color: var(--text-muted);
}

.platforms {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 28px;
}

.platform {
  padding: 6px 18px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--bg-card);
  font-size: 14px;
}

.btn-primary {
  display: inline-block;
  background: var(--accent);
  color: var(--accent-contrast);
  padding: 12px 32px;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 600;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  opacity: 0.92;
}
</style>
```

- [ ] **Step 3: 写 `src/components/SiteFooter.vue`**

```vue
<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <p>{{ t('footer.copyright') }}</p>
      <a href="https://github.com/moonsyan/mkEditor" target="_blank" rel="noopener">
        {{ t('footer.source') }}
      </a>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: 24px 0;
  border-top: 1px solid var(--border);
  font-size: 13px;
  color: var(--text-muted);
}

.site-footer .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
```

- [ ] **Step 4: 挂载到 App.vue**

`<main>` 内依次挂载:`<HeroSection />`、`<FeatureGrid />`、`<DownloadSection />`;`<footer>` 内挂载 `<SiteFooter />`;并补上三处 import。

- [ ] **Step 5: 验证**

Run: `npm run build` → 成功
Run: `npm run dev` 手动检查:功能卡片 8 张、下载区、页脚、中英切换下全部文案跟随变化、四主题下所有区块配色正常
Run: `npx vitest run` → 全部 PASS

- [ ] **Step 6: 提交**

```bash
git add src/components src/App.vue
git commit -m "feat: 功能卡片、下载区与页脚"
```

---

### Task 7: 部署工作流与 README

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `README.md`

**Interfaces:**
- Consumes: `npm run build`(Task 1 定义)
- Produces: 自动部署;`https://moonsyan.github.io/` 上线

- [ ] **Step 1: 写 `.github/workflows/deploy.yml`**

```yaml
name: Deploy site to Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - uses: actions/configure-pages@v5

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: 写 `README.md`**

```markdown
# moonsyan.github.io

MarkdownSoft 官方网站(单页落地页)。

## 本地开发

```bash
npm install
npm run dev
```

## 构建与测试

```bash
npm run typecheck
npm run test
npm run build
```

## 部署

推送到 `main` 分支即自动经 GitHub Actions 部署到 `https://moonsyan.github.io/`。

## 站点结构

- 文案: `src/locales/zh.ts` / `en.ts`(改文案只动这两个文件)
- 主题: `src/themes/*.css`(4 套主题的 CSS 变量)
- 截图: 将真实截图放入 `public/screenshots/` 后替换 `ScreenshotPlaceholder.vue`
```

- [ ] **Step 3: 提交并推送触发首次部署**

```bash
git add .github/workflows/deploy.yml README.md
git commit -m "feat: 部署工作流与 README"
git push origin main
```

- [ ] **Step 4: 验证部署**

在 https://github.com/moonsyan/moonsyan.github.io/actions 观察 workflow(前提:用户已在 Settings → Pages 将 Source 设为 "GitHub Actions")
Expected: 三个 job 步全部绿色
打开 https://moonsyan.github.io/ 验证:页面加载、中英切换、四主题切换、下载按钮可达
如 Pages 未配置,提示用户完成一次性设置后,在 Actions 页对该 workflow 手动 Run workflow

- [ ] **Step 5: 收尾提交(如本步骤无改动则跳过)**

---

## Self-Review(计划自检)

- **Spec 覆盖**:架构目录(Task 1)、useI18n + 文案(Task 2)、useTheme + 4 主题(Task 3)、App 骨架与切换控件(Task 4)、Hero + 截图占位(Task 5)、FeatureGrid/Download/Footer(Task 6)、部署(Task 7)——spec 中"数据流/组件职责/错误处理/测试/部署"各节均有对应任务 ✅
- **占位符**:所有代码块均含完整实现,无 TBD/TODO ✅
- **类型一致性**:`useI18n().t(key)`、`setLocale(l)`、`useTheme().setTheme(t)`、`THEMES`、`RELEASE_URL` 在各任务间签名一致(RELEASE_URL 由 `src/lib/constants.ts` 导出,HeroSection 与 DownloadSection 均从该模块导入)✅
- **边界遵守**:未引入 vue-router/vue-i18n;lockfile 已含在 Task 1 提交中;base:'/' 已在 vite 配置 ✅
