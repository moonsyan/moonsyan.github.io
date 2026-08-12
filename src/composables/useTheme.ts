import { ref } from 'vue'

export type Theme = 'light' | 'dark' | 'rose' | 'ocean'
export const THEMES: Theme[] = ['light', 'dark', 'rose', 'ocean']

const STORAGE_KEY = 'site-theme'
const isTheme = (v: unknown): v is Theme => THEMES.includes(v as Theme)

function loadTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isTheme(saved)) return saved
  } catch {
    /* localStorage 不可用时忽略 */
  }
  const dark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  return dark ? 'dark' : 'light'
}

const theme = ref<Theme>(loadTheme())
document.documentElement.setAttribute('data-theme', theme.value)

export function useTheme() {
  function setTheme(t: Theme) {
    theme.value = t
    document.documentElement.setAttribute('data-theme', t)
    try {
      localStorage.setItem(STORAGE_KEY, t)
    } catch {
      /* 忽略 */
    }
  }

  return { theme, setTheme }
}
