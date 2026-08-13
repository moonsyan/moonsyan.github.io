import type { ToolManifest } from '../types'

export const manifest: ToolManifest = {
  slug: 'image-compress',
  name: '图片压缩',
  description: 'JPEG/PNG/WebP 压缩，限制总像素，展示压缩前后大小',
  category: 'file',
  tags: ['图片', '压缩', 'jpeg'],
  aliases: ['图片压缩在线', 'png 压缩'],
  execution: 'async',
  capabilities: { download: true, fileUpload: true },
  seo: {
    title: '图片压缩工具 · JPEG/PNG/WebP 在线压缩',
    description: '在线图片压缩：支持 JPEG、PNG、WebP，限制总像素防解压炸弹，展示压缩前后大小与质量参数。',
  },
  status: 'ready',
}
