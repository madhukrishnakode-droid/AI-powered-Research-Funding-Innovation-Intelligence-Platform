import { Link, useRouterState } from '@tanstack/react-router'
import {
  Atom,
  BadgeDollarSign,
  BarChart3,
  Bell,
  BookOpen,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  FlaskConical,
  Home,
  LayoutDashboard,
  PieChart,
  Settings,
  Users,
} from 'lucide-react'
import { cn } from '../lib/utils'

type NavItem = {
  to: string
  label: string
  icon: typeof Home
}

const navSections: { label: string; items: NavItem[] }[] = [
  {
    label: 'Workspace',
    items: [
      { to: '/', label: 'Home', icon: Home },
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Modules',
    items: [
      { to: '/patents', label: 'Patents', icon: FileText },
      { to: '/funding', label: 'Funding Recommendations', icon: BadgeDollarSign },
      { to: '/publications', label: 'Publications', icon: BookOpen },
      { to: '/innovation-score', label: 'Innovation Score', icon: BarChart3 },
      { to: '/reports', label: 'Reports', icon: PieChart },
      { to: '/collaborations', label: 'Collaborations', icon: Users },
      { to: '/lab-resources', label: 'Lab Resources', icon: FlaskConical },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/alerts', label: 'Alerts', icon: Bell },
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
]

export function AppSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white/10 bg-slate-900/80 backdrop-blur transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-white/10 px-4',
          collapsed && 'justify-center px-0',
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-glow-blue">
          <Atom className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="ml-2.5 flex items-center gap-2 overflow-hidden">
            <span className="font-serif text-lg font-semibold text-white">Radial</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-cyan-400">
              beta
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {navSections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="mb-2 px-3 text-xs uppercase tracking-wider text-slate-500">{section.label}</p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = pathname === item.to
                const Icon = item.icon
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        'flex items-center gap-3 rounded-xl py-2 text-sm transition-all duration-300',
                        collapsed ? 'justify-center px-0' : 'px-3',
                        active
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-glow-blue'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white',
                      )}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="shrink-0 border-t border-white/10 p-3">
        <button
          onClick={onToggle}
          className={cn(
            'flex w-full items-center rounded-lg py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white',
            collapsed ? 'justify-center px-0' : 'gap-2 px-3',
          )}
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : (
            <>
              <ChevronsLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
