/** JSON/CSV 转换输入校验与示例（RUN-006）。 */
import { z } from 'zod'

export const jsonCsvInputSchema = z.object({
  text: z.string().max(5 * 1024 * 1024, '输入超过 5MB 限制'),
  action: z.enum(['json2csv', 'csv2json']),
  delimiter: z.enum([',', '\t', ';']).default(','),
  hasHeader: z.boolean().default(true),
  nested: z.enum(['flatten', 'stringify']).default('flatten'),
})

export const EXAMPLE_JSON = `[
  { "name": "示例工具", "version": 1, "meta": { "author": "toolkit" } },
  { "name": "第二个", "version": 2 }
]`
