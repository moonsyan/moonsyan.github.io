/**
 * Base64 编解码核心逻辑（TOOL-002）。
 * - 支持 UTF-8 文本（中文、Emoji 通过字节序列正确处理）；
 * - 明确区分标准 Base64 与 Base64URL 两种字母表；
 * - 非法输入返回可恢复的中文错误提示，不抛异常到界面。
 * 纯函数实现，不依赖浏览器 API 之外的环境（btoa/atob 在 Node 18+ 全局可用）。
 */

export type Base64Mode = 'standard' | 'urlsafe'

export interface Base64Result {
  ok: boolean
  output?: string
  message?: string
}

/** 文本 → Base64。先经 TextEncoder 转 UTF-8 字节，再逐字节编码。 */
export function encodeBase64(text: string, mode: Base64Mode = 'standard'): Base64Result {
  if (!text) {
    return { ok: false, message: '输入为空，请填写要编码的文本' }
  }
  try {
    const bytes = new TextEncoder().encode(text)
    let binary = ''
    for (const b of bytes) binary += String.fromCharCode(b)
    let encoded = btoa(binary)
    if (mode === 'urlsafe') {
      // Base64URL：+/ 换成 -_，并去掉填充 =（RFC 4648 §5）
      encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    }
    return { ok: true, output: encoded }
  } catch {
    return { ok: false, message: '编码失败，请检查输入内容' }
  }
}

/** Base64 → 文本。严格校验字符集，解码后经 TextDecoder 还原 UTF-8。 */
export function decodeBase64(input: string, mode: Base64Mode = 'standard'): Base64Result {
  const trimmed = input.trim()
  if (!trimmed) {
    return { ok: false, message: '输入为空，请填写要解码的 Base64 文本' }
  }

  let normalized = trimmed.replace(/\s+/g, '')
  if (mode === 'urlsafe') {
    if (/[+/]/.test(normalized)) {
      return { ok: false, message: '包含标准 Base64 字符（+ 或 /），请切换到标准模式' }
    }
    normalized = normalized.replace(/-/g, '+').replace(/_/g, '/')
    // 补齐填充
    while (normalized.length % 4 !== 0) normalized += '='
  }

  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(normalized) || normalized.length % 4 !== 0) {
    return { ok: false, message: '不是合法的 Base64 文本，请检查字符与长度' }
  }

  try {
    const binary = atob(normalized)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return { ok: true, output: new TextDecoder('utf-8', { fatal: true }).decode(bytes) }
  } catch {
    return { ok: false, message: '解码失败：内容不是有效的 UTF-8 文本' }
  }
}
