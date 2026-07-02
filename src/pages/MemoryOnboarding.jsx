import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Brain, Check, Loader2, Sparkles, Wand2 } from 'lucide-react'
import { skillById, starterSkills } from '../data/mock'
import { cn } from '../lib/utils'
import { Button, Card, Textarea } from '../components/ui'
import { SkillCard } from '../components/skills'

const EXAMPLES = [
  '“I’m a high-school biology teacher in the UK”',
  '“I run a startup and write investor updates”',
  '“I’m a broker who lists 10 homes a month”',
]

// The guided form "builds itself": sections appear one by one, pre-filled
// from what the user wrote, and each can be edited before continuing.
const BUILT_SECTIONS = [
  { id: 'who', title: 'Who you are', fill: 'Product engineer building a prompt marketplace. Ships full-stack features end to end.' },
  { id: 'audience', title: 'Who you write for', fill: 'A small product team — engineers, a designer, and a founder who likes numbers first.' },
  { id: 'voice', title: 'How you sound', fill: 'Direct and warm. Short sentences. Clear over impressive.' },
  { id: 'rules', title: 'Your standing rules', fill: 'Answer first, reasoning second. Say “I’m not sure” instead of guessing. Metric units.' },
]

export default function MemoryOnboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0) // 0 intro → 1 building → 2 starters
  const [description, setDescription] = useState('')
  const [builtCount, setBuiltCount] = useState(0)
  const [building, setBuilding] = useState(false)
  const timerRef = useRef(null)

  // Simulate sections appearing as the system "understands" the description.
  useEffect(() => {
    if (step !== 1) return
    setBuilding(true)
    let i = 0
    const tick = () => {
      i += 1
      setBuiltCount(i)
      if (i < BUILT_SECTIONS.length) {
        timerRef.current = setTimeout(tick, 950)
      } else {
        setBuilding(false)
      }
    }
    timerRef.current = setTimeout(tick, 950)
    return () => clearTimeout(timerRef.current)
  }, [step])

  return (
    <div className="mx-auto max-w-2xl">
      {step === 0 && (
        <div className="animate-fade-up space-y-7 pt-6 text-center">
          <span className="inline-grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-brand-600 to-brand-400 text-white shadow-glow">
            <Brain size={30} />
          </span>
          <div>
            <h1 className="font-display mb-3 text-3xl font-bold tracking-tight text-neutral-900">
              Let’s build your Memory
            </h1>
            <p className="mx-auto max-w-md text-[15px] leading-relaxed text-neutral-500">
              Describe what you do, in your own words. Your Memory makes every AI you use sound like <em>you</em> — and it keeps growing over time.
            </p>
          </div>

          <div className="text-left">
            <Textarea
              rows={4}
              autoFocus
              placeholder="I’m a…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-[15px]"
              aria-label="Describe what you do"
            />
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setDescription(ex.replaceAll('“', '').replaceAll('”', ''))}
                  className="cursor-pointer rounded-full bg-neutral-100 px-3.5 py-1.5 text-[12.5px] font-medium text-neutral-500 transition-all hover:bg-brand-50 hover:text-brand-700"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <Button size="lg" disabled={!description.trim()} onClick={() => setStep(1)}>
            <Wand2 size={17} /> Build my Memory
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5 pt-4">
          <div className="animate-fade-up text-center">
            <h1 className="font-display mb-2 text-2xl font-bold tracking-tight text-neutral-900">
              {building ? 'Building your profile…' : 'Here’s your starting Memory'}
            </h1>
            <p className="text-sm text-neutral-500">
              {building ? 'Sections appear as we understand what you told us. Edit anything.' : 'Everything is editable — this is a first draft of you.'}
            </p>
          </div>

          <div className="space-y-3">
            {BUILT_SECTIONS.slice(0, builtCount).map((s, i) => (
              <Card key={s.id} className="animate-fade-up p-5" style={{ animationDelay: '60ms' }}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-100 text-brand-600">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  <p className="text-[13.5px] font-bold text-neutral-900">{s.title}</p>
                </div>
                <Textarea rows={2} defaultValue={s.fill} className="ring-transparent hover:ring-neutral-200" />
              </Card>
            ))}
            {building && (
              <Card className="flex items-center gap-3 p-5 text-neutral-400">
                <Loader2 size={17} className="animate-spin text-brand-500" />
                <span className="text-[13.5px] font-medium">
                  {builtCount < BUILT_SECTIONS.length ? `Working out “${BUILT_SECTIONS[builtCount].title.toLowerCase()}”…` : 'Almost there…'}
                </span>
              </Card>
            )}
          </div>

          {!building && (
            <div className="animate-fade-up flex justify-center pt-2">
              <Button size="lg" onClick={() => setStep(2)}>
                Looks like me <ArrowRight size={17} />
              </Button>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 pt-4">
          <div className="animate-fade-up text-center">
            <span className="mb-4 inline-grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-400 text-white shadow-glow">
              <Sparkles size={24} />
            </span>
            <h1 className="font-display mb-2 text-2xl font-bold tracking-tight text-neutral-900">
              Skills picked for you
            </h1>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-neutral-500">
              Based on your Memory, these are a strong place to start. Every one of them will already sound like you.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {starterSkills.map((id) => {
              const s = skillById(id)
              return s ? <SkillCard key={id} skill={s} /> : null
            })}
          </div>

          <div className="flex flex-col items-center gap-3 pt-2">
            <Button size="lg" onClick={() => navigate('/app/memory')}>
              Go to your Memory <ArrowRight size={17} />
            </Button>
            <Link to="/app/marketplace" className="text-[13px] font-semibold text-neutral-400 transition-colors hover:text-brand-600">
              or browse the whole marketplace
            </Link>
          </div>
        </div>
      )}

      {/* step dots */}
      <div className="mt-10 flex justify-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className={cn('h-1.5 rounded-full transition-all duration-300', i === step ? 'w-6 bg-brand-600' : 'w-1.5 bg-neutral-200')} />
        ))}
      </div>
    </div>
  )
}
