import { useMemo, useState } from 'react'
import {
  BookOpen, Brain, Cable, Check, Copy, GitMerge, LibraryBig, Lock,
  Plug, RefreshCw, Send, Stamp, Trash2, KeyRound, ArrowRight,
} from 'lucide-react'
import { librarianConnections, librarianItems, shelves } from '../data/mock'
import { cn, copyText, timeAgo } from '../lib/utils'
import {
  Button, Card, ConfirmDialog, EmptyState, Modal, Skeleton, StateGate,
} from '../components/ui'
import { useToast } from '../context/AppContext'

const SHELF_META = {
  wiki: { icon: BookOpen, tag: 'SHELF 1' },
  memory: { icon: Brain, tag: 'SHELF 2' },
  trash: { icon: Trash2, tag: 'OUT-BIN' },
}

const KIND_META = {
  new: { stamp: 'SHELVE · ADD', icon: Stamp, action: 'Stamp & file' },
  update: { stamp: 'UPDATE PAGE', icon: RefreshCw, action: 'Apply update' },
  merge: { stamp: 'MERGE · DUPE', icon: GitMerge, action: 'Merge them' },
  discard: { stamp: 'DISCARD', icon: Trash2, action: 'Discard' },
}

const DEST_LABEL = { wiki: 'YOUR WIKI', memory: 'MEMORY', trash: 'OUT-BIN' }

