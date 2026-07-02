import { useState } from 'react'
import { Building2, MoreHorizontal, Search, ShieldCheck, UsersRound } from 'lucide-react'
import { adminOrgs, adminUsers } from '../data/mock'
import { cn, formatDate, timeAgo } from '../lib/utils'
import { Avatar, Badge, Card, Input, SectionHeading, Tabs } from '../components/ui'
import { useToast } from '../context/AppContext'

/** Restricted panel — in the real app this route is admin-gated server-side. */
export default function Admin() {
  const toast = useToast()
  const [tab, setTab] = useState('orgs')
  const [query, setQuery] = useState('')

  const orgs = adminOrgs.filter((o) => o.name.toLowerCase().includes(query.toLowerCase()))
  const users = adminUsers.filter((u) => `${u.name} ${u.email} ${u.org}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="animate-fade-up flex flex-wrap items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-950 text-brand-300"><ShieldCheck size={20} /></span>
        <div>
          <h1 className="font-display text-[26px] font-bold tracking-tight text-neutral-900">Admin</h1>
          <p className="text-sm text-neutral-500">Organization and user management. Visible to system administrators only.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          tabs={[
            { id: 'orgs', label: 'Organizations', count: adminOrgs.length },
            { id: 'users', label: 'Users', count: adminUsers.length },
          ]}
          active={tab}
          onChange={setTab}
        />
        <div className="relative w-full sm:w-64">
          <Search size={15} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-neutral-400" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={tab === 'orgs' ? 'Search organizations…' : 'Search users…'} className="h-9 pl-9" />
        </div>
      </div>

      {tab === 'orgs' ? (
        <Card className="overflow-hidden">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-neutral-100 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                <th className="px-5 py-3.5">Organization</th>
                <th className="px-4 py-3.5">Members</th>
                <th className="px-4 py-3.5">Skills</th>
                <th className="hidden px-4 py-3.5 sm:table-cell">Plan</th>
                <th className="hidden px-4 py-3.5 md:table-cell">Created</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {orgs.map((o) => (
                <tr key={o.id} className="transition-colors hover:bg-neutral-50/60">
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-2.5 font-bold text-neutral-900">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-600"><Building2 size={14} /></span>
                      {o.name}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-neutral-600">{o.members}</td>
                  <td className="px-4 py-3.5 text-neutral-600">{o.skills}</td>
                  <td className="hidden px-4 py-3.5 sm:table-cell"><Badge variant={o.plan === 'Business' ? 'brand' : 'neutral'}>{o.plan}</Badge></td>
                  <td className="hidden px-4 py-3.5 text-neutral-400 md:table-cell">{formatDate(o.created)}</td>
                  <td className="px-4 py-3.5 text-right">
                    <button onClick={() => toast('Org actions are mocked', 'info')} aria-label={`Manage ${o.name}`} className="grid h-7 w-7 cursor-pointer place-items-center rounded-lg text-neutral-400 hover:bg-neutral-100"><MoreHorizontal size={15} /></button>
                  </td>
                </tr>
              ))}
              {orgs.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-neutral-400">No organizations match “{query}”.</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-neutral-100 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                <th className="px-5 py-3.5">User</th>
                <th className="hidden px-4 py-3.5 md:table-cell">Organization</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="hidden px-4 py-3.5 sm:table-cell">Last seen</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {users.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-neutral-50/60">
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-2.5">
                      <Avatar name={u.name} size={30} />
                      <span>
                        <span className="block font-bold text-neutral-900">{u.name}</span>
                        <span className="block text-[11.5px] text-neutral-400">{u.email}</span>
                      </span>
                    </span>
                  </td>
                  <td className="hidden px-4 py-3.5 text-neutral-600 md:table-cell">{u.org}</td>
                  <td className="px-4 py-3.5">
                    <Badge variant={u.role === 'Admin' ? 'dark' : 'neutral'}>{u.role}</Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn('flex w-fit items-center gap-1.5 text-[12px] font-bold', u.status === 'active' ? 'text-brand-600' : 'text-neutral-500')}>
                      <span className={cn('h-1.5 w-1.5 rounded-full', u.status === 'active' ? 'bg-brand-500' : 'bg-neutral-400')} />
                      {u.status}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3.5 text-neutral-400 sm:table-cell">{timeAgo(u.lastSeen)}</td>
                  <td className="px-4 py-3.5 text-right">
                    <button onClick={() => toast('User actions are mocked', 'info')} aria-label={`Manage ${u.name}`} className="grid h-7 w-7 cursor-pointer place-items-center rounded-lg text-neutral-400 hover:bg-neutral-100"><MoreHorizontal size={15} /></button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-neutral-400">No users match “{query}”.</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      )}

      <SectionHeading title="" sub="This panel is only rendered for admin accounts; regular members never see it in navigation." />
    </div>
  )
}
