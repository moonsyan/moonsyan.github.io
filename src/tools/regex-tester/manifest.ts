import type { ToolManifest } from '../types'

export const manifest: ToolManifest = {
  slug: 'regex-tester',
  name: '正则表达式测试',
  description: '实时匹配与分组提取，标志位切换，Worker 内执行防页面冻结',
  category: 'text',
  tags: ['正则', 'regex', '匹配'],
  aliases: ['正则测试', 'regex online', '正则在线调试'],
  execution: 'client',
  seo: {
    title: '正则表达式测试工具 · 在线匹配与分组提取',
    description: '在线正则测试：实时匹配、分组提取、标志位切换，隔离执行防止灾难性回溯冻结页面。',
  },
  status: 'ready',
}
