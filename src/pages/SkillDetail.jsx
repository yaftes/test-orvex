import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  ArchiveX, Bookmark, Code2, Eye, GitBranch, GitFork, MessageSquare,
  PenLine, Play, Smile, Star, UserPlus, Check, Download, TrendingUp,
  Network, CalendarClock,
} from 'lucide-react'
import {
  buildPromptText, commentsBySkill, forksOf, myForksOf, ratingDistFor,
  reviewsBySkill, seriesFor, skillById, starCurveFor, userById,
} from '../data/mock'
import { compact, formatDate, timeAgo, cn } from '../lib/utils'
import {
  Avatar, Badge, Button, Card, EmptyState, Modal, SectionHeading,
  Skeleton, StarRating, StateGate, Tabs, Textarea,
} from '../components/ui'
import { BlockList } from '../components/skills'
import { CategoryCover, ForkTree, RatingBars, TrendChart, VersionTimeline, categoryArt } from '../components/viz'
import { WeekBars } from '../components/viz'
import { useToast } from '../context/AppContext'
import NotFound from './NotFound'

const QUICK_EMOJI = ['👍', '🔥', '💜', '👏', '🤯', '😂']
const PICKER_EMOJI = ['😀', '😅', '🤔', '😍', '🙌', '💡', '🚀', '✨', '🎯', '🧠', '💪', '🙏', '😮', '🥳', '👀', '❤️']

export default function SkillDetail() {
  const { id } = useParams()
  const skill = skillById(id)
  if (!skill) return <NotFound />
  return <SkillDetailInner key={skill.id} skill={skill} />
}

