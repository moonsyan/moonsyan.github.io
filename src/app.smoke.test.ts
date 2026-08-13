/**
 * 应用冒烟测试（jsdom）：整站挂载 + 关键路由渲染。
 * 覆盖：首页（含站长工具推荐）、客户端工具详情、服务端工具静态版提示、
 * MarkdownSoft 详情页、未知路径 404 兜底。
 */
import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { registerGlobals } from './registerGlobals'

let app: ReturnType<typeof createApp>

beforeAll(async () => {
  // jsdom 未实现 matchMedia，补最小 polyfill（theme store 初始化需要）
  window.matchMedia =
    window.matchMedia ||
    ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }))
  document.body.innerHTML = '<div id="app"></div>'
  // jsdom 未实现 window.scrollTo（vue-router 滚动行为需要）
  window.scrollTo = () => {}
  app = createApp(App)
  app.use(createPinia())
  app.use(router)
  registerGlobals(app)
  app.mount('#app')
  await router.isReady()
})

afterAll(() => {
  app.unmount()
})

async function goto(path: string, expectText?: string) {
  await router.push(path)
  if (expectText) {
    // 异步组件渲染时机不定：轮询等待目标文本出现（最长 5s）
    for (let i = 0; i < 100; i++) {
      if ((document.body.textContent ?? '').includes(expectText)) return
      await new Promise((r) => setTimeout(r, 50))
    }
  } else {
    await new Promise((r) => setTimeout(r, 60))
  }
}

describe('应用冒烟测试', () => {
  it('首页渲染：Hero、工具墙与站长工具推荐', async () => {
    await goto('/', 'JSON 格式化')
    const text = document.body.textContent ?? ''
    expect(text).toContain('简单的工具')
    expect(text).toContain('站长工具推荐')
    expect(text).toContain('MarkdownSoft')
  })

  it('客户端工具详情页渲染真实组件', async () => {
    await goto('/tools/json-formatter', 'JSON 文本')
    const text = document.body.textContent ?? ''
    expect(text).toContain('JSON 格式化')
    expect(text).toContain('本地运行')
  })

  it('服务端/文件工具显示静态版提示', async () => {
    await goto('/tools/pdf-merge', '需要后端服务支持')
    const text = document.body.textContent ?? ''
    expect(text).toContain('PDF 合并')
  })

  it('MarkdownSoft 详情页渲染', async () => {
    await goto('/markdownsoft', '本地优先 · 专注写作的 Markdown 编辑器')
    const text = document.body.textContent ?? ''
    expect(text).toContain('多格式导出')
  })

  it('未知路径兜底 404', async () => {
    await goto('/definitely-not-exist', '404')
  })
})
