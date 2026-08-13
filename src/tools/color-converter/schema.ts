/** 颜色转换输入校验与示例（RUN-006）。 */
import { z } from 'zod'

export const colorInputSchema = z.object({
  text: z.string().max(200, '颜色值过长，请填写单个颜色'),
})

export const EXAMPLE_COLOR = '#00b589'
