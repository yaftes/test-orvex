import { Link } from 'react-router-dom'
import {
  Archive, ArrowRight, ArrowUpRight, Bookmark, FolderOpen, GitFork, Inbox,
  Network, Plus, Store, TrendingUp, UserRoundCheck, UsersRound, Sparkles,
} from 'lucide-react'
import {
  activity, currentUser, drafts, followingIds, myPublished, seriesFor,
  skillById, suggestions, userById, allSkills,
} from '../data/mock'
import { Avatar, Button, Card, EmptyState, SectionHeading, Skeleton, StateGate } from '../components/ui'
import { ActivityItem } from '../components/skills'
import { ForkTree, Sparkline, TrendChart, WeekBars } from '../components/viz'
import { cn, compact } from '../lib/utils'

const INK = 'var(--color-neutral-900)'
const MUTED = 'var(--color-neutral-300)'

const savedCount = allSkills.filter((s) => s.savedByMe).length

const STATS = [
  { label: 'Following', value: followingIds.length, icon: UserRoundCheck, to: '/app/following', series: 'me:following' },
  { label: 'Published', value: myPublished.length, icon: Archive, to: '/app/published', series: 'me:published' },
  { label: 'Drafts', value: drafts.created.length, icon: FolderOpen, to: '/app/drafts?tab=created', series: 'me:drafts' },
  { label: 'Forked', value: drafts.forked.length, icon: GitFork, to: '/app/drafts?tab=forked', series: 'me:forked' },
  { label: 'Saves', value: savedCount, icon: Bookmark, to: '/app/marketplace', series: 'me:saves' },
]

