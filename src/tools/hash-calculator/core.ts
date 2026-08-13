/**
 * 哈希计算核心逻辑（TOOL-006）。
 * - 支持 SHA-256、SHA-512 与 SHA-1（基于 Web Crypto，无第三方依赖）；
 * - SHA-1 仅用于兼容校验场景，不用于密码安全，界面必须标注；
 * - 不提供 MD5（安全性过弱）；密码散列需求不在本工具范围内。
 * crypto.subtle 在浏览器与 Node 18+ 全局可用，可直接测试。
 */

export type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-512'

export interface HashResult {
  ok: boolean
  message?: string
  output?: string
  algorithm?: HashAlgorithm
}

const SUPPORTED: readonly HashAlgorithm[] = ['SHA-1', 'SHA-256', 'SHA-512']

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, '0')).join('')
}

/** 计算文本摘要，输出小写十六进制。 */
export async function hashText(
  text: string,
  algorithm: HashAlgorithm = 'SHA-256',
): Promise<HashResult> {
  if (!text) {
    return { ok: false, message: '输入为空，请填写要计算摘要的文本' }
  }
  if (!SUPPORTED.includes(algorithm)) {
    return { ok: false, message: `不支持的算法：${algorithm}` }
  }
  try {
    const bytes = new TextEncoder().encode(text)
    const digest = await crypto.subtle.digest(algorithm, bytes)
    return { ok: true, output: toHex(digest), algorithm }
  } catch {
    return { ok: false, message: '计算失败：当前环境不支持 Web Crypto' }
  }
}

/** 常见算法摘要长度（十六进制字符数），用于结果自检。 */
export const DIGEST_HEX_LENGTH: Record<HashAlgorithm, number> = {
  'SHA-1': 40,
  'SHA-256': 64,
  'SHA-512': 128,
}
