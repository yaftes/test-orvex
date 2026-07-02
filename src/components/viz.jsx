// ─────────────────────────────────────────────────────────────────────────────
// VIZ KIT — dependency-free SVG micro-charts + structural visuals.
// Single-series charts use the brand hue (validated on light & dark surfaces
// via CSS vars). Text always wears text tokens; marks carry the color.
// ─────────────────────────────────────────────────────────────────────────────
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Baby, BarChart3, BookOpenText, Briefcase, Building2, ChefHat, Code2,
  Dumbbell, FlaskConical, GitFork, GraduationCap, Handshake, Headphones,
  HeartPulse, Landmark, Megaphone, Package, Palette, PenTool, Plane,
  Scale, Share2, ShoppingBag, Sprout, Star, Users, Zap, ArchiveX,
} from 'lucide-react'
import { cn, compact, formatDate, timeAgo } from '../lib/utils'

const BRAND = 'var(--color-brand-600)'

// ─── Category iconography ─────────────────────────────────────────────────────
// Architectural Studio: one material palette for everything — categories are
// identified by their icon, never by a color of their own.
const CATEGORY_ICONS = {
  'Real Estate': Building2,
  Education: GraduationCap,
  Marketing: Megaphone,
  Sales: Handshake,
  Engineering: Code2,
  Design: Palette,
  Legal: Scale,
  Finance: Landmark,
  'HR & People': Users,
  Health: HeartPulse,
  Cooking: ChefHat,
  Travel: Plane,
  Writing: PenTool,
  'Customer Support': Headphones,
  'Data & Analytics': BarChart3,
  Product: Package,
  Research: FlaskConical,
  'Social Media': Share2,
  'E-commerce': ShoppingBag,
  Parenting: Baby,
  Fitness: Dumbbell,
  Career: Briefcase,
  Productivity: Zap,
  'Personal Growth': Sprout,
}

const OCHRE = ['#FF5A00', '#FF7D33']

export function categoryArt(category) {
  return { icon: CATEGORY_ICONS[category] || BookOpenText, g: OCHRE }
}

/** Decorative gradient cover strip with pattern + oversized category icon. */
export function CategoryCover({ category, className, children }) {
  const { icon: Icon, g } = categoryArt(category)
  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ background: `linear-gradient(120deg, ${g[0]}, ${g[1]})` }}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-25"
        style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '14px 14px' }}
      />
      <div className="absolute -top-6 -right-4 rotate-12 text-white/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
        <Icon size={110} strokeWidth={1.2} />
      </div>
      {children}
    </div>
  )
}

// ─── Sparkline (decorative, lives inside stat tiles/cards) ──────────────────
export function Sparkline({ data, width = 96, height = 30, stroke = BRAND, accent, className }) {
  if (!data?.length) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const span = max - min || 1
  const px = (i) => (i / (data.length - 1)) * (width - 4) + 2
  const py = (v) => height - 3 - ((v - min) / span) * (height - 8)
  const pts = data.map((v, i) => `${px(i)},${py(v)}`).join(' L')
  const id = `sg${Math.abs(data[0] * 7 + data[data.length - 1] * 13 + data.length).toFixed(0)}`
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M${pts} L${px(data.length - 1)},${height} L${px(0)},${height} Z`} fill={`url(#${id})`} />
      <path d={`M${pts}`} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={px(data.length - 1)} cy={py(data[data.length - 1])} r="2.5" fill={accent || stroke} />
    </svg>
  )
}

// ─── Shared hover tooltip shell ──────────────────────────────────────────────
function Tip({ x, y, children }) {
  return (
    <div
      className="pointer-events-none absolute z-20 -translate-x-1/2 rounded-lg bg-ink-950 px-2.5 py-1.5 text-[11px] font-semibold whitespace-nowrap text-white shadow-lift"
      style={{ left: x, top: y }}
      role="status"
    >
      {children}
    </div>
  )
}