function greeting() {
  const h = new Date().getHours()
  if (h < 5) return 'Up late'
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function QuietLink({ to, children }) {
  return (
    <Link to={to} className="group flex items-center gap-1 text-[13px] font-semibold text-neutral-500 transition-colors hover:text-neutral-900">
      {children} <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-20 rounded-2xl" />
      <div className="grid grid-cols-12 gap-4">
        <Skeleton className="col-span-12 h-56 rounded-2xl lg:col-span-8" />
        <Skeleton className="col-span-12 h-56 rounded-2xl lg:col-span-4" />
      </div>
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <Skeleton className="h-96 rounded-2xl lg:col-span-7" />
        <Skeleton className="h-96 rounded-2xl lg:col-span-5" />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const firstName = currentUser.name.split(' ')[0]
  const following = followingIds.map(userById)
  const newFromFollowed = activity.length

  // momentum, derived honestly from the (mock) analytics series
  const momentum = seriesFor('me:activity', 12)
  const total = Math.round(momentum.reduce((a, b) => a + b, 0))
  const thisWeek = Math.round(momentum[momentum.length - 1])
  const lastWeek = Math.round(momentum[momentum.length - 2]) || 1
  const delta = Math.round(((thisWeek - lastWeek) / lastWeek) * 100)

  // a lineage the user is part of: the original they forked + its family
  const listingPro = skillById('sk_listing-pro')
  const luxury = skillById('sk_listing-luxury')
  const myRentalDraft = drafts.forked.find((d) => d.basedOn?.id === 'sk_listing-pro')

  return (
    <StateGate
      loading={<DashboardSkeleton />}
      empty={
        <EmptyState
          icon={Sparkles}
          title={`Welcome, ${firstName}`}
          body="Your home base is quiet so far. Browse the marketplace, star a few skills, and follow some creators — their new releases will show up right here."
          action={<Link to="/app/marketplace"><Button><Store size={16} /> Explore the marketplace</Button></Link>}
        />
      }
    >
      <div className="space-y-8">
        {/* ─── Quiet header ─── */}
        <div className="animate-fade-up flex flex-wrap items-end justify-between gap-5 border-b border-neutral-200 pb-6">
          <div>
            <p className="mb-2 text-[11px] font-bold tracking-[0.22em] text-neutral-400 uppercase">Home</p>
            <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900">
              {greeting()}, {firstName}.
            </h1>
            <p className="mt-1.5 text-sm text-neutral-500">
              {newFromFollowed > 0
                ? `${newFromFollowed} new release${newFromFollowed === 1 ? '' : 's'} from creators you follow since your last visit.`
                : 'All quiet from the people you follow — a good day to build something of your own.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link to="/app/marketplace">
              <Button variant="outline" size="sm"><Store size={14} /> Marketplace</Button>
            </Link>
            <Link to="/app/builder/new">
              <Button size="sm"><Plus size={14} /> Create skill</Button>
            </Link>
          </div>
        </div>

        {/* ─── Bento: momentum + this week ─── */}
        <div className="grid grid-cols-12 gap-4">
          <Card className="animate-fade-up col-span-12 p-6 lg:col-span-8">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.18em] text-neutral-400 uppercase">
                  <TrendingUp size={12} /> Your momentum · 12 weeks
                </p>
                <p className="font-display mt-1.5 text-4xl leading-none font-bold text-neutral-900">
                  {compact(total)}
                  <span className="ml-2 text-[13px] font-semibold text-neutral-400">actions across your skills</span>
                </p>
              </div>
              <span className={cn(
                'rounded-full px-3 py-1 text-[12px] font-bold',
                delta >= 0 ? 'bg-brand-500 text-ink-950' : 'bg-neutral-100 text-neutral-500',
              )}>
                {delta >= 0 ? '+' : ''}{delta}% vs last week
              </span>
            </div>
            <TrendChart data={momentum} height={148} color={INK} label="Your activity over the last 12 weeks" format={(v) => `${Math.round(v)} actions`} />
          </Card>

          <Card className="animate-fade-up col-span-12 flex flex-col p-6 lg:col-span-4" style={{ animationDelay: '70ms' }}>
            <p className="text-[11px] font-bold tracking-[0.18em] text-neutral-400 uppercase">This week</p>
            <p className="font-display mt-1.5 mb-4 text-4xl leading-none font-bold text-neutral-900">
              {thisWeek}
              <span className="ml-2 text-[13px] font-semibold text-neutral-400">actions</span>
            </p>
            <div className="mt-auto">
              <WeekBars data={momentum} height={110} color={MUTED} accentLast label="Actions per week, current week highlighted" format={(v) => `${Math.round(v)} actions`} />
              <p className="mt-2 text-right text-[10.5px] font-semibold text-neutral-400">
                <span className="mr-1 inline-block h-2 w-2 rounded-[2px] bg-brand-500 align-middle" aria-hidden /> now
              </p>
            </div>
          </Card>
        </div>

        {/* ─── Stat row — every count is real; 0 shows honestly ─── */}
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
          {STATS.map((s, i) => (
            <Link key={s.label} to={s.to} className="group animate-fade-up rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600" style={{ animationDelay: `${i * 50}ms` }}>
              <Card hover className="p-4.5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] text-neutral-400 uppercase">
                    <s.icon size={13} className="text-neutral-400" /> {s.label}
                  </span>
                  <ArrowRight size={13} className="text-neutral-300 transition-transform group-hover:translate-x-0.5 group-hover:text-neutral-900" />
                </div>
                <div className="flex items-end justify-between gap-2">
                  <p className="font-display text-3xl leading-none font-bold text-neutral-900">{s.value}</p>
                  {s.value > 0 && (
                    <Sparkline data={seriesFor(s.series, 8)} width={56} height={24} stroke={MUTED} accent="var(--color-brand-500)" className="shrink-0" />
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* ─── Recent activity, in mono ─── */}
          <section className="lg:col-span-7">
            <SectionHeading
              title="Recent activity"
              sub="The latest from creators you follow"
              right={<QuietLink to="/app/activity">View all</QuietLink>}
            />
            {activity.length === 0 ? (
              <EmptyState
                icon={UsersRound}
                title="Nothing here yet"
                body="Follow a few creators and their new skills will show up here."
                action={<Link to="/app/following"><Button variant="secondary" size="sm">Find people to follow</Button></Link>}
              />
            ) : (
              <div className="space-y-2.5">
                {activity.slice(0, 6).map((a) => {
                  const skill = skillById(a.skillId)
                  return skill ? <ActivityItem key={a.id} entry={a} skill={skill} creator={userById(a.userId)} /> : null
                })}
              </div>
            )}
          </section>

          {/* ─── Right rail ─── */}
          <div className="space-y-6 lg:col-span-5">
            {/* Lineage tree */}
            {listingPro && (
              <section>
                <SectionHeading
                  title="A lineage you're part of"
                  sub="The family around a skill you forked"
                  right={<span className="grid h-8 w-8 place-items-center rounded-lg bg-neutral-100 text-neutral-500"><Network size={15} /></span>}
                />
                <Card className="p-4.5">
                  <ForkTree
                    parent={null}
                    current={{
                      id: listingPro.id, title: listingPro.title, category: listingPro.category,
                      meta: `${userById(listingPro.creatorId).name} · v${listingPro.version} · ${compact(listingPro.stars)} stars`,
                      stat: listingPro.forksTotal, to: `/app/skills/${listingPro.id}`,
                    }}
                    children={[
                      ...(luxury ? [{
                        id: luxury.id, title: luxury.title, category: luxury.category,
                        meta: `${userById(luxury.creatorId).name} · v${luxury.version}`,
                        stat: luxury.forksTotal, to: `/app/skills/${luxury.id}`,
                        badge: 'Fork', badgeStyle: 'bg-neutral-100 text-neutral-500',
                      }] : []),
                      ...(myRentalDraft ? [{
                        id: myRentalDraft.id, title: myRentalDraft.title, category: myRentalDraft.category,
                        meta: `Your private draft · ${myRentalDraft.edits} edits`,
                        to: `/app/drafts/${myRentalDraft.id}`,
                        badge: 'Your copy', badgeStyle: 'bg-brand-500 text-ink-950',
                      }] : []),
                    ]}
                  />
                </Card>
              </section>
            )}

            {/* Review inbox */}
            <Link to="/app/review" className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600">
              <Card hover className="flex items-center gap-4 p-4.5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink-950 text-brand-500"><Inbox size={19} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-bold text-neutral-900">Review inbox</span>
                  <span className="block text-[12.5px] text-neutral-400">
                    {suggestions.length > 0 ? `${suggestions.length} suggestion${suggestions.length === 1 ? '' : 's'} waiting on your skills` : 'All caught up'}
                  </span>
                </span>
                {suggestions.length > 0 && (
                  <span className="font-display text-2xl font-bold text-neutral-900">{suggestions.length}</span>
                )}
                <ArrowUpRight size={16} className="shrink-0 text-neutral-300" />
              </Card>
            </Link>

            {/* People you follow */}
            <section>
              <SectionHeading
                title="People you follow"
                right={<QuietLink to="/app/following">See all</QuietLink>}
              />
              {following.length === 0 ? (
                <EmptyState icon={UsersRound} title="No one yet" body="Following creators fills your feed with skills tuned to your work." action={<Link to="/app/marketplace"><Button variant="secondary" size="sm">Discover creators</Button></Link>} />
              ) : (
                <Card className="divide-y divide-neutral-100 p-2">
                  {following.slice(0, 4).map((u) => (
                    <Link key={u.id} to={`/app/authors/${u.handle}`} className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-neutral-50">
                      <Avatar name={u.name} size={34} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-bold text-neutral-900">{u.name}</span>
                        <span className="block truncate text-[12px] text-neutral-400">{u.role}</span>
                      </span>
                      <span className="text-[12px] font-semibold text-neutral-400">{u.skillCount} skills</span>
                    </Link>
                  ))}
                </Card>
              )}
            </section>
          </div>
        </div>
      </div>
    </StateGate>
  )
}
