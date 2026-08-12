import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('useI18n', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  async function load() {
    const mod = await import('./useI18n')
    return mod.useI18n()
  }

  it('默认语言为 zh', async () => {
    const { locale } = await load()
    expect(locale.value).toBe('zh')
  })

  it('setLocale 切换语言并持久化', async () => {
    const { locale, setLocale, t } = await load()
    setLocale('en')
    expect(locale.value).toBe('en')
    expect(localStorage.getItem('site-locale')).toBe('en')
    expect(t('hero.cta')).toBe('Download MarkdownSoft')
  })

  it('从 localStorage 恢复上次语言', async () => {
    localStorage.setItem('site-locale', 'en')
    const { locale } = await load()
    expect(locale.value).toBe('en')
  })

  it('未知 key 回退返回 key 本身', async () => {
    const { t } = await load()
    expect(t('no.such.key')).toBe('no.such.key')
  })
})
