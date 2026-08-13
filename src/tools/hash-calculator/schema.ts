/** 哈希计算输入校验与示例（RUN-006：不含真实个人或生产数据）。 */
import { z } from 'zod'

export const hashInputSchema = z.object({
  text: z.string().max(5 * 1024 * 1024, '输入超过 5MB 限制，请拆分后处理'),
  algorithm: z.enum(['SHA-1', 'SHA-256', 'SHA-512']),
})

export const EXAMPLE_TEXT = 'ToolKit 哈希计算示例文本'
