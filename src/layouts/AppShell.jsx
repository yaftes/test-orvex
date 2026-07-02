import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Activity, Archive, BookOpen, Brain, FolderOpen, Home, Inbox, Layers,
  LibraryBig, LogOut, Moon, Plus, Search, Settings, ShieldCheck, Sparkles,
  Store, Sun, UserRoundCheck, Users, Menu, X,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { currentUser, drafts, librarianItems, suggestions } from '../data/mock'
import { Avatar, Button } from '../components/ui'
import { useTheme } from '../context/AppContext'

const NAV = [
  {
    label: 'Discover',
    items: [
      { to: '/app', icon: Home, label: 'Home', end: true },
      { to: '/app/marketplace', icon: Store, label: 'Marketplace' },
      { to: '/app/activity', icon: Activity, label: 'Activity' },
      { to: '/app/following', icon: UserRoundCheck, label: 'Following' },
      { to: '/app/collections', icon: Layers, label: 'Collections' },
    ],
  },
  {
    label: 'Your studio',
    items: [
      { to: '/app/drafts', icon: FolderOpen, label: 'Drafts', count: drafts.created.length + drafts.forked.length },
      { to: '/app/published', icon: Archive, label: 'Published' },
      { to: '/app/review', icon: Inbox, label: 'Review inbox', count: suggestions.length },
    ],
  },
  {
    label: 'Personal',
    items: [
      { to: '/app/memory', icon: Brain, label: 'Memory' },
      { to: '/app/librarian', icon: LibraryBig, label: 'Librarian', count: librarianItems.length, countStyle: 'brand' },
      { to: '/app/wiki', icon: BookOpen, label: 'Your Wiki' },
    ],
  },
]

function SideNav({ onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <Link to="/app" onClick={onNavigate} className="mb-6 flex items-center gap-2.5 px-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 rounded-lg">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 shadow-glow-sm">
          <Sparkles size={18} className="text-white" />
        </span>
        <span className="font-display text-[17px] font-bold tracking-tight text-neutral-900">
          Orvex <span className="text-neutral-400 font-medium">Studio</span>
        </span>
      </Link>

      {/* Nav groups */}
      <nav className="flex-1 space-y-6 overflow-y-auto scrollbar-none">
        {NAV.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-2 text-[10.5px] font-bold tracking-widest text-neutral-400 uppercase">{group.label}</p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    className={({ isActive }) => cn(
                      'group relative flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13.5px] font-semibold transition-all duration-150',
                      isActive ? 'bg-brand-50 text-brand-700' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900',
                    )}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && <span className="absolute top-1/2 -left-3 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-600" />}
                        <item.icon size={17} strokeWidth={2} className={isActive ? 'text-brand-600' : 'text-neutral-400 group-hover:text-neutral-600'} />
                        {item.label}
                        {item.count != null && item.count > 0 && (
                          <span className={cn(
                            'ml-auto rounded-full px-1.5 py-px text-[11px] font-bold',
                            item.countStyle === 'brand' ? 'bg-brand-600 text-white shadow-glow-sm' : 'bg-neutral-200/80 text-neutral-500',
                          )}>
                            {item.count}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="mt-4 space-y-0.5 border-t border-neutral-100 pt-4">
        <NavLink to="/app/admin" onClick={onNavigate} className={({ isActive }) => cn('flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13.5px] font-semibold transition-colors', isActive ? 'bg-brand-50 text-brand-700' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900')}>
          <ShieldCheck size={17} className="text-neutral-400" /> Admin
        </NavLink>
        <NavLink to="/app/settings" onClick={onNavigate} className={({ isActive }) => cn('flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13.5px] font-semibold transition-colors', isActive ? 'bg-brand-50 text-brand-700' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900')}>
          <Settings size={17} className="text-neutral-400" /> Settings
        </NavLink>
        <Link to="/app/settings" onClick={onNavigate} className="mt-2 flex items-center gap-2.5 rounded-xl bg-neutral-50 p-2.5 ring-1 ring-neutral-200/60 ring-inset transition-colors hover:bg-neutral-100">
          <Avatar name={currentUser.name} size={32} />
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-bold text-neutral-900">{currentUser.name}</span>
            <span className="block truncate text-[11.5px] text-neutral-400">{currentUser.org} workspace</span>
          </span>
        </Link>
      </div>
    </div>
  )
}

export default function AppShell() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-canvas">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-neutral-200/70 bg-surface px-3 py-5 lg:block">
        <SideNav />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="animate-fade-in absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="animate-slide-in-right absolute inset-y-0 left-0 w-72 bg-surface px-3 py-5 shadow-lift">
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full text-neutral-400 hover:bg-neutral-100">
              <X size={18} />
            </button>
            <SideNav onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Topbar */}
      <header className="glass sticky top-0 z-30 border-b border-neutral-200/60 lg:pl-64">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
          <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl text-neutral-500 hover:bg-neutral-100 lg:hidden">
            <Menu size={19} />
          </button>

          <button
            onClick={() => navigate('/app/marketplace')}
            className="flex h-9 w-full max-w-sm cursor-pointer items-center gap-2.5 rounded-xl bg-neutral-100/80 px-3.5 text-[13px] font-medium text-neutral-400 ring-1 ring-transparent transition-all hover:bg-surface hover:ring-neutral-200 hover:shadow-soft"
          >
            <Search size={15} />
            Search skills, roles, tags…
            <kbd className="ml-auto hidden rounded-md bg-surface px-1.5 py-0.5 text-[10px] font-bold text-neutral-400 ring-1 ring-neutral-200 sm:block">/</kbd>
          </button>

          <div className="ml-auto flex items-center gap-2.5">
            <Button size="sm" onClick={() => navigate('/app/builder/new')}>
              <Plus size={15} /> <span className="hidden sm:inline">Create skill</span>
            </Button>
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-brand-600"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button
              onClick={() => navigate('/')}
              title="Sign out"
              aria-label="Sign out"
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            >
              <LogOut size={17} />
            </button>
            <Link to="/app/settings" className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600">
              <Avatar name={currentUser.name} size={34} ring />
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
