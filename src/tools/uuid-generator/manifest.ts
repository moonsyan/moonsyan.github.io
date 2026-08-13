import type { ToolManifest } from '../types'

export const manifest: ToolManifest = {
  slug: 'uuid-generator',
  name: 'UUID 生成器',
  description: '批量生成 UUID v4 与 v7，使用浏览器安全随机源，支持复制与下载',
  category: 'dev',
  tags: ['uuid', 'guid', '随机'],
  aliases: ['uuid v4', 'uuid v7', 'uuid 在线生成'],
  execution: 'client',
  seo: {
    title: 'UUID 生成器 · v4 / v7 批量生成',
    description: '在线 UUID 生成器：支持 v4 与 v7，批量生成 1-100 个，浏览器安全随机源，可复制下载。',
  },
  capabilities: { download: true },
  status: 'ready',
}
