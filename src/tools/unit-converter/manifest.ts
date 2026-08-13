import type { ToolManifest } from '../types'

export const manifest: ToolManifest = {
  slug: 'unit-converter',
  name: '单位换算',
  description: '长度、面积、质量、温度、数据大小换算，量纲隔离、精度可控',
  category: 'dev',
  tags: ['单位', '换算', '温度'],
  aliases: ['单位转换', '长度换算', '字节换算'],
  execution: 'client',
  seo: {
    title: '单位换算工具 · 长度/质量/温度/数据大小',
    description: '在线单位换算：长度、面积、质量、温度、数据大小五个量纲，不同量纲不能混算，精度可控。',
  },
  status: 'ready',
}
