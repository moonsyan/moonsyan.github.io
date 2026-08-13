import type { ToolManifest } from '../types'

export const manifest: ToolManifest = {
  slug: 'hash-calculator',
  name: '哈希计算',
  description: 'SHA-256、SHA-512 与 SHA-1 文本摘要计算（SHA-1 仅限兼容校验）',
  category: 'verify',
  tags: ['hash', 'sha256', '摘要'],
  aliases: ['sha1', 'sha512', '在线哈希', 'digest'],
  execution: 'client',
  seo: {
    title: '在线哈希计算工具 · SHA-256 / SHA-512 / SHA-1',
    description: '在线计算文本 SHA-256、SHA-512 摘要，SHA-1 仅限兼容校验，浏览器 Web Crypto 本地运行。',
  },
  status: 'ready',
}
