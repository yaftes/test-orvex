import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SearchX, SlidersHorizontal, Sparkles, X } from 'lucide-react'
import { allSkills, categories, roles as allRoles, tags as allTags } from '../data/mock'
import { Button, Chip, Dropdown, EmptyState, StateGate } from '../components/ui'
import { SkillCard, SkillCardSkeleton, SkillGridSkeleton } from '../components/skills'
import { pluralize } from '../lib/utils'

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
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-up">
        <h1 className="font-display text-[26px] font-bold tracking-tight text-neutral-900">Marketplace</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {allSkills.length.toLocaleString()}+ skills across {categories.length} categories. Find the one that does your job.
        </p>
      </div>

      {/* Search */}
      <div className="relative animate-fade-up" style={{ animationDelay: '60ms' }}>
        <Search size={17} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-neutral-400" />
        <input
          value={q}
          onChange={(e) => setParam('q', e.target.value)}
          placeholder="Search skills, roles, categories, tags…"
          aria-label="Search skills"
          className="h-12 w-full rounded-2xl bg-surface pr-11 pl-11 text-[14.5px] text-neutral-900 shadow-soft ring-1 ring-neutral-200 ring-inset transition-shadow outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-brand-500"
        />
        {q && (
          <button onClick={() => setParam('q', '')} aria-label="Clear search" className="absolute top-1/2 right-3.5 grid h-7 w-7 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700">
            <X size={15} />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-3 animate-fade-up" style={{ animationDelay: '120ms' }}>
        <FilterRow label="Category">
          {categories.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setParam('category', category === c ? '' : c)} count={countFor('category', c)}>
              {c}
            </Chip>
          ))}
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

      {/* Result bar */}
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

      {/* Grid */}
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
