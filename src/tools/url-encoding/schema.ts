/** URL 编解码输入校验与示例数据（RUN-006）。 */
import { z } from 'zod'

export const urlInputSchema = z.object({
  text: z.string().max(512 * 1024, '输入超过 512KB 限制，请拆分后处理'),
  action: z.enum(['encode', 'decode']),
  mode: z.enum(['component', 'full']),
})

export type UrlInput = z.infer<typeof urlInputSchema>

export const EXAMPLE_TEXT = 'https://example.com/search?q=工具站&lang=中文'
export const EXAMPLE_ENCODED = 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3D%E5%B7%A5%E5%85%B7%E7%AB%99%26lang%3D%E4%B8%AD%E6%96%87'
