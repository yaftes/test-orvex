import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Copy, Globe, Layers, Link2, Lock, Plus, Sparkles } from 'lucide-react'
import { collections, skillById } from '../data/mock'
import { copyText, pluralize } from '../lib/utils'
import { Badge, Button, Card, EmptyState, Field, Input, Modal, SectionHeading, Skeleton, StateGate, Toggle } from '../components/ui'
import { SkillCard } from '../components/skills'
import { useToast } from '../context/AppContext'
import NotFound from './NotFound'

export function Collections() {
  const toast = useToast()
  const [list, setList] = useState(collections)
  const [createOpen, setCreateOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [shared, setShared] = useState(false)

  const create = () => {
    setList((l) => [...l, {
      id: `col_${l.length + 1}`, name, description, shared,
      shareId: shared ? `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${l.length + 7}xq` : null,
      skillIds: [],
    }])
    setCreateOpen(false)
    setName(''); setDescription(''); setShared(false)
    toast('Collection created ✓')
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="animate-fade-up flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[26px] font-bold tracking-tight text-neutral-900">Collections</h1>
          <p className="mt-1 text-sm text-neutral-500">Your named groups of skills. Share one with a link — anyone can view it.</p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}><Plus size={15} /> New collection</Button>
      </div>

      <StateGate
        loading={<div className="space-y-4">{Array.from({ length: 2 }, (_, i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}</div>}
        empty={
          <EmptyState
            icon={Layers}
            title="No collections yet"
            body="Group skills however you think — “daily drivers,” “for the launch,” “teach the new hire.” Then share the link."
            action={<Button onClick={() => setCreateOpen(true)}><Plus size={15} /> Create your first collection</Button>}
          />
        }
      >
        {list.length === 0 ? (
          <EmptyState icon={Layers} title="No collections yet" body="Create one to group skills for a project, a team, or a mood." action={<Button onClick={() => setCreateOpen(true)}><Plus size={15} /> New collection</Button>} />
        ) : (
          <div className="space-y-5">
            {list.map((col, i) => (
              <Card key={col.id} className="animate-fade-up p-5" style={{ animationDelay: `${i * 70}ms` }}>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600"><Layers size={18} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-[15.5px] font-bold text-neutral-900">
                      {col.name}
                      {col.shared
                        ? <Badge variant="brand"><Globe size={11} /> Shared</Badge>
                        : <Badge variant="neutral"><Lock size={11} /> Private</Badge>}
                    </p>
                    <p className="text-[12.5px] text-neutral-400">{col.description} · {pluralize(col.skillIds.length, 'skill')}</p>
                  </div>
                  <div className="flex gap-2">
                    {col.shared && col.shareId && (
                      <Button
                        variant="outline" size="sm"
                        onClick={async () => { await copyText(`${location.origin}/c/${col.shareId}`); toast('Share link copied 🔗') }}
                      >
                        <Link2 size={14} /> Copy link
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => toast('Pick skills from any skill page → “Add to collection”', 'info')}>
                      <Plus size={14} /> Add skills
                    </Button>
                  </div>
                </div>

                {col.skillIds.length === 0 ? (
                  <p className="rounded-xl bg-neutral-50 py-5 text-center text-[12.5px] text-neutral-400 ring-1 ring-neutral-200/50 ring-inset">
                    Empty so far — add skills from any skill page.
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {col.skillIds.map((id) => {
                      const s = skillById(id)
                      return s ? <SkillCard key={id} skill={s} /> : null
                    })}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </StateGate>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New collection">
        <div className="space-y-4">
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. My daily drivers" autoFocus />
          </Field>
          <Field label="Description">
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What belongs in here?" />
          </Field>
          <div className="flex items-center justify-between rounded-xl bg-neutral-50 p-3.5 ring-1 ring-neutral-200/60 ring-inset">
            <div>
              <p className="text-[13.5px] font-bold text-neutral-800">Share with a link</p>
              <p className="text-[12px] text-neutral-400">Anyone with the link can view (not edit).</p>
            </div>
            <Toggle checked={shared} onChange={setShared} label="Share collection" />
          </div>
          <div className="flex justify-end gap-2.5 pt-1">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button disabled={!name.trim()} onClick={create}>Create collection</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ─── Public shared-collection view ───────────────────────────────────────────
export function SharedCollection() {
  const { shareId } = useParams()
  const col = collections.find((c) => c.shareId === shareId)
  if (!col) return <NotFound />

  return (
    <div className="min-h-screen bg-canvas">
      <header className="glass sticky top-0 z-30 border-b border-neutral-200/60">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-400">
              <Sparkles size={15} className="text-white" />
            </span>
            <span className="font-display text-[15px] font-bold text-neutral-900">Orvex</span>
          </Link>
          <Link to="/signup"><Button size="sm">Get started free</Button></Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12">
        <div className="mb-10 text-center">
          <Badge variant="brand" className="mb-4"><Globe size={11} /> Shared collection</Badge>
          <h1 className="font-display mb-2 text-3xl font-bold tracking-tight text-neutral-900">{col.name}</h1>
          <p className="text-sm text-neutral-500">{col.description} · {pluralize(col.skillIds.length, 'skill')}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {col.skillIds.map((id) => {
            const s = skillById(id)
            return s ? <SkillCard key={id} skill={s} to={`/s/${s.id}`} /> : null
          })}
        </div>
      </main>
    </div>
  )
}
