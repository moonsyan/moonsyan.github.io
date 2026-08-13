import type { ToolManifest } from '../types'

export const manifest: ToolManifest = {
  slug: 'image-convert',
  name: '图片格式转换',
  description: 'JPEG/PNG/WebP 互转；透明通道不兼容时需选择背景色',
  category: 'file',
  tags: ['图片', '格式转换', 'webp'],
  aliases: ['png 转 jpg', 'webp 转换'],
  execution: 'async',
  capabilities: { download: true, fileUpload: true },
  seo: {
    title: '图片格式转换工具 · JPEG/PNG/WebP 互转',
    description: '在线图片格式转换：JPEG、PNG、WebP 互转，透明通道不兼容时要求选择背景色。',
  },
  status: 'ready',
}
