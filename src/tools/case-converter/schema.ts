/** 大小写转换输入校验与示例（RUN-006）。 */
import { z } from 'zod'

export const caseInputSchema = z.object({
  text: z.string().max(512 * 1024, '输入超过 512KB 限制'),
  style: z.enum(['upper', 'lower', 'camel', 'pascal', 'snake', 'kebab']),
})

export const EXAMPLE_TEXT = 'user_name for HTTPServer demo'
