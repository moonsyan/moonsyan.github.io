/** 单位换算输入校验与示例（RUN-006）。 */
import { z } from 'zod'

export const unitInputSchema = z.object({
  value: z.number({ invalid_type_error: '数值无效' }),
  from: z.string(),
  to: z.string(),
  precision: z.number().int().min(0).max(12).default(6),
})

export const EXAMPLE_VALUE = 1024
export const EXAMPLE_FROM = 'mb'
export const EXAMPLE_TO = 'gb'
