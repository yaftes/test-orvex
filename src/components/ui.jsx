// ─────────────────────────────────────────────────────────────────────────────
// UI KIT — every primitive the app uses, in one copyable file.
// Pure presentational React + Tailwind. No external state.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, ChevronDown, Inbox, RefreshCw, X } from 'lucide-react'
import { cn, avatarGradient, initials } from '../lib/utils'
import { useViewState, useSimulatedLoad } from '../context/AppContext'

// ─── Button ──────────────────────────────────────────────────────────────────
const BTN_VARIANTS = {
  // The 3% fire: primary actions are solid International Orange with ink text.
  primary:
    'bg-brand-500 font-bold text-ink-950 shadow-glow-sm hover:brightness-95 active:scale-[0.985]',
  dark:
    'bg-ink-950 text-white hover:bg-ink-800 active:scale-[0.985]',
  secondary:
    'bg-brand-50 text-brand-700 ring-1 ring-brand-200/70 ring-inset hover:bg-brand-100',
  outline:
    'bg-surface text-neutral-800 ring-1 ring-neutral-300 ring-inset hover:ring-neutral-900',
  ghost:
    'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
  // Destructive is structural, not red: an unmistakable mono block.
  danger:
    'bg-neutral-900 font-bold text-neutral-50 hover:opacity-90 active:scale-[0.985]',
  dangerGhost:
    'font-bold text-neutral-900 ring-1 ring-neutral-400 ring-inset hover:bg-neutral-900 hover:text-neutral-50',
}
const BTN_SIZES = {
  xs: 'h-7 px-2.5 text-xs gap-1.5 rounded-lg',
  sm: 'h-8.5 px-3.5 text-[13px] gap-1.5 rounded-[10px]',
  md: 'h-10 px-4.5 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-[15px] gap-2 rounded-[14px]',
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex cursor-pointer items-center justify-center font-semibold transition-all duration-200 select-none disabled:pointer-events-none disabled:opacity-50',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600',
        BTN_VARIANTS[variant], BTN_SIZES[size], className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// ─── Badge ───────────────────────────────────────────────────────────────────
const BADGE_VARIANTS = {
  neutral: 'bg-neutral-100 text-neutral-600',
  brand: 'bg-brand-50 text-brand-700 ring-1 ring-brand-100 ring-inset',
  solid: 'bg-brand-500 text-ink-950 font-bold',
  // Semantic states stay inside the mono system: success = solid black,
  // warning = crisp outline, danger = black with the fire for text.
  success: 'bg-neutral-900 text-neutral-50',
  warning: 'text-neutral-500 ring-1 ring-neutral-300 ring-inset',
  danger: 'bg-neutral-900 text-brand-500',
  outline: 'text-neutral-500 ring-1 ring-neutral-200 ring-inset',
  dark: 'bg-ink-950 text-white',
}

export function Badge({ variant = 'neutral', className, children, ...props }) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap', BADGE_VARIANTS[variant], className)}
      {...props}
    >
      {children}
    </span>
  )
}

// ─── Card ────────────────────────────────────────────────────────────────────
export function Card({ className, hover = false, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-surface ring-1 ring-neutral-200/80 ring-inset',
        hover && 'transition-all duration-200 hover:-translate-y-0.5 hover:ring-neutral-900',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Avatar ──────────────────────────────────────────────────────────────────
export function Avatar({ name, size = 36, className, ring = false }) {
  return (
    <div
      aria-hidden
      className={cn('flex shrink-0 items-center justify-center rounded-full font-semibold text-white select-none', ring && 'ring-2 ring-surface', className)}
      style={{ width: size, height: size, fontSize: size * 0.36, background: avatarGradient(name) }}
    >
      {initials(name)}
    </div>
  )
}

// ─── Inputs ──────────────────────────────────────────────────────────────────
export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-xl bg-surface px-3.5 text-sm text-neutral-900 ring-1 ring-neutral-200 ring-inset transition-shadow duration-200 outline-none',
        'placeholder:text-neutral-400 hover:ring-neutral-300 focus:ring-2 focus:ring-brand-500',
        className,
      )}
      {...props}
    />
  )
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'w-full resize-y rounded-xl bg-surface p-3.5 text-sm leading-relaxed text-neutral-900 ring-1 ring-neutral-200 ring-inset transition-shadow duration-200 outline-none',
        'placeholder:text-neutral-400 hover:ring-neutral-300 focus:ring-2 focus:ring-brand-500',
        className,
      )}
      {...props}
    />
  )
}

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-neutral-700">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-neutral-400">{hint}</span>}
    </label>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600',
        checked ? 'bg-brand-600' : 'bg-neutral-200',
      )}
    >
      <span
        className={cn('absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-surface shadow transition-transform duration-200', checked && 'translate-x-5')}
      />
    </button>
  )
}

