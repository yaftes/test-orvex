import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArchiveX, ArrowLeft, Calendar, Info, Lock, RotateCcw } from 'lucide-react'
import { myPublished, skillById, userById } from '../data/mock'
import { formatDate } from '../lib/utils'
import { Avatar, Badge, Button, Card, Modal, Textarea } from '../components/ui'
import { BlockList } from '../components/skills'
import { useToast } from '../context/AppContext'
import NotFound from './NotFound'

export default function VersionSnapshot() {
  const { id, version } = useParams()

  // A snapshot can come from a marketplace skill or one of the user's own.
  const marketSkill = skillById(id)
  const mine = myPublished.find((p) => p.id === id)

  const source = marketSkill || (mine && { ...mine, blocks: [], versions: mine.versions.map((v) => ({ ...v, by: 'u_me' })) })
  if (!source) return <NotFound />

  const versionEntry = source.versions.find((v) => v.v === version)
  if (!versionEntry) return <NotFound />

  return <SnapshotInner source={source} marketSkill={marketSkill} versionEntry={versionEntry} isOwner={Boolean(mine)} />
}

function SnapshotInner({ source, marketSkill, versionEntry, isOwner }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [deprecated, setDeprecated] = useState(Boolean(versionEntry.deprecated))
  const [reason, setReason] = useState(versionEntry.deprecated?.reason || '')
  const [modalOpen, setModalOpen] = useState(false)
  const [draftReason, setDraftReason] = useState('')

  const publisher = userById(versionEntry.by)
  const isLatest = source.versions[0].v === versionEntry.v

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button onClick={() => navigate(-1)} className="flex cursor-pointer items-center gap-1.5 text-[13px] font-bold text-neutral-400 transition-colors hover:text-neutral-700">
        <ArrowLeft size={15} /> Back
      </button>

      {/* Frozen banner */}
      <div className="animate-fade-up flex items-center gap-3 rounded-2xl bg-ink-950 p-4 text-white ring-1 ring-white/10 ring-inset">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10"><Lock size={16} /></span>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-bold">Frozen snapshot — v{versionEntry.v}</p>
          <p className="text-[12px] text-zinc-400">This is exactly what was published. It can never change.</p>
        </div>
        {isLatest && !deprecated && <Badge variant="solid">Latest</Badge>}
        {deprecated && <Badge variant="warning"><ArchiveX size={11} /> Outdated</Badge>}
      </div>

      <div className="animate-fade-up" style={{ animationDelay: '60ms' }}>
        <h1 className="font-display mb-2 text-3xl font-bold tracking-tight text-neutral-900">{source.title}</h1>
        <Card className="flex flex-wrap items-center gap-x-6 gap-y-3 p-4.5">
          <span className="font-display text-[15px] font-bold text-neutral-900">v{versionEntry.v}</span>
          <span className="flex items-center gap-1.5 text-[13px] text-neutral-500">
            <Avatar name={publisher.name} size={20} /> {publisher.name}
          </span>
          <span className="flex items-center gap-1.5 text-[13px] text-neutral-500">
            <Calendar size={13} /> {formatDate(versionEntry.date)}
          </span>
        </Card>
        <p className="mt-3 rounded-xl bg-neutral-50 px-4 py-3 text-[13.5px] leading-relaxed text-neutral-600 ring-1 ring-neutral-200/60 ring-inset">
          <span className="font-bold text-neutral-800">Changelog: </span>{versionEntry.notes}
        </p>
        {deprecated && reason && (
          <p className="mt-3 rounded-xl bg-brand-50 px-4 py-3 text-[13px] text-brand-800 ring-1 ring-brand-200/70 ring-inset">
            <span className="font-bold">Marked outdated:</span> {reason}
          </p>
        )}
      </div>

      {/* Owner controls — never on public views */}
      {isOwner && (
        <Card className="animate-fade-up space-y-3 border-dashed p-5" style={{ animationDelay: '120ms' }}>
          <p className="text-[12px] font-bold tracking-wider text-neutral-400 uppercase">Owner controls</p>
          {deprecated ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[13px] text-neutral-500">This version is marked outdated. You can reverse that at any time.</p>
              <Button variant="secondary" size="sm" onClick={() => { setDeprecated(false); setReason(''); toast(`v${versionEntry.v} is active again`) }}>
                <RotateCcw size={14} /> Undeprecate
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[13px] text-neutral-500">Mark this version outdated so people know to use a newer one.</p>
              <Button variant="dangerGhost" size="sm" onClick={() => setModalOpen(true)}>
                <ArchiveX size={14} /> Deprecate this version
              </Button>
            </div>
          )}
          <div className="flex items-start gap-2 rounded-xl bg-brand-50/70 px-3.5 py-2.5 text-[12px] leading-relaxed text-brand-800">
            <Info size={13} className="mt-0.5 shrink-0" />
            <span>
              Deprecating the most recent version changes which one is treated as “latest.”
              Deprecating <em>every</em> version hides the skill from the marketplace entirely.
            </span>
          </div>
        </Card>
      )}

      {/* Frozen content */}
      {marketSkill?.blocks?.length ? (
        <BlockList blocks={marketSkill.blocks} />
      ) : (
        <Card className="p-8 text-center text-[13.5px] text-neutral-400">
          The frozen content of v{versionEntry.v}, exactly as released.
        </Card>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={`Deprecate v${versionEntry.v}?`}>
        <p className="mb-4 text-sm leading-relaxed text-neutral-600">
          People who open this version will see it’s outdated. Anyone who already copied it keeps their copy.
        </p>
        <Textarea
          rows={2}
          className="mb-5"
          placeholder="Optional: a short reason (e.g. “superseded by v2 — output format changed”)"
          value={draftReason}
          onChange={(e) => setDraftReason(e.target.value)}
        />
        <div className="flex justify-end gap-2.5">
          <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => { setDeprecated(true); setReason(draftReason); setModalOpen(false); toast(`v${versionEntry.v} marked outdated`) }}>
            Mark as outdated
          </Button>
        </div>
      </Modal>
    </div>
  )
}
