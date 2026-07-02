import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  ArchiveX, Bookmark, Calendar, Code2, Eye, GitBranch, GitFork,
  MessageSquare, PenLine, Play, Smile, Star, UserPlus, Check, Download,
} from 'lucide-react'
import { buildPromptText, commentsBySkill, reviewsBySkill, skillById, userById } from '../data/mock'
import { compact, formatDate, timeAgo, cn } from '../lib/utils'
import {
  Avatar, Badge, Button, Card, Divider, EmptyState, Modal, SectionHeading,
  Skeleton, StarRating, StateGate, Tabs, Textarea,
} from '../components/ui'
import { BlockList } from '../components/skills'
import { useToast } from '../context/AppContext'
import NotFound from './NotFound'

const QUICK_EMOJI = ['👍', '🔥', '💜', '👏', '🤯', '😂']
const PICKER_EMOJI = ['😀', '😅', '🤔', '😍', '🙌', '💡', '🚀', '✨', '🎯', '🧠', '💪', '🙏', '😮', '🥳', '👀', '❤️']

export default function SkillDetail() {
  const { id } = useParams()
  const skill = skillById(id)
  if (!skill) return <NotFound />
  return <SkillDetailInner skill={skill} />
}

function SkillDetailInner({ skill }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') || 'overview'
  const setTab = (t) => setParams(t === 'overview' ? {} : { tab: t })

  const creator = userById(skill.creatorId)
  const [following, setFollowing] = useState(false)
  const [starred, setStarred] = useState(skill.starredByMe)
  const [saved, setSaved] = useState(skill.savedByMe)
  const [showSource, setShowSource] = useState(false)
  const [suggestOpen, setSuggestOpen] = useState(false)

  return (
    <StateGate
      loading={<DetailSkeleton />}
      empty={<EmptyState title="Skill unavailable" body="This skill may have been unpublished by its creator." action={<Link to="/app/marketplace"><Button variant="secondary">Back to marketplace</Button></Link>} />}
    >
      <div className="mx-auto max-w-4xl space-y-7">
        {/* ─── Header (shared by both tabs) ─── */}
        <div className="animate-fade-up">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="brand">{skill.category}</Badge>
            <Badge variant="outline">v{skill.version}</Badge>
            {skill.deprecated && <Badge variant="warning"><ArchiveX size={11} /> Outdated — {skill.deprecatedReason}</Badge>}
          </div>
          <h1 className="font-display mb-2 text-3xl font-bold tracking-tight text-neutral-900">{skill.title}</h1>
          <p className="mb-4 max-w-2xl text-[15px] leading-relaxed text-neutral-500">{skill.tagline}</p>

          {skill.basedOn && (
            <p className="mb-4 flex items-center gap-1.5 text-[13px] text-neutral-400">
              <GitBranch size={13} />
              Based on{' '}
              <Link to={`/app/skills/${skill.basedOn.id}`} className="font-semibold text-brand-600 hover:underline">
                {skill.basedOn.title}
              </Link>
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link to={`/app/authors/${creator.handle}`} className="group flex items-center gap-2.5">
              <Avatar name={creator.name} size={38} />
              <span>
                <span className="block text-[13.5px] font-bold text-neutral-900 group-hover:text-brand-700">{creator.name}</span>
                <span className="block text-[12px] text-neutral-400">{creator.role}</span>
              </span>
              <button
                onClick={(e) => { e.preventDefault(); setFollowing((f) => !f); toast(following ? `Unfollowed ${creator.name}` : `Following ${creator.name}`) }}
                className={cn(
                  'ml-2 flex h-7 cursor-pointer items-center gap-1 rounded-full px-3 text-[12px] font-bold transition-all',
                  following ? 'bg-neutral-100 text-neutral-500' : 'bg-brand-50 text-brand-700 hover:bg-brand-100',
                )}
              >
                {following ? <><Check size={12} /> Following</> : <><UserPlus size={12} /> Follow</>}
              </button>
            </Link>

            {/* The only two actions on a public view */}
            <div className="flex items-center gap-2.5">
              <Button variant="outline" onClick={() => navigate(`/app/skills/${skill.id}/use`)}>
                <Play size={15} /> Use it
              </Button>
              <Button onClick={() => { toast('Copied to your drafts — make it yours ✨'); navigate('/app/drafts?tab=forked') }}>
                <GitFork size={15} /> Make it yours
              </Button>
            </div>
          </div>
        </div>

        <Tabs
          className="w-fit"
          tabs={[{ id: 'overview', label: 'Overview' }, { id: 'versions', label: 'Versions', count: skill.versions.length }]}
          active={tab}
          onChange={setTab}
        />

        {tab === 'overview' ? (
          <div className="space-y-10">
            {/* Package summary */}
            <Card className="animate-fade-up grid grid-cols-2 gap-y-5 p-6 sm:grid-cols-4">
              <SummaryStat label="Current version" value={`v${skill.version}`} />
              <SummaryStat
                label="Stars"
                value={compact(starred ? skill.stars + (skill.starredByMe ? 0 : 1) : skill.stars - (skill.starredByMe ? 1 : 0))}
                extra={
                  <button
                    onClick={() => { setStarred((s) => !s); toast(starred ? 'Star removed' : 'Starred ⭐') }}
                    aria-pressed={starred}
                    className={cn(
                      'mt-1.5 flex h-7 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[12px] font-bold transition-all',
                      starred ? 'bg-brand-600 text-white shadow-glow-sm' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200',
                    )}
                  >
                    <Star size={12} className={starred ? 'fill-white' : ''} /> {starred ? 'Starred' : 'Star'}
                  </button>
                }
              />
              <SummaryStat label="Forks" value={compact(skill.forksTotal)} sub={`${skill.forksWeek} this week`} />
              <SummaryStat label="Last published" value={timeAgo(skill.versions[0].date)} sub={formatDate(skill.versions[0].date)} />
            </Card>

            {/* The pieces */}
            <section>
              <SectionHeading
                title="What’s inside"
                sub="The skill’s pieces, in plain language — no code, no markup"
                right={
                  <button onClick={() => setShowSource(true)} className="flex cursor-pointer items-center gap-1.5 text-[13px] font-bold text-neutral-400 transition-colors hover:text-brand-600">
                    <Code2 size={14} /> View source
                  </button>
                }
              />
              <BlockList blocks={skill.blocks} />
            </section>

            {/* Suggest an edit */}
            <Card className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-brand-50/80 to-white p-5">
              <div className="flex items-center gap-3.5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface text-brand-600 shadow-soft"><PenLine size={18} /></span>
                <div>
                  <p className="text-[14px] font-bold text-neutral-900">See something to improve?</p>
                  <p className="text-[12.5px] text-neutral-500">Propose a change — the creator sees it as a before/after.</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setSuggestOpen(true)}>Suggest an edit</Button>
            </Card>

            {/* Reviews */}
            <ReviewsSection skill={skill} saved={saved} onToggleSave={() => { setSaved((s) => !s); toast(saved ? 'Removed from your library' : 'Saved to your library 📚') }} />

            {/* Comments */}
            <CommentsSection skill={skill} />
          </div>
        ) : (
          <VersionsTab skill={skill} />
        )}

        {/* View source modal */}
        <Modal open={showSource} onClose={() => setShowSource(false)} title="Source" wide>
          <p className="mb-3 text-[13px] text-neutral-400">The plain source text of this skill, read-only.</p>
          <pre className="max-h-96 overflow-auto rounded-2xl bg-ink-950 p-5 text-[12.5px] leading-relaxed whitespace-pre-wrap text-zinc-200">
            {buildPromptText(skill)}
          </pre>
        </Modal>

        <SuggestEditModal open={suggestOpen} onClose={() => setSuggestOpen(false)} skill={skill} />
      </div>
    </StateGate>
  )
}

function SummaryStat({ label, value, sub, extra }) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">{label}</p>
      <p className="font-display text-xl font-bold text-neutral-900">{value}</p>
      {sub && <p className="text-[12px] text-neutral-400">{sub}</p>}
      {extra}
    </div>
  )
}

