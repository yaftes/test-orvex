import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowDown, ArrowLeft, ArrowUp, Check, CloudUpload, Copy, Eye, EyeOff,
  GitBranch, Loader2, Plus, RotateCcw, Trash2, TriangleAlert, Rocket, X,
} from 'lucide-react'
import { drafts, categories, skillById, buildPromptText } from '../data/mock'
import { cn, copyText, wordCount } from '../lib/utils'
import { Badge, Button, Dropdown, Field, Input, Modal, Textarea } from '../components/ui'
import { BlockList } from '../components/skills'
import { useToast } from '../context/AppContext'

const SECTIONS = ['Role', 'What it asks you', 'Instructions', 'Tone & voice', 'Output format', 'Guardrails']

const NEW_BLOCK = (section) => ({
  id: `nb_${Math.random().toString(36).slice(2, 8)}`,
  section,
  title: 'New piece',
  content: '',
  disabled: false,
})

function findDraft(id) {
  return [...drafts.created, ...drafts.forked].find((d) => d.id === id)
}

export default function Builder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const draft = id === 'new' ? null : (findDraft(id) || skillById(id))
  const [title, setTitle] = useState(draft?.title || 'Untitled skill')
  const [blocks, setBlocks] = useState(() =>
    (draft?.blocks || [NEW_BLOCK('Role'), NEW_BLOCK('Instructions')]).map((b) => ({ ...b, disabled: false })),
  )
  const [saveState, setSaveState] = useState('saved') // saving | saved | retrying
  const [preview, setPreview] = useState(false)
  const [publishOpen, setPublishOpen] = useState(false)
  const [lastRemoved, setLastRemoved] = useState(null)
  const saveTimer = useRef(null)

  const activeBlocks = blocks.filter((b) => !b.disabled)
  const promptText = useMemo(() => buildPromptText({ blocks: activeBlocks }), [blocks])
  const words = wordCount(promptText)

  // Simulated autosave: edits flip to "saving", settle to "saved".
  const touch = () => {
    setSaveState('saving')
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => setSaveState('saved'), 900)
  }
  useEffect(() => () => clearTimeout(saveTimer.current), [])

  const updateBlock = (bid, patch) => {
    setBlocks((bs) => bs.map((b) => (b.id === bid ? { ...b, ...patch } : b)))
    touch()
  }
  const move = (bid, dir) => {
    setBlocks((bs) => {
      const i = bs.findIndex((b) => b.id === bid)
      const j = i + dir
      if (j < 0 || j >= bs.length) return bs
      const next = [...bs]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
    touch()
  }
  const remove = (bid) => {
    const b = blocks.find((x) => x.id === bid)
    setLastRemoved(b)
    setBlocks((bs) => bs.filter((x) => x.id !== bid))
    touch()
  }
  const undoRemove = () => {
    if (!lastRemoved) return
    setBlocks((bs) => [...bs, lastRemoved])
    setLastRemoved(null)
    touch()
  }
  const addBlock = (section) => {
    setBlocks((bs) => [...bs, NEW_BLOCK(section)])
    touch()
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={() => navigate(-1)} className="flex cursor-pointer items-center gap-1.5 text-[13px] font-bold text-neutral-400 transition-colors hover:text-neutral-700">
          <ArrowLeft size={15} /> Back
        </button>
        <div className="flex items-center gap-3">
          <SaveStatus state={saveState} onRetry={() => { setSaveState('saving'); setTimeout(() => setSaveState('saved'), 800) }} />
          <span className="text-[12.5px] font-semibold text-neutral-400 tabular-nums">{words} words</span>
        </div>
      </div>

      {/* Title + attribution */}
      <div>
        <input
          value={title}
          onChange={(e) => { setTitle(e.target.value); touch() }}
          aria-label="Skill title"
          className="font-display w-full bg-transparent text-3xl font-bold tracking-tight text-neutral-900 outline-none placeholder:text-neutral-300"
          placeholder="Name your skill"
        />
        {draft?.basedOn && (
          <p className="mt-2 flex items-center gap-1.5 text-[13px] text-neutral-400">
            <GitBranch size={13} />
            Based on{' '}
            <Link to={`/app/skills/${draft.basedOn.id}`} className="font-semibold text-brand-600 hover:underline">
              {draft.basedOn.title} <span className="text-neutral-400">v{draft.basedOn.version}</span>
            </Link>
          </p>
        )}
      </div>

      {/* Actions row */}
      <div className="flex flex-wrap items-center gap-2.5 border-y border-neutral-100 py-3.5">
        <Button variant="outline" size="sm" onClick={() => setPreview((p) => !p)}>
          {preview ? <><EyeOff size={14} /> Exit preview</> : <><Eye size={14} /> Preview</>}
        </Button>
        <Button variant="outline" size="sm" onClick={async () => { await copyText(promptText); toast('Prompt copied to clipboard 📋') }}>
          <Copy size={14} /> Copy prompt
        </Button>
        <div className="ml-auto">
          <Button size="sm" onClick={() => setPublishOpen(true)}>
            <Rocket size={14} /> Publish
          </Button>
        </div>
      </div>

      {/* Undo strip */}
      {lastRemoved && (
        <div className="animate-scale-in flex items-center justify-between rounded-xl bg-ink-950 px-4 py-2.5 text-[13px] font-semibold text-white">
          <span>Removed “{lastRemoved.title}”</span>
          <div className="flex items-center gap-2">
            <button onClick={undoRemove} className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-[12.5px] font-bold transition-colors hover:bg-white/20">
              <RotateCcw size={13} /> Undo
            </button>
            <button onClick={() => setLastRemoved(null)} aria-label="Dismiss" className="grid h-7 w-7 cursor-pointer place-items-center rounded-lg text-zinc-400 hover:text-white">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {preview ? (
        // Read-only, exactly as a reader would see it
        <div className="animate-fade-in">
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-2.5 text-[13px] font-semibold text-brand-700">
            <Eye size={14} /> Preview — this is what readers will see
          </div>
          <BlockList blocks={activeBlocks} />
        </div>
      ) : (
        <div className="space-y-3">
          {SECTIONS.filter((s) => blocks.some((b) => b.section === s)).map((section) => (
            <div key={section}>
              <p className="mt-5 mb-2 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">{section}</p>
              <div className="space-y-3">
                {blocks.filter((b) => b.section === section).map((b) => (
                  <EditableBlock
                    key={b.id}
                    block={b}
                    onChange={(patch) => updateBlock(b.id, patch)}
                    onMoveUp={() => move(b.id, -1)}
                    onMoveDown={() => move(b.id, +1)}
                    onRemove={() => remove(b.id)}
                    onMoveSection={(s) => updateBlock(b.id, { section: s })}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Add block */}
          <div className="rounded-2xl border-2 border-dashed border-neutral-200 p-4">
            <p className="mb-2.5 text-[12.5px] font-bold text-neutral-400">Add a piece</p>
            <div className="flex flex-wrap gap-2">
              {SECTIONS.map((s) => (
                <button key={s} onClick={() => addBlock(s)} className="flex cursor-pointer items-center gap-1 rounded-full bg-neutral-100 px-3 py-1.5 text-[12.5px] font-semibold text-neutral-600 transition-all hover:bg-brand-50 hover:text-brand-700">
                  <Plus size={13} /> {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <PublishModal open={publishOpen} onClose={() => setPublishOpen(false)} defaultTitle={title} />
    </div>
  )
}

function SaveStatus({ state, onRetry }) {
  if (state === 'saving') {
    return (
      <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-neutral-400">
        <Loader2 size={13} className="animate-spin" /> Saving…
      </span>
    )
  }
  if (state === 'retrying') {
    return (
      <button onClick={onRetry} className="flex cursor-pointer items-center gap-1.5 text-[12.5px] font-bold text-amber-600">
        <TriangleAlert size={13} /> Couldn’t save — retrying
      </button>
    )
  }
  return (
    <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-emerald-600">
      <Check size={13} /> Saved
    </span>
  )
}

function EditableBlock({ block, onChange, onMoveUp, onMoveDown, onRemove, onMoveSection }) {
  return (
    <div className={cn(
      'group rounded-2xl bg-surface p-4 ring-1 ring-neutral-200/70 ring-inset transition-all focus-within:ring-2 focus-within:ring-brand-400',
      block.disabled && 'opacity-50',
    )}>
      <div className="mb-2 flex items-center gap-2">
        <input
          value={block.title}
          onChange={(e) => onChange({ title: e.target.value })}
          aria-label="Piece title"
          className="flex-1 bg-transparent text-[14px] font-bold text-neutral-900 outline-none placeholder:text-neutral-300"
          placeholder="Piece title"
        />
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
          <Dropdown
            value={block.section}
            options={SECTIONS.map((s) => ({ value: s, label: s }))}
            onChange={onMoveSection}
          />
          <IconBtn label="Move up" onClick={onMoveUp}><ArrowUp size={14} /></IconBtn>
          <IconBtn label="Move down" onClick={onMoveDown}><ArrowDown size={14} /></IconBtn>
          <IconBtn label={block.disabled ? 'Enable' : 'Disable'} onClick={() => onChange({ disabled: !block.disabled })}>
            {block.disabled ? <Eye size={14} /> : <EyeOff size={14} />}
          </IconBtn>
          <IconBtn label="Remove" danger onClick={onRemove}><Trash2 size={14} /></IconBtn>
        </div>
      </div>
      <textarea
        value={block.content}
        onChange={(e) => onChange({ content: e.target.value })}
        rows={Math.max(2, Math.ceil(block.content.length / 90))}
        aria-label="Piece content"
        placeholder="Write this piece in plain language…"
        className="w-full resize-none bg-transparent text-[13.5px] leading-relaxed text-neutral-600 outline-none placeholder:text-neutral-300"
      />
      {block.disabled && <Badge variant="warning" className="mt-1">Disabled — won’t appear in the prompt</Badge>}
    </div>
  )
}

function IconBtn({ label, onClick, danger, children }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        'grid h-7 w-7 cursor-pointer place-items-center rounded-lg transition-colors',
        danger ? 'text-neutral-400 hover:bg-rose-50 hover:text-rose-600' : 'text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700',
      )}
    >
      {children}
    </button>
  )
}

function PublishModal({ open, onClose, defaultTitle }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [title, setTitle] = useState(defaultTitle)
  const [category, setCategory] = useState(categories[0])
  const [tagline, setTagline] = useState('')
  useEffect(() => setTitle(defaultTitle), [defaultTitle])

  return (
    <Modal open={open} onClose={onClose} title="Publish to the marketplace">
      <div className="space-y-4">
        <Field label="Title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Category">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 w-full cursor-pointer rounded-xl bg-surface px-3 text-sm text-neutral-900 ring-1 ring-neutral-200 ring-inset outline-none focus:ring-2 focus:ring-brand-500"
          >
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="One-line description" hint="This is what people see on the marketplace card.">
          <Input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="What does this skill do, in one honest line?" maxLength={90} />
        </Field>
        <div className="flex justify-end gap-2.5 pt-2">
          <Button variant="outline" onClick={onClose}>Not yet</Button>
          <Button
            disabled={!title.trim() || !tagline.trim()}
            onClick={() => { onClose(); toast('Published! Your skill is live 🚀'); navigate('/app/published') }}
          >
            <CloudUpload size={15} /> Publish v1.0.0
          </Button>
        </div>
      </div>
    </Modal>
  )
}
