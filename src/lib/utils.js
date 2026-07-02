// Small shared helpers. Everything is dependency-free so it copies anywhere.

export function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}

const MS = { minute: 60e3, hour: 36e5, day: 864e5, week: 6048e5, month: 2592e6 }

/** "3d ago" style relative time from an ISO date string. */
export function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < MS.minute) return 'just now'
  if (diff < MS.hour) return `${Math.floor(diff / MS.minute)}m ago`
  if (diff < MS.day) return `${Math.floor(diff / MS.hour)}h ago`
  if (diff < MS.week) return `${Math.floor(diff / MS.day)}d ago`
  if (diff < MS.month) return `${Math.floor(diff / MS.week)}w ago`
  return `${Math.floor(diff / MS.month)}mo ago`
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/** 12400 -> "12.4k" */
export function compact(n) {
  if (n == null) return '0'
  if (n < 1000) return String(n)
  if (n < 1e6) return `${(n / 1000).toFixed(n < 10000 ? 1 : 0).replace(/\.0$/, '')}k`
  return `${(n / 1e6).toFixed(1).replace(/\.0$/, '')}M`
}

/** Deterministic gradient pair for avatars, keyed by name. */
const AVATAR_GRADIENTS = [
  ['#FF5A00', '#FF9A5C'], ['#C64000', '#FF5A00'], ['#0B0B0C', '#FF5A00'],
  ['#7A2800', '#FF7D33'], ['#1A1A1D', '#71717A'], ['#FF5A00', '#FFD9BF'],
  ['#3F3F46', '#0B0B0C'], ['#F04E00', '#FFC7A6'],
]
export function avatarGradient(name = '?') {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff
  const [a, b] = AVATAR_GRADIENTS[h % AVATAR_GRADIENTS.length]
  return `linear-gradient(135deg, ${a}, ${b})`
}

export function initials(name = '?') {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function wordCount(text = '') {
  return (text.trim().match(/\S+/g) || []).length
}

export function pluralize(n, word, plural = `${word}s`) {
  return `${n} ${n === 1 ? word : plural}`
}