// ─── TrendChart: area line with crosshair + tooltip ──────────────────────────
export function TrendChart({ data, height = 150, label = '', format = compact, color = BRAND }) {
  const [hover, setHover] = useState(null)
  const ref = useRef(null)
  if (!data?.length) return null
  const W = 100 // viewBox units; scales to container
  const H = 42
  const max = Math.max(...data)
  const min = Math.min(...data)
  const span = max - min || 1
  const px = (i) => (i / (data.length - 1)) * (W - 4) + 2
  const py = (v) => H - 4 - ((v - min) / span) * (H - 10)
  const pts = data.map((v, i) => `${px(i)},${py(v)}`).join(' L')

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const frac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    const i = Math.round(frac * (data.length - 1))
    setHover({ i, x: (px(i) / W) * rect.width, y: (py(data[i]) / H) * rect.height })
  }

  return (
    <div className="relative" style={{ height }} ref={ref} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-full w-full" role="img" aria-label={label}>
        <defs>
          <linearGradient id={`tf${color.replace(/[^a-z0-9]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* recessive gridlines */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="2" x2={W - 2} y1={H * f} y2={H * f} stroke="var(--color-neutral-200)" strokeWidth="0.3" />
        ))}
        <path d={`M${pts} L${px(data.length - 1)},${H} L${px(0)},${H} Z`} fill={`url(#tf${color.replace(/[^a-z0-9]/gi, '')})`} />
        <path d={`M${pts}`} fill="none" stroke={color} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 2 }} />
        {hover && (
          <line x1={px(hover.i)} x2={px(hover.i)} y1="2" y2={H - 2} stroke="var(--color-neutral-300)" strokeWidth="0.4" strokeDasharray="1.2 1.2" />
        )}
      </svg>
      {hover && (
        <span
          className="pointer-events-none absolute z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface"
          style={{ left: hover.x, top: hover.y, background: 'var(--color-brand-500)' }}
          aria-hidden
        />
      )}
      {hover && (
        <Tip x={hover.x} y={hover.y - 34}>
          {format(data[hover.i])} · {data.length - 1 - hover.i === 0 ? 'this week' : `${data.length - 1 - hover.i}w ago`}
        </Tip>
      )}
      <div className="mt-1 flex justify-between text-[10px] font-semibold text-neutral-400">
        <span>{data.length - 1}w ago</span>
        <span>now</span>
      </div>
    </div>
  )
}

// ─── WeekBars: thin rounded bars, 2px gaps, per-bar hover ────────────────────
export function WeekBars({ data, height = 120, label = '', format = compact, color = BRAND, accentLast = false }) {
  const [hover, setHover] = useState(null)
  if (!data?.length) return null
  const max = Math.max(...data) || 1
  return (
    <div className="relative flex items-end gap-[3px]" style={{ height }} onMouseLeave={() => setHover(null)} role="img" aria-label={label}>
      {data.map((v, i) => (
        <div
          key={i}
          className="group/bar relative flex h-full flex-1 cursor-default items-end"
          onMouseEnter={(e) => {
            const bar = e.currentTarget
            setHover({ i, x: bar.offsetLeft + bar.offsetWidth / 2 })
          }}
        >
          <div
            className={cn('w-full rounded-t-[4px] transition-all duration-200', hover != null && hover.i !== i ? 'opacity-45' : '')}
            style={{ height: `${Math.max(6, (v / max) * 100)}%`, background: accentLast && i === data.length - 1 ? 'var(--color-brand-500)' : color }}
          />
        </div>
      ))}
      {hover != null && (
        <Tip x={hover.x} y={-30}>
          {format(data[hover.i])} · {data.length - 1 - hover.i === 0 ? 'this week' : `${data.length - 1 - hover.i}w ago`}
        </Tip>
      )}
    </div>
  )
}

