import type { ToolManifest } from '../types'

export const manifest: ToolManifest = {
  slug: 'word-counter',
  name: '字数统计',
  description: '字符、非空白字符、行数与中英文词数统计，计数规则透明',
  category: 'text',
  tags: ['字数', '统计', '词数'],
  aliases: ['字符统计', 'word count', '字数在线统计'],
  execution: 'client',
  seo: {
    title: '字数统计工具 · 中英文词数与字符统计',
    description: '在线字数统计：字符、非空白字符、行数、中文字数与英文词数，明确计数规则，浏览器本地运行。',
  },
  status: 'ready',
}
