import { Link } from 'react-router-dom'
import {
  Archive, ArrowRight, Bookmark, FolderOpen, GitFork, Inbox, Store,
  UserRoundCheck, UsersRound, Sparkles,
} from 'lucide-react'
import {
  activity, currentUser, drafts, followingIds, myPublished, skillById,
  suggestions, userById, allSkills,
} from '../data/mock'
import { Avatar, Button, Card, EmptyState, SectionHeading, Skeleton, StateGate } from '../components/ui'
import { ActivityItem } from '../components/skills'

const savedCount = allSkills.filter((s) => s.savedByMe).length

const STATS = [
  { label: 'Following', value: followingIds.length, icon: UserRoundCheck, to: '/app/following' },
  { label: 'Published', value: myPublished.length, icon: Archive, to: '/app/published' },
  { label: 'Drafts', value: drafts.created.length, icon: FolderOpen, to: '/app/drafts?tab=created' },
  { label: 'Forked', value: drafts.forked.length, icon: GitFork, to: '/app/drafts?tab=forked' },
  { label: 'Saves', value: savedCount, icon: Bookmark, to: '/app/marketplace' },
]

const QUICK_LINKS = [
  { label: 'Drafts', count: drafts.created.length + drafts.forked.length, to: '/app/drafts', icon: FolderOpen },
  { label: 'Published', count: myPublished.length, to: '/app/published', icon: Archive },
  { label: 'Saved', count: savedCount, to: '/app/marketplace', icon: Bookmark },
  { label: 'Review', count: suggestions.length, to: '/app/review', icon: Inbox },
]

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-9 w-72" />
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-[74px] rounded-2xl" />)}
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const firstName = currentUser.name.split(' ')[0]
  const following = followingIds.map(userById)

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
      <div className="space-y-9">
        {/* Greeting */}
        <div className="animate-fade-up flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-[26px] font-bold tracking-tight text-neutral-900">
              Welcome back, {firstName} <span className="align-middle">👋</span>
            </h1>
            <p className="mt-1 text-sm text-neutral-500">Here’s what’s new in your corner of Orvex.</p>
          </div>
          <Link to="/app/marketplace">
            <Button variant="secondary"><Store size={16} /> Jump into the marketplace</Button>
          </Link>
        </div>

        {/* Stat row — every count is real; 0 shows honestly */}
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
          {STATS.map((s, i) => (
            <Link key={s.label} to={s.to} className="animate-fade-up rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600" style={{ animationDelay: `${i * 60}ms` }}>
              <Card hover className="p-4.5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-600"><s.icon size={16} /></span>
                  <ArrowRight size={14} className="text-neutral-300" />
                </div>
                <p className="font-display text-2xl font-bold text-neutral-900">{s.value}</p>
                <p className="text-[12.5px] font-medium text-neutral-400">{s.label}</p>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent activity */}
          <section className="lg:col-span-2">
            <SectionHeading
              title="Recent activity"
              sub="The latest from creators you follow"
              right={<Link to="/app/activity" className="text-[13px] font-bold text-brand-600 hover:text-brand-700">View all</Link>}
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
                {activity.slice(0, 5).map((a) => {
                  const skill = skillById(a.skillId)
                  return skill ? <ActivityItem key={a.id} entry={a} skill={skill} creator={userById(a.userId)} /> : null
                })}
              </div>
            )}
          </section>

          {/* Right rail */}
          <div className="space-y-8">
            {/* People you follow */}
            <section>
              <SectionHeading
                title="People you follow"
                right={<Link to="/app/following" className="text-[13px] font-bold text-brand-600 hover:text-brand-700">See all</Link>}
              />
              {following.length === 0 ? (
                <EmptyState icon={UsersRound} title="No one yet" body="Following creators fills your feed with skills tuned to your work." action={<Link to="/app/marketplace"><Button variant="secondary" size="sm">Discover creators</Button></Link>} />
              ) : (
                <Card className="divide-y divide-neutral-100 p-2">
                  {following.slice(0, 5).map((u) => (
                    <Link key={u.id} to={`/app/authors/${u.handle}`} className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-neutral-50">
                      <Avatar name={u.name} size={36} />
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

            {/* Quick links */}
            <section>
              <SectionHeading title="Your stuff" />
              <div className="grid grid-cols-2 gap-2.5">
                {QUICK_LINKS.map((q) => (
                  <Link key={q.label} to={q.to} className="rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600">
                    <Card hover className="flex items-center gap-3 p-3.5">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-neutral-100 text-neutral-500"><q.icon size={16} /></span>
                      <span>
                        <span className="block text-[13.5px] font-bold text-neutral-900">{q.label}</span>
                        <span className="block text-[12px] text-neutral-400">{q.count} item{q.count === 1 ? '' : 's'}</span>
                      </span>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </StateGate>
  )
}