function SkillDetailInner({ skill }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') || 'overview'
  const setTab = (t) => setParams(t === 'overview' ? {} : { tab: t })

  const creator = userById(skill.creatorId)
  const art = categoryArt(skill.category)
  const [following, setFollowing] = useState(false)
  const [starred, setStarred] = useState(skill.starredByMe)
  const [saved, setSaved] = useState(skill.savedByMe)
  const [showSource, setShowSource] = useState(false)
  const [suggestOpen, setSuggestOpen] = useState(false)

  const starCount = skill.stars + (starred ? (skill.starredByMe ? 0 : 1) : (skill.starredByMe ? -1 : 0))

  return (
    <StateGate
      loading={<DetailSkeleton />}
      empty={<EmptyState title="Skill unavailable" body="This skill may have been unpublished by its creator." action={<Link to="/app/marketplace"><Button variant="secondary">Back to marketplace</Button></Link>} />}
    >
      <div className="mx-auto max-w-4xl space-y-7">
        {/* ─── Hero (shared by both tabs) ─── */}
        <div className="animate-fade-up relative overflow-hidden rounded-3xl bg-ink-950 p-6 text-white ring-1 ring-white/10 ring-inset sm:p-8">
          <div className="absolute inset-0 opacity-40" style={{ background: `radial-gradient(600px 240px at 85% -20%, ${art.g[0]}66, transparent), radial-gradient(500px 220px at 0% 110%, ${art.g[1]}44, transparent)` }} />
          <div className="bg-hero-grid absolute inset-0 opacity-60" />

          <div className="relative">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Link to={`/app/marketplace?category=${encodeURIComponent(skill.category)}`} className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-bold text-white ring-1 ring-white/20 ring-inset transition-colors hover:bg-white/10" style={{ background: `linear-gradient(120deg, ${art.g[0]}cc, ${art.g[1]}cc)` }}>
                <art.icon size={12} /> {skill.category}
              </Link>
              <Badge variant="outline" className="!text-zinc-300 !ring-white/20">v{skill.version}</Badge>
              {skill.deprecated && <Badge variant="warning"><ArchiveX size={11} /> Outdated — {skill.deprecatedReason}</Badge>}
            </div>

            <h1 className="font-display mb-2 text-3xl font-bold tracking-tight sm:text-4xl">{skill.title}</h1>
            <p className="mb-4 max-w-2xl text-[15px] leading-relaxed text-zinc-400">{skill.tagline}</p>

            {skill.basedOn && (
              <p className="mb-5 flex items-center gap-1.5 text-[13px] text-zinc-500">
                <GitBranch size={13} />
                Based on{' '}
                <Link to={`/app/skills/${skill.basedOn.id}`} className="font-semibold text-brand-300 hover:text-white">
                  {skill.basedOn.title}
                </Link>
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link to={`/app/authors/${creator.handle}`} className="group flex items-center gap-2.5">
                <Avatar name={creator.name} size={40} ring />
                <span>
                  <span className="block text-[13.5px] font-bold text-white group-hover:text-brand-300">{creator.name}</span>
                  <span className="block text-[12px] text-zinc-500">{creator.role}</span>
                </span>
                <button
                  onClick={(e) => { e.preventDefault(); setFollowing((f) => !f); toast(following ? `Unfollowed ${creator.name}` : `Following ${creator.name}`) }}
                  className={cn(
                    'ml-2 flex h-7 cursor-pointer items-center gap-1 rounded-full px-3 text-[12px] font-bold transition-all',
                    following ? 'bg-white/10 text-zinc-300' : 'bg-brand-600 text-white shadow-glow-sm hover:brightness-110',
                  )}
                >
                  {following ? <><Check size={12} /> Following</> : <><UserPlus size={12} /> Follow</>}
                </button>
              </Link>

              {/* The only two actions on a public view */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => navigate(`/app/skills/${skill.id}/use`)}
                  className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-white/10 px-4.5 text-sm font-semibold text-white ring-1 ring-white/15 ring-inset transition-all hover:bg-white/15"
                >
                  <Play size={15} /> Use it
                </button>
                <Button onClick={() => { toast('Copied to your drafts — make it yours ✨'); navigate('/app/drafts?tab=forked') }}>
                  <GitFork size={15} /> Make it yours
                </Button>
              </div>
            </div>

            {/* Stat chips — every number real */}
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <button
                onClick={() => { setStarred((s) => !s); toast(starred ? 'Star removed' : 'Starred ⭐') }}
                aria-pressed={starred}
                className={cn(
                  'cursor-pointer rounded-2xl p-3.5 text-left ring-1 ring-inset transition-all',
                  starred ? 'bg-brand-600/30 ring-brand-400/50' : 'bg-white/6 ring-white/10 hover:bg-white/10',
                )}
              >
                <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                  <Star size={11} className={starred ? 'fill-brand-300 text-brand-300' : ''} /> Stars
                </p>
                <p className="font-display mt-1 text-xl font-bold">{compact(starCount)}</p>
                <p className="text-[10.5px] font-semibold text-brand-300">{starred ? 'Starred — tap to undo' : 'Tap to star'}</p>
              </button>
              <HeroStat icon={GitFork} label="Forks" value={compact(skill.forksTotal)} sub={`${skill.forksWeek} this week`} subClass="text-brand-400" />
              <HeroStat icon={Bookmark} label="Saves" value={compact(skill.saves)} sub={saved ? 'In your library' : ' '} subClass="text-brand-300" />
              <HeroStat icon={CalendarClock} label="Last release" value={timeAgo(skill.versions[0].date)} sub={formatDate(skill.versions[0].date)} subClass="text-zinc-500" />
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
            {/* ─── Signals: live charts ─── */}
            <section>
              <SectionHeading title="Signals" sub="Real activity, straight from the community" />
              <div className="grid gap-4 lg:grid-cols-3">
                <Card className="animate-fade-up p-5">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                    <TrendingUp size={12} className="text-brand-500" /> Star growth
                  </p>
                  <p className="font-display mt-1 mb-2 text-2xl font-bold text-neutral-900">{compact(starCount)}</p>
                  <TrendChart data={starCurveFor(skill)} height={92} label={`${skill.title} stars over the last 12 weeks`} />
                </Card>
                <Card className="animate-fade-up p-5" style={{ animationDelay: '70ms' }}>
                  <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                    <GitFork size={12} className="text-brand-500" /> Forks per week
                  </p>
                  <p className="font-display mt-1 mb-2 text-2xl font-bold text-neutral-900">{skill.forksWeek}<span className="ml-1 text-[12px] font-semibold text-neutral-400">this week</span></p>
                  <WeekBars data={seriesFor(`forks:${skill.id}`)} height={92} label={`${skill.title} forks per week`} format={(v) => `${Math.round(v)} forks`} />
                </Card>
                <Card className="animate-fade-up p-5" style={{ animationDelay: '140ms' }}>
                  <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                    <Star size={12} className="text-brand-500" /> Ratings
                  </p>
                  <p className="font-display mt-1 mb-2 flex items-baseline gap-2 text-2xl font-bold text-neutral-900">
                    {skill.rating}
                    <StarRating value={skill.rating} size={12} />
                    <span className="text-[12px] font-semibold text-neutral-400">{skill.reviewCount} ratings</span>
                  </p>
                  <RatingBars dist={ratingDistFor(skill)} />
                </Card>
              </div>
            </section>

            {/* ─── The pieces ─── */}
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

            {/* ─── Lineage tree ─── */}
            <LineageSection skill={skill} />

            {/* Suggest an edit */}
            <Card className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-brand-50/80 to-surface p-5">
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

function HeroStat({ icon: Icon, label, value, sub, subClass }) {
  return (
    <div className="rounded-2xl bg-white/6 p-3.5 ring-1 ring-white/10 ring-inset">
      <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
        <Icon size={11} /> {label}
      </p>
      <p className="font-display mt-1 text-xl font-bold text-white">{value}</p>
      <p className={cn('text-[10.5px] font-semibold', subClass)}>{sub}</p>
    </div>
  )
}

// ─── Lineage (family tree) ───────────────────────────────────────────────────
function LineageSection({ skill }) {
  const parent = skill.basedOn ? skillById(skill.basedOn.id) : null
  const forkChildren = forksOf(skill.id)
  const draftChildren = myForksOf(skill.id)
  if (!parent && forkChildren.length === 0 && draftChildren.length === 0) return null

  const node = (s, extra = {}) => ({
    id: s.id,
    title: s.title,
    category: s.category,
    meta: `${userById(s.creatorId).name} · v${s.version} · ${compact(s.stars)} stars`,
    stat: s.forksTotal,
    to: `/app/skills/${s.id}`,
    ...extra,
  })

  const children = [
    ...forkChildren.map((s) => node(s, { badge: 'Fork', badgeStyle: 'bg-neutral-100 text-neutral-500' })),
    ...draftChildren.map((d) => ({
      id: d.id, title: d.title, category: d.category,
      meta: `Your private draft · ${d.edits} edits`,
      to: `/app/drafts/${d.id}`,
      badge: 'Your copy', badgeStyle: 'bg-brand-600 text-white',
    })),
  ]

  return (
    <section>
      <SectionHeading
        title="Lineage"
        sub="Where this skill came from, and where the community took it"
        right={<span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600"><Network size={17} /></span>}
      />
      <Card className="animate-fade-up p-5">
        <ForkTree
          parent={parent ? node(parent, { badge: 'Original', badgeStyle: 'bg-brand-100 text-brand-700' }) : null}
          current={{ id: skill.id, title: skill.title, category: skill.category, meta: `This skill · v${skill.version}`, stat: skill.forksTotal }}
          children={children}
        />
      </Card>
    </section>
  )
}

// ─── Versions tab: timeline ──────────────────────────────────────────────────
function VersionsTab({ skill }) {
  const navigate = useNavigate()
  const toast = useToast()
  const items = skill.versions.map((v) => ({ ...v, byName: userById(v.by).name }))
  return (
    <div className="animate-fade-up">
      <VersionTimeline
        items={items}
        renderActions={(item) => (
          <>
            <Button variant="outline" size="sm" onClick={() => navigate(`/app/published/${skill.id}/v/${item.v}`)}>
              <Eye size={14} /> View
            </Button>
            <Button variant="secondary" size="sm" onClick={() => { toast(`Copy created from v${item.v}`); navigate('/app/drafts?tab=forked') }}>
              <Download size={14} /> Get this version
            </Button>
          </>
        )}
      />
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
            <span className={cn('text-[11.5px] font-semibold tabular-nums', text.length > MAX * 0.9 ? 'text-brand-600' : 'text-neutral-300')}>
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
          <div className="h-40 overflow-y-auto rounded-xl bg-neutral-100/70 p-3.5 text-[13px] leading-relaxed text-neutral-600 ring-1 ring-neutral-200 ring-inset">
            {block?.content}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">Your version</p>
          <Textarea
            className="h-40 bg-brand-50/50 ring-brand-100"
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
      <Skeleton className="h-72 rounded-3xl" />
      <Skeleton className="h-10 w-56 rounded-xl" />
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}
      </div>
      {Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
    </div>
  )
}