// ─── RatingBars: 5→1 distribution, one hue, direct labels ────────────────────
export function RatingBars({ dist, className }) {
  const total = dist.reduce((a, b) => a + b, 0) || 1
  return (
    <div className={cn('space-y-1.5', className)}>
      {dist.map((n, i) => {
        const starsN = 5 - i
        const frac = n / total
        return (
          <div key={starsN} className="flex items-center gap-2">
            <span className="flex w-7 items-center gap-0.5 text-[11px] font-bold text-neutral-500">
              {starsN} <Star size={9} className="fill-brand-500 text-brand-500" />
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(frac > 0 ? 3 : 0, frac * 100)}%`, background: BRAND, opacity: 0.35 + frac * 0.65 }}
              />
            </div>
            <span className="w-8 text-right text-[11px] font-semibold text-neutral-400 tabular-nums">{compact(n)}</span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Version timeline ────────────────────────────────────────────────────────
export function VersionTimeline({ items, renderActions }) {
  return (
    <ol className="relative space-y-0">
      {items.map((item, i) => (
        <li key={item.v} className="relative flex gap-4 pb-6 last:pb-0">
          {/* rail */}
          {i < items.length - 1 && (
            <span className="absolute top-8 left-[13px] h-[calc(100%-16px)] w-px bg-gradient-to-b from-brand-300 to-neutral-200" aria-hidden />
          )}
          {/* dot */}
          <span
            className={cn(
              'relative z-10 mt-1.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[9px] font-black',
              i === 0 && !item.deprecated
                ? 'bg-gradient-to-br from-brand-600 to-brand-400 text-white shadow-glow-sm'
                : item.deprecated
                  ? 'bg-neutral-200 text-neutral-600 ring-2 ring-surface'
                  : 'bg-brand-50 text-brand-700 ring-2 ring-surface',
            )}
            aria-hidden
          >
            {item.deprecated ? <ArchiveX size={12} /> : `v${String(item.v).split('.')[0]}`}
          </span>

          <div className="min-w-0 flex-1 animate-fade-up rounded-2xl bg-surface p-4.5 ring-1 ring-neutral-200/70 ring-inset transition-all hover:ring-brand-200 hover:shadow-soft" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-[15px] font-bold text-neutral-900">v{item.v}</span>
                  {i === 0 && !item.deprecated && (
                    <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10.5px] font-bold text-neutral-50">Latest</span>
                  )}
                  {item.deprecated && (
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10.5px] font-bold text-neutral-500">Outdated</span>
                  )}
                  <span className="text-[11.5px] text-neutral-400">{timeAgo(item.date)}</span>
                </p>
                <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-neutral-600">{item.notes}</p>
                {item.deprecated?.reason && (
                  <p className="mt-2 rounded-lg bg-brand-50 px-3 py-1.5 text-[12px] text-brand-700">{item.deprecated.reason}</p>
                )}
                {item.byName && (
                  <p className="mt-2 text-[11.5px] text-neutral-400">{item.byName} · {formatDate(item.date)}</p>
                )}
              </div>
              {renderActions && <div className="flex shrink-0 gap-2">{renderActions(item, i)}</div>}
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}

// ─── Fork lineage tree ───────────────────────────────────────────────────────
function TreeNode({ node, highlight }) {
  const { icon: Icon, g } = categoryArt(node.category)
  const inner = (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl p-3 pr-4 ring-1 ring-inset transition-all',
        highlight
          ? 'bg-gradient-to-r from-brand-50 to-surface ring-brand-300 shadow-glow-sm'
          : 'bg-surface ring-neutral-200/70 hover:ring-brand-200 hover:shadow-soft',
      )}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white" style={{ background: `linear-gradient(135deg, ${g[0]}, ${g[1]})` }}>
        <Icon size={16} />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span className={cn('truncate text-[13.5px] font-bold', highlight ? 'text-brand-800' : 'text-neutral-900')}>{node.title}</span>
          {node.badge && (
            <span className={cn('shrink-0 rounded-full px-2 py-px text-[10px] font-bold', node.badgeStyle || 'bg-brand-600 text-white')}>{node.badge}</span>
          )}
        </span>
        <span className="block truncate text-[11.5px] text-neutral-400">{node.meta}</span>
      </span>
      {node.stat != null && (
        <span className="ml-auto flex shrink-0 items-center gap-1 text-[11.5px] font-bold text-neutral-400">
          <GitFork size={11} /> {compact(node.stat)}
        </span>
      )}
    </div>
  )
  return node.to ? <Link to={node.to} className="block min-w-0 flex-1">{inner}</Link> : <div className="min-w-0 flex-1">{inner}</div>
}

/**
 * Family tree of a skill: optional parent above, this skill highlighted,
 * forks (marketplace + your drafts) branching below with elbow connectors.
 */
export function ForkTree({ parent, current, children }) {
  return (
    <div>
      {parent && (
        <>
          <div className="flex"><TreeNode node={parent} /></div>
          <div className="ml-[26px] h-5 w-px bg-gradient-to-b from-neutral-300 to-brand-400" aria-hidden />
        </>
      )}
      <div className="flex"><TreeNode node={current} highlight /></div>
      {children.length > 0 && (
        <ul className="mt-2.5 space-y-2.5 pl-3.5">
          {children.map((child, i) => (
            <li key={child.id || i} className="relative pl-6">
              {/* elbow from the rail into this card's vertical center */}
              <span
                aria-hidden
                className="absolute -top-2.5 left-0 h-[calc(50%+10px)] w-5 rounded-bl-[14px] border-b border-l border-neutral-300"
              />
              {/* rail continues down to the next sibling */}
              {i < children.length - 1 && (
                <span aria-hidden className="absolute top-1/2 -bottom-2.5 left-0 w-px bg-neutral-300" />
              )}
              <TreeNode node={child} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
