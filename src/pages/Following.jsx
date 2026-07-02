import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Search, UserPlus, UsersRound } from 'lucide-react'
import { followingIds, users } from '../data/mock'
import { cn, compact } from '../lib/utils'
import { Avatar, Button, Card, EmptyState, Input, SectionHeading, Skeleton, StateGate } from '../components/ui'
import { useToast } from '../context/AppContext'

export default function Following() {
  const toast = useToast()
  const [followed, setFollowed] = useState(new Set(followingIds))
  const [query, setQuery] = useState('')

  const toggle = (u) => {
    setFollowed((s) => {
      const next = new Set(s)
      if (next.has(u.id)) { next.delete(u.id); toast(`Unfollowed ${u.name}`) }
      else { next.add(u.id); toast(`Following ${u.name} ✓`) }
      return next
    })
  }

  const list = users.filter((u) => `${u.name} ${u.role}`.toLowerCase().includes(query.toLowerCase()))
  const followingList = list.filter((u) => followed.has(u.id))
  const discoverList = list.filter((u) => !followed.has(u.id))

  return (
    <div className="mx-auto max-w-2xl space-y-7">
      <div className="animate-fade-up">
        <h1 className="font-display text-[26px] font-bold tracking-tight text-neutral-900">Following</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {followed.size === 0 ? 'You’re not following anyone yet.' : `You follow ${followed.size} ${followed.size === 1 ? 'person' : 'people'}.`}
        </p>
      </div>

      <div className="relative">
        <Search size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-neutral-400" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find people by name or role…" className="pl-10" aria-label="Search people" />
      </div>

      <StateGate
        loading={<div className="space-y-2.5">{Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-[76px] rounded-2xl" />)}</div>}
        empty={
          <EmptyState
            icon={UsersRound}
            title="No one to show"
            body="When creators join the marketplace, you’ll be able to follow them here."
          />
        }
      >
        <div className="space-y-8">
          {followingList.length > 0 && (
            <section>
              <SectionHeading title="People you follow" />
              <div className="space-y-2.5">
                {followingList.map((u) => <PersonRow key={u.id} user={u} following onToggle={() => toggle(u)} />)}
              </div>
            </section>
          )}

          <section>
            <SectionHeading title="Find more people" sub="Creators whose skills match your world" />
            {discoverList.length === 0 ? (
              <p className="rounded-2xl bg-surface p-6 text-center text-[13px] text-neutral-400 ring-1 ring-neutral-200/70 ring-inset">
                No matches for “{query}”.
              </p>
            ) : (
              <div className="space-y-2.5">
                {discoverList.map((u) => <PersonRow key={u.id} user={u} following={false} onToggle={() => toggle(u)} />)}
              </div>
            )}
          </section>
        </div>
      </StateGate>
    </div>
  )
}

function PersonRow({ user, following, onToggle }) {
  return (
    <Card hover className="flex items-center gap-3.5 p-4">
      <Link to={`/app/authors/${user.handle}`} className="flex min-w-0 flex-1 items-center gap-3.5">
        <Avatar name={user.name} size={44} />
        <span className="min-w-0">
          <span className="block truncate text-[14.5px] font-bold text-neutral-900">{user.name}</span>
          <span className="block truncate text-[12.5px] text-neutral-400">
            {user.role} · {user.skillCount} skills · {compact(user.followers)} followers
          </span>
        </span>
      </Link>
      <button
        onClick={onToggle}
        aria-pressed={following}
        className={cn(
          'flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[12.5px] font-bold transition-all',
          following ? 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200' : 'bg-brand-600 text-white shadow-glow-sm hover:brightness-110',
        )}
      >
        {following ? <><Check size={13} /> Following</> : <><UserPlus size={13} /> Follow</>}
      </button>
    </Card>
  )
}
