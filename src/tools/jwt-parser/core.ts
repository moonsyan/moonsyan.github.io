/**
 * JWT 解析核心逻辑（TOOL-007）。
 * - 只解析 Header 与 Payload（Base64URL 解码 + JSON 解析）；
 * - 明确不验证签名：解析结果不能证明令牌真实有效；
 * - 展示 exp/iat/nbf 的可读时间与过期状态；
 * - 界面需提示用户不要粘贴生产环境令牌。
 */

export interface JwtParseResult {
  ok: boolean
  message?: string
  header?: Record<string, unknown>
  payload?: Record<string, unknown>
  /** exp 的可读时间（本地时区）；无 exp 字段时为 undefined */
  expiresAt?: string
  /** 令牌是否已过期；无 exp 字段时为 undefined */
  expired?: boolean
}

/** Base64URL → UTF-8 文本。 */
function decodeBase64Url(input: string): string {
  let normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  while (normalized.length % 4 !== 0) normalized += '='
  const binary = atob(normalized)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
}

function decodeSegment(segment: string, name: string): Record<string, unknown> | string {
  let text: string
  try {
    text = decodeBase64Url(segment)
  } catch {
    return `${name} 不是合法的 Base64URL 编码`
  }
  try {
    const value: unknown = JSON.parse(text)
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return `${name} 解码后不是 JSON 对象`
    }
    return value as Record<string, unknown>
  } catch {
    return `${name} 解码后不是合法 JSON`
  }
}

/** 解析 JWT 字符串。仅结构解析，不做任何签名验证。 */
export function parseJwt(token: string): JwtParseResult {
  const trimmed = token.trim()
  if (!trimmed) return { ok: false, message: '输入为空，请粘贴 JWT' }

  const parts = trimmed.split('.')
  if (parts.length !== 3) {
    return { ok: false, message: `JWT 应由 3 段组成（当前 ${parts.length} 段），请检查是否完整复制` }
  }

  const header = decodeSegment(parts[0], 'Header')
  if (typeof header === 'string') return { ok: false, message: header }
  const payload = decodeSegment(parts[1], 'Payload')
  if (typeof payload === 'string') return { ok: false, message: payload }

  const result: JwtParseResult = { ok: true, header, payload }

  if (typeof payload.exp === 'number') {
    const expDate = new Date(payload.exp * 1000)
    result.expiresAt = expDate.toLocaleString('zh-CN', { hour12: false, timeZoneName: 'short' })
    result.expired = expDate.getTime() < Date.now()
  }
  return result
}
