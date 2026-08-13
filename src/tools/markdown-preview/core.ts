/**
 * Markdown 预览核心逻辑（TOOL-011）。
 * - 使用成熟解析库 marked 将 Markdown 转为 HTML；
 * - 重要安全边界：本函数输出的是未清洗 HTML，
 *   渲染前必须经过 DOMPurify 清洗（见 ToolView.vue），
 *   脚本、事件属性与危险 URL 不得执行（架构文档 8.2）。
 */
import { marked } from 'marked'

export interface MarkdownResult {
  ok: boolean
  message?: string
  /** 未清洗 HTML，渲染前必须 sanitize */
  html?: string
}

export const MAX_MARKDOWN_SIZE = 500 * 1024

/** Markdown → 原始 HTML（同步）。 */
export function renderMarkdown(markdown: string): MarkdownResult {
  if (!markdown.trim()) {
    return { ok: false, message: '输入为空，请填写 Markdown 文本' }
  }
  if (markdown.length > MAX_MARKDOWN_SIZE) {
    return { ok: false, message: '输入超过 500KB 限制，请拆分后处理' }
  }
  try {
    const html = marked.parse(markdown, { async: false })
    return { ok: true, html }
  } catch (err) {
    return { ok: false, message: `解析失败：${(err as Error).message}` }
  }
}
