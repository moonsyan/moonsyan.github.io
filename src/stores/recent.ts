/**
 * 最近使用（WEB-007）：记录工具 slug 与最近使用时间。
 * 支持单条移除和全部清空，默认最多 50 条；只存 localStorage，不存输入内容。
 */
import { defineStore } from 'pinia'

const STORAGE_KEY = 'toolkit:recent'
const MAX_ENTRIES = 50

export interface RecentEntry {
  slug: string
  at: number
}

export const useRecentStore = defineStore('recent', {
  state: () => ({
    entries: [] as RecentEntry[],
    loaded: false,
  }),
  actions: {
    load() {
      if (this.loaded) return
      try {
        this.entries = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
      } catch {
        this.entries = []
      }
      this.loaded = true
    },
    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.entries))
    },
    touch(slug: string) {
      this.load()
      this.entries = [
        { slug, at: Date.now() },
        ...this.entries.filter((e) => e.slug !== slug),
      ].slice(0, MAX_ENTRIES)
      this.persist()
    },
    remove(slug: string) {
      this.entries = this.entries.filter((e) => e.slug !== slug)
      this.persist()
    },
    clear() {
      this.entries = []
      this.persist()
    },
  },
})
