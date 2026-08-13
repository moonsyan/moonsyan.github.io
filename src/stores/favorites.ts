/**
 * 本地收藏（WEB-006）：只保存工具 slug 和状态，不保存输入内容。
 * 数据仅存在于当前浏览器 localStorage，可一键清除。
 */
import { defineStore } from 'pinia'

const STORAGE_KEY = 'toolkit:favorites'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    slugs: [] as string[],
    loaded: false,
  }),
  getters: {
    isFavorite: (state) => (slug: string) => state.slugs.includes(slug),
  },
  actions: {
    load() {
      if (this.loaded) return
      try {
        this.slugs = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
      } catch {
        this.slugs = []
      }
      this.loaded = true
    },
    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.slugs))
    },
    toggle(slug: string) {
      this.load()
      const idx = this.slugs.indexOf(slug)
      if (idx >= 0) {
        this.slugs.splice(idx, 1)
      } else {
        this.slugs.push(slug)
      }
      this.persist()
    },
    clear() {
      this.slugs = []
      this.persist()
    },
  },
})
