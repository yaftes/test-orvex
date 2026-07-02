import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Check, UserPlus } from 'lucide-react'
import { allSkills, seriesFor, users } from '../data/mock'
import { cn, compact } from '../lib/utils'
import { Avatar, Button, EmptyState, SectionHeading, Skeleton, StateGate } from '../components/ui'
import { SkillCard, SkillGridSkeleton } from '../components/skills'
import { Sparkline } from '../components/viz'
import { useToast } from '../context/AppContext'
import NotFound from './NotFound'

export default function AuthorProfile() {
  const { handle } = useParams()
  const user = users.find((u) => u.handle === handle)
  if (!user) return <NotFound />
  return <AuthorInner user={user} />
}

function AuthorInner({ user }) {
  const toast = useToast()
  const [following, setFollowing] = useState(false)
  const published = allSkills.filter((s) => s.creatorId === user.id && !s.deprecated)

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Profile header */}
      <div className="animate-fade-up relative overflow-hidden rounded-3xl bg-ink-950 p-8 text-white ring-1 ring-white/10 ring-inset sm:p-10">
        <div className="absolute -top-20 right-10 h-64 w-64 rounded-full bg-brand-600/25 blur-[80px]" />
        <div className="relative flex flex-wrap items-center gap-6">
          <Avatar name={user.name} size={84} className="ring-4 ring-white/10" />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-3xl font-bold tracking-tight">{user.name}</h1>
            <p className="mt-0.5 text-[14px] text-brand-300">@{user.handle} · {user.role}</p>
            <p className="mt-2 max-w-lg text-[13.5px] leading-relaxed text-zinc-400">{user.bio}</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            {following ? (
              <button
                onClick={() => { setFollowing(false); toast(`Unfollowed ${user.name}`) }}
                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-white/10 px-4.5 text-sm font-semibold text-white ring-1 ring-white/20 ring-inset transition-all hover:bg-white/15"
              >
                <Check size={15} /> Following
              </button>
            ) : (
              <Button onClick={() => { setFollowing(true); toast(`Following ${user.name} ✓`) }}>
                <UserPlus size={15} /> Follow
              </Button>
            )}
            <div className="flex gap-5 text-center">
              {[
                [published.length, 'skills'],
                [compact(user.followers + (following ? 1 : 0)), 'followers'],
                [user.following, 'following'],
              ].map(([n, label]) => (
                <span key={label}>
                  <span className="font-display block text-lg font-bold">{n}</span>
                  <span className="text-[11px] text-zinc-500">{label}</span>
                </span>
              ))}
            </div>
            <div className="rounded-xl bg-white/6 px-3 py-2 ring-1 ring-white/10 ring-inset">
              <Sparkline data={seriesFor(`author:${user.id}`, 12)} width={120} height={30} stroke="var(--color-brand-400)" />
              <p className="text-center text-[9.5px] font-bold tracking-wider text-zinc-500 uppercase">momentum</p>
            </div>
          </div>
        </div>
      </div>

      {/* Published skills */}
      <section>
        <SectionHeading title="Published skills" sub={`Everything ${user.name.split(' ')[0]} has released, with real signals`} />
        <StateGate
          loading={<SkillGridSkeleton count={6} />}
          empty={<EmptyState title="Nothing published yet" body={`${user.name.split(' ')[0]} hasn’t released a skill yet — follow them to catch the first one.`} />}
        >
          {published.length === 0 ? (
            <EmptyState title="Nothing published yet" body={`${user.name.split(' ')[0]} hasn’t released a skill yet.`} />
          ) : (
            <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3')}>
              {published.map((s) => <SkillCard key={s.id} skill={s} />)}
            </div>
          )}
        </StateGate>
      </section>
    </div>
  )
}
