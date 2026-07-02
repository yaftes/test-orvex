import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertTriangle, BookOpen, Cable, LogOut, Moon, Sun } from 'lucide-react'
import { currentUser, librarianConnections } from '../data/mock'
import { cn, timeAgo } from '../lib/utils'
import { Avatar, Button, Card, ConfirmDialog, Field, Input, SectionHeading, Toggle } from '../components/ui'
import { useTheme, useToast } from '../context/AppContext'

export default function SettingsPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { theme, setTheme } = useTheme()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [emailDigest, setEmailDigest] = useState(true)
  const [publicProfile, setPublicProfile] = useState(true)

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="animate-fade-up">
        <h1 className="font-display text-[26px] font-bold tracking-tight text-neutral-900">Account & settings</h1>
        <p className="mt-1 text-sm text-neutral-500">Your profile, connections, and preferences.</p>
      </div>

      {/* Profile */}
      <section>
        <SectionHeading title="Profile" />
        <Card className="space-y-5 p-6">
          <div className="flex items-center gap-4">
            <Avatar name={currentUser.name} size={64} />
            <div>
              <p className="text-[15px] font-bold text-neutral-900">{currentUser.name}</p>
              <p className="text-[13px] text-neutral-400">@{currentUser.handle} · {currentUser.org} workspace</p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto" onClick={() => toast('Avatar upload is mocked here', 'info')}>Change photo</Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name"><Input defaultValue={currentUser.name} onBlur={() => toast('Saved', 'info')} /></Field>
            <Field label="Email"><Input defaultValue={currentUser.email} onBlur={() => toast('Saved', 'info')} /></Field>
          </div>
          <Field label="Bio" hint="Shown on your public author page.">
            <Input defaultValue={currentUser.bio} onBlur={() => toast('Saved', 'info')} />
          </Field>
        </Card>
      </section>

      {/* Connected accounts & integrations */}
      <section>
        <SectionHeading title="Connected accounts & integrations" />
        <Card className="divide-y divide-neutral-100">
          <Row
            icon={<GoogleMark />}
            title="Google"
            sub="Used for sign-in"
            right={<span className="text-[12px] font-bold text-brand-600">Connected</span>}
          />
          {librarianConnections.map((c) => (
            <Row
              key={c.id}
              icon={<span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600"><Cable size={16} /></span>}
              title={c.name}
              sub={`Sends captures to the Librarian · last capture ${timeAgo(c.lastCapture)}`}
              right={<Button size="xs" variant="dangerGhost" onClick={() => toast(`${c.name} revoked`)}>Revoke</Button>}
            />
          ))}
        </Card>
      </section>

      {/* Appearance & preferences */}
      <section>
        <SectionHeading title="Appearance & preferences" />
        <Card className="divide-y divide-neutral-100">
          <div className="flex items-center justify-between p-5">
            <div>
              <p className="text-[14px] font-bold text-neutral-900">Theme</p>
              <p className="text-[12.5px] text-neutral-400">Light or dark — your choice is remembered on this device.</p>
            </div>
            <div className="flex gap-1 rounded-xl bg-neutral-100 p-1">
              {[['light', Sun], ['dark', Moon]].map(([t, Icon]) => (
                <button
                  key={t}
                  onClick={() => { setTheme(t); toast(t === 'dark' ? 'Dark theme on 🌙' : 'Light theme on ☀️', 'info') }}
                  aria-pressed={theme === t}
                  className={cn('grid h-8 w-9 cursor-pointer place-items-center rounded-lg transition-all', theme === t ? 'bg-surface text-brand-600 shadow-soft' : 'text-neutral-400')}
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between p-5">
            <div>
              <p className="text-[14px] font-bold text-neutral-900">Weekly email digest</p>
              <p className="text-[12.5px] text-neutral-400">New skills from people you follow, once a week.</p>
            </div>
            <Toggle checked={emailDigest} onChange={(v) => { setEmailDigest(v); toast(v ? 'Digest on' : 'Digest off', 'info') }} label="Weekly email digest" />
          </div>
          <div className="flex items-center justify-between p-5">
            <div>
              <p className="text-[14px] font-bold text-neutral-900">Public profile</p>
              <p className="text-[12.5px] text-neutral-400">Let anyone see your author page and published skills.</p>
            </div>
            <Toggle checked={publicProfile} onChange={(v) => { setPublicProfile(v); toast(v ? 'Profile is public' : 'Profile is private', 'info') }} label="Public profile" />
          </div>
        </Card>
      </section>

      {/* Wiki link */}
      <section>
        <Card className="flex items-center justify-between gap-4 bg-gradient-to-r from-brand-50/80 to-white p-5">
          <div className="flex items-center gap-3.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface text-brand-600 shadow-soft"><BookOpen size={18} /></span>
            <div>
              <p className="text-[14px] font-bold text-neutral-900">Your Wiki</p>
              <p className="text-[12.5px] text-neutral-400">Your private, Orvex-hosted knowledge space.</p>
            </div>
          </div>
          <Link to="/app/wiki"><Button variant="secondary" size="sm">Open</Button></Link>
        </Card>
      </section>

      {/* Danger zone — clearly separated */}
      <section>
        <SectionHeading title="Danger zone" />
        <Card className="space-y-4 !ring-neutral-900/50 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-1.5 text-[14px] font-bold text-neutral-900">
                <AlertTriangle size={14} className="text-brand-600" /> Delete account
              </p>
              <p className="max-w-sm text-[12.5px] leading-relaxed text-neutral-400">
                Permanently deletes your account, drafts, Memory and Wiki. Published skills are unpublished. This cannot be undone.
              </p>
            </div>
            <Button variant="dangerGhost" size="sm" onClick={() => setConfirmDelete(true)}>Delete my account</Button>
          </div>
        </Card>
      </section>

      {/* Sign out */}
      <div className="flex justify-center pb-4">
        <Button variant="outline" onClick={() => navigate('/')}>
          <LogOut size={15} /> Sign out
        </Button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => toast('This is a mock — your account is safe 😊', 'info')}
        title="Delete your account?"
        body="Everything goes: drafts, Memory, Wiki, connections. Your published skills are unpublished from the marketplace. There is no undo and no grace period."
        confirmLabel="I understand — delete everything"
      />
    </div>
  )
}

function Row({ icon, title, sub, right }) {
  return (
    <div className="flex items-center gap-3.5 p-5">
      {icon}
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold text-neutral-900">{title}</p>
        <p className="truncate text-[12.5px] text-neutral-400">{sub}</p>
      </div>
      {right}
    </div>
  )
}

function GoogleMark() {
  return (
    <span className="grid h-9 w-9 place-items-center rounded-lg bg-neutral-50 ring-1 ring-neutral-200/60 ring-inset">
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
        <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.3-2.1 3.7-5.1 3.7-8.6z" />
        <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-6-2.2-6.9-5.1l-3.9 3C3.2 21.3 7.3 24 12 24z" />
        <path fill="#FBBC05" d="M5.1 14.3c-.3-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3l-3.9-3C.4 8.3 0 10.1 0 12s.4 3.7 1.2 5.3l3.9-3z" />
        <path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17 1.1 15.2 0 12 0 7.3 0 3.2 2.7 1.2 6.7l3.9 3C6 6.9 8.8 4.7 12 4.7z" />
      </svg>
    </span>
  )
}
