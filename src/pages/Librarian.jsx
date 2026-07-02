import { useMemo, useState } from 'react'
import {
  ArrowRight, BookOpen, Brain, Cable, Check, Copy, Eye, GitMerge,
  LibraryBig, Lock, MessageCircle, Plug, RefreshCw, Send, Sparkles,
  Trash2, X, KeyRound,
} from 'lucide-react'
import { librarianConnections, librarianItems, shelves } from '../data/mock'
import { cn, copyText, timeAgo } from '../lib/utils'
import {
  Badge, Button, Card, ConfirmDialog, EmptyState, Input, Modal,
  SectionHeading, Skeleton, StateGate,
} from '../components/ui'
import { useToast } from '../context/AppContext'

const SHELF_ICONS = { wiki: BookOpen, memory: Brain, trash: Trash2 }

const PROPOSAL_META = {
  new: { label: 'File as new', variant: 'brand', icon: ArrowRight },
  update: { label: 'Update existing', variant: 'warning', icon: RefreshCw },
  merge: { label: 'Merge duplicate', variant: 'warning', icon: GitMerge },
  discard: { label: 'Discard', variant: 'danger', icon: Trash2 },
}

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
      toast(item.proposal.kind === 'discard' ? 'Discarded' : `Filed to ${dest.name} ✓`)
    }
  }

  const fileAllSafe = () => {
    safeItems.forEach((i) => fileItem(i, true))
    toast(`Filed ${safeItems.length} safe item${safeItems.length === 1 ? '' : 's'} ✓`)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      {/* Header */}
      <div className="animate-fade-up flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display flex items-center gap-2.5 text-[26px] font-bold tracking-tight text-neutral-900">
            The Librarian
            {items.length > 0 && (
              <span className="grid h-7 min-w-7 place-items-center rounded-full bg-brand-600 px-2 text-[13px] font-bold text-white shadow-glow-sm">
                {items.length}
              </span>
            )}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">New captures from your AI sessions, ready to review and file.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setConnectOpen(true)}>
          <Cable size={14} /> Connect a client
        </Button>
      </div>

      {/* Shelves */}
      <div className="grid grid-cols-3 gap-3">
        {shelves.map((shelf, i) => {
          const Icon = SHELF_ICONS[shelf.id]
          return (
            <Card key={shelf.id} className="animate-fade-up p-4 text-center sm:p-5" style={{ animationDelay: `${i * 60}ms` }}>
              <span className={cn(
                'mx-auto mb-2.5 grid h-10 w-10 place-items-center rounded-xl',
                shelf.id === 'wiki' && 'bg-brand-50 text-brand-600',
                shelf.id === 'memory' && 'bg-sky-50 text-sky-600',
                shelf.id === 'trash' && 'bg-neutral-100 text-neutral-400',
              )}>
                <Icon size={19} />
              </span>
              <p className="font-display text-xl font-bold text-neutral-900">{shelf.count + filedTally[shelf.id]}</p>
              <p className="text-[12.5px] font-bold text-neutral-700">{shelf.name}</p>
              <p className="text-[11px] text-neutral-400">{shelf.description}</p>
            </Card>
          )
        })}
      </div>

      <StateGate
        loading={<div className="space-y-3">{Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}</div>}
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
          <div className="space-y-8">
            {/* Safe batch */}
            {safeItems.length > 0 && (
              <section>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <SectionHeading
                    className="mb-0"
                    title="Safe to file at once"
                    sub="These only add something new — they don’t touch anything existing"
                  />
                  <Button size="sm" onClick={fileAllSafe}>
                    <Sparkles size={14} /> File all {safeItems.length} safe ones
                  </Button>
                </div>
                <div className="space-y-3">
                  {safeItems.map((item) => (
                    <InTrayItem key={item.id} item={item} onAction={() => fileItem(item)} onDestructive={() => setConfirmItem(item)} />
                  ))}
                </div>
              </section>
            )}

            {/* Held back */}
            {heldItems.length > 0 && (
              <section>
                <SectionHeading
                  title="Held back for your review"
                  sub="Updates, merges, and anything sensitive — these always wait for a human eye"
                />
                <div className="space-y-3">
                  {heldItems.map((item) => (
                    <InTrayItem key={item.id} item={item} onAction={() => (item.proposal.kind === 'discard' ? setConfirmItem(item) : fileItem(item))} onDestructive={() => setConfirmItem(item)} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </StateGate>

      {/* Confirm destructive */}
      <ConfirmDialog
        open={Boolean(confirmItem)}
        onClose={() => setConfirmItem(null)}
        onConfirm={() => confirmItem && fileItem(confirmItem)}
        title="Discard this capture?"
        body="It’ll go to the trash shelf. You’re not deleting any existing Wiki or Memory content — just this capture."
        confirmLabel="Yes, discard it"
      />

      <ConnectModal open={connectOpen} onClose={() => setConnectOpen(false)} />
    </div>
  )
}

// ─── One in-tray item ────────────────────────────────────────────────────────
function InTrayItem({ item, onAction, onDestructive }) {
  const [unsealed, setUnsealed] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [thread, setThread] = useState(item.conversation)
  const meta = PROPOSAL_META[item.proposal.kind]
  const destination = shelves.find((s) => s.id === item.proposal.destination)
  const sealed = item.sensitive && !unsealed

  const ask = () => {
    if (!question.trim()) return
    setThread((t) => [
      ...t,
      { who: 'you', text: question.trim() },
      { who: 'librarian', text: 'Good question. My suggestion is based only on what’s in this capture and what already exists on your shelves — if you file it differently, I’ll learn from that choice.' },
    ])
    setQuestion('')
  }

  return (
    <Card className={cn('animate-fade-up overflow-hidden', item.sensitive && 'ring-amber-200')}>
      {/* Header row */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-100 px-5 py-3">
        <Badge variant={meta.variant}><meta.icon size={11} /> {meta.label}</Badge>
        <span className="flex items-center gap-1 text-[12px] font-semibold text-neutral-400">
          <ArrowRight size={11} /> {destination.name}
        </span>
        {item.sensitive && <Badge variant="warning"><Lock size={11} /> Sensitive — sealed</Badge>}
        <span className="ml-auto text-[11.5px] text-neutral-400">{item.source} · {timeAgo(item.capturedAt)}</span>
      </div>

      <div className="space-y-4 p-5">
        {/* Preview (sealed if sensitive) */}
        {sealed ? (
          <button
            onClick={() => setUnsealed(true)}
            className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-amber-50/70 py-6 text-[13px] font-bold text-amber-700 ring-1 ring-amber-200/70 ring-inset transition-all hover:bg-amber-50"
          >
            <Eye size={15} /> This capture is sealed — click to reveal its contents
          </button>
        ) : (
          <p className={cn('rounded-xl bg-neutral-50 p-4 text-[13.5px] leading-relaxed text-neutral-700 ring-1 ring-neutral-200/60 ring-inset', item.sensitive && 'animate-fade-in')}>
            {item.preview}
          </p>
        )}

        {/* The Librarian's reasoning */}
        <div className="flex gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-brand-400 text-white">
            <LibraryBig size={14} />
          </span>
          <p className="rounded-2xl rounded-tl-sm bg-brand-50/80 px-4 py-3 text-[13px] leading-relaxed text-brand-950">
            {item.proposal.reason}
          </p>
        </div>

        {/* Before/after for update & merge (sensitive fields stay hidden) */}
        {item.diff && !sealed && (
          <div className="grid gap-2.5 sm:grid-cols-2">
            <div className="rounded-xl bg-rose-50/60 p-3.5 ring-1 ring-rose-100 ring-inset">
              <p className="mb-1 text-[10.5px] font-bold tracking-widest text-rose-400 uppercase">Current entry</p>
              <p className="text-[12.5px] leading-relaxed text-neutral-600">{item.diff.before}</p>
            </div>
            <div className="rounded-xl bg-emerald-50/60 p-3.5 ring-1 ring-emerald-100 ring-inset">
              <p className="mb-1 text-[10.5px] font-bold tracking-widest text-emerald-500 uppercase">After {item.proposal.kind}</p>
              <p className="text-[12.5px] leading-relaxed text-neutral-700">{item.diff.after}</p>
            </div>
          </div>
        )}

        {/* Conversation thread */}
        {(chatOpen || thread.length > 0) && (
          <div className="space-y-2.5">
            {thread.map((m, i) => (
              <div key={i} className={cn('flex gap-2.5', m.who === 'you' && 'justify-end')}>
                {m.who === 'librarian' && (
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-500"><LibraryBig size={12} /></span>
                )}
                <p className={cn(
                  'max-w-[85%] rounded-2xl px-3.5 py-2 text-[12.5px] leading-relaxed',
                  m.who === 'you' ? 'rounded-br-sm bg-neutral-900 text-neutral-50' : 'rounded-tl-sm bg-neutral-100 text-neutral-700',
                )}>
                  {m.text}
                </p>
              </div>
            ))}
            {chatOpen && (
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about this item…"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && ask()}
                  className="h-9"
                />
                <Button size="sm" variant="secondary" onClick={ask} disabled={!question.trim()} aria-label="Send question">
                  <Send size={14} />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-4">
          {item.proposal.kind === 'discard' ? (
            <Button size="sm" variant="dangerGhost" onClick={onDestructive} disabled={sealed}>
              <Trash2 size={14} /> Discard
            </Button>
          ) : (
            <Button size="sm" onClick={onAction} disabled={sealed}>
              <Check size={14} />
              {item.proposal.kind === 'new' ? `File to ${destination.name}` : item.proposal.kind === 'update' ? 'Apply update' : 'Merge them'}
            </Button>
          )}
          {item.proposal.kind !== 'discard' && (
            <Button size="sm" variant="ghost" onClick={onDestructive}>
              <X size={14} /> Discard instead
            </Button>
          )}
          <button
            onClick={() => setChatOpen((o) => !o)}
            className="ml-auto flex cursor-pointer items-center gap-1.5 text-[12.5px] font-bold text-neutral-400 transition-colors hover:text-brand-600"
          >
            <MessageCircle size={14} /> Ask the Librarian
          </button>
          {sealed && <span className="w-full text-[11.5px] text-amber-600">Sealed items can’t be filed until you review their contents.</span>}
        </div>
      </div>
    </Card>
  )
}

// ─── All-caught-up summary ───────────────────────────────────────────────────
function CaughtUp({ tally }) {
  const total = tally.wiki + tally.memory + tally.trash
  return (
    <div className="animate-scale-in overflow-hidden rounded-3xl bg-ink-950 p-10 text-center text-white ring-1 ring-white/10 ring-inset">
      <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-brand-400 shadow-glow">
        <Check size={30} strokeWidth={2.5} />
      </span>
      <h2 className="font-display mb-2 text-2xl font-bold">All caught up 🎉</h2>
      <p className="mx-auto mb-7 max-w-sm text-[14px] leading-relaxed text-zinc-400">
        {total > 0 ? `You reviewed ${total} capture${total === 1 ? '' : 's'} this session. Here’s where everything went:` : 'The in-tray is empty. New captures will appear as you work.'}
      </p>
      {total > 0 && (
        <div className="mx-auto flex max-w-sm justify-center gap-8">
          {[
            ['Your Wiki', tally.wiki, BookOpen],
            ['Memory', tally.memory, Brain],
            ['Trash', tally.trash, Trash2],
          ].map(([name, n, Icon]) => (
            <div key={name}>
              <Icon size={17} className="mx-auto mb-1.5 text-brand-300" />
              <p className="font-display text-xl font-bold">{n}</p>
              <p className="text-[11.5px] text-zinc-500">{name}</p>
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

      {/* Existing connections */}
      <div className="mb-5 space-y-2">
        {connections.map((c) => (
          <div key={c.id} className="flex items-center gap-3 rounded-xl bg-neutral-50 p-3.5 ring-1 ring-neutral-200/60 ring-inset">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface text-brand-600 shadow-soft"><Plug size={16} /></span>
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

      {/* New connection */}
      {secret ? (
        <div className="animate-scale-in rounded-2xl bg-ink-950 p-5 text-white">
          <p className="mb-1 flex items-center gap-1.5 text-[13px] font-bold"><KeyRound size={14} className="text-brand-300" /> Your one-time secret</p>
          <p className="mb-3 text-[12px] text-zinc-400">Copy it now — for your security it won’t be shown again.</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded-lg bg-white/10 px-3.5 py-2.5 font-mono text-[13px] text-brand-300">
              orvx_cap_9f2KwQx7Lm4TzR8pVn3E
            </code>
            <Button size="sm" variant="secondary" onClick={async () => { await copyText('orvx_cap_9f2KwQx7Lm4TzR8pVn3E'); toast('Secret copied 🔑') }}>
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
