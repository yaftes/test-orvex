import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Archive, ChevronDown, Eye, Plus, Rocket } from 'lucide-react'
import { myPublished, seriesFor } from '../data/mock'
import { cn, compact } from '../lib/utils'
import { Badge, Button, Card, EmptyState, Skeleton, StateGate } from '../components/ui'
import { SignalRow } from '../components/skills'
import { Sparkline, VersionTimeline } from '../components/viz'

export default function Published() {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(null)

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="animate-fade-up flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[26px] font-bold tracking-tight text-neutral-900">Published</h1>
          <p className="mt-1 text-sm text-neutral-500">Your live skills. Expand one to see every release.</p>
        </div>
        <Button size="sm" onClick={() => navigate('/app/builder/new')}><Plus size={15} /> Create skill</Button>
      </div>

      <StateGate
        loading={<div className="space-y-3">{Array.from({ length: 2 }, (_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>}
        empty={
          <EmptyState
            icon={Rocket}
            title="Nothing published yet"
            body="When you publish a draft, it goes live in the marketplace and shows up here with all of its versions."
            action={<Button onClick={() => navigate('/app/drafts')}>Open your drafts</Button>}
          />
        }
      >
        {myPublished.length === 0 ? (
          <EmptyState icon={Archive} title="Nothing published yet" body="Publish a draft to see it here." />
        ) : (
          <div className="space-y-3">
            {myPublished.map((skill, i) => {
              const open = expanded === skill.id
              return (
                <Card key={skill.id} className="animate-fade-up overflow-hidden" style={{ animationDelay: `${i * 70}ms` }}>
                  <button
                    onClick={() => setExpanded(open ? null : skill.id)}
                    aria-expanded={open}
                    className="flex w-full cursor-pointer items-center gap-4 p-5 text-left transition-colors hover:bg-neutral-50/60"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 text-white shadow-glow-sm">
                      <Archive size={19} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="mb-0.5 flex flex-wrap items-center gap-2">
                        <span className="text-[15px] font-bold text-neutral-900">{skill.title}</span>
                        <Badge variant="brand">{skill.category}</Badge>
                        <Badge variant="outline">v{skill.currentVersion}</Badge>
                      </span>
                      <span className="block truncate text-[12.5px] text-neutral-400">{skill.tagline}</span>
                    </span>
                    <Sparkline data={seriesFor(skill.id, 10)} width={72} height={26} className="hidden shrink-0 md:block" />
                    <SignalRow skill={{ ...skill, starredByMe: false, savedByMe: false }} className="hidden sm:flex" />
                    <ChevronDown size={17} className={cn('shrink-0 text-neutral-400 transition-transform duration-200', open && 'rotate-180')} />
                  </button>

                  {open && (
                    <div className="animate-fade-in border-t border-neutral-100 bg-neutral-50/50 px-5 py-5">
                      <p className="mb-4 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">Release history</p>
                      <VersionTimeline
                        items={skill.versions}
                        renderActions={(item) => (
                          <Button variant="outline" size="sm" onClick={() => navigate(`/app/published/${skill.id}/v/${item.v}`)}>
                            <Eye size={14} /> View
                          </Button>
                        )}
                      />
                      <p className="mt-4 text-[11.5px] text-neutral-400">
                        {compact(skill.stars)} stars · {compact(skill.forksTotal)} forks · {compact(skill.saves)} saves — all real numbers.
                      </p>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </StateGate>
    </div>
  )
}