export default function Librarian() {
  const toast = useToast()
  const [items, setItems] = useState(librarianItems)
  const [filedTally, setFiledTally] = useState({ wiki: 0, memory: 0, trash: 0 })
  const [confirmItem, setConfirmItem] = useState(null)
  const [connectOpen, setConnectOpen] = useState(false)

  const safeItems = useMemo(() => items.filter((i) => i.safe), [items])
  const heldItems = useMemo(() => items.filter((i) => !i.safe), [items])
  const startedWithItems = librarianItems.length > 0

  const fileItem = (item, quiet = false) => {
    setItems((list) => list.filter((i) => i.id !== item.id))
    setFiledTally((t) => ({ ...t, [item.proposal.destination]: t[item.proposal.destination] + 1 }))
    if (!quiet) {
      const dest = shelves.find((s) => s.id === item.proposal.destination)
      toast(item.proposal.kind === 'discard' ? 'Discarded' : `Stamped & filed to ${dest.name} ✓`)
    }
  }

  const fileAllSafe = () => {
    safeItems.forEach((i) => fileItem(i, true))
    toast(`Filed ${safeItems.length} safe addition${safeItems.length === 1 ? '' : 's'} ✓`)
  }

  return (
    <div className="relative mx-auto max-w-5xl space-y-6">
      {/* desk-lamp glow + speckle */}
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-brand-500/12 blur-[100px]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-dot-grid opacity-25" />

      {/* ─── Desk header ─── */}
      <div className="animate-fade-up grid items-start gap-6 lg:grid-cols-[1fr_auto]">
        <div>
          <div className="bubble-dark inline-flex items-center gap-3.5 rounded-2xl py-3.5 pr-7 pl-4">
            <span className="glow-icon grid h-12 w-12 place-items-center rounded-2xl"><LibraryBig size={22} /></span>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">The Librarian</h1>
              <p className="text-[10.5px] font-bold tracking-[0.28em] text-zinc-500 uppercase">The sorting desk</p>
            </div>
          </div>
          <p className="font-hand mt-4 max-w-md text-[24px] leading-snug text-neutral-700">
            “Pull up a chair. Fresh captures have been landing — let’s find each one a proper home.”
          </p>
          <p className="font-typewriter mt-1 text-[12px] text-brand-600">— your Librarian, on duty</p>
        </div>
        <div className="flex flex-row items-center gap-6 lg:flex-col lg:items-end lg:gap-3">
          <div className="text-right">
            <p className="glow-count font-display text-6xl leading-none font-bold text-brand-500">{items.length}</p>
            <p className="mt-1 text-[10px] font-bold tracking-[0.25em] text-neutral-400 uppercase">slips awaiting filing</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setConnectOpen(true)}>
            <Cable size={14} /> Connect a client
          </Button>
        </div>
      </div>

      {/* ─── Status strip ─── */}
      <div className="bubble-dark animate-fade-up flex flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-3.5 text-white">
        <p className="font-typewriter text-[13px]">
          <span className="text-brand-400">The Librarian</span>
          <span className="text-zinc-300"> · reading your pile, item by item — I’ll file each capture into your Wiki or Memory.</span>
        </p>
        <span className="font-typewriter text-[13px] text-zinc-400">{items.length} to sort</span>
      </div>

      <StateGate
        loading={<div className="space-y-4">{Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}</div>}
        empty={<CaughtUp tally={{ wiki: 3, memory: 2, trash: 1 }} />}
      >
        {items.length === 0 ? (
          startedWithItems ? <CaughtUp tally={filedTally} /> : (
            <EmptyState
              icon={LibraryBig}
              title="The in-tray is empty"
              body="Connect an AI client and useful things from your sessions will start arriving here for review."
              action={<Button variant="secondary" onClick={() => setConnectOpen(true)}><Plug size={15} /> Connect a client</Button>}
            />
          )
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_290px]">
            {/* ─── In-tray ─── */}
            <section className="min-w-0">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <span className="font-typewriter rounded-lg bg-brand-500 px-3 py-1 text-[12px] font-bold tracking-[0.18em] text-ink-950 uppercase">In-tray</span>
                <span className="font-typewriter text-[12px] text-neutral-400">
                  <span className="text-brand-600">{items.length}</span> to review · oldest first
                </span>
              </div>

              <div className="space-y-6">
                {safeItems.map((item, i) => (
                  <DeskItem key={item.id} item={item} index={i} onAction={() => fileItem(item)} onDestructive={() => setConfirmItem(item)} />
                ))}

                {heldItems.length > 0 && (
                  <div className="flex items-center gap-3 pt-2" aria-hidden>
                    <span className="h-px flex-1 bg-neutral-200" />
                    <span className="font-typewriter text-[11px] font-bold tracking-[0.22em] text-neutral-400 uppercase">Held back for your eye</span>
                    <span className="h-px flex-1 bg-neutral-200" />
                  </div>
                )}

                {heldItems.map((item, i) => (
                  <DeskItem
                    key={item.id}
                    item={item}
                    index={i + safeItems.length}
                    onAction={() => (item.proposal.kind === 'discard' ? setConfirmItem(item) : fileItem(item))}
                    onDestructive={() => setConfirmItem(item)}
                  />
                ))}
              </div>
            </section>

            {/* ─── Pigeonholes rail ─── */}
            <aside className="space-y-4">
              <p className="font-typewriter text-[11px] font-bold tracking-[0.28em] text-neutral-400 uppercase">Pigeonholes</p>
              {shelves.map((shelf) => {
                const meta = SHELF_META[shelf.id]
                return (
                  <div key={shelf.id} className="bubble-dark flex items-center gap-3.5 rounded-2xl p-4 text-white transition-transform hover:scale-[1.015]">
                    <span className={cn(
                      'grid h-10 w-10 shrink-0 place-items-center rounded-xl',
                      shelf.id === 'trash' ? 'bg-white/8 text-zinc-400' : 'glow-icon',
                    )}>
                      <meta.icon size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-2">
                        <span className="font-typewriter text-[14px] font-bold text-white">{shelf.name}</span>
                        <span className="font-typewriter text-[9.5px] tracking-[0.2em] text-brand-400 uppercase">{meta.tag}</span>
                      </span>
                      <span className="block truncate text-[12px] text-zinc-500">{shelf.description}</span>
                    </span>
                    <span className="glow-count font-display text-2xl font-bold text-brand-400 tabular-nums">{shelf.count + filedTally[shelf.id]}</span>
                  </div>
                )
              })}

              {/* Quick-file */}
              <div className="bubble-dark space-y-4 rounded-2xl p-5 text-white">
                <p className="font-typewriter text-[11px] font-bold tracking-[0.24em] text-white uppercase">Quick-file</p>
                <p className="text-[13px] leading-relaxed text-zinc-400">
                  The Librarian can stamp the <span className="font-semibold text-brand-400">safe additions</span> in one
                  motion — captures that only add to a shelf and touch nothing existing.
                </p>
                <Button className="w-full !shadow-glow-sm" size="sm" disabled={safeItems.length === 0} onClick={fileAllSafe}>
                  <Check size={15} /> Approve all safe adds ({safeItems.length})
                </Button>
                <div>
                  <p className="font-typewriter mb-2 text-[11.5px] font-bold text-brand-400">Held back for your eye</p>
                  <ul className="space-y-1.5 font-typewriter text-[11.5px] leading-relaxed text-zinc-500">
                    <li>· edits an existing page</li>
                    <li>· merges a possible duplicate</li>
                    <li>· is a discard — it can’t be undone</li>
                    <li>· is sealed — it contains secrets</li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        )}
      </StateGate>

      {/* Confirm destructive */}
      <ConfirmDialog
        open={Boolean(confirmItem)}
        onClose={() => setConfirmItem(null)}
        onConfirm={() => confirmItem && fileItem(confirmItem)}
        title="Discard this capture?"
        body="It’ll go to the out-bin. You’re not deleting any existing Wiki or Memory content — just this capture."
        confirmLabel="Yes, discard it"
      />

      <ConnectModal open={connectOpen} onClose={() => setConnectOpen(false)} />
    </div>
  )
}

