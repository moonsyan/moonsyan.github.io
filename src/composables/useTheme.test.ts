import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    vi.resetModules()
  })

  async function load() {
    const mod = await import('./useTheme')
    return mod.useTheme()
  }

  it('默认浅色主题', async () => {
    const { theme } = await load()
    expect(theme.value).toBe('light')
  })

  it('系统深色偏好时默认深色主题', async () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true
    } as MediaQueryList)
    const { theme } = await load()
    expect(theme.value).toBe('dark')
    vi.restoreAllMocks()
  })

  it('setTheme 切换并同步 html 属性与 localStorage', async () => {
    const { theme, setTheme } = await load()
    setTheme('ocean')
    expect(theme.value).toBe('ocean')
    expect(document.documentElement.getAttribute('data-theme')).toBe('ocean')
    expect(localStorage.getItem('site-theme')).toBe('ocean')
  })

  it('localStorage 非法值回退到系统偏好', async () => {
    localStorage.setItem('site-theme', 'neon')
    const { theme } = await load()
    expect(['light', 'dark']).toContain(theme.value)
  })

  it('THEMES 导出恰好四套主题', async () => {
    const { THEMES } = await import('./useTheme')
    expect(THEMES).toEqual(['light', 'dark', 'rose', 'ocean'])
  })
})
