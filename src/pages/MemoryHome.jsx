import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Brain, Check, FileUp, Globe, Loader2, Lock, Mic, PenLine, Plus,
  Shield, Sparkles, User, X,
} from 'lucide-react'
import { memorySections, portraitSuggestions } from '../data/mock'
import { cn } from '../lib/utils'
import { Button, Card, Input, SectionHeading, Skeleton, StateGate, Tabs, Textarea, EmptyState } from '../components/ui'
import { useToast } from '../context/AppContext'

const ICONS = { user: User, mic: Mic, shield: Shield, globe: Globe }

export default function MemoryHome() {
  const [tab, setTab] = useState('portrait')

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="animate-fade-up flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[26px] font-bold tracking-tight text-neutral-900">Your Memory</h1>
          <p className="mt-1 max-w-lg text-sm leading-relaxed text-neutral-500">
            What the AI knows about you — reviewed by you, always. It grows gently; nothing is added without your yes.
          </p>
        </div>
        <Link to="/app/memory/onboarding" className="text-[13px] font-bold text-brand-600 hover:text-brand-700">
          Redo onboarding
        </Link>
      </div>

      <Tabs
        className="w-fit"
        tabs={[
          { id: 'portrait', label: 'Portrait', count: portraitSuggestions.length },
          { id: 'editor', label: 'Profile editor' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'portrait' ? <PortraitView /> : <EditorView />}
    </div>
  )
}

// ─── Portrait: suggestion cards that grow over time ─────────────────────────
function PortraitView() {
  const toast = useToast()
  const [cards, setCards] = useState(portraitSuggestions)
  const [tweaking, setTweaking] = useState(null)
  const [tweakText, setTweakText] = useState('')
  const [manualText, setManualText] = useState('')
  const [reading, setReading] = useState(false)
  const fileRef = useRef(null)

  const resolve = (id, message) => {
    setCards((cs) => cs.filter((c) => c.id !== id))
    toast(message)
  }

  const onDrop = () => {
    setReading(true)
    setTimeout(() => {
      setReading(false)
      setCards((cs) => [
        ...cs,
        { id: `doc_${cs.length}`, text: 'From your document: you lead the weekly demo on Thursdays and prefer agendas sent a day ahead.', source: 'From “team-handbook.pdf”', sensitive: false },
      ])
      toast('Document read — 1 new suggestion')
    }, 1400)
  }

  return (
    <StateGate
      loading={<div className="space-y-3">{Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>}
      empty={<AllCaughtUpCard />}
    >
      <div className="space-y-6">
        {/* Add manually */}
        <Card className="p-4.5">
          <p className="mb-2.5 flex items-center gap-1.5 text-[13px] font-bold text-neutral-800">
            <PenLine size={14} className="text-brand-500" /> Tell me something about you
          </p>
          <div className="flex gap-2.5">
            <Input
              placeholder="e.g. “I never schedule meetings before 10am”"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && manualText.trim()) {
                  setManualText('')
                  toast('Added to your profile ✓')
                }
              }}
            />
            <Button
              size="md"
              variant="secondary"
              disabled={!manualText.trim()}
              onClick={() => { setManualText(''); toast('Added to your profile ✓') }}
            >
              <Plus size={15} /> Add
            </Button>
          </div>
          <button
            onClick={() => (reading ? null : onDrop())}
            className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-200 py-3.5 text-[13px] font-semibold text-neutral-400 transition-all hover:border-brand-300 hover:text-brand-600"
          >
            {reading ? (
              <><Loader2 size={15} className="animate-spin" /> Reading your document…</>
            ) : (
              <><FileUp size={15} /> Or drop in a document — I’ll read it and propose facts</>
            )}
          </button>
          <input ref={fileRef} type="file" className="hidden" aria-hidden />
        </Card>

        {/* Suggestion cards */}
        {cards.length === 0 ? (
          <AllCaughtUpCard />
        ) : (
          <div className="space-y-3">
            <p className="text-[12px] font-bold tracking-widest text-neutral-400 uppercase">New things I think I’ve learned</p>
            {cards.map((c, i) => (
              <Card key={c.id} className={cn('animate-fade-up p-5', c.sensitive && 'ring-amber-200')} style={{ animationDelay: `${i * 60}ms` }}>
                {c.sensitive && (
                  <p className="mb-2.5 flex w-fit items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11.5px] font-bold text-amber-700">
                    <Lock size={11} /> Personal — needs your deliberate yes, never added in bulk
                  </p>
                )}
                <p className="mb-1 text-[14px] leading-relaxed text-neutral-800">{c.text}</p>
                <p className="mb-4 text-[11.5px] text-neutral-400">{c.source}</p>

                {tweaking === c.id ? (
                  <div className="animate-fade-in space-y-2.5">
                    <Textarea rows={2} value={tweakText} onChange={(e) => setTweakText(e.target.value)} autoFocus />
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setTweaking(null)}>Cancel</Button>
                      <Button size="sm" disabled={!tweakText.trim()} onClick={() => { setTweaking(null); resolve(c.id, 'Saved your version ✓') }}>
                        Save my version
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" onClick={() => resolve(c.id, 'Added to your Memory ✓')}>
                      <Check size={14} /> Yes, that’s me
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => resolve(c.id, 'Okay — forgotten')}>
                      <X size={14} /> Not quite
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setTweaking(c.id); setTweakText(c.text) }}>
                      <PenLine size={14} /> Tweak it
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </StateGate>
  )
}

function AllCaughtUpCard() {
  return (
    <EmptyState
      icon={Sparkles}
      title="All caught up"
      body="Nothing new to review. Your portrait grows quietly as you work — new facts will appear here when there’s something worth asking about."
    />
  )
}

// ─── Question-based profile editor ───────────────────────────────────────────
function EditorView() {
  const toast = useToast()
  const [savedAt, setSavedAt] = useState(null)

  return (
    <StateGate
      loading={<div className="space-y-3">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}</div>}
      empty={
        <EmptyState
          icon={Brain}
          title="Your profile is empty"
          body="Run the two-minute onboarding and your Memory will write its own first draft."
          action={<Link to="/app/memory/onboarding"><Button>Start onboarding</Button></Link>}
        />
      }
    >
      <div className="space-y-5">
        <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-neutral-400">
          {savedAt ? <><Check size={13} className="text-emerald-500" /> Saved automatically</> : 'Everything here saves automatically as you type.'}
        </p>
        {memorySections.map((section, i) => {
          const Icon = ICONS[section.icon] || User
          return (
            <Card key={section.id} className="animate-fade-up p-5" style={{ animationDelay: `${i * 60}ms` }}>
              <SectionHeading
                title={section.title}
                className="mb-4"
                right={<span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600"><Icon size={17} /></span>}
              />
              <div className="space-y-4">
                {section.entries.map((entry) => (
                  <div key={entry.id}>
                    <p className="mb-1.5 text-[13px] font-semibold text-neutral-700">{entry.q}</p>
                    <Textarea
                      rows={2}
                      defaultValue={entry.a}
                      onChange={() => { setSavedAt(true) }}
                      onBlur={() => toast('Saved', 'info')}
                      className="ring-transparent hover:ring-neutral-200"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )
        })}
      </div>
    </StateGate>
  )
}