// ─── One desk item: paper slip + Librarian bubble ────────────────────────────
function DeskItem({ item, index, onAction, onDestructive }) {
  const toast = useToast()
  const [unsealed, setUnsealed] = useState(false)
  const [question, setQuestion] = useState('')
  const [thread, setThread] = useState(item.conversation)
  const kind = KIND_META[item.proposal.kind]
  const sealed = item.sensitive && !unsealed
  const tilt = index % 2 === 0 ? 'rotate-[-0.5deg]' : 'rotate-[0.45deg]'

  const ask = () => {
    if (!question.trim()) return
    setThread((t) => [
      ...t,
      { who: 'you', text: question.trim() },
      { who: 'librarian', text: 'Good question. My suggestion is based only on what’s in this capture and what already exists on your shelves — if you file it differently, I’ll learn from that choice.' },
    ])
    setQuestion('')
    toast('Reply noted', 'info')
  }

  return (
    <div className="animate-fade-up grid gap-4 md:grid-cols-2" style={{ animationDelay: `${(index % 6) * 60}ms` }}>
      {/* The slip */}
      {sealed ? (
        <button
          onClick={() => setUnsealed(true)}
          className={cn('relative flex min-h-44 cursor-pointer flex-col items-center justify-center gap-3 rounded-md bg-ink-950 p-6 text-center shadow-lift ring-1 ring-white/10 ring-inset transition-transform hover:scale-[1.01]', tilt)}
        >
          <span className="tape -top-2 left-8 rotate-[-5deg]" aria-hidden />
          <Lock size={20} className="text-brand-500" />
          <span className="font-typewriter text-[13px] font-bold tracking-[0.2em] text-white uppercase">Sealed</span>
          <span className="font-typewriter text-[12px] leading-relaxed text-zinc-400">
            Contains secrets. Never filed automatically —<br />click to open it under your eye.
          </span>
        </button>
      ) : (
        <div className={cn('paper relative rounded-md p-5 shadow-lift ring-1 ring-zinc-200 ring-inset', tilt)}>
          <span className="tape -top-2 left-8 rotate-[-5deg]" aria-hidden />

          <div className="mb-3 flex items-start justify-between gap-2">
            <span className="font-typewriter inline-flex items-center gap-1.5 rounded-sm border-2 border-zinc-800 px-2 py-1 text-[10.5px] font-bold tracking-[0.14em] text-zinc-800 uppercase">
              <kind.icon size={11} /> {kind.stamp}
            </span>
            <span className="font-typewriter rounded-sm border border-dashed border-brand-600 px-2 py-1 text-[10px] font-bold tracking-[0.14em] text-brand-600 uppercase">
              {DEST_LABEL[item.proposal.destination]}
            </span>
          </div>

          <p className="font-typewriter mb-1 text-[10px] tracking-[0.2em] text-zinc-400 uppercase">Type · {item.proposal.kind === 'new' ? 'capture' : item.proposal.kind}</p>
          <p className="font-typewriter text-[13.5px] leading-relaxed text-zinc-800">{item.preview}</p>

          {item.diff && (
            <div className="mt-4 space-y-2 border-t border-dashed border-zinc-300 pt-3">
              <div>
                <p className="font-typewriter mb-1 text-[9.5px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Current entry</p>
                <p className="font-typewriter rounded-sm bg-zinc-100 px-2.5 py-2 text-[12px] leading-relaxed text-zinc-500">{item.diff.before}</p>
              </div>
              <div>
                <p className="font-typewriter mb-1 text-[9.5px] font-bold tracking-[0.2em] text-brand-600 uppercase">After {item.proposal.kind}</p>
                <p className="font-typewriter rounded-sm bg-orange-50 px-2.5 py-2 text-[12px] leading-relaxed text-zinc-700">{item.diff.after}</p>
              </div>
            </div>
          )}

          <p className="font-typewriter mt-4 text-[11px] text-zinc-400">
            captured <span className="font-bold text-zinc-600">{timeAgo(item.capturedAt)}</span> · {item.source}
          </p>
        </div>
      )}

      {/* The Librarian's bubble */}
      <div className="bubble-dark flex flex-col rounded-2xl p-5 text-white">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="glow-icon grid h-8 w-8 shrink-0 place-items-center rounded-full"><LibraryBig size={14} /></span>
          <div>
            <p className="text-[13px] font-bold">The Librarian</p>
            <p className="font-typewriter text-[10.5px] tracking-[0.14em] text-zinc-500 uppercase">deciding where this capture belongs</p>
          </div>
        </div>

        <p className="rounded-xl bg-white/6 p-3.5 text-[13.5px] leading-relaxed text-zinc-200 ring-1 ring-white/8 ring-inset">
          {item.proposal.reason}
        </p>

        {thread.length > 0 && (
          <div className="mt-3 space-y-2">
            {thread.map((m, i) => (
              <p key={i} className={cn(
                'max-w-[90%] rounded-xl px-3 py-2 text-[12.5px] leading-relaxed',
                m.who === 'you' ? 'ml-auto rounded-br-sm bg-brand-500 text-ink-950' : 'rounded-tl-sm bg-white/8 text-zinc-300',
              )}>
                {m.text}
              </p>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {item.proposal.kind === 'discard' ? (
            <button
              onClick={onDestructive}
              disabled={sealed}
              className="inline-flex h-8.5 cursor-pointer items-center gap-1.5 rounded-[10px] bg-white/10 px-3.5 text-[13px] font-bold text-white ring-1 ring-white/20 ring-inset transition-all hover:bg-white/20 disabled:pointer-events-none disabled:opacity-40"
            >
              <Trash2 size={14} /> Discard
            </button>
          ) : (
            <>
              <Button size="sm" onClick={onAction} disabled={sealed}>
                {kind.action} <ArrowRight size={14} />
              </Button>
              <button
                onClick={onDestructive}
                disabled={sealed}
                className="inline-flex h-8.5 cursor-pointer items-center gap-1.5 rounded-[10px] bg-white/8 px-3.5 text-[13px] font-semibold text-zinc-300 ring-1 ring-white/15 ring-inset transition-all hover:bg-white/15 disabled:pointer-events-none disabled:opacity-40"
              >
                Discard
              </button>
            </>
          )}
          {sealed && <span className="font-typewriter w-full text-[11px] text-brand-400">sealed — open the slip before filing</span>}
        </div>

        {/* Reply */}
        <div className="mt-4 flex gap-2 border-t border-white/8 pt-4">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && ask()}
            placeholder="Reply to the Librarian…"
            aria-label="Reply to the Librarian"
            className="h-10 w-full rounded-xl bg-white/6 px-3.5 text-[13px] text-white ring-1 ring-white/10 ring-inset transition-all outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-brand-500"
          />
          <button onClick={ask} disabled={!question.trim()} aria-label="Send reply" className="grid h-10 w-11 shrink-0 cursor-pointer place-items-center rounded-xl bg-brand-500 text-ink-950 transition-all hover:brightness-95 disabled:pointer-events-none disabled:opacity-40">
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── All-caught-up summary ───────────────────────────────────────────────────
function CaughtUp({ tally }) {
  const total = tally.wiki + tally.memory + tally.trash
  return (
    <div className="bubble-dark animate-scale-in overflow-hidden rounded-3xl p-10 text-center text-white">
      <span className="glow-icon mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full">
        <Check size={30} strokeWidth={2.5} />
      </span>
      <h2 className="font-display mb-2 text-2xl font-bold">All caught up</h2>
      <p className="font-hand mx-auto mb-2 max-w-sm text-[22px] text-zinc-300">“A tidy desk. Lovely work.”</p>
      <p className="font-typewriter mx-auto mb-7 max-w-sm text-[13px] leading-relaxed text-zinc-500">
        {total > 0 ? `You reviewed ${total} capture${total === 1 ? '' : 's'} this session — here's where everything went:` : 'The in-tray is empty. New captures will appear as you work.'}
      </p>
      {total > 0 && (
        <div className="mx-auto flex max-w-sm justify-center gap-10">
          {[
            ['Your Wiki', tally.wiki, BookOpen],
            ['Memory', tally.memory, Brain],
            ['Out-bin', tally.trash, Trash2],
          ].map(([name, n, Icon]) => (
            <div key={name}>
              <Icon size={17} className="mx-auto mb-1.5 text-brand-400" />
              <p className="font-display text-xl font-bold">{n}</p>
              <p className="font-typewriter text-[11px] text-zinc-500">{name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Connect an external client ──────────────────────────────────────────────
function ConnectModal({ open, onClose }) {
  const toast = useToast()
  const [connections, setConnections] = useState(librarianConnections)
  const [secret, setSecret] = useState(null)

  return (
    <Modal open={open} onClose={() => { onClose(); setSecret(null) }} title="Connect an AI client" wide>
      <p className="mb-5 text-[13px] leading-relaxed text-neutral-500">
        Connected clients can send captures from your sessions straight to the Librarian’s in-tray. You can revoke a connection at any time.
      </p>

      <div className="mb-5 space-y-2">
        {connections.map((c) => (
          <div key={c.id} className="flex items-center gap-3 rounded-xl bg-neutral-50 p-3.5 ring-1 ring-neutral-200/60 ring-inset">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink-950 text-brand-500"><Plug size={16} /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13.5px] font-bold text-neutral-900">{c.name}</span>
              <span className="block text-[11.5px] text-neutral-400">Connected {timeAgo(c.connectedAt)} · last capture {timeAgo(c.lastCapture)}</span>
            </span>
            <Button
              size="xs"
              variant="dangerGhost"
              onClick={() => { setConnections((cs) => cs.filter((x) => x.id !== c.id)); toast(`${c.name} revoked`) }}
            >
              Revoke
            </Button>
          </div>
        ))}
        {connections.length === 0 && <p className="py-2 text-center text-[12.5px] text-neutral-400">No connected clients.</p>}
      </div>

      {secret ? (
        <div className="animate-scale-in rounded-2xl bg-ink-950 p-5 text-white">
          <p className="mb-1 flex items-center gap-1.5 text-[13px] font-bold"><KeyRound size={14} className="text-brand-400" /> Your one-time secret</p>
          <p className="mb-3 text-[12px] text-zinc-400">Copy it now — for your security it won’t be shown again.</p>
          <div className="flex items-center gap-2">
            <code className="font-typewriter flex-1 truncate rounded-lg bg-white/10 px-3.5 py-2.5 text-[13px] text-brand-300">
              orvx_cap_9f2KwQx7Lm4TzR8pVn3E
            </code>
            <Button size="sm" onClick={async () => { await copyText('orvx_cap_9f2KwQx7Lm4TzR8pVn3E'); toast('Secret copied 🔑') }}>
              <Copy size={14} /> Copy
            </Button>
          </div>
          <ol className="mt-4 list-inside list-decimal space-y-1 text-[12.5px] text-zinc-300">
            <li>Open your AI client’s integrations settings</li>
            <li>Choose “Add capture destination” and paste the secret</li>
            <li>New captures will appear in your in-tray within a minute</li>
          </ol>
        </div>
      ) : (
        <Button className="w-full" onClick={() => setSecret(true)}>
          <Plug size={15} /> Generate a connection secret
        </Button>
      )}
    </Modal>
  )
}
