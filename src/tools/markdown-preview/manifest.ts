import type { ToolManifest } from '../types'

export const manifest: ToolManifest = {
  slug: 'markdown-preview',
  name: 'Markdown 预览',
  description: '左右分栏实时预览，复制 HTML，渲染前强制清洗防注入',
  category: 'format',
  tags: ['markdown', '预览', 'md'],
  aliases: ['md 预览', 'markdown 在线渲染'],
  execution: 'client',
  seo: {
    title: 'Markdown 预览工具 · 在线实时渲染',
    description: '在线 Markdown 预览：左右分栏实时渲染、复制 HTML，输出经清洗库处理，浏览器本地运行。',
  },
  status: 'ready',
}
