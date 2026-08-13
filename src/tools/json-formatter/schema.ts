/** 输入校验 Schema（《工具站架构.md》5.1：每个工具模块包含输入校验 Schema）。 */
import { z } from 'zod'

export const jsonFormatterInputSchema = z.object({
  text: z.string().max(5 * 1024 * 1024, '输入超过 5MB 限制，请拆分后处理'),
  mode: z.enum(['format', 'compress', 'validate']),
  indent: z.number().int().min(1).max(8).default(2),
})

export type JsonFormatterInput = z.infer<typeof jsonFormatterInputSchema>

/** 有效示例与错误用例（RUN-006：不含真实个人或生产数据） */
export const EXAMPLE_VALID = `{
  "name": "示例工具",
  "version": 1,
  "tags": ["json", "格式化"]
}`

export const EXAMPLE_INVALID = `{"name": "缺少右括号",`
