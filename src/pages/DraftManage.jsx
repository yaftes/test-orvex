import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, GitBranch, PenLine, Play, Rocket, Trash2, Undo2 } from 'lucide-react'
import { drafts } from '../data/mock'
import { pluralize, timeAgo } from '../lib/utils'
import { Badge, Button, ConfirmDialog } from '../components/ui'
import { BlockList } from '../components/skills'
import { useToast } from '../context/AppContext'
import NotFound from './NotFound'

export default function DraftManage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [confirm, setConfirm] = useState(null) // 'delete' | 'drop'

  const created = drafts.created.find((d) => d.id === id)
  const forked = drafts.forked.find((d) => d.id === id)
  const draft = created || forked
  if (!draft) return <NotFound />
  const isForked = Boolean(forked)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button onClick={() => navigate('/app/drafts' + (isForked ? '?tab=forked' : ''))} className="flex cursor-pointer items-center gap-1.5 text-[13px] font-bold text-neutral-400 transition-colors hover:text-neutral-700">
        <ArrowLeft size={15} /> All drafts
      </button>

      <div className="animate-fade-up">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="brand">{draft.category}</Badge>
          <Badge variant={isForked ? 'neutral' : 'outline'}>{isForked ? 'Forked draft' : 'Created by you'}</Badge>
        </div>
        <h1 className="font-display mb-1.5 text-3xl font-bold tracking-tight text-neutral-900">{draft.title}</h1>
        <p className="text-[13px] text-neutral-400">
          {pluralize(draft.edits, 'edit')} · last touched {timeAgo(draft.lastTouched)}
        </p>
        {draft.basedOn && (
          <p className="mt-2 flex items-center gap-1.5 text-[13px] text-neutral-400">
            <GitBranch size={13} />
            Based on{' '}
            <Link to={`/app/skills/${draft.basedOn.id}`} className="font-semibold text-brand-600 hover:underline">
              {draft.basedOn.title} <span className="text-neutral-400">v{draft.basedOn.version}</span>
            </Link>
          </p>
        )}
      </div>

      {/* The right actions for this draft's type */}
      <div className="flex flex-wrap items-center gap-2.5 border-y border-neutral-100 py-3.5">
        <Button size="sm" onClick={() => navigate(`/app/builder/${draft.id}`)}>
          <PenLine size={14} /> Edit
        </Button>
        {isForked ? (
          <>
            <Button variant="outline" size="sm" onClick={() => navigate(`/app/skills/${draft.basedOn.id}/use`)}>
              <Play size={14} /> Use
            </Button>
            <Button variant="dangerGhost" size="sm" className="ml-auto" onClick={() => setConfirm('drop')}>
              <Undo2 size={14} /> Drop customization
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" size="sm" onClick={() => navigate(`/app/builder/${draft.id}`)}>
              <Rocket size={14} /> Publish
            </Button>
            <Button variant="dangerGhost" size="sm" className="ml-auto" onClick={() => setConfirm('delete')}>
              <Trash2 size={14} /> Delete
            </Button>
          </>
        )}
      </div>

      <BlockList blocks={draft.blocks} />

      {/* Plain-language confirmations for destructive actions */}
      <ConfirmDialog
        open={confirm === 'delete'}
        onClose={() => setConfirm(null)}
        onConfirm={() => { toast('Draft deleted'); navigate('/app/drafts') }}
        title="Delete this draft?"
        body={`“${draft.title}” and its ${pluralize(draft.edits, 'edit')} will be gone for good. This can’t be undone — there’s no trash bin for drafts.`}
        confirmLabel="Yes, delete it"
      />
      <ConfirmDialog
        open={confirm === 'drop'}
        onClose={() => setConfirm(null)}
        onConfirm={() => { toast('Customization dropped — the original skill is untouched'); navigate('/app/drafts?tab=forked') }}
        title="Drop your customization?"
        body={`Your edits to this copy will be discarded. The original skill (“${draft.basedOn?.title}”) stays in the marketplace, completely unaffected — you can always fork it again.`}
        confirmLabel="Yes, drop my changes"
      />
    </div>
  )
}
