import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Sparkles, Users, User } from 'lucide-react'
import { organizations } from '../data/mock'
import { Button, Field, Input } from '../components/ui'
import { cn } from '../lib/utils'

function AuthFrame({ title, sub, children, footer }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4 py-12">
      <div className="bg-hero-grid absolute inset-0" />
      <div className="animate-float absolute -top-24 left-1/3 h-80 w-80 rounded-full bg-brand-600/25 blur-[100px]" />
      <div className="animate-float-slow absolute right-1/4 bottom-0 h-72 w-72 rounded-full bg-brand-400/15 blur-[90px]" />

      <div className="relative w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 shadow-glow-sm">
            <Sparkles size={19} className="text-white" />
          </span>
          <span className="font-display text-lg font-bold text-white">Orvex</span>
        </Link>

        <div className="animate-scale-in rounded-3xl bg-surface p-8 shadow-lift">
          <h1 className="font-display mb-1.5 text-center text-2xl font-bold tracking-tight text-neutral-900">{title}</h1>
          <p className="mb-7 text-center text-sm text-neutral-500">{sub}</p>
          {children}
        </div>
        <p className="mt-6 text-center text-[13.5px] text-neutral-400">{footer}</p>
      </div>
    </div>
  )
}

function GoogleButton({ label }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate('/choose-org')}
      className="flex h-11 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-surface text-sm font-semibold text-neutral-700 ring-1 ring-neutral-200 ring-inset transition-all hover:bg-neutral-50 hover:ring-neutral-300"
    >
      <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden>
        <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.3-2.1 3.7-5.1 3.7-8.6z" />
        <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-6-2.2-6.9-5.1l-3.9 3C3.2 21.3 7.3 24 12 24z" />
        <path fill="#FBBC05" d="M5.1 14.3c-.3-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3l-3.9-3C.4 8.3 0 10.1 0 12s.4 3.7 1.2 5.3l3.9-3z" />
        <path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17 1.1 15.2 0 12 0 7.3 0 3.2 2.7 1.2 6.7l3.9 3C6 6.9 8.8 4.7 12 4.7z" />
      </svg>
      {label}
    </button>
  )
}

function OrDivider() {
  return (
    <div className="my-5 flex items-center gap-3.5">
      <span className="h-px flex-1 bg-neutral-100" />
      <span className="text-[11px] font-bold tracking-wider text-neutral-300 uppercase">or</span>
      <span className="h-px flex-1 bg-neutral-100" />
    </div>
  )
}

export function SignIn() {
  const navigate = useNavigate()
  return (
    <AuthFrame
      title="Welcome back"
      sub="Sign in to your Orvex workspace"
      footer={<>New to Orvex? <Link to="/signup" className="font-semibold text-brand-300 hover:text-white">Create an account</Link></>}
    >
      <GoogleButton label="Continue with Google" />
      <OrDivider />
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate('/app') }}>
        <Field label="Email">
          <Input type="email" placeholder="you@company.com" autoComplete="email" required />
        </Field>
        <Field label="Password">
          <Input type="password" placeholder="••••••••••" autoComplete="current-password" required />
        </Field>
        <div className="flex justify-end">
          <a href="#" className="text-[12.5px] font-semibold text-brand-600 hover:text-brand-700">Forgot your password?</a>
        </div>
        <Button type="submit" className="w-full">Sign in</Button>
      </form>
    </AuthFrame>
  )
}

export function SignUp() {
  const navigate = useNavigate()
  return (
    <AuthFrame
      title="Create your account"
      sub="Free forever for personal use. No card needed."
      footer={<>Already have an account? <Link to="/signin" className="font-semibold text-brand-300 hover:text-white">Sign in</Link></>}
    >
      <GoogleButton label="Sign up with Google" />
      <OrDivider />
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate('/choose-org') }}>
        <Field label="Full name">
          <Input placeholder="Ada Lovelace" autoComplete="name" required />
        </Field>
        <Field label="Email">
          <Input type="email" placeholder="you@company.com" autoComplete="email" required />
        </Field>
        <Field label="Password" hint="At least 8 characters.">
          <Input type="password" placeholder="Pick something strong" autoComplete="new-password" minLength={8} required />
        </Field>
        <Button type="submit" className="w-full">Create account</Button>
      </form>
    </AuthFrame>
  )
}

export function ChooseOrg() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState('org_personal')
  return (
    <AuthFrame
      title="Choose your workspace"
      sub="Where should your skills live? You can switch anytime."
      footer={<Link to="/app" className="font-semibold text-brand-300 hover:text-white">Skip for now — use my personal workspace</Link>}
    >
      <div className="mb-6 space-y-2.5">
        {organizations.map((org) => (
          <button
            key={org.id}
            onClick={() => setSelected(org.id)}
            aria-pressed={selected === org.id}
            className={cn(
              'flex w-full cursor-pointer items-center gap-3.5 rounded-2xl p-4 text-left ring-1 ring-inset transition-all duration-200',
              selected === org.id ? 'bg-brand-50 ring-2 ring-brand-500' : 'bg-surface ring-neutral-200 hover:ring-neutral-300',
            )}
          >
            <span className={cn('grid h-10 w-10 place-items-center rounded-xl', selected === org.id ? 'bg-brand-600 text-white' : 'bg-neutral-100 text-neutral-500')}>
              {org.kind === 'personal' ? <User size={18} /> : <Users size={18} />}
            </span>
            <span className="flex-1">
              <span className="block text-[14.5px] font-bold text-neutral-900">{org.name}</span>
              <span className="block text-[12.5px] text-neutral-400">
                {org.kind === 'personal' ? 'Just you — the default' : `${org.members} members`}
              </span>
            </span>
            {selected === org.id && (
              <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-white"><Check size={13} strokeWidth={3} /></span>
            )}
          </button>
        ))}
      </div>
      <Button className="w-full" onClick={() => navigate('/app')}>Continue</Button>
    </AuthFrame>
  )
}
