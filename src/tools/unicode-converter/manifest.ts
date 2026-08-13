import type { ToolManifest } from '../types'

export const manifest: ToolManifest = {
  slug: 'unicode-converter',
  name: 'Unicode 转换',
  description: '文本与 \\uXXXX 转义互转，正确处理代理对和 Emoji',
  category: 'text',
  tags: ['unicode', '转义', '编码'],
  aliases: ['\\u 转换', 'unicode 在线转换'],
  execution: 'client',
  seo: {
    title: 'Unicode 转换工具 · 文本与 \\uXXXX 互转',
    description: '在线 Unicode 转换：文本与 \\uXXXX 转义互转，支持 \\u{...} 写法，正确处理 Emoji 代理对。',
  },
  status: 'ready',
}
