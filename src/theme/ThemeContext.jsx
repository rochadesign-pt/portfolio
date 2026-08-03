import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof document !== 'undefined' && document.documentElement.dataset.theme) {
      return document.documentElement.dataset.theme
    }
    return 'dark'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('rds-theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const toggle = () => setTheme((tm) => (tm === 'dark' ? 'light' : 'dark'))

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}
