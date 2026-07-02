import { Link } from 'react-router-dom'
import {
  ArrowRight, Blocks, Bot, Brain, Eye, Moon, PenLine, Sparkles, Store,
  Sun, Users, Wand2, ChevronRight,
} from 'lucide-react'
import { skills } from '../data/mock'
import { SkillCard } from '../components/skills'
import { Button } from '../components/ui'
import { useTheme } from '../context/AppContext'

const BENEFITS = [
  { icon: Store, title: 'Ready-made skills for your job', body: 'Over a thousand skills across thousands of roles. Pick one, use it, done — no blank chat box.' },
  { icon: Eye, title: 'See what it does before you trust it', body: 'Every skill shows its pieces in plain language — the role, the rules, the guardrails. No black boxes.' },
  { icon: PenLine, title: 'Make it yours', body: 'Fork any skill and tune it to your voice, your rules, your edge cases. Your copy, your call.' },
  { icon: Bot, title: 'Works across every assistant', body: 'ChatGPT, Claude, Gemini, Grok — one skill, delivered wherever you actually work.' },
  { icon: Brain, title: 'AI that knows you', body: 'Your Memory travels with you, so every assistant sounds like you — not like a template.' },
  { icon: Users, title: 'One source for your whole team', body: 'Your team pulls from one shared library. No more "which prompt is the good one?" threads.' },
]

const STEPS = [
  { n: '01', icon: Store, title: 'Pick a skill', body: 'Browse the marketplace by role, category or tag. Read exactly what it does in plain language.' },
  { n: '02', icon: Wand2, title: 'Use it or fork it', body: 'Run it as-is in your favorite assistant, or make your own copy and tune the voice and rules.' },
  { n: '03', icon: Blocks, title: 'It grows with you', body: 'Your Memory and Librarian keep collecting what works, so every session starts smarter.' },
]

const ASSISTANTS = ['ChatGPT', 'Claude', 'Gemini', 'Grok']

