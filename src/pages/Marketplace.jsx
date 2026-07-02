import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Flame, Layers3, Search, SearchX, SlidersHorizontal, Sparkles, Users2, GitFork, X } from 'lucide-react'
import { allSkills, categories, roles as allRoles, tags as allTags, users } from '../data/mock'
import { Button, Chip, Dropdown, EmptyState, StateGate } from '../components/ui'
import { SkillCard, SkillCardSkeleton, SkillGridSkeleton } from '../components/skills'
import { categoryArt } from '../components/viz'
import { cn, pluralize } from '../lib/utils'

const PAGE_SIZE = 12

const SORTS = [
  { value: 'recent', label: 'Recent' },
  { value: 'trending', label: 'Trending' },
  { value: 'stars', label: 'Most starred' },
  { value: 'popular', label: 'Popular' },
]

function matches(skill, { q, category, roles, tags }) {
  if (category && skill.category !== category) return false
  if (roles.length && !roles.some((r) => skill.roles.includes(r))) return false
  if (tags.length && !tags.some((t) => skill.tags.includes(t))) return false
  if (q) {
    const hay = `${skill.title} ${skill.tagline} ${skill.category} ${skill.roles.join(' ')} ${skill.tags.join(' ')}`.toLowerCase()
    if (!hay.includes(q.toLowerCase())) return false
  }
  return true
}

function sortSkills(list, sort, q) {
  const copy = [...list]
  switch (sort) {
    case 'trending': return copy.sort((a, b) => b.forksWeek - a.forksWeek)
    case 'stars': return copy.sort((a, b) => b.stars - a.stars)
    case 'popular': return copy.sort((a, b) => (b.saves + b.forksTotal) - (a.saves + a.forksTotal))
    case 'relevance': {
      const ql = q.toLowerCase()
      return copy.sort((a, b) => {
        const at = a.title.toLowerCase().includes(ql) ? 1 : 0
        const bt = b.title.toLowerCase().includes(ql) ? 1 : 0
        return bt - at || b.stars - a.stars
      })
    }
    default: return copy.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  }
}

const forksThisWeek = allSkills.reduce((n, s) => n + s.forksWeek, 0)

