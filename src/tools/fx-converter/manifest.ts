import type { ToolManifest } from '../types'

export const manifest: ToolManifest = {
  slug: 'fx-converter',
  name: '汇率换算',
  description: '常用币种汇率换算，展示汇率来源与时间；数据源不可用时如实提示',
  category: 'dev',
  tags: ['汇率', '货币', 'fx'],
  aliases: ['currency', '汇率转换', '美元人民币'],
  execution: 'server',
  seo: {
    title: '汇率换算工具 · 常用币种在线换算',
    description: '在线汇率换算：常用币种互转，展示汇率来源与获取时间，数据源异常时如实提示不编造数据。',
  },
  status: 'ready',
}
