/**
 * 主题状态（WEB-008：跟随系统明暗主题，切换不导致布局跳动）。
 * 只切换 CSS 变量，不改变任何尺寸。
 */
import { defineStore } from 'pinia'

const STORAGE_KEY = 'toolkit:theme'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: 'light' as 'light' | 'dark',
    initialized: false,
  }),
  actions: {
    init() {
      if (this.initialized) return
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'dark' || saved === 'light') {
        this.theme = saved
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.theme = 'dark'
      }
      this.apply()
      this.initialized = true
    },
    toggle() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem(STORAGE_KEY, this.theme)
      this.apply()
    },
    apply() {
      document.documentElement.dataset.theme = this.theme
    },
  },
})
