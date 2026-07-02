import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { CheckCircle2, Info, XCircle } from 'lucide-react'

// ─── Toasts ──────────────────────────────────────────────────────────────────
const ToastContext = createContext(null)

export function useToast() {
  return useContext(ToastContext)
}

// ─── Demo view-state (default / loading / empty / error) ────────────────────
// Lets you preview every page's honest states from the floating switcher.
const ViewStateContext = createContext({ viewState: 'default', setViewState: () => {} })

export function useViewState() {
  return useContext(ViewStateContext)
}

// ─── Theme (light / dark) ────────────────────────────────────────────────────
// Class-based: `.dark` on <html> remaps the palette variables in index.css.
const ThemeContext = createContext({ theme: 'light', setTheme: () => {}, toggleTheme: () => {} })

export function useTheme() {
  return useContext(ThemeContext)
}

function getInitialTheme() {
  const stored = localStorage.getItem('orvex-theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** True for a moment on mount, to demo skeleton loading like a real fetch. */
export function useSimulatedLoad(ms = 550) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms)
    return () => clearTimeout(t)
  }, [ms])
  return loading
}

const TOAST_ICONS = {
  success: <CheckCircle2 size={17} className="text-emerald-400" />,
  error: <XCircle size={17} className="text-rose-400" />,
  info: <Info size={17} className="text-brand-300" />,
}

export function AppProviders({ children }) {
  const [toasts, setToasts] = useState([])
  const [viewState, setViewState] = useState('default')
  const [theme, setTheme] = useState(getInitialTheme)
  const idRef = useRef(0)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('orvex-theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  const toast = useCallback((message, type = 'success') => {
    const id = ++idRef.current
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600)
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      <ViewStateContext.Provider value={{ viewState, setViewState }}>
      <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
        {children}
        {/* Toast stack */}
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="animate-pop pointer-events-auto flex items-center gap-2.5 rounded-full bg-ink-950 py-2.5 pr-5 pl-4 text-sm font-medium text-white shadow-lift"
              role="status"
            >
              {TOAST_ICONS[t.type]}
              {t.message}
            </div>
          ))}
        </div>
      </ThemeContext.Provider>
      </ViewStateContext.Provider>
    </ToastContext.Provider>
  )
}