export default function Landing() {
  const preview = skills.slice(0, 6)
  const { theme, toggleTheme } = useTheme()
  return (
    <div className="min-h-screen bg-surface">
      {/* ─── Header ─── */}
      <header className="glass-dark fixed inset-x-0 top-0 z-50 border-b border-white/8">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 shadow-glow-sm">
              <Sparkles size={18} className="text-white" />
            </span>
            <span className="font-display text-[17px] font-bold text-white">Orvex</span>
          </Link>
          <nav className="hidden items-center gap-7 text-[13.5px] font-medium text-zinc-300 md:flex">
            <a href="#how" className="transition-colors hover:text-white">How it works</a>
            <a href="#benefits" className="transition-colors hover:text-white">Why Orvex</a>
            <a href="#skills" className="transition-colors hover:text-white">Marketplace</a>
          </nav>
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link to="/signin" className="rounded-xl px-3.5 py-2 text-[13.5px] font-semibold text-zinc-300 transition-colors hover:text-white">
              Sign in
            </Link>
            <Link to="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-ink-950 pt-36 pb-28">
        {/* atmosphere */}
        <div className="bg-hero-grid absolute inset-0" />
        <div className="animate-float absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-brand-600/28 blur-[110px]" />
        <div className="animate-float-slow absolute top-24 right-1/5 h-80 w-80 rounded-full bg-brand-400/18 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-brand-600/12 blur-[90px]" />

        <div className="relative mx-auto max-w-4xl px-5 text-center">
          <div className="animate-fade-up mb-7 inline-flex items-center gap-2 rounded-full bg-white/6 py-1.5 pr-4 pl-1.5 text-[13px] font-medium text-zinc-300 ring-1 ring-white/10">
            <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-[11px] font-bold text-white">New</span>
            The Librarian now files captures from any AI client
            <ChevronRight size={14} className="text-zinc-500" />
          </div>

          <h1 className="font-display animate-fade-up mb-6 text-5xl leading-[1.05] font-bold tracking-tight text-white sm:text-6xl lg:text-7xl" style={{ animationDelay: '80ms' }}>
            Stop staring at a<br />
            <span className="text-gradient">blank chat box.</span>
          </h1>

          <p className="animate-fade-up mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-zinc-400" style={{ animationDelay: '160ms' }}>
            Orvex is a marketplace of ready-made AI skills — prompt packages that make any assistant
            do one job brilliantly. Pick one, see exactly what it does, make it sound like you.
          </p>

          <div className="animate-fade-up mb-14 flex flex-wrap items-center justify-center gap-3.5" style={{ animationDelay: '240ms' }}>
            <Link to="/signup">
              <Button size="lg">Get started free <ArrowRight size={17} /></Button>
            </Link>
            <a
              href="#skills"
              className="inline-flex h-12 items-center gap-2 rounded-[14px] bg-white/8 px-6 text-[15px] font-semibold text-white ring-1 ring-white/15 ring-inset transition-all duration-200 hover:bg-white/12 hover:ring-white/25"
            >
              Browse the marketplace
            </a>
          </div>

          <div className="animate-fade-up flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] font-medium text-zinc-500" style={{ animationDelay: '320ms' }}>
            <span className="text-zinc-600">Works with</span>
            {ASSISTANTS.map((a) => (
              <span key={a} className="flex items-center gap-1.5 text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> {a}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section id="how" className="relative bg-surface py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="mb-3 text-center text-[12px] font-bold tracking-[0.2em] text-brand-600 uppercase">How it works</p>
          <h2 className="font-display mx-auto mb-16 max-w-xl text-center text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            From blank box to brilliant output in three steps
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.n} className="group relative rounded-3xl bg-neutral-50 p-8 ring-1 ring-neutral-200/60 ring-inset transition-all duration-300 hover:-translate-y-1 hover:bg-surface hover:shadow-lift hover:ring-brand-200">
                <span className="font-display absolute top-7 right-7 text-4xl font-bold text-neutral-200/80 transition-colors group-hover:text-brand-100">{s.n}</span>
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-400 text-white shadow-glow-sm">
                  <s.icon size={22} />
                </div>
                <h3 className="font-display mb-2 text-lg font-bold text-neutral-900">{s.title}</h3>
                <p className="text-[14px] leading-relaxed text-neutral-500">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Benefits ─── */}
      <section id="benefits" className="bg-neutral-50 py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="mb-3 text-center text-[12px] font-bold tracking-[0.2em] text-brand-600 uppercase">Why Orvex</p>
          <h2 className="font-display mx-auto mb-16 max-w-2xl text-center text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Everything a prompt should have been all along
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div key={b.title} className="rounded-3xl bg-surface p-7 ring-1 ring-neutral-200/70 ring-inset transition-all duration-300 hover:shadow-lift hover:ring-brand-200">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <b.icon size={21} />
                </div>
                <h3 className="mb-1.5 text-[15.5px] font-bold text-neutral-900">{b.title}</h3>
                <p className="text-[13.5px] leading-relaxed text-neutral-500">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Skill preview ─── */}
      <section id="skills" className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-[12px] font-bold tracking-[0.2em] text-brand-600 uppercase">Live from the marketplace</p>
              <h2 className="font-display max-w-lg text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                Real skills, made by people who do the job
              </h2>
            </div>
            <Link to="/signup" className="group flex items-center gap-1.5 text-[14px] font-bold text-brand-600 transition-colors hover:text-brand-700">
              Explore all skills <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {preview.map((s) => <SkillCard key={s.id} skill={s} to={`/s/${s.id}`} />)}
          </div>
        </div>
      </section>

      {/* ─── Big CTA ─── */}
      <section className="relative overflow-hidden bg-ink-950 py-24">
        <div className="absolute inset-0 bg-dot-grid opacity-30" />
        <div className="absolute top-1/2 left-1/2 h-80 w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/25 blur-[100px]" />
        <div className="relative mx-auto max-w-2xl px-5 text-center">
          <h2 className="font-display mb-5 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Your AI, finally <span className="text-gradient">fluent in you.</span>
          </h2>
          <p className="mb-9 text-[16px] leading-relaxed text-zinc-400">
            Join thousands of brokers, teachers, founders and analysts who stopped rewriting the same prompt every morning.
          </p>
          <Link to="/signup">
            <Button size="lg">Create your free account <ArrowRight size={17} /></Button>
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-neutral-100 bg-surface py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-10 md:flex-row">
            <div className="max-w-xs">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-400">
                  <Sparkles size={15} className="text-white" />
                </span>
                <span className="font-display text-[15px] font-bold text-neutral-900">Orvex</span>
              </div>
              <p className="text-[13px] leading-relaxed text-neutral-400">
                The marketplace and workshop for reusable AI skills. Prompt once, benefit forever.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-16 gap-y-8 sm:grid-cols-3">
              {[
                ['Product', ['Marketplace', 'Memory', 'The Librarian', 'Collections']],
                ['Company', ['About', 'Blog', 'Careers', 'Contact']],
                ['Legal', ['Privacy', 'Terms', 'Security']],
              ].map(([title, links]) => (
                <div key={title}>
                  <p className="mb-3 text-[12px] font-bold tracking-wider text-neutral-900 uppercase">{title}</p>
                  <ul className="space-y-2">
                    {links.map((l) => (
                      <li key={l}>
                        <a href="#" className="text-[13px] text-neutral-400 transition-colors hover:text-brand-600">{l}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-7 text-[12.5px] text-neutral-400">
            <span>© 2026 Orvex, Inc. All rights reserved.</span>
            <span>Made for people who’d rather do the work than write the prompt.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
