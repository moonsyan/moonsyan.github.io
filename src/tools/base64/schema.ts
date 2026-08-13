/** Base64 编解码输入校验与示例数据（RUN-006：示例不含真实个人或生产数据）。 */
import { z } from 'zod'

export const base64InputSchema = z.object({
  text: z.string().max(1 * 1024 * 1024, '输入超过 1MB 限制，请拆分后处理'),
  action: z.enum(['encode', 'decode']),
  mode: z.enum(['standard', 'urlsafe']),
})

export type Base64Input = z.infer<typeof base64InputSchema>

export const EXAMPLE_TEXT = '你好，ToolKit！这是一段 Base64 示例文本。'
export const EXAMPLE_ENCODED = '5L2g5aW977yMVG9vbEtpdO+8gei/meaYr+S4gOautSBCYXNlNjQg56S65L6L5paH5pys44CC'
