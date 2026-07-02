import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Check, Copy, FileOutput, Sparkles } from 'lucide-react'
import { buildPromptText, skillById } from '../data/mock'
import { copyText } from '../lib/utils'
import { Badge, Button, Card } from '../components/ui'
import { useToast } from '../context/AppContext'
import NotFound from './NotFound'

// Deep links into the major assistants — intentionally assistant-agnostic order.
const ASSISTANTS = [
  { name: 'Claude', href: (p) => `https://claude.ai/new?q=${encodeURIComponent(p)}`, mark: 'C', tint: 'bg-neutral-100 text-neutral-700' },
  { name: 'ChatGPT', href: (p) => `https://chatgpt.com/?q=${encodeURIComponent(p)}`, mark: 'G', tint: 'bg-neutral-100 text-neutral-700' },
  { name: 'Gemini', href: (p) => `https://gemini.google.com/app?q=${encodeURIComponent(p)}`, mark: 'G', tint: 'bg-neutral-100 text-neutral-700' },
  { name: 'Grok', href: (p) => `https://grok.com/?q=${encodeURIComponent(p)}`, mark: 'X', tint: 'bg-neutral-100 text-neutral-700' },
]

export default function UseIt() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const skill = skillById(id)
  const [copied, setCopied] = useState(false)
  if (!skill) return <NotFound />

  const prompt = buildPromptText(skill)

  const onCopy = async () => {
    await copyText(prompt)
    setCopied(true)
    toast('Prompt copied — paste it into any assistant 📋')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <button onClick={() => navigate(-1)} className="flex cursor-pointer items-center gap-1.5 text-[13px] font-bold text-neutral-400 transition-colors hover:text-neutral-700">
        <ArrowLeft size={15} /> Back to skill
      </button>

      <div className="animate-fade-up text-center">
        <span className="mb-4 inline-grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-400 text-white shadow-glow">
          <Sparkles size={26} />
        </span>
        <h1 className="font-display mb-1 text-2xl font-bold tracking-tight text-neutral-900">{skill.title}</h1>
        <p className="text-sm text-neutral-500">Ready to use. Copy it, or open it straight in your assistant.</p>
        <Badge variant="outline" className="mt-2">v{skill.version}</Badge>
      </div>

      {/* The prompt, front and center */}
      <Card className="animate-fade-up relative overflow-hidden" style={{ animationDelay: '80ms' }}>
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
          <span className="text-[12px] font-bold tracking-wider text-neutral-400 uppercase">The prompt</span>
          <Button size="sm" variant={copied ? 'secondary' : 'primary'} onClick={onCopy}>
            {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
          </Button>
        </div>
        <pre className="max-h-[420px] overflow-y-auto p-5 text-[13px] leading-relaxed whitespace-pre-wrap text-neutral-700">
          {prompt}
        </pre>
      </Card>

      {/* Deep links */}
      <div className="animate-fade-up" style={{ animationDelay: '160ms' }}>
        <p className="mb-3 text-center text-[12px] font-bold tracking-wider text-neutral-400 uppercase">Open directly in</p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {ASSISTANTS.map((a) => (
            <a
              key={a.name}
              href={a.href(prompt)}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center gap-2 rounded-2xl bg-surface p-4 ring-1 ring-neutral-200/80 ring-inset transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift hover:ring-brand-200"
            >
              <span className={`grid h-10 w-10 place-items-center rounded-xl text-[15px] font-black ${a.tint}`}>{a.mark}</span>
              <span className="flex items-center gap-1 text-[13px] font-bold text-neutral-800">
                {a.name} <ArrowUpRight size={12} className="text-neutral-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-500" />
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link to={`/app/skills/${skill.id}/export`} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-brand-600 transition-colors hover:text-brand-700">
          <FileOutput size={14} /> Need a specific format? Export it
        </Link>
      </div>
    </div>
  )
}
