// Floating pill that previews each page's honest states (default / loading /
// empty / error). A demo-only affordance — delete this file in production.
import { useState } from 'react'
import { FlaskConical, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { useViewState } from '../context/AppContext'

const STATES = [
  { id: 'default', label: 'Live' },
  { id: 'loading', label: 'Loading' },
  { id: 'empty', label: 'Empty' },
  { id: 'error', label: 'Error' },
]

export default function DemoStateSwitcher() {
  const { viewState, setViewState } = useViewState()
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed right-5 bottom-5 z-[80]">
      {open ? (
        <div className="animate-scale-in flex items-center gap-1 rounded-full bg-ink-950 p-1.5 shadow-lift">
          <span className="pl-3 pr-1 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">UI state</span>
          {STATES.map((s) => (
            <button
              key={s.id}
              onClick={() => setViewState(s.id)}
              className={cn(
                'h-7 cursor-pointer rounded-full px-3 text-xs font-semibold transition-all',
                viewState === s.id ? 'bg-brand-600 text-white shadow-glow-sm' : 'text-zinc-400 hover:text-white',
              )}
            >
              {s.label}
            </button>
          ))}
          <button onClick={() => setOpen(false)} aria-label="Collapse" className="grid h-7 w-7 cursor-pointer place-items-center rounded-full text-zinc-500 hover:text-white">
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          title="Preview loading / empty / error states"
          className={cn(
            'grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-ink-950 text-white shadow-lift transition-transform hover:scale-105',
            viewState !== 'default' && 'ring-2 ring-brand-500',
          )}
        >
          <FlaskConical size={18} />
        </button>
      )}
    </div>
  )
}
