/** Markdown 预览输入校验与示例（RUN-006）。 */
import { z } from 'zod'

export const markdownInputSchema = z.object({
  text: z.string(),
})

export const EXAMPLE_MARKDOWN = `# ToolKit 示例

一个**本地运行**的 Markdown 预览示例。

## 功能

- 实时预览
- 代码高亮结构
- 复制 HTML

\`\`\`ts
const local = true
\`\`\`

> 输入内容不会上传服务器。
`
