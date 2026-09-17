export const THEME_STORAGE_KEY = 'fithit_theme'

export function getStoredTheme() {
  return localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light'
}

export function applyTheme(theme) {
  const nextTheme = theme === 'dark' ? 'dark' : 'light'
  document.documentElement.dataset.theme = nextTheme
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
  return nextTheme
}

export function applyStoredTheme() {
  return applyTheme(getStoredTheme())
}