// ─── Tabs ────────────────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange, className }) {
  return (
    <div role="tablist" className={cn('flex items-center gap-1 rounded-xl bg-neutral-100 p-1', className)}>
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            'flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-3.5 text-[13px] font-semibold transition-all duration-200',
            active === t.id ? 'bg-surface text-neutral-900 shadow-soft' : 'text-neutral-500 hover:text-neutral-800',
          )}
        >
          {t.label}
          {t.count != null && (
            <span className={cn('rounded-full px-1.5 py-px text-[11px] font-bold', active === t.id ? 'bg-brand-50 text-brand-700' : 'bg-neutral-200/70 text-neutral-500')}>
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

// ─── Chip (filter pill) ──────────────────────────────────────────────────────
export function Chip({ active, onClick, children, count }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[13px] font-medium transition-all duration-200',
        active
          ? 'bg-brand-500 text-ink-950'
          : 'bg-surface text-neutral-600 ring-1 ring-neutral-200 ring-inset hover:ring-neutral-300 hover:text-neutral-900',
      )}
    >
      {children}
      {count != null && (
        <span className={cn('text-[11px] font-bold', active ? 'text-ink-950/60' : 'text-neutral-400')}>{count}</span>
      )}
    </button>
  )
}

// ─── Modal & confirm dialog ─────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, wide = false }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="animate-fade-in absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('animate-scale-in relative max-h-[86vh] w-full overflow-y-auto rounded-3xl bg-surface p-6 shadow-lift', wide ? 'max-w-2xl' : 'max-w-md')}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="font-display text-lg font-bold text-neutral-900">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700">
            <X size={17} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function ConfirmDialog({ open, onClose, onConfirm, title, body, confirmLabel = 'Yes, do it', danger = true }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="mb-6 text-sm leading-relaxed text-neutral-600">{body}</p>
      <div className="flex justify-end gap-2.5">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose() }}>{confirmLabel}</Button>
      </div>
    </Modal>
  )
}

// ─── Dropdown (simple) ───────────────────────────────────────────────────────
export function Dropdown({ label, value, options, onChange, className }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const onDoc = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])
  const current = options.find((o) => o.value === value)
  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-9 cursor-pointer items-center gap-2 rounded-xl bg-surface px-3.5 text-[13px] font-semibold text-neutral-700 ring-1 ring-neutral-200 ring-inset transition-all hover:ring-neutral-300"
      >
        {label && <span className="font-medium text-neutral-400">{label}</span>}
        {current?.label}
        <ChevronDown size={14} className={cn('text-neutral-400 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="animate-scale-in absolute right-0 z-30 mt-1.5 min-w-44 origin-top-right rounded-xl bg-surface p-1.5 shadow-lift ring-1 ring-neutral-200/70" role="listbox">
          {options.map((o) => (
            <button
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              onClick={() => { onChange(o.value); setOpen(false) }}
              className={cn(
                'flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors',
                o.value === value ? 'bg-brand-50 text-brand-700' : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900',
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── States: skeleton / empty / error / gate ────────────────────────────────
export function Skeleton({ className }) {
  return <div className={cn('skeleton', className)} aria-hidden />
}

export function EmptyState({ icon: Icon = Inbox, title, body, action, className }) {
  return (
    <div className={cn('animate-fade-up flex flex-col items-center justify-center rounded-3xl bg-surface px-8 py-16 text-center ring-1 ring-neutral-200/70 ring-inset', className)}>
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-500">
        <Icon size={26} strokeWidth={1.8} />
      </div>
      <h3 className="font-display mb-1.5 text-[17px] font-bold text-neutral-900">{title}</h3>
      <p className="mx-auto mb-5 max-w-sm text-sm leading-relaxed text-neutral-500">{body}</p>
      {action}
    </div>
  )
}

export function ErrorState({ onRetry, title = 'Something went wrong', body = 'We couldn’t load this. It’s us, not you — try again.', className }) {
  return (
    <div className={cn('animate-fade-up flex flex-col items-center justify-center rounded-3xl bg-surface px-8 py-16 text-center ring-1 ring-neutral-200 ring-inset', className)}>
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-neutral-900 text-brand-500">
        <AlertTriangle size={26} strokeWidth={1.8} />
      </div>
      <h3 className="font-display mb-1.5 text-[17px] font-bold text-neutral-900">{title}</h3>
      <p className="mx-auto mb-5 max-w-sm text-sm leading-relaxed text-neutral-500">{body}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCw size={14} /> Try again
      </Button>
    </div>
  )
}

/**
 * StateGate — renders honest loading / empty / error / content states.
 * Respects the floating demo switcher, plus a brief simulated fetch on mount.
 */
export function StateGate({ loading, empty, error, children }) {
  const { viewState } = useViewState()
  const simLoading = useSimulatedLoad()
  const [retryTick, setRetryTick] = useState(0)

  if (viewState === 'loading' || (viewState === 'default' && simLoading)) return loading
  if (viewState === 'error' && retryTick === 0)
    return <ErrorState onRetry={() => setRetryTick(1)} />
  if (viewState === 'empty') return empty
  return children
}

// ─── Misc ────────────────────────────────────────────────────────────────────
export function SectionHeading({ title, sub, right, className }) {
  return (
    <div className={cn('mb-5 flex flex-wrap items-end justify-between gap-3', className)}>
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight text-neutral-900">{title}</h2>
        {sub && <p className="mt-1 text-sm text-neutral-500">{sub}</p>}
      </div>
      {right}
    </div>
  )
}

export function Divider({ className }) {
  return <div className={cn('h-px w-full bg-neutral-100', className)} />
}

export function StarRating({ value, size = 14 }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" style={{ fill: i <= Math.round(value) ? 'var(--color-brand-600)' : 'var(--color-neutral-200)' }} aria-hidden>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  )
}