export default function Marketplace() {
  // All filter/search/sort state lives in the URL — shareable, back-button friendly.
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const category = params.get('category') || ''
  const selRoles = params.getAll('role')
  const selTags = params.getAll('tag')
  const sort = params.get('sort') || (q ? 'relevance' : 'recent')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [loadingMore, setLoadingMore] = useState(false)
  const sentinelRef = useRef(null)

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: false })
    setVisible(PAGE_SIZE)
  }

  const toggleMulti = (key, value) => {
    const next = new URLSearchParams(params)
    const current = next.getAll(key)
    next.delete(key)
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    updated.forEach((v) => next.append(key, v))
    setParams(next)
    setVisible(PAGE_SIZE)
  }

  const filters = { q, category, roles: selRoles, tags: selTags }
  const results = useMemo(() => sortSkills(allSkills.filter((s) => matches(s, filters)), sort, q), [q, category, selRoles.join(), selTags.join(), sort])
  const trending = useMemo(() => [...allSkills].filter((s) => !s.deprecated).sort((a, b) => b.forksWeek - a.forksWeek).slice(0, 8), [])

  // Live counts per chip: what the result set would be with that chip applied.
  const countFor = (key, value) => allSkills.filter((s) => matches(s, {
    ...filters,
    category: key === 'category' ? value : filters.category,
    roles: key === 'roles' ? [value] : filters.roles,
    tags: key === 'tags' ? [value] : filters.tags,
  })).length

  const anyFilter = q || category || selRoles.length > 0 || selTags.length > 0

  const clearAll = () => {
    setParams(new URLSearchParams(), { replace: false })
    setVisible(PAGE_SIZE)
  }

  // Infinite scroll
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && visible < results.length && !loadingMore) {
        setLoadingMore(true)
        setTimeout(() => {
          setVisible((v) => v + PAGE_SIZE)
          setLoadingMore(false)
        }, 450)
      }
    }, { rootMargin: '600px' })
    io.observe(el)
    return () => io.disconnect()
  }, [visible, results.length, loadingMore])

  const shown = results.slice(0, visible)
  const sortOptions = q ? [{ value: 'relevance', label: 'Relevance' }, ...SORTS] : SORTS

  return (
    <div className="space-y-7">
      {/* ─── Hero ─── */}
      <div className="animate-fade-up relative overflow-hidden rounded-3xl bg-ink-950 px-6 pt-10 pb-8 ring-1 ring-white/10 ring-inset sm:px-10">
        <div className="bg-hero-grid absolute inset-0" />
        <div className="animate-float absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-brand-600/30 blur-[90px]" />
        <div className="animate-float-slow absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-brand-500/15 blur-[80px]" />

        <div className="relative mx-auto max-w-2xl text-center">
          <h1 className="font-display mb-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Find the skill that <span className="text-gradient">does your job</span>
          </h1>
          <p className="mb-6 text-[14px] text-zinc-400">
            Every skill shows exactly what it does — in plain language — before you trust it.
          </p>

          {/* Search, front and center */}
          <div className="relative mx-auto max-w-xl">
            <Search size={18} className="pointer-events-none absolute top-1/2 left-4.5 -translate-y-1/2 text-zinc-500" />
            <input
              value={q}
              onChange={(e) => setParam('q', e.target.value)}
              placeholder="Search skills, roles, categories, tags…"
              aria-label="Search skills"
              className="h-13 w-full rounded-2xl bg-white/10 pr-12 pl-12 text-[15px] text-white ring-1 ring-white/15 ring-inset backdrop-blur-md transition-all outline-none placeholder:text-zinc-500 focus:bg-white/15 focus:ring-2 focus:ring-brand-500"
            />
            {q && (
              <button onClick={() => setParam('q', '')} aria-label="Clear search" className="absolute top-1/2 right-3.5 grid h-7 w-7 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-zinc-400 hover:bg-white/10 hover:text-white">
                <X size={15} />
              </button>
            )}
          </div>

          {/* Live stats — all real numbers */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[12.5px] font-semibold text-zinc-400">
            <span className="flex items-center gap-1.5"><Sparkles size={13} className="text-brand-400" /> {allSkills.length.toLocaleString()} skills</span>
            <span className="flex items-center gap-1.5"><Layers3 size={13} className="text-brand-400" /> {categories.length} categories</span>
            <span className="flex items-center gap-1.5"><Users2 size={13} className="text-brand-400" /> {users.length} creators</span>
            <span className="flex items-center gap-1.5"><GitFork size={13} className="text-brand-400" /> {forksThisWeek} forks this week</span>
          </div>
        </div>
      </div>

      {/* ─── Trending rail (hidden while filtering — results take the stage) ─── */}
      {!anyFilter && (
        <section className="animate-fade-up" style={{ animationDelay: '80ms' }}>
          <div className="mb-3.5 flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-white"><Flame size={14} /></span>
            <h2 className="font-display text-lg font-bold tracking-tight text-neutral-900">Trending this week</h2>
            <span className="text-[12px] font-semibold text-neutral-400">ranked by real forks</span>
          </div>
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 scrollbar-none sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            {trending.map((s, i) => (
              <div key={s.id} className="w-[290px] shrink-0 snap-start">
                <SkillCard skill={s} rank={i + 1} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Category quick-picks ─── */}
      <div className="space-y-3 animate-fade-up" style={{ animationDelay: '140ms' }}>
        <FilterRow label="Category">
          {categories.map((c) => {
            const { icon: Icon } = categoryArt(c)
            const active = category === c
            return (
              <button
                key={c}
                onClick={() => setParam('category', active ? '' : c)}
                aria-pressed={active}
                className={cn(
                  'inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[12.5px] font-semibold transition-all duration-200',
                  active
                    ? 'bg-neutral-900 text-neutral-50 shadow-soft'
                    : 'bg-surface text-neutral-600 ring-1 ring-neutral-200 ring-inset hover:ring-brand-300 hover:text-brand-700',
                )}
              >
                <Icon size={13} className={active ? 'text-brand-400' : 'text-neutral-400'} />
                {c}
                <span className={cn('text-[10.5px] font-bold', active ? 'text-brand-400' : 'text-neutral-400')}>{countFor('category', c)}</span>
              </button>
            )
          })}
        </FilterRow>
        <FilterRow label="Roles">
          {allRoles.map((r) => (
            <Chip key={r} active={selRoles.includes(r)} onClick={() => toggleMulti('role', r)} count={countFor('roles', r)}>
              {r}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="Tags">
          {allTags.map((t) => (
            <Chip key={t} active={selTags.includes(t)} onClick={() => toggleMulti('tag', t)} count={countFor('tags', t)}>
              #{t}
            </Chip>
          ))}
        </FilterRow>
      </div>

      {/* ─── Result bar ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-5">
        <div className="flex items-center gap-3">
          <p className="text-sm font-semibold text-neutral-700">{pluralize(results.length, 'skill')}</p>
          {anyFilter && (
            <button onClick={clearAll} className="flex cursor-pointer items-center gap-1 text-[13px] font-semibold text-brand-600 transition-colors hover:text-brand-700">
              <X size={13} /> Clear filters
            </button>
          )}
        </div>
        <Dropdown label="Sort" value={sort} options={sortOptions} onChange={(v) => setParam('sort', v)} />
      </div>

      {/* ─── Grid ─── */}
      <StateGate
        loading={<SkillGridSkeleton />}
        empty={
          <EmptyState
            icon={Sparkles}
            title="Nothing published yet"
            body="The marketplace is warming up. Be the first — create a skill and publish it."
            action={<Button>Create the first skill</Button>}
          />
        }
      >
        {results.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No skills match"
            body={anyFilter ? 'Try adjusting your filters or removing a keyword — the perfect skill might be one chip away.' : 'Nothing published yet. Be the first to create a skill.'}
            action={anyFilter ? <Button variant="secondary" onClick={clearAll}><SlidersHorizontal size={15} /> Clear all filters</Button> : null}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {shown.map((s, i) => (
                <div key={s.id} className="animate-fade-up" style={{ animationDelay: `${(i % PAGE_SIZE) * 40}ms` }}>
                  <SkillCard skill={s} />
                </div>
              ))}
              {loadingMore && Array.from({ length: 4 }, (_, i) => <SkillCardSkeleton key={`sk-${i}`} />)}
            </div>
            <div ref={sentinelRef} className="h-px" aria-hidden />
            {visible >= results.length && results.length > PAGE_SIZE && (
              <p className="py-6 text-center text-[13px] text-neutral-400">You’ve seen all {results.length} matching skills ✨</p>
            )}
          </>
        )}
      </StateGate>
    </div>
  )
}

function FilterRow({ label, children }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1.5 w-16 shrink-0 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">{label}</span>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">{children}</div>
    </div>
  )
}
