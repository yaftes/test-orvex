import { ArrowUpRight, BookOpen, Lock, Sparkles } from 'lucide-react'
import { wikiEntries } from '../data/mock'
import { timeAgo } from '../lib/utils'
import { Button, Card, EmptyState, SectionHeading, Skeleton, StateGate } from '../components/ui'

export default function Wiki() {
  return (
    <div className="mx-auto max-w-3xl space-y-7">
      {/* Hero explanation + way in */}
      <div className="animate-fade-up relative overflow-hidden rounded-3xl bg-ink-950 p-8 text-white ring-1 ring-white/10 ring-inset sm:p-10">
        <div className="absolute -top-16 -right-10 h-56 w-56 rounded-full bg-brand-600/30 blur-[70px]" />
        <div className="relative">
          <span className="mb-5 inline-grid h-13 w-13 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-400 p-3 shadow-glow">
            <BookOpen size={24} />
          </span>
          <h1 className="font-display mb-3 text-3xl font-bold tracking-tight">Your Wiki</h1>
          <p className="mb-2 max-w-lg text-[14.5px] leading-relaxed text-zinc-300">
            A private space Orvex hosts just for you — where durable knowledge lives. Team decisions, environment quirks,
            processes worth keeping: everything the Librarian files as “worth remembering forever.”
          </p>
          <p className="mb-7 flex items-center gap-1.5 text-[12.5px] text-zinc-500">
            <Lock size={12} /> Private to you and the people you invite. Nothing here is public.
          </p>
          <a href="#" onClick={(e) => e.preventDefault()}>
            <Button size="lg">
              Open your wiki <ArrowUpRight size={17} />
            </Button>
          </a>
        </div>
      </div>

      {/* Recent entries preview */}
      <section>
        <SectionHeading title="Recently updated" sub="A peek at what’s inside" />
        <StateGate
          loading={<div className="space-y-3">{Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>}
          empty={
            <EmptyState
              icon={Sparkles}
              title="Your wiki is brand new"
              body="As the Librarian files captures — or as you write pages yourself — the freshest entries will show up here."
            />
          }
        >
          <div className="space-y-3">
            {wikiEntries.map((w, i) => (
              <Card key={w.id} hover className="animate-fade-up flex items-center gap-4 p-4.5" style={{ animationDelay: `${i * 60}ms` }}>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><BookOpen size={17} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-bold text-neutral-900">{w.title}</span>
                  <span className="block truncate text-[12.5px] text-neutral-400">{w.excerpt}</span>
                </span>
                <span className="shrink-0 text-[11.5px] text-neutral-400">{timeAgo(w.updated)}</span>
              </Card>
            ))}
          </div>
        </StateGate>
      </section>
    </div>
  )
}
