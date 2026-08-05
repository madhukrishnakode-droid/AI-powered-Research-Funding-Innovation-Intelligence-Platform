import { Link, useRouterState } from '@tanstack/react-router'
import { Bell, ChevronDown, LogOut, Menu, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../lib/auth-context'

const titles: Record<string, string> = {
  '/': 'Home',
  '/dashboard': 'Dashboard',
  '/patents': 'Patents',
  '/funding': 'Funding Recommendations',
  '/publications': 'Publications',
  '/innovation-score': 'Innovation Score',
  '/reports': 'Reports',
  '/profile': 'Research Profile',
  '/collaborations': 'Collaborations',
  '/lab-resources': 'Lab Resources',
  '/alerts': 'Alerts',
  '/settings': 'Settings',
}

export function TopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const title = titles[pathname] ?? 'Radial'

  const initial = user?.name?.charAt(0)?.toUpperCase() ?? 'E'
  const givenName = user?.name?.replace(/^Dr\.\s*/i, '').split(' ')[0] ?? ''

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/10 bg-slate-900/60 px-4 backdrop-blur sm:gap-4 sm:px-6">
      <button
        onClick={onOpenMenu}
        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white md:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="truncate whitespace-nowrap font-serif text-lg font-semibold text-white">{title}</h1>

      <div className="hidden flex-1 md:flex" />

      <div className="flex items-center gap-2">
        <Link
          to="/alerts"
          className="relative rounded-full p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          title="Alerts"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" />
        </Link>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-white/5"
          >
            {user?.picture ? (
              <img src={user.picture} alt="" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-sm font-semibold text-white">
                {initial}
              </span>
            )}
            <span className="hidden text-sm text-white lg:block">{givenName}</span>
            <ChevronDown className="hidden h-4 w-4 text-slate-500 lg:block" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-white/10 bg-slate-900 p-1.5 shadow-card">
                <div className="border-b border-white/10 px-3 py-2">
                  <p className="break-words text-sm font-medium leading-snug text-white">{user?.name}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <User className="h-4 w-4" /> View profile
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    signOut()
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
