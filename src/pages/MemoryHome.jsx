import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Brain, Check, Eye, EyeOff, FileUp, Loader2, Lock, PenLine, Pin,
  Search, X, MessageCircle, Linkedin, Github, Facebook, Instagram,
} from 'lucide-react'
import { currentUser, memorySections, portraitSuggestions } from '../data/mock'
import { cn } from '../lib/utils'
import { Button, Card, EmptyState, Input, Skeleton, StateGate, Textarea } from '../components/ui'
import { useToast } from '../context/AppContext'

const TILTS = ['rotate-[-0.8deg]', 'rotate-[0.6deg]', 'rotate-[0.9deg]', 'rotate-[-0.5deg]', 'rotate-[0.4deg]', 'rotate-[-1deg]']

export default function MemoryHome() {
  const toast = useToast()
  const firstName = currentUser.name.split(' ')[0]
  const [view, setView] = useState('wall') // wall | editor
  const [query, setQuery] = useState('')
  const [activeSection, setActiveSection] = useState('')
  const [revealPrivate, setRevealPrivate] = useState(false)
  const [manualText, setManualText] = useState('')
  const [extraPins, setExtraPins] = useState([])

  const allEntries = useMemo(
    () => memorySections.flatMap((s) => s.entries.map((e) => ({ ...e, section: s.title, sectionId: s.id }))),
    [],
  )
  const pinnedCount = allEntries.length + extraPins.length
  const lastPinned = extraPins.length ? 'Your note' : allEntries[allEntries.length - 1]?.q

  const matches = (e) => {
    if (activeSection && e.sectionId !== activeSection) return false
    if (query && !`${e.q} ${e.a}`.toLowerCase().includes(query.toLowerCase())) return false
    return true
  }

  const pinManual = () => {
    if (!manualText.trim()) return
    setExtraPins((p) => [...p, { id: `pin_${p.length}`, q: 'You told me', a: manualText.trim(), section: 'Your world', sectionId: 'ms_context' }])
    setManualText('')
    toast('Pinned to your wall 📌')
  }

  return (
    <div className="relative mx-auto max-w-5xl space-y-8 pb-24">
      {/* wall lamp glow + speckle */}
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-brand-500/12 blur-[100px]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-dot-grid opacity-25" />

      {/* ─── Wall header: polaroid + intro ─── */}
      <div className="animate-fade-up flex flex-wrap items-center gap-8">
        {/* polaroid */}
        <div className="paper relative w-36 shrink-0 rotate-[-3deg] rounded-sm p-2.5 pb-9 shadow-lift ring-1 ring-zinc-200 ring-inset">
          <span className="tape -top-2.5 left-1/2 -translate-x-1/2 rotate-[3deg]" aria-hidden />
          <div className="grid h-28 place-items-center bg-brand-500">
            <span className="font-display text-5xl font-bold text-ink-950">{firstName[0]}</span>
          </div>
          <p className="font-hand absolute right-0 bottom-1.5 left-0 text-center text-[19px] text-zinc-600">that’s me</p>
        </div>

        <div className="min-w-0 flex-1">
          <span className="font-typewriter inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-[11px] text-neutral-500">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden /> Just pinned: “{lastPinned}”
          </span>
          <h1 className="font-typewriter mt-3 text-4xl font-bold text-neutral-900">{firstName}</h1>
          <p className="font-typewriter mt-2 max-w-md text-[14.5px] leading-relaxed text-neutral-500">
            A picture of you, in your words. The AI keeps it current — you keep it yours.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              onClick={() => setView(view === 'wall' ? 'editor' : 'wall')}
              className="inline-flex h-8.5 cursor-pointer items-center gap-1.5 rounded-[10px] px-3.5 text-[13px] font-semibold text-neutral-700 ring-1 ring-neutral-300 ring-inset transition-all hover:ring-neutral-900"
            >
              <PenLine size={13} /> {view === 'wall' ? 'Edit your answers' : 'Back to the wall'}
            </button>
            <Link to="/app/memory/onboarding" className="inline-flex h-8.5 items-center rounded-[10px] px-3.5 text-[13px] font-semibold text-neutral-400 transition-colors hover:text-neutral-700">
              Redo onboarding
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Build your wall — connect a source ─── */}
      <div className="animate-fade-up flex flex-wrap items-center gap-3">
        <span className="font-typewriter text-[11px] font-bold tracking-[0.24em] text-neutral-400 uppercase">
          Build your wall — connect a source
        </span>
        {[['LinkedIn', Linkedin], ['GitHub', Github], ['Facebook', Facebook], ['Instagram', Instagram]].map(([name, Icon]) => (
          <button
            key={name}
            onClick={() => toast(`${name} connect is mocked here`, 'info')}
            className="bubble-dark inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl px-4 text-[13px] font-semibold text-white transition-transform hover:scale-[1.03]"
          >
            <Icon size={15} className="text-brand-400" /> {name}
          </button>
        ))}
      </div>

      {view === 'editor' ? (
        <EditorView />
      ) : (
        <StateGate
          loading={<WallSkeleton />}
          empty={
            <EmptyState
              icon={Brain}
              title="Your wall is empty"
              body="Run the two-minute onboarding and your Memory will pin its own first notes."
              action={<Link to="/app/memory/onboarding"><Button>Start onboarding</Button></Link>}
            />
          }
        >
          {/* ─── Controls ─── */}
          <div className="animate-fade-up flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-xs">
              <Search size={15} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-neutral-400" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="find anything about you…" className="pl-9 font-typewriter text-[13px]" aria-label="Search your wall" />
            </div>
            <span className="font-typewriter text-[12.5px] text-neutral-500"><span className="font-bold text-neutral-900">{pinnedCount}</span> pinned</span>
            <button
              onClick={() => { setRevealPrivate((r) => !r); toast(revealPrivate ? 'Private notes hidden' : 'Private notes revealed', 'info') }}
              aria-pressed={revealPrivate}
              className={cn(
                'inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[12.5px] font-bold transition-all',
                revealPrivate ? 'bg-brand-500 text-ink-950 shadow-glow-sm' : 'bg-surface text-neutral-600 ring-1 ring-neutral-200 ring-inset hover:ring-neutral-900',
              )}
            >
              {revealPrivate ? <Eye size={13} /> : <EyeOff size={13} />} Reveal private
            </button>
            <div className="flex gap-2 overflow-x-auto scrollbar-none">
              <SectionChip label="Everything" count={pinnedCount} active={!activeSection} onClick={() => setActiveSection('')} />
              {memorySections.map((s) => (
                <SectionChip key={s.id} label={s.title} count={s.entries.length} active={activeSection === s.id} onClick={() => setActiveSection(activeSection === s.id ? '' : s.id)} />
              ))}
            </div>
          </div>

          {/* ─── The wall ─── */}
          <div className="space-y-10">
            {memorySections
              .filter((s) => !activeSection || s.id === activeSection)
              .map((section) => {
                const entries = [...section.entries.map((e) => ({ ...e, sectionId: section.id })), ...extraPins.filter((p) => p.sectionId === section.id)].filter(matches)
                if (entries.length === 0) return null
                return (
                  <section key={section.id}>
                    <span className="paper relative mb-5 inline-block rotate-[-1.2deg] rounded-sm px-3.5 py-1.5 shadow-soft ring-1 ring-zinc-200 ring-inset">
                      <span className="font-typewriter flex items-center gap-2 text-[11.5px] font-bold tracking-[0.18em] text-zinc-700 uppercase">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden />
                        {section.title} · {entries.length}
                      </span>
                    </span>
                    <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
                      {entries.map((e, i) => (
                        <NoteCard key={e.id} entry={e} index={i} revealPrivate={revealPrivate} />
                      ))}
                    </div>
                  </section>
                )
              })}

            {/* pin something yourself */}
            <div className="mx-auto max-w-md rounded-md border-2 border-dashed border-neutral-300 p-5 text-center">
              <p className="font-typewriter mb-3 flex items-center justify-center gap-1.5 text-[11.5px] font-bold tracking-[0.2em] text-neutral-500 uppercase">
                <Pin size={12} className="text-brand-600" /> Pin something yourself
              </p>
              <div className="flex gap-2">
                <Input
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && pinManual()}
                  placeholder="tell me something about you…"
                  className="font-typewriter text-[13px]"
                />
                <Button size="md" disabled={!manualText.trim()} onClick={pinManual}>Pin</Button>
              </div>
            </div>
          </div>
        </StateGate>
      )}

      {/* ─── The coach, working the case ─── */}
      <Coach />
    </div>
  )
}

