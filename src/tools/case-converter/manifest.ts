import type { ToolManifest } from '../types'

export const manifest: ToolManifest = {
  slug: 'case-converter',
  name: '大小写转换',
  description: '大小写与 camelCase / snake_case 等风格互转，分词规则透明',
  category: 'text',
  tags: ['大小写', 'camelCase', '命名'],
  aliases: ['驼峰转换', 'snake_case', '命名风格转换'],
  execution: 'client',
  seo: {
    title: '大小写转换工具 · 驼峰/下划线/中划线命名互转',
    description: '在线大小写转换：camelCase、PascalCase、snake_case、kebab-case 互转，分词规则明确说明。',
  },
  status: 'ready',
}
