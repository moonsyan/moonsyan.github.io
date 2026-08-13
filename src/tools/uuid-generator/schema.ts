/** UUID 生成输入校验（RUN-006：无需示例输入，生成即结果）。 */
import { z } from 'zod'

export const uuidInputSchema = z.object({
  count: z.number({ invalid_type_error: '数量必须是数字' }).int().min(1).max(100, '最多一次生成 100 个'),
  version: z.enum(['v4', 'v7']),
})

export type UuidInput = z.infer<typeof uuidInputSchema>
