import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Copy } from 'lucide-react'
import { buildExport, skillById } from '../data/mock'
import { copyText, cn } from '../lib/utils'
import { Button, Card } from '../components/ui'
import { useToast } from '../context/AppContext'
import NotFound from './NotFound'

const FORMATS = [
  { id: 'claude', name: 'Claude-shaped', desc: 'Structured tags Claude reads natively — ideal for Projects and custom instructions.' },
  { id: 'chatgpt', name: 'ChatGPT-shaped', desc: 'Markdown custom-instructions block, ready for GPT setup or a system prompt.' },
  { id: 'plain', name: 'Plain text', desc: 'A clean universal version that works pasted anywhere.' },
]

export default function ExportPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const skill = skillById(id)
  const [format, setFormat] = useState('claude')
  const [copied, setCopied] = useState(false)
  if (!skill) return <NotFound />

  const output = buildExport(skill, format)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button onClick={() => navigate(-1)} className="flex cursor-pointer items-center gap-1.5 text-[13px] font-bold text-neutral-400 transition-colors hover:text-neutral-700">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="animate-fade-up">
        <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">Export “{skill.title}”</h1>
        <p className="mt-1 text-sm text-neutral-500">Pick a shape. The content is identical — only the packaging changes.</p>
      </div>

      {/* Format choice */}
      <div className="grid gap-3 sm:grid-cols-3">
        {FORMATS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFormat(f.id)}
            aria-pressed={format === f.id}
            className={cn(
              'cursor-pointer rounded-2xl p-4.5 text-left ring-1 ring-inset transition-all duration-200',
              format === f.id ? 'bg-brand-50 ring-2 ring-brand-500' : 'bg-surface ring-neutral-200 hover:ring-neutral-300',
            )}
          >
            <p className={cn('mb-1 flex items-center justify-between text-[14px] font-bold', format === f.id ? 'text-brand-700' : 'text-neutral-900')}>
              {f.name}
              {format === f.id && <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-600 text-white"><Check size={11} strokeWidth={3} /></span>}
            </p>
            <p className="text-[12px] leading-relaxed text-neutral-500">{f.desc}</p>
          </button>
        ))}
      </div>

      {/* Output */}
      <Card className="animate-fade-up overflow-hidden">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
          <span className="text-[12px] font-bold tracking-wider text-neutral-400 uppercase">
            {FORMATS.find((f) => f.id === format).name} · v{skill.version}
          </span>
          <Button
            size="sm"
            variant={copied ? 'secondary' : 'primary'}
            onClick={async () => { await copyText(output); setCopied(true); toast('Export copied 📋'); setTimeout(() => setCopied(false), 2000) }}
          >
            {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
          </Button>
        </div>
        <pre className="max-h-[480px] overflow-y-auto bg-ink-950 p-5 text-[12.5px] leading-relaxed whitespace-pre-wrap text-zinc-200">
          {output}
        </pre>
      </Card>
    </div>
  )
}
