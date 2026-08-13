import type { ToolManifest } from '../types'

export const manifest: ToolManifest = {
  slug: 'base64',
  name: 'Base64 编解码',
  description: '文本与 Base64 互转，支持 UTF-8 与 URL Safe 模式',
  category: 'encode',
  tags: ['base64', '编码', '解码'],
  aliases: ['base64 encode', 'base64 decode', 'base64url'],
  execution: 'client',
  seo: {
    title: 'Base64 编解码工具 · 支持 UTF-8 与 URL Safe',
    description: '在线 Base64 编码解码，正确处理中文与 Emoji，支持 Base64URL 字母表，浏览器本地运行。',
  },
  status: 'ready',
}
