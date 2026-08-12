import { ref } from 'vue'
import zh from '../locales/zh'
import en from '../locales/en'

export type Locale = 'zh' | 'en'

const STORAGE_KEY = 'site-locale'
const dicts: Record<Locale, Record<string, string>> = { zh, en }

function loadLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'zh' || saved === 'en') return saved
  } catch {
    /* localStorage 不可用时忽略 */
  }
  return 'zh'
}

const locale = ref<Locale>(loadLocale())

export function useI18n() {
  function setLocale(l: Locale) {
    locale.value = l
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* 忽略 */
    }
    document.documentElement.lang = l
  }

  function t(key: string): string {
    return dicts[locale.value][key] ?? key
  }

  return { locale, setLocale, t }
}
