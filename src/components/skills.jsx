// Skill-centric building blocks: cards, signal rows, block renderers.
// Architectural Studio system: bone surfaces, ink structure, one ochre accent.
import { Link } from 'react-router-dom'
import {
  GitFork, Star, Bookmark, Sparkles, ArchiveX, Flame, UserRound,
  MessageCircleQuestion, ListChecks, AudioLines, FileOutput, ShieldCheck, Puzzle,
} from 'lucide-react'
import { cn, compact, timeAgo } from '../lib/utils'
import { userById, seriesFor } from '../data/mock'
import { Avatar, Badge, Card, Skeleton } from './ui'
import { Sparkline, categoryArt } from './viz'

export function SignalRow({ skill, className, size = 13 }) {
  return (
    <div className={cn('flex items-center gap-3.5 text-[12.5px] font-medium text-neutral-500', className)}>
      <span className="flex items-center gap-1" title="Stars">
        <Star size={size} className={skill.starredByMe ? 'fill-brand-600 text-brand-600' : 'text-neutral-400'} />
        {compact(skill.stars)}
      </span>
      <span className="flex items-center gap-1" title="Forks">
        <GitFork size={size} className="text-neutral-400" />
        {compact(skill.forksTotal)}
      </span>
      <span className="flex items-center gap-1" title="Saves">
        <Bookmark size={size} className={skill.savedByMe ? 'fill-brand-600 text-brand-600' : 'text-neutral-400'} />
        {compact(skill.saves)}
      </span>
    </div>
  )
}

/**
 * The skill card, Architectural Studio edition — a clean specimen sheet:
 * small-caps category rule on top, editorial title, hairline dividers,
 * ochre sparkline, honest signals. No decorative color blocks.
 */
export function SkillCard({ skill, to, rank }) {
  const creator = userById(skill.creatorId)
  const trend = seriesFor(skill.id, 10)
  const hot = skill.forksWeek >= 18
  const { icon: CatIcon } = categoryArt(skill.category)

  return (
    <Link
      to={to || `/app/skills/${skill.id}`}
      className="group block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
    >
      <article className="relative flex h-full flex-col rounded-2xl bg-surface p-5 ring-1 ring-neutral-200 ring-inset transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lift group-hover:ring-neutral-900">
        {/* Index rule — category + badges over a hairline */}
        <div className="mb-3.5 flex items-center justify-between gap-2 border-b border-neutral-200/80 pb-3">
          <span className="flex min-w-0 items-center gap-1.5 text-[10.5px] font-bold tracking-[0.16em] text-brand-700 uppercase">
            <CatIcon size={12} strokeWidth={2.2} className="shrink-0" />
            <span className="truncate">{skill.category}</span>
          </span>
          <div className="flex shrink-0 items-center gap-1.5">
            {rank != null && (
              <span className="grid h-5.5 w-5.5 place-items-center rounded-full bg-ink-950 text-[10.5px] font-black text-white">
                {rank}
              </span>
            )}
            {hot && !skill.deprecated && (
              <span className="flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                <Flame size={10} className="fill-brand-600 text-brand-600" /> Hot
              </span>
            )}
            {skill.isNew && skill.saves === 0 && (
              <span className="flex items-center gap-1 rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-black text-ink-950">
                <Sparkles size={10} /> NEW
              </span>
            )}
            {skill.deprecated && (
              <span className="flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-500">
                <ArchiveX size={10} /> Outdated
              </span>
            )}
            <span className="text-[11px] font-semibold text-neutral-400 tabular-nums">v{skill.version}</span>
          </div>
        </div>

        {/* Title & tagline */}
        <h3 className="font-display mb-1.5 text-[16.5px] leading-snug font-bold text-neutral-900 transition-colors group-hover:text-brand-700">
          {skill.title}
        </h3>
        <p className="mb-4 line-clamp-2 text-[13px] leading-relaxed text-neutral-500">{skill.tagline}</p>

        {/* Spec chips */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {skill.roles.slice(0, 2).map((r) => (
            <span key={r} className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-800">{r}</span>
          ))}
          {skill.tags.slice(0, 2).map((t) => (
            <span key={t} className="rounded-md px-2 py-0.5 text-[11px] font-medium text-neutral-400 ring-1 ring-neutral-200 ring-inset">#{t}</span>
          ))}
        </div>

        {/* Activity strip */}
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-neutral-200/80 pt-3">
          <div className="min-w-0">
            <span className="flex items-center gap-2 text-[12.5px] font-semibold text-neutral-500">
              <Avatar name={creator.name} size={22} />
              <span className="truncate">{creator.name}</span>
            </span>
            {skill.forksWeek > 0 && (
              <p className="mt-1.5 flex items-center gap-1 text-[10.5px] font-bold tracking-wide text-brand-700 uppercase">
                <GitFork size={9} /> {skill.forksWeek} forks this week
              </p>
            )}
          </div>
          <Sparkline data={trend} width={64} height={24} className="mb-0.5 shrink-0 opacity-80" />
        </div>
        <div className="mt-2.5 border-t border-neutral-100 pt-2.5">
          <SignalRow skill={skill} />
        </div>
      </article>
    </Link>
  )
}

export function SkillCardSkeleton() {
  return (
    <Card className="p-5">
      <div className="mb-3.5 flex justify-between border-b border-neutral-200/60 pb-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-10" />
      </div>
      <Skeleton className="mb-2 h-5 w-4/5" />
      <Skeleton className="mb-1.5 h-3.5 w-full" />
      <Skeleton className="mb-4 h-3.5 w-2/3" />
      <div className="mb-4 flex gap-1.5">
        <Skeleton className="h-5 w-16 rounded-md" />
        <Skeleton className="h-5 w-14 rounded-md" />
      </div>
      <div className="flex items-center justify-between border-t border-neutral-200/60 pt-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-[22px] w-[22px] rounded-full" />
          <Skeleton className="h-3.5 w-20" />
        </div>
        <Skeleton className="h-5 w-16" />
      </div>
    </Card>
  )
}

export function SkillGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => <SkillCardSkeleton key={i} />)}
    </div>
  )
}

