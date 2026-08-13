import { describe, expect, it } from 'vitest'
import { renderMarkdown } from '../core'

describe('markdown-preview core', () => {
  it('标题与段落转 HTML', () => {
    const res = renderMarkdown('# 标题\n\n一段文字')
    expect(res.ok).toBe(true)
    expect(res.html).toContain('<h1>标题</h1>')
    expect(res.html).toContain('<p>一段文字</p>')
  })

  it('列表与代码块', () => {
    const res = renderMarkdown('- a\n- b\n\n```\ncode\n```')
    expect(res.html).toContain('<li>a</li>')
    expect(res.html).toContain('<code>')
  })

  it('链接保留', () => {
    const res = renderMarkdown('[站点](https://example.com)')
    expect(res.html).toContain('href="https://example.com"')
  })

  it('空输入报错', () => {
    expect(renderMarkdown('  ').ok).toBe(false)
  })

  it('超大输入拒绝', () => {
    expect(renderMarkdown('x'.repeat(600 * 1024)).message).toContain('限制')
  })

  it('原始 script 标签会出现在未清洗输出中（验证必须 sanitize 的前提）', () => {
    // 该测试固化安全边界：core 不做清洗，渲染侧必须用 DOMPurify
    const res = renderMarkdown('<script>alert(1)</script>')
    expect(res.html).toContain('script')
  })
})
