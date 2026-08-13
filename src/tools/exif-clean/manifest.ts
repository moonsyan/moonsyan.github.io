import type { ToolManifest } from '../types'

export const manifest: ToolManifest = {
  slug: 'exif-clean',
  name: 'EXIF 清理',
  description: '删除照片位置和设备等元数据，输出后重新检查确认',
  category: 'file',
  tags: ['exif', '隐私', '元数据'],
  aliases: ['去除 exif', '照片位置信息删除'],
  execution: 'async',
  capabilities: { download: true, fileUpload: true },
  seo: {
    title: 'EXIF 清理工具 · 删除照片元数据',
    description: '在线 EXIF 清理：删除位置、设备等元数据，输出后重新检查确认目标元数据不存在。',
  },
  status: 'ready',
}
