/**
 * 安全分享状态（RUN-008）。
 * 分享链接（/tools/{slug}?share=token）打开时加载分享选项，
 * ToolView 在挂载时读取并应用；只包含白名单化的非敏感选项。
 */
import { defineStore } from 'pinia'

export interface ShareState {
  token: string
  toolSlug: string
  options: Record<string, unknown>
}

export const useShareStore = defineStore('share', {
  state: (): { current: ShareState | null } => ({
    current: null,
  }),
  actions: {
    set(share: ShareState) {
      this.current = share
    },
    clear() {
      this.current = null
    },
  },
})
