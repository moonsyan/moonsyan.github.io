/**
 * URL 编解码核心逻辑（TOOL-003）。
 * - 组件模式（encodeURIComponent）：编码查询参数值，/ ? & 等全部转义；
 * - 整体模式（encodeURI）：编码完整 URL，保留协议与路径分隔符；
 * - 不自动访问或打开用户输入的任何 URL（安全要求）。
 */

export type UrlMode = 'component' | 'full'

export interface UrlResult {
  ok: boolean
  output?: string
  message?: string
}

export function encodeUrl(text: string, mode: UrlMode = 'component'): UrlResult {
  if (!text.trim()) {
    return { ok: false, message: '输入为空，请填写要编码的内容' }
  }
  try {
    return { ok: true, output: mode === 'component' ? encodeURIComponent(text) : encodeURI(text) }
  } catch {
    return { ok: false, message: '编码失败，请检查输入内容' }
  }
}

export function decodeUrl(text: string, mode: UrlMode = 'component'): UrlResult {
  const trimmed = text.trim()
  if (!trimmed) {
    return { ok: false, message: '输入为空，请填写要解码的内容' }
  }
  try {
    return {
      ok: true,
      output: mode === 'component' ? decodeURIComponent(trimmed) : decodeURI(trimmed),
    }
  } catch {
    return { ok: false, message: '不是合法的 URL 编码文本（存在孤立的 % 或非法转义序列）' }
  }
}
