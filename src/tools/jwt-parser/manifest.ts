import type { ToolManifest } from '../types'

export const manifest: ToolManifest = {
  slug: 'jwt-parser',
  name: 'JWT 解析',
  description: '解码 JWT Header 与 Payload，查看过期时间；不验证签名',
  category: 'encode',
  tags: ['jwt', 'token', '解析'],
  aliases: ['jwt decode', 'jwt 在线解析', 'token 解码'],
  execution: 'client',
  seo: {
    title: 'JWT 解析工具 · 在线解码 Header 与 Payload',
    description: '在线 JWT 解析：解码 Header 与 Payload、查看过期时间，不验证签名，浏览器本地处理。',
  },
  status: 'ready',
}
