/** 字数统计输入校验与示例（RUN-006）。 */
import { z } from 'zod'

export const wordCounterInputSchema = z.object({
  text: z.string().max(2 * 1024 * 1024, '输入超过 2MB 限制，请拆分后处理'),
})

export const EXAMPLE_TEXT = `ToolKit 是一个本地运行的工具站。
It runs entirely in your browser.
数据不离开设备，输入即出结果。`
