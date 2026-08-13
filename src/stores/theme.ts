/**
 * 主题状态（WEB-008：跟随系统明暗主题，切换不导致布局跳动）。
 * 四套主题：light（亮色 · 鼠尾草绿）/ dark（暗色）/ ocean（海洋 · 天青）/ rose（玫瑰 · 蔷薇粉）。
 * 只切换 CSS 变量，不改变任何尺寸。选择结果持久化到 localStorage（首屏预载脚本同步）。
 */
import { defineStore } from 'pinia'

const STORAGE_KEY = 'toolkit:theme'

export type ThemeName = 'light' | 'dark' | 'ocean' | 'rose'

export const THEMES: { name: ThemeName; label: string; icon: string }[] = [
  { name: 'light', label: '亮色', icon: 'light' },
  { name: 'dark', label: '暗色', icon: 'dark' },
  { name: 'ocean', label: '海洋', icon: 'ocean' },
  { name: 'rose', label: '玫瑰', icon: 'rose' },
]

const isThemeName = (v: unknown): v is ThemeName =>
  v === 'light' || v === 'dark' || v === 'ocean' || v === 'rose'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: 'light' as ThemeName,
    initialized: false,
  }),
  actions: {
    init() {
      if (this.initialized) return
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && isThemeName(saved)) {
        this.theme = saved
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.theme = 'dark'
      }
      this.apply()
      this.initialized = true
    },
    set(name: ThemeName) {
      this.theme = name
      localStorage.setItem(STORAGE_KEY, name)
      this.apply()
    },
    apply() {
      document.documentElement.dataset.theme = this.theme
    },
  },
})