// ─── Versions tab ────────────────────────────────────────────────────────────
function VersionsTab({ skill }) {
  const navigate = useNavigate()
  const toast = useToast()
  return (
    <div className="space-y-3">
      {skill.versions.map((v, i) => {
        const publisher = userById(v.by)
        return (
          <Card key={v.v} className="animate-fade-up p-5" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <span className="font-display text-[15px] font-bold text-neutral-900">v{v.v}</span>
                  {i === 0 && !v.deprecated && <Badge variant="success">Latest</Badge>}
                  {v.deprecated && <Badge variant="warning"><ArchiveX size={11} /> Outdated</Badge>}
                </div>
                <p className="mb-2 max-w-xl text-[13.5px] leading-relaxed text-neutral-600">{v.notes}</p>
                {v.deprecated && (
                  <p className="mb-2 rounded-lg bg-amber-50 px-3 py-2 text-[12.5px] text-amber-700">
                    Marked outdated: {v.deprecated.reason}
                  </p>
                )}
                <p className="flex items-center gap-1.5 text-[12px] text-neutral-400">
                  <Avatar name={publisher.name} size={16} /> {publisher.name} · <Calendar size={11} /> {formatDate(v.date)}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate(`/app/published/${skill.id}/v/${v.v}`)}>
                  <Eye size={14} /> View
                </Button>
                <Button variant="secondary" size="sm" onClick={() => { toast(`Copy created from v${v.v}`); navigate('/app/drafts?tab=forked') }}>
                  <Download size={14} /> Get this version
                </Button>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

// ─── Reviews ─────────────────────────────────────────────────────────────────
function ReviewsSection({ skill, saved, onToggleSave }) {
  const toast = useToast()
  const reviews = reviewsBySkill[skill.id] || []
  const [writing, setWriting] = useState(false)
  const [myRating, setMyRating] = useState(0)
  const [text, setText] = useState('')

  return (
    <section>
      <SectionHeading
        title="Reviews"
        sub={reviews.length ? `${skill.rating} average · ${skill.reviewCount} ratings` : 'No reviews yet'}
        right={
          <div className="flex items-center gap-2.5">
            <Button
              variant={saved ? 'secondary' : 'outline'} size="sm" onClick={onToggleSave} aria-pressed={saved}
            >
              <Bookmark size={14} className={saved ? 'fill-brand-600' : ''} /> {saved ? 'Saved' : 'Save'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setWriting((w) => !w)}>Write a review</Button>
          </div>
        }
      />

      {writing && (
        <Card className="animate-scale-in mb-4 p-5">
          <p className="mb-2 text-[13px] font-bold text-neutral-700">Your rating</p>
          <div className="mb-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <button key={i} onClick={() => setMyRating(i)} aria-label={`${i} stars`} className="cursor-pointer transition-transform hover:scale-110">
                <svg width={26} height={26} viewBox="0 0 24 24" style={{ fill: i <= myRating ? 'var(--color-brand-600)' : 'var(--color-neutral-200)' }}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            ))}
          </div>
          <Textarea rows={3} placeholder="What did this skill do for you?" value={text} onChange={(e) => setText(e.target.value)} />
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setWriting(false)}>Cancel</Button>
            <Button size="sm" disabled={!myRating || !text.trim()} onClick={() => { setWriting(false); setText(''); setMyRating(0); toast('Review posted — thank you!') }}>
              Post review
            </Button>
          </div>
        </Card>
      )}

      {reviews.length === 0 ? (
        <EmptyState icon={Star} title="No reviews yet" body="Used this skill? A short honest review helps the next person decide." action={<Button variant="secondary" size="sm" onClick={() => setWriting(true)}>Be the first to review</Button>} />
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => {
            const author = userById(r.userId)
            return (
              <Card key={r.id} className="p-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2.5">
                    <Avatar name={author.name} size={30} />
                    <span className="text-[13.5px] font-bold text-neutral-900">{author.name}</span>
                    <StarRating value={r.rating} />
                  </span>
                  <span className="text-[12px] text-neutral-400">{timeAgo(r.date)}</span>
                </div>
                <p className="text-[13.5px] leading-relaxed text-neutral-600">{r.text}</p>
              </Card>
            )
          })}
        </div>
      )}
    </section>
  )
}

