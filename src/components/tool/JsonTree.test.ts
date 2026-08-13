/**
 * JsonTree 树形组件单元测试：渲染、默认层级折叠、点击折叠/展开、层级控制按钮、超大 JSON 保护。
 */
import { describe, it, expect } from 'vitest'
import { createApp, nextTick } from 'vue'
import JsonTree from './JsonTree.vue'

const sample = { name: '示例', ok: true, items: [1, 2, { deep: { x: null } }], empty: {} }

function mountTree(data: unknown, defaultDepth?: number) {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const app = createApp(JsonTree, { data, defaultDepth })
  app.mount(el)
  return { el, app }
}
const rowCount = (el: HTMLElement) => el.querySelectorAll('.jt-row').length

describe('JsonTree 树形组件', () => {
  it('全展开时渲染所有行并显示节点总数', () => {
    const { el, app } = mountTree(sample, 10)
    expect(rowCount(el)).toBeGreaterThan(10)
    expect(el.textContent).toContain('个节点')
    app.unmount()
  })

  it('默认层级折叠：深层节点自动收起', () => {
    const { el, app } = mountTree(sample, 1)
    expect(rowCount(el)).toBeLessThan(10)
    app.unmount()
  })

  it('点击折叠箭头折叠/展开子树', async () => {
    const { el, app } = mountTree(sample, 10)
    const before = rowCount(el)
    ;(el.querySelector('.jt-toggle') as HTMLButtonElement).click() // 折叠根
    await nextTick()
    expect(rowCount(el)).toBeLessThan(before)
    ;(el.querySelector('.jt-toggle') as HTMLButtonElement).click() // 重新展开根
    await nextTick()
    expect(rowCount(el)).toBe(before)
    app.unmount()
  })

  it('工具栏「折叠全部」按钮生效', async () => {
    const { el, app } = mountTree(sample, 10)
    const btns = [...el.querySelectorAll('.jt-tb-btn')]
    expect(btns.map((b) => b.textContent)).toEqual(
      expect.arrayContaining(['展开全部', '折叠全部']),
    )
    ;(btns.find((b) => b.textContent === '折叠全部') as HTMLButtonElement).click()
    await nextTick()
    expect(rowCount(el)).toBeLessThan(5)
    app.unmount()
  })

  it('超大 JSON 保护：不渲染树并如实提示', () => {
    const big: Record<string, number> = {}
    for (let i = 0; i < 20000; i++) big[`k${i}`] = i
    const { el, app } = mountTree(big, 10)
    expect(rowCount(el)).toBe(0)
    expect(el.textContent).toContain('15,000')
    app.unmount()
  })
})