// One material for every section — identity comes from the icon and label.
const SECTION_ICONS = {
  Role: UserRound,
  'What it asks you': MessageCircleQuestion,
  Instructions: ListChecks,
  'Tone & voice': AudioLines,
  'Output format': FileOutput,
  Guardrails: ShieldCheck,
}
const G = ['#FF5A00', '#FF7D33'] // international orange

/**
 * The skill's pieces as a connected flow — cards threaded onto an ochre spine
 * (alternating sides on desktop) with an energy pulse traveling the line.
 * Plain language only, never raw markup.
 */
export function BlockList({ blocks, className }) {
  return (
    <div className={cn('relative', className)}>
      {/* spine */}
      <div
        className="absolute top-4 bottom-4 left-[22px] w-px -translate-x-1/2 lg:left-1/2"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--color-brand-400) 8%, var(--color-brand-600) 55%, var(--color-brand-300) 92%, transparent)' }}
        aria-hidden
      />
      {/* traveling pulse */}
      <div className="absolute top-4 bottom-4 left-[22px] w-px -translate-x-1/2 lg:left-1/2" aria-hidden>
        <span className="flow-pulse absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-brand-400 shadow-[0_0_12px_3px_rgba(255,90,0,0.5)]" />
      </div>

      <ol className="space-y-6 lg:space-y-8">
        {blocks.map((b, i) => {
          const Icon = SECTION_ICONS[b.section] || Puzzle
          const left = i % 2 === 0 // desktop: alternate sides
          return (
            <li key={b.id} className="relative lg:grid lg:grid-cols-2">
              {/* node on the spine */}
              <span
                className="absolute top-5 left-[22px] z-10 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full text-white ring-4 ring-canvas lg:left-1/2"
                style={{ background: `linear-gradient(135deg, ${G[0]}, ${G[1]})`, boxShadow: `0 4px 16px ${G[0]}45` }}
                aria-hidden
              >
                <Icon size={17} strokeWidth={2.2} />
              </span>

              {/* connector: spine → card */}
              <span
                className={cn('absolute top-[39px] hidden h-px w-14 lg:block', left ? 'right-1/2 mr-5' : 'left-1/2 ml-5')}
                style={{ background: `linear-gradient(to ${left ? 'left' : 'right'}, ${G[0]}aa, ${G[1]}33)` }}
                aria-hidden
              />
              <span
                className={cn('absolute top-[36.5px] hidden h-1.5 w-1.5 rounded-full lg:block', left ? 'right-1/2 mr-[73px]' : 'left-1/2 ml-[73px]')}
                style={{ background: G[0] }}
                aria-hidden
              />
              {/* mobile connector */}
              <span className="absolute top-[39px] left-[30px] h-px w-4 lg:hidden" style={{ background: `linear-gradient(to right, ${G[0]}aa, ${G[1]}33)` }} aria-hidden />

              {/* card */}
              <div className={cn('ml-12 lg:ml-0', left ? 'lg:col-start-1 lg:mr-[76px]' : 'lg:col-start-2 lg:ml-[76px]')}>
                <div
                  className="group animate-fade-up relative overflow-hidden rounded-3xl bg-surface p-5 ring-1 ring-neutral-200/80 ring-inset transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift hover:ring-neutral-900"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  {/* ochre hairline */}
                  <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(to right, ${G[0]}, ${G[1]}, transparent)` }} aria-hidden />
                  {/* step watermark */}
                  <span className="font-display pointer-events-none absolute -right-1 -bottom-4 text-[64px] leading-none font-black text-neutral-100 select-none" aria-hidden>
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="relative">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-brand-50 px-2.5 py-1 text-[10.5px] font-bold tracking-wider text-brand-800 uppercase">
                        {b.section}
                      </span>
                    </div>
                    <h4 className="font-display mb-1.5 text-[15.5px] font-bold text-neutral-900">{b.title}</h4>
                    <p className="prose-blocks max-w-[52ch] text-[13.5px] leading-relaxed text-neutral-600">{b.content}</p>
                  </div>
                </div>
              </div>
            </li>
          )
        })}

        {/* terminal node — the flow completes */}
        <li className="relative">
          <span className="absolute top-0 left-[22px] z-10 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full bg-gradient-to-br from-brand-700 to-brand-500 text-white shadow-glow-sm ring-4 ring-canvas lg:left-1/2" aria-hidden>
            <Sparkles size={15} />
          </span>
          <p className="ml-12 pt-1.5 text-[12.5px] font-semibold text-neutral-400 lg:ml-0 lg:pt-10 lg:text-center">
            That’s the whole skill — nothing hidden, ready to run ✨
          </p>
        </li>
      </ol>
    </div>
  )
}

export function ActivityItem({ entry, skill, creator }) {
  return (
    <Link
      to={`/app/skills/${skill.id}`}
      className="group flex items-center gap-3.5 rounded-2xl bg-surface p-4 ring-1 ring-neutral-200/70 ring-inset transition-all duration-200 hover:ring-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
    >
      <Avatar name={creator.name} size={38} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] text-neutral-500">
          <span className="font-semibold text-neutral-900">{creator.name}</span>
          {' published '}
          <span className="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-2 group-hover:decoration-neutral-900">{skill.title}</span>
          {entry.version && <span className="text-neutral-400"> v{entry.version}</span>}
        </p>
        <p className="mt-0.5 text-xs text-neutral-400">{timeAgo(entry.date)} · {skill.category}</p>
      </div>
      <Sparkline data={seriesFor(skill.id, 10)} width={72} height={24} stroke="var(--color-neutral-300)" accent="var(--color-brand-500)" className="hidden shrink-0 sm:block" />
    </Link>
  )
}