// ─── Comments ────────────────────────────────────────────────────────────────
function CommentsSection({ skill }) {
  const toast = useToast()
  const initial = commentsBySkill[skill.id] || []
  const [comments, setComments] = useState(initial)
  const [text, setText] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [replyTo, setReplyTo] = useState(null)
  const MAX = 500

  const post = () => {
    if (!text.trim()) return
    if (replyTo) {
      setComments((cs) => cs.map((c) => c.id === replyTo
        ? { ...c, replies: [...c.replies, { id: `new-${c.replies.length}`, userId: 'u_me', text: text.trim(), date: new Date().toISOString(), reactions: {} }] }
        : c))
    } else {
      setComments((cs) => [{ id: `new-${cs.length}`, userId: 'u_me', text: text.trim(), date: new Date().toISOString(), reactions: {}, replies: [] }, ...cs])
    }
    setText('')
    setReplyTo(null)
    toast('Comment posted 💬')
  }

  return (
    <section>
      <SectionHeading title="Comments" sub={comments.length ? `${comments.reduce((n, c) => n + 1 + c.replies.length, 0)} comments` : 'Start the conversation'} />

      {/* Composer */}
      <Card className="mb-5 p-4">
        {replyTo && (
          <p className="mb-2 flex items-center justify-between rounded-lg bg-brand-50 px-3 py-1.5 text-[12px] font-semibold text-brand-700">
            Replying to {userById(comments.find((c) => c.id === replyTo)?.userId).name}
            <button onClick={() => setReplyTo(null)} className="cursor-pointer text-brand-400 hover:text-brand-700">Cancel</button>
          </p>
        )}
        <Textarea
          rows={2}
          maxLength={MAX}
          placeholder="Share what this skill did for you, or ask the creator anything…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Write a comment"
        />
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex items-center gap-1">
            {QUICK_EMOJI.map((e) => (
              <button key={e} onClick={() => setText((t) => t + e)} aria-label={`Add ${e}`} className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-[16px] transition-all hover:bg-neutral-100 hover:scale-110">
                {e}
              </button>
            ))}
            <button onClick={() => setPickerOpen((o) => !o)} aria-label="Open emoji picker" aria-expanded={pickerOpen} className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600">
              <Smile size={17} />
            </button>
            {pickerOpen && (
              <div className="animate-scale-in absolute bottom-10 left-0 z-20 grid w-56 grid-cols-8 gap-0.5 rounded-2xl bg-surface p-2.5 shadow-lift ring-1 ring-neutral-200/70">
                {PICKER_EMOJI.map((e) => (
                  <button key={e} onClick={() => { setText((t) => t + e); setPickerOpen(false) }} className="grid h-6 w-6 cursor-pointer place-items-center rounded text-[15px] transition-transform hover:scale-125">
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className={cn('text-[11.5px] font-semibold tabular-nums', text.length > MAX * 0.9 ? 'text-amber-600' : 'text-neutral-300')}>
              {text.length}/{MAX}
            </span>
            <Button size="sm" disabled={!text.trim()} onClick={post}>Post</Button>
          </div>
        </div>
      </Card>

      {comments.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No comments yet" body="Signed-in users can comment. Tell the creator what worked — or what didn’t." />
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} onReply={() => setReplyTo(c.id)} />
          ))}
        </div>
      )}
    </section>
  )
}

