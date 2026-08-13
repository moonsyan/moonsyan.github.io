/** 文本对比输入校验与示例（RUN-006：不含真实个人或生产数据）。 */
import { z } from 'zod'

export const diffInputSchema = z.object({
  oldText: z.string(),
  newText: z.string(),
  granularity: z.enum(['line', 'char']),
})

export const EXAMPLE_OLD = `版本说明
- 修复搜索页空白问题
- 优化首页加载速度`

export const EXAMPLE_NEW = `版本说明（v2）
- 修复搜索页空白问题
- 优化首页加载速度
- 新增暗色主题`
