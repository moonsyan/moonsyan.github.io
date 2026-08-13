/** 时间戳转换输入校验与示例（RUN-006）。 */
import { z } from 'zod'

export const timestampInputSchema = z.object({
  text: z.string().max(64, '输入过长，请填写单个时间戳或日期'),
  unit: z.enum(['auto', 'seconds', 'milliseconds']),
})

/** 示例：2023-11-14T22:13:20Z（公开资料中常见的整点示例时间戳） */
export const EXAMPLE_TIMESTAMP = '1700000000'
export const EXAMPLE_DATE = '2026-01-01T08:00:00'
