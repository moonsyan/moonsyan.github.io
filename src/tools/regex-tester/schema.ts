/** 正则测试输入校验与示例（RUN-006）。 */
import { z } from 'zod'

export const regexInputSchema = z.object({
  pattern: z.string().max(2000, '正则过长，请拆分或简化'),
  flags: z.string(),
  text: z.string().max(1 * 1024 * 1024, '测试文本超过 1MB 限制'),
})

export const EXAMPLE_PATTERN = '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b'
export const EXAMPLE_FLAGS = 'g'
export const EXAMPLE_TEXT = `联系方式：dev@example.com 与 admin.user+test@sub.domain.cn
无效示例：@missing.com、plain-text`