function SectionChip({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[12.5px] font-semibold transition-all',
        active ? 'bg-brand-500 font-bold text-ink-950 shadow-glow-sm' : 'bg-surface text-neutral-600 ring-1 ring-neutral-200 ring-inset hover:ring-neutral-900',
      )}
    >
      {label} <span className={active ? 'text-ink-950/60' : 'text-neutral-400'}>{count}</span>
    </button>
  )
}

function NoteCard({ entry, index, revealPrivate }) {
  const hidden = entry.sensitive && !revealPrivate
  return (
    <div className={cn('paper relative mb-4 break-inside-avoid rounded-md p-4 shadow-soft ring-1 ring-zinc-200 ring-inset transition-transform hover:scale-[1.015] hover:shadow-lift', TILTS[index % TILTS.length])}>
      <span className="tape -top-2 left-5 rotate-[-4deg]" aria-hidden />
      <p className="font-typewriter mb-1.5 flex items-center justify-between gap-2 text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden />
          {entry.q}
        </span>
        {entry.sensitive && (
          <span className="flex items-center gap-1 text-[9px] text-zinc-500"><Lock size={9} /> private</span>
        )}
      </p>
      <p className={cn('font-typewriter text-[13px] leading-relaxed text-zinc-800', hidden && 'blur-[5px] select-none')} aria-hidden={hidden}>
        {entry.a}
      </p>
      {hidden && (
        <p className="font-typewriter mt-2 text-[10.5px] text-zinc-400">hidden — flip “Reveal private” to read</p>
      )}
    </div>
  )
}

