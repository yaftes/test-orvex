import { cn } from '../lib/utils'

/**
 * The Orvex wordmark as pure text (Space Grotesk, lowercase, tight).
 * Ink black in light mode, white in dark mode — `text-neutral-950` flips
 * with the theme automatically, so no theme context is needed.
 *
 * variant:
 *  - 'auto' (default) — black on light, white on dark
 *  - 'dark'           — always white (for always-dark panels)
 *  - 'light'          — always ink black
 *
 * Size with a text-size class, e.g. <Logo className="text-[21px]" />.
 */
export default function Logo({ variant = 'auto', className }) {
  const color =
    variant === 'dark' ? 'text-white'
    : variant === 'light' ? 'text-ink-950'
    : 'text-neutral-950'
  return (
    <span
      className={cn(
        'font-display leading-none font-bold tracking-tight whitespace-nowrap lowercase select-none',
        color,
        className || 'text-xl',
      )}
    >
      orvex&nbsp;ai
    </span>
  )
}
