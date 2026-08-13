/**
 * 消费分享链接携带的选项（RUN-008）。
 * 在 ToolView 的 setup 中调用：若当前分享属于本工具，返回白名单选项并清空状态。
 * 选项只影响界面初始值，输入正文永不通过分享传递。
 */
import { useShareStore } from '~/stores/share'

export function consumeSharedOptions(slug: string): Record<string, unknown> | null {
  const share = useShareStore()
  if (share.current && share.current.toolSlug === slug) {
    const options = share.current.options
    share.clear()
    return options
  }
  return null
}
