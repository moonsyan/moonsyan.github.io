/** Unicode 转换输入校验与示例（RUN-006）。 */
import { z } from 'zod'

export const unicodeInputSchema = z.object({
  text: z.string().max(1 * 1024 * 1024, '输入超过 1MB 限制'),
  action: z.enum(['encode', 'decode']),
})

export const EXAMPLE_TEXT = '你好 ToolKit 😀'
export const EXAMPLE_ESCAPED = '\\u4f60\\u597d ToolKit \\ud83d\\ude00'
