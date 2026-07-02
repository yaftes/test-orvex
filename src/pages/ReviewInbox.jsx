import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, CheckCheck, Inbox, X } from 'lucide-react'
import { suggestions, userById } from '../data/mock'
import { cn, timeAgo } from '../lib/utils'
import { Avatar, Badge, Button, Card, EmptyState, Skeleton, StateGate } from '../components/ui'
import { useToast } from '../context/AppContext'

export default function ReviewInbox() {
  const toast = useToast()
  const [items, setItems] = useState(suggestions)
  // decisions: { [changeId]: 'accept' | 'decline' }
  const [decisions, setDecisions] = useState({})

  const decide = (changeId, decision) =>
    setDecisions((d) => ({ ...d, [changeId]: d[changeId] === decision ? undefined : decision }))

  const decidedCount = useMemo(() => Object.values(decisions).filter(Boolean).length, [decisions])
  const acceptedCount = useMemo(() => Object.values(decisions).filter((d) => d === 'accept').length, [decisions])
  const totalChanges = items.reduce((n, s) => n + s.changes.length, 0)

  const applyAll = () => {
    setItems([])
    setDecisions({})
    toast(`Applied ${acceptedCount} change${acceptedCount === 1 ? '' : 's'} — the rest were declined`)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24">
      <div className="animate-fade-up">
        <h1 className="font-display text-[26px] font-bold tracking-tight text-neutral-900">Review inbox</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Edits people suggested on your skills — like suggestions in a shared doc. Accept what helps, decline the rest.
        </p>
      </div>

      <StateGate
        loading={
          <div className="space-y-4">
            {Array.from({ length: 2 }, (_, i) => <Skeleton key={i} className="h-56 rounded-2xl" />)}
          </div>
        }
        empty={<AllCaughtUp />}
      >
        {items.length === 0 ? (
          <AllCaughtUp />
        ) : (
          <>
            <p className="text-[13px] font-semibold text-neutral-400">
              {items.length} pending suggestion{items.length === 1 ? '' : 's'} · {totalChanges} proposed change{totalChanges === 1 ? '' : 's'}
            </p>

            <div className="space-y-5">
              {items.map((sug, i) => {
                const author = userById(sug.userId)
                return (
                  <Card key={sug.id} className="animate-fade-up overflow-hidden" style={{ animationDelay: `${i * 70}ms` }}>
                    {/* Who + when + which skill */}
                    <div className="flex flex-wrap items-center gap-3 border-b border-neutral-100 px-5 py-4">
                      <Avatar name={author.name} size={36} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13.5px]">
                          <span className="font-bold text-neutral-900">{author.name}</span>
                          <span className="text-neutral-400"> suggested changes to </span>
                          <Link to={`/app/skills/${sug.skillId}`} className="font-bold text-brand-600 hover:underline">{sug.skillTitle}</Link>
                        </p>
                        <p className="text-[12px] text-neutral-400">{timeAgo(sug.date)}</p>
                      </div>
                      <Badge variant="neutral">{sug.changes.length} change{sug.changes.length === 1 ? '' : 's'}</Badge>
                    </div>

                    {/* Optional note */}
                    {sug.note && (
                      <p className="mx-5 mt-4 rounded-xl bg-brand-50/70 px-4 py-3 text-[13px] leading-relaxed text-brand-900">
                        “{sug.note}”
                      </p>
                    )}

                    {/* Before/after per change */}
                    <div className="space-y-4 p-5">
                      {sug.changes.map((ch) => {
                        const decision = decisions[ch.id]
                        return (
                          <div
                            key={ch.id}
                            className={cn(
                              'rounded-2xl p-4 ring-1 ring-inset transition-all duration-200',
                              decision === 'accept' && 'bg-brand-50/50 ring-brand-200',
                              decision === 'decline' && 'bg-neutral-50 opacity-60 ring-neutral-200',
                              !decision && 'ring-neutral-200/70',
                            )}
                          >
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <p className="text-[13px] font-bold text-neutral-800">{ch.blockTitle}</p>
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => decide(ch.id, 'accept')}
                                  aria-pressed={decision === 'accept'}
                                  className={cn(
                                    'flex h-7 cursor-pointer items-center gap-1 rounded-full px-3 text-[12px] font-bold transition-all',
                                    decision === 'accept' ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700 hover:bg-brand-100',
                                  )}
                                >
                                  <Check size={12} strokeWidth={3} /> Accept
                                </button>
                                <button
                                  onClick={() => decide(ch.id, 'decline')}
                                  aria-pressed={decision === 'decline'}
                                  className={cn(
                                    'flex h-7 cursor-pointer items-center gap-1 rounded-full px-3 text-[12px] font-bold transition-all',
                                    decision === 'decline' ? 'bg-zinc-700 text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200',
                                  )}
                                >
                                  <X size={12} strokeWidth={3} /> Decline
                                </button>
                              </div>
                            </div>
                            <div className="grid gap-2.5 sm:grid-cols-2">
                              <div className="rounded-xl bg-neutral-100/70 p-3.5 ring-1 ring-neutral-200 ring-inset">
                                <p className="mb-1 text-[10.5px] font-bold tracking-widest text-neutral-400 uppercase">Before</p>
                                <p className="text-[12.5px] leading-relaxed text-neutral-600">{ch.before}</p>
                              </div>
                              <div className="rounded-xl bg-brand-50/60 p-3.5 ring-1 ring-brand-100 ring-inset">
                                <p className="mb-1 text-[10.5px] font-bold tracking-widest text-brand-500 uppercase">After</p>
                                <p className="text-[12.5px] leading-relaxed text-neutral-700">{ch.after}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Apply decisions bar */}
            {decidedCount > 0 && (
              <div className="animate-pop fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-full bg-ink-950 py-2.5 pr-2.5 pl-6 text-white shadow-lift">
                <span className="text-[13px] font-semibold">
                  {acceptedCount} accepted · {decidedCount - acceptedCount} declined
                </span>
                <Button size="sm" onClick={applyAll}>
                  <CheckCheck size={15} /> Apply decisions
                </Button>
              </div>
            )}
          </>
        )}
      </StateGate>
    </div>
  )
}

function AllCaughtUp() {
  return (
    <EmptyState
      icon={Inbox}
      title="All caught up ✨"
      body="No pending suggestions on your skills. When someone proposes an edit, it lands here as a clean before/after."
    />
  )
}
