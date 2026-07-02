import { Link, useParams } from 'react-router-dom'
import { ArrowRight, GitFork } from 'lucide-react'
import { skillById, userById } from '../data/mock'
import { Avatar, Badge, Button } from '../components/ui'
import Logo from '../components/Logo'
import { BlockList, SignalRow } from '../components/skills'
import NotFound from './NotFound'

/** Public, live view of a single skill for people who aren't signed in. */
export default function SharePage() {
  const { id } = useParams()
  const skill = skillById(id)
  if (!skill) return <NotFound />
  const creator = userById(skill.creatorId)

  return (
    <div className="min-h-screen bg-canvas">
      <header className="glass sticky top-0 z-30 border-b border-neutral-200/60">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5">
          <Link to="/" className="flex items-center">
            <Logo className="text-2xl" />
          </Link>
          <div className="flex items-center gap-2.5">
            <Link to="/signin" className="text-[13px] font-semibold text-neutral-500 hover:text-neutral-900">Sign in</Link>
            <Link to="/signup"><Button size="sm">Get started</Button></Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-7 px-5 py-12">
        <div className="animate-fade-up">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="brand">{skill.category}</Badge>
            <Badge variant="outline">v{skill.version}</Badge>
          </div>
          <h1 className="font-display mb-2 text-3xl font-bold tracking-tight text-neutral-900">{skill.title}</h1>
          <p className="mb-5 max-w-xl text-[15px] leading-relaxed text-neutral-500">{skill.tagline}</p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="flex items-center gap-2.5">
              <Avatar name={creator.name} size={36} />
              <span>
                <span className="block text-[13.5px] font-bold text-neutral-900">{creator.name}</span>
                <span className="block text-[12px] text-neutral-400">{creator.role}</span>
              </span>
            </span>
            <SignalRow skill={skill} size={15} />
          </div>
        </div>

        <BlockList blocks={skill.blocks} />

        {/* Invitation to make a copy */}
        <div className="animate-fade-up relative overflow-hidden rounded-3xl bg-ink-950 p-8 text-center text-white ring-1 ring-white/10 ring-inset">
          <div className="absolute -top-10 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-brand-600/30 blur-[60px]" />
          <div className="relative">
            <GitFork size={26} className="mx-auto mb-3 text-brand-300" />
            <h2 className="font-display mb-2 text-xl font-bold">Like it? Make it yours.</h2>
            <p className="mx-auto mb-6 max-w-sm text-[13.5px] leading-relaxed text-zinc-400">
              Create a free account, fork this skill, and tune it to your own voice and rules in minutes.
            </p>
            <Link to="/signup">
              <Button size="lg">Make your own copy <ArrowRight size={16} /></Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
