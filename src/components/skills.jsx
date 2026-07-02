// Skill-centric building blocks: cards, signal rows, block renderers.
import { Link } from 'react-router-dom'
import { GitFork, Star, Bookmark, Sparkles, ArchiveX } from 'lucide-react'
import { cn, compact, timeAgo } from '../lib/utils'
import { userById } from '../data/mock'
import { Avatar, Badge, Card, Skeleton } from './ui'

export function SignalRow({ skill, className, size = 13 }) {
  return (
    <div className={cn('flex items-center gap-3.5 text-[12.5px] font-medium text-neutral-500', className)}>
      <span className="flex items-center gap-1" title="Stars">
        <Star size={size} className={skill.starredByMe ? 'fill-brand-500 text-brand-500' : 'text-neutral-400'} />
        {compact(skill.stars)}
      </span>
      <span className="flex items-center gap-1" title="Forks">
        <GitFork size={size} className="text-neutral-400" />
        {compact(skill.forksTotal)}
      </span>
      <span className="flex items-center gap-1" title="Saves">
        <Bookmark size={size} className={skill.savedByMe ? 'fill-brand-500 text-brand-500' : 'text-neutral-400'} />
        {compact(skill.saves)}
      </span>
    </div>
  )
}

export function SkillCard({ skill, to }) {
  const creator = userById(skill.creatorId)
  return (
    <Link to={to || `/app/skills/${skill.id}`} className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 rounded-2xl">
      <Card hover className="flex h-full flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <Badge variant="brand">{skill.category}</Badge>
          <div className="flex items-center gap-1.5">
            {skill.isNew && skill.saves === 0 && (
              <Badge variant="solid"><Sparkles size={11} /> New</Badge>
            )}
            {skill.deprecated && (
              <Badge variant="warning"><ArchiveX size={11} /> Outdated</Badge>
            )}
            <Badge variant="outline">v{skill.version}</Badge>
          </div>
        </div>

        <h3 className="font-display mb-1 text-[16px] leading-snug font-bold text-neutral-900 transition-colors group-hover:text-brand-700">
          {skill.title}
        </h3>
        <p className="mb-4 line-clamp-2 text-[13.5px] leading-relaxed text-neutral-500">{skill.tagline}</p>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {skill.roles.slice(0, 2).map((r) => (
            <span key={r} className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500">{r}</span>
          ))}
          {skill.tags.slice(0, 2).map((t) => (
            <span key={t} className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-400">#{t}</span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-3.5">
          <span className="flex min-w-0 items-center gap-2 text-[12.5px] font-medium text-neutral-500">
            <Avatar name={creator.name} size={22} />
            <span className="truncate">{creator.name}</span>
          </span>
          <SignalRow skill={skill} />
        </div>
      </Card>
    </Link>
  )
}

export function SkillCardSkeleton() {
  return (
    <Card className="p-5">
      <div className="mb-3 flex justify-between">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <Skeleton className="mb-2 h-5 w-4/5" />
      <Skeleton className="mb-1.5 h-3.5 w-full" />
      <Skeleton className="mb-4 h-3.5 w-2/3" />
      <div className="mb-4 flex gap-1.5">
        <Skeleton className="h-5 w-16 rounded-md" />
        <Skeleton className="h-5 w-14 rounded-md" />
      </div>
      <div className="flex items-center justify-between border-t border-neutral-100 pt-3.5">
        <div className="flex items-center gap-2">
          <Skeleton className="h-[22px] w-[22px] rounded-full" />
          <Skeleton className="h-3.5 w-20" />
        </div>
        <Skeleton className="h-3.5 w-24" />
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

const SECTION_COLORS = {
  Role: 'bg-brand-50 text-brand-700',
  'What it asks you': 'bg-sky-50 text-sky-700',
  Instructions: 'bg-emerald-50 text-emerald-700',
  'Tone & voice': 'bg-amber-50 text-amber-700',
  'Output format': 'bg-fuchsia-50 text-fuchsia-700',
  Guardrails: 'bg-rose-50 text-rose-700',
}

/** Renders a skill's content as clean, readable pieces — never raw markup. */
export function BlockList({ blocks, className }) {
  return (
    <div className={cn('space-y-3', className)}>
      {blocks.map((b, i) => (
        <div key={b.id} className="animate-fade-up rounded-2xl bg-surface p-5 ring-1 ring-neutral-200/70 ring-inset" style={{ animationDelay: `${i * 50}ms` }}>
          <div className="mb-2 flex items-center gap-2.5">
            <span className={cn('rounded-lg px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase', SECTION_COLORS[b.section] || 'bg-neutral-100 text-neutral-600')}>
              {b.section}
            </span>
            <h4 className="text-[14.5px] font-semibold text-neutral-800">{b.title}</h4>
          </div>
          <p className="prose-blocks text-[13.5px] leading-relaxed text-neutral-600">{b.content}</p>
        </div>
      ))}
    </div>
  )
}

export function ActivityItem({ entry, skill, creator }) {
  return (
    <Link
      to={`/app/skills/${skill.id}`}
      className="group flex items-center gap-3.5 rounded-2xl bg-surface p-4 ring-1 ring-neutral-200/70 ring-inset transition-all duration-200 hover:ring-brand-200 hover:shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
    >
      <Avatar name={creator.name} size={38} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] text-neutral-500">
          <span className="font-semibold text-neutral-900">{creator.name}</span>
          {' published '}
          <span className="font-semibold text-brand-700 group-hover:underline">{skill.title}</span>
          {entry.version && <span className="text-neutral-400"> v{entry.version}</span>}
        </p>
        <p className="mt-0.5 text-xs text-neutral-400">{timeAgo(entry.date)} · {skill.category}</p>
      </div>
      <Badge variant="brand" className="hidden sm:inline-flex">{skill.category}</Badge>
    </Link>
  )
}
