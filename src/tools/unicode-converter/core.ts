/**
 * Unicode 转换核心逻辑（TOOL-013）。
 * - 文本 → \uXXXX 转义：按 Unicode 码点处理，增补平面字符（Emoji）
 *   输出 UTF-16 代理对形式 \uXXXX\uXXXX，兼容性最好；
 * - 转义 → 文本：同时支持 \uXXXX 与 \u{XXXXX} 两种写法，
 *   代理对在解码后由 JS 字符串自动还原为完整码点。
 */

export interface UnicodeResult {
  ok: boolean
  output?: string
  message?: string
}

/** 文本 → \uXXXX 转义序列。 */
export function textToUnicode(text: string): UnicodeResult {
  if (!text) return { ok: false, message: '输入为空，请填写要转换的文本' }
  let out = ''
  for (const ch of text) {
    const code = ch.codePointAt(0)!
    if (code < 0x7f && code >= 0x20 && ch !== '\\' && ch !== '"') {
      out += ch // 可打印 ASCII 保持原样，输出更可读
    } else if (code <= 0xffff) {
      out += `\\u${code.toString(16).padStart(4, '0')}`
    } else {
      // 增补平面：输出 UTF-16 代理对
      const offset = code - 0x10000
      const high = 0xd800 + (offset >> 10)
      const low = 0xdc00 + (offset & 0x3ff)
      out += `\\u${high.toString(16)}\\u${low.toString(16)}`
    }
  }
  return { ok: true, output: out }
}

/** \uXXXX / \u{...} 转义 → 文本。 */
export function unicodeToText(escaped: string): UnicodeResult {
  if (!escaped.trim()) return { ok: false, message: '输入为空，请填写转义文本' }
  try {
    const out = escaped
      .replace(/\\u\{([0-9a-fA-F]{1,6})\}/g, (_, hex: string) => {
        const code = Number.parseInt(hex, 16)
        if (code > 0x10ffff) throw new Error('码点超出 Unicode 范围')
        return String.fromCodePoint(code)
      })
      .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex: string) => String.fromCharCode(Number.parseInt(hex, 16)))
    return { ok: true, output: out }
  } catch (err) {
    return { ok: false, message: `转换失败：${(err as Error).message}` }
  }
}
