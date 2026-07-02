import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FolderOpen, GitFork, PenLine, Plus, Store } from 'lucide-react'
import { drafts } from '../data/mock'
import { pluralize, timeAgo } from '../lib/utils'
import { Badge, Button, Card, EmptyState, Skeleton, StateGate, Tabs } from '../components/ui'

export default function Drafts() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') || 'created'
  const list = tab === 'created' ? drafts.created : drafts.forked

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="animate-fade-up">
        <h1 className="font-display text-[26px] font-bold tracking-tight text-neutral-900">Drafts</h1>
        <p className="mt-1 text-sm text-neutral-500">Your works in progress — private until you publish.</p>
      </div>

      <Tabs
        className="w-fit"
        tabs={[
          { id: 'created', label: 'Created by you', count: drafts.created.length },
          { id: 'forked', label: 'Forked', count: drafts.forked.length },
        ]}
        active={tab}
        onChange={(t) => setParams(t === 'created' ? {} : { tab: t })}
      />

      <p className="text-[12.5px] text-neutral-400">
        {tab === 'created'
          ? 'Skills you started from scratch. Only you can see them.'
          : 'Copies of other people’s skills that you’re customizing. The originals stay untouched.'}
      </p>

      <StateGate
        loading={
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-[88px] rounded-2xl" />)}
          </div>
        }
        empty={<DraftsEmpty tab={tab} navigate={navigate} />}
      >
        {list.length === 0 ? (
          <DraftsEmpty tab={tab} navigate={navigate} />
        ) : (
          <div className="space-y-3">
            {/* Intentionally simple cards — no buttons; click opens the manage page. */}
            {list.map((d, i) => (
              <Link key={d.id} to={`/app/drafts/${d.id}`} className="block animate-fade-up rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600" style={{ animationDelay: `${i * 60}ms` }}>
                <Card hover className="flex items-center gap-4 p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                    {tab === 'created' ? <PenLine size={19} /> : <GitFork size={19} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="mb-0.5 flex flex-wrap items-center gap-2">
                      <span className="text-[15px] font-bold text-neutral-900">{d.title}</span>
                      <Badge variant="brand">{d.category}</Badge>
                    </span>
                    <span className="block text-[12.5px] text-neutral-400">
                      {pluralize(d.edits, 'edit')} · last touched {timeAgo(d.lastTouched)}
                      {d.basedOn && <> · based on <span className="font-semibold text-neutral-500">{d.basedOn.title}</span></>}
                    </span>
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </StateGate>
    </div>
  )
}

function DraftsEmpty({ tab, navigate }) {
  return tab === 'created' ? (
    <EmptyState
      icon={FolderOpen}
      title="No drafts yet"
      body="Hit “Create skill” and start one from scratch — it saves automatically as you type."
      action={<Button onClick={() => navigate('/app/builder/new')}><Plus size={15} /> Create skill</Button>}
    />
  ) : (
    <EmptyState
      icon={GitFork}
      title="Nothing forked yet"
      body="Open any marketplace skill and hit “Make it yours” — your customizable copy will land here."
      action={<Button variant="secondary" onClick={() => navigate('/app/marketplace')}><Store size={15} /> Browse the marketplace</Button>}
    />
  )
}