// ─── The coach bubble: portrait suggestions, doc drop, calm tone ─────────────
function Coach() {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [cards, setCards] = useState(portraitSuggestions)
  const [tweaking, setTweaking] = useState(null)
  const [tweakText, setTweakText] = useState('')
  const [reading, setReading] = useState(false)

  const resolve = (id, message) => {
    setCards((cs) => cs.filter((c) => c.id !== id))
    toast(message)
  }

  const onDrop = () => {
    setReading(true)
    setTimeout(() => {
      setReading(false)
      setCards((cs) => [
        ...cs,
        { id: `doc_${cs.length}`, text: 'From your document: you lead the weekly demo on Thursdays and prefer agendas sent a day ahead.', source: 'From “team-handbook.pdf”', sensitive: false },
      ])
      toast('Document read — 1 new suggestion')
    }, 1400)
  }

  return (
    <div className="fixed right-5 bottom-20 z-40">
      {open ? (
        <div className="bubble-dark animate-scale-in flex max-h-[70vh] w-[340px] flex-col overflow-hidden rounded-2xl text-white">
          {/* header */}
          <div className="flex items-center gap-2.5 border-b border-white/8 p-4">
            <span className="glow-icon grid h-9 w-9 shrink-0 place-items-center rounded-full"><Search size={15} /></span>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-bold">Your coach</p>
              <p className="font-typewriter text-[10.5px] tracking-[0.12em] text-zinc-500 uppercase">working the case with you</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close coach" className="grid h-7 w-7 cursor-pointer place-items-center rounded-full text-zinc-500 hover:bg-white/10 hover:text-white">
              <X size={14} />
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
            <p className="text-[13px] leading-relaxed text-zinc-400">
              I help you build this wall — I’ll notice the gaps, ask the next good question, and pin what you tell me.
            </p>

            {cards.length === 0 ? (
              <p className="rounded-xl bg-white/6 p-4 text-center text-[12.5px] leading-relaxed text-zinc-400">
                All caught up ✨ Nothing new to review — your portrait grows quietly as you work.
              </p>
            ) : (
              cards.map((c) => (
                <div key={c.id} className={cn('rounded-xl bg-white/6 p-3.5 ring-1 ring-white/8 ring-inset', c.sensitive && 'ring-brand-500/40')}>
                  {c.sensitive && (
                    <p className="font-typewriter mb-2 flex w-fit items-center gap-1.5 rounded-full bg-brand-500/15 px-2.5 py-0.5 text-[10px] font-bold text-brand-400">
                      <Lock size={9} /> personal — needs your deliberate yes
                    </p>
                  )}
                  <p className="text-[13px] leading-relaxed text-zinc-200">{c.text}</p>
                  <p className="font-typewriter mt-1 text-[10.5px] text-zinc-500">{c.source}</p>

                  {tweaking === c.id ? (
                    <div className="mt-2.5 space-y-2">
                      <Textarea rows={2} value={tweakText} onChange={(e) => setTweakText(e.target.value)} autoFocus className="!bg-white/8 !text-white !ring-white/15 placeholder:!text-zinc-500" />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setTweaking(null)} className="cursor-pointer rounded-lg px-2.5 py-1 text-[12px] font-semibold text-zinc-400 hover:text-white">Cancel</button>
                        <Button size="xs" disabled={!tweakText.trim()} onClick={() => { setTweaking(null); resolve(c.id, 'Pinned your version ✓') }}>Pin my version</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      <Button size="xs" onClick={() => resolve(c.id, 'Pinned to your wall ✓')}>
                        <Check size={11} /> Yes, that’s me
                      </Button>
                      <button onClick={() => resolve(c.id, 'Okay — forgotten')} className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-lg bg-white/8 px-2.5 text-xs font-semibold text-zinc-300 ring-1 ring-white/15 ring-inset hover:bg-white/15">
                        <X size={11} /> Not quite
                      </button>
                      <button onClick={() => { setTweaking(c.id); setTweakText(c.text) }} className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-lg px-2.5 text-xs font-semibold text-zinc-400 hover:text-white">
                        <PenLine size={11} /> Tweak it
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}

            {/* doc drop */}
            <button
              onClick={() => (reading ? null : onDrop())}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/15 py-3 text-[12px] font-semibold text-zinc-400 transition-all hover:border-brand-500/50 hover:text-brand-400"
            >
              {reading ? (
                <><Loader2 size={13} className="animate-spin" /> Reading your document…</>
              ) : (
                <><FileUp size={13} /> Drop in a document — I’ll propose facts</>
              )}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bubble-dark animate-fade-up flex cursor-pointer items-center gap-3 rounded-2xl py-3 pr-5 pl-3.5 text-left text-white transition-transform hover:scale-[1.02]"
        >
          <span className="glow-icon relative grid h-10 w-10 shrink-0 place-items-center rounded-full">
            <MessageCircle size={17} />
            {cards.length > 0 && (
              <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-white text-[10px] font-black text-ink-950">{cards.length}</span>
            )}
          </span>
          <span>
            <span className="block text-[13px] font-bold">Talk to your coach</span>
            <span className="font-typewriter block text-[10.5px] text-zinc-500">
              {cards.length > 0 ? `${cards.length} suggestion${cards.length === 1 ? '' : 's'} to review` : 'all caught up'}
            </span>
          </span>
        </button>
      )}
    </div>
  )
}

function WallSkeleton() {
  return (
    <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
      {Array.from({ length: 9 }, (_, i) => <Skeleton key={i} className="mb-4 h-28 break-inside-avoid rounded-md" />)}
    </div>
  )
}

// ─── Question-based profile editor (autosaves) ───────────────────────────────
function EditorView() {
  const toast = useToast()
  const [saved, setSaved] = useState(false)
  return (
    <div className="space-y-5">
      <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-neutral-400">
        {saved ? <><Check size={13} className="text-brand-600" /> Saved automatically</> : 'Everything here saves automatically as you type.'}
      </p>
      {memorySections.map((section, i) => (
        <Card key={section.id} className="animate-fade-up p-5" style={{ animationDelay: `${i * 60}ms` }}>
          <p className="font-typewriter mb-4 text-[11.5px] font-bold tracking-[0.2em] text-neutral-500 uppercase">{section.title}</p>
          <div className="space-y-4">
            {section.entries.map((entry) => (
              <div key={entry.id}>
                <p className="mb-1.5 flex items-center gap-2 text-[13px] font-semibold text-neutral-700">
                  {entry.q}
                  {entry.sensitive && <span className="flex items-center gap-1 text-[10.5px] font-bold text-brand-600"><Lock size={10} /> private</span>}
                </p>
                <Textarea
                  rows={2}
                  defaultValue={entry.a}
                  onChange={() => setSaved(true)}
                  onBlur={() => toast('Saved', 'info')}
                  className="ring-transparent hover:ring-neutral-200"
                />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}