function CommentItem({ comment, onReply, isReply = false }) {
  const author = userById(comment.userId)
  const [reactions, setReactions] = useState(comment.reactions)
  const react = (e) => setReactions((r) => ({ ...r, [e]: (r[e] || 0) + 1 }))

  return (
    <div className={cn(!isReply && 'rounded-2xl bg-surface p-4.5 ring-1 ring-neutral-200/70 ring-inset')}>
      <div className="flex gap-3">
        <Avatar name={author.name} size={32} />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-baseline gap-x-2 text-[13.5px]">
            <span className="font-bold text-neutral-900">{author.name}</span>
            <span className="text-[11.5px] text-neutral-400">{timeAgo(comment.date)}</span>
          </p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-neutral-600">{comment.text}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {Object.entries(reactions).map(([e, n]) => (
              <button key={e} onClick={() => react(e)} className="flex cursor-pointer items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[12px] font-semibold text-neutral-600 transition-all hover:bg-brand-50 hover:text-brand-700">
                {e} {n}
              </button>
            ))}
            <button onClick={() => react('💜')} aria-label="React" className="grid h-6 w-6 cursor-pointer place-items-center rounded-full text-neutral-300 transition-colors hover:bg-neutral-100 hover:text-neutral-500">
              <Smile size={13} />
            </button>
            {!isReply && (
              <button onClick={onReply} className="ml-1 cursor-pointer text-[12px] font-bold text-neutral-400 transition-colors hover:text-brand-600">
                Reply
              </button>
            )}
          </div>

          {comment.replies?.length > 0 && (
            <div className="mt-3.5 space-y-3.5 border-l-2 border-brand-100 pl-4">
              {comment.replies.map((r) => <CommentItem key={r.id} comment={r} isReply />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Suggest an edit ─────────────────────────────────────────────────────────
function SuggestEditModal({ open, onClose, skill }) {
  const toast = useToast()
  const [blockId, setBlockId] = useState(skill.blocks[0]?.id)
  const block = useMemo(() => skill.blocks.find((b) => b.id === blockId), [blockId, skill])
  const [after, setAfter] = useState('')
  const [note, setNote] = useState('')

  return (
    <Modal open={open} onClose={onClose} title="Suggest an edit" wide>
      <p className="mb-4 text-[13px] text-neutral-500">
        Pick a piece, propose your version, add an optional note. The creator sees it as a clean before/after in their review inbox.
      </p>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {skill.blocks.map((b) => (
          <button
            key={b.id}
            onClick={() => { setBlockId(b.id); setAfter('') }}
            className={cn(
              'cursor-pointer rounded-full px-3 py-1.5 text-[12px] font-bold transition-all',
              b.id === blockId ? 'bg-neutral-900 text-neutral-50' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200',
            )}
          >
            {b.section}
          </button>
        ))}
      </div>
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">Before</p>
          <div className="h-40 overflow-y-auto rounded-xl bg-rose-50/60 p-3.5 text-[13px] leading-relaxed text-neutral-600 ring-1 ring-rose-100 ring-inset">
            {block?.content}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">Your version</p>
          <Textarea
            className="h-40 bg-emerald-50/50 ring-emerald-100"
            placeholder="Write the piece the way you think it should read…"
            value={after}
            onChange={(e) => setAfter(e.target.value)}
          />
        </div>
      </div>
      <Textarea rows={2} className="mb-5" placeholder="Optional: why this change? (helps the creator say yes)" value={note} onChange={(e) => setNote(e.target.value)} />
      <div className="flex justify-end gap-2.5">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button disabled={!after.trim()} onClick={() => { onClose(); setAfter(''); setNote(''); toast('Suggestion sent to the creator ✅') }}>
          Send suggestion
        </Button>
      </div>
    </Modal>
  )
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <div>
        <div className="mb-3 flex gap-2"><Skeleton className="h-5 w-24 rounded-full" /><Skeleton className="h-5 w-14 rounded-full" /></div>
        <Skeleton className="mb-2 h-9 w-96 max-w-full" />
        <Skeleton className="mb-5 h-4 w-72 max-w-full" />
        <div className="flex justify-between">
          <div className="flex items-center gap-2.5"><Skeleton className="h-9 w-9 rounded-full" /><Skeleton className="h-8 w-36" /></div>
          <div className="flex gap-2.5"><Skeleton className="h-10 w-24 rounded-xl" /><Skeleton className="h-10 w-36 rounded-xl" /></div>
        </div>
      </div>
      <Skeleton className="h-10 w-56 rounded-xl" />
      <Skeleton className="h-28 rounded-2xl" />
      {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
    </div>
  )
}
