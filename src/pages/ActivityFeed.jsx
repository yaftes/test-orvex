import { Link } from 'react-router-dom'
import { UsersRound } from 'lucide-react'
import { activity, skillById, userById } from '../data/mock'
import { Button, EmptyState, Skeleton, StateGate } from '../components/ui'
import { ActivityItem } from '../components/skills'

export default function ActivityFeed() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="animate-fade-up">
        <h1 className="font-display text-[26px] font-bold tracking-tight text-neutral-900">Activity</h1>
        <p className="mt-1 text-sm text-neutral-500">The latest releases from creators you follow, newest first.</p>
      </div>

      <StateGate
        loading={<div className="space-y-2.5">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-[74px] rounded-2xl" />)}</div>}
        empty={<FeedEmpty />}
      >
        {activity.length === 0 ? (
          <FeedEmpty />
        ) : (
          <div className="space-y-2.5">
            {activity.map((a, i) => {
              const skill = skillById(a.skillId)
              if (!skill) return null
              return (
                <div key={a.id} className="animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <ActivityItem entry={a} skill={skill} creator={userById(a.userId)} />
                </div>
              )
            })}
            <p className="pt-4 pb-2 text-center text-[12.5px] text-neutral-400">That’s everything from the last few weeks.</p>
          </div>
        )}
      </StateGate>
    </div>
  )
}

function FeedEmpty() {
  return (
    <EmptyState
      icon={UsersRound}
      title="Your feed is quiet"
      body="Follow a few more creators and their new skills will show up here the moment they publish."
      action={<Link to="/app/following"><Button variant="secondary">Find people to follow</Button></Link>}
    />
  )
}
