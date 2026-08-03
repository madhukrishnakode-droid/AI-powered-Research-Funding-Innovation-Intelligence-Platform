import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Search, Sparkles } from 'lucide-react'
import { Avatar, Badge, Card, CardTitle, Tag } from '../components/ui'
import { useAuth } from '../lib/auth-context'
import { activity, portfolioSummary, trends } from '../lib/data'
import { cn } from '../lib/utils'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { user } = useAuth()
  const givenName = user?.name?.replace(/^Dr\.\s*/i, '').split(' ')[0] ?? 'Elena'

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="rounded-2xl border border-white/10 bg-hero-gradient p-8 shadow-card">
        <div className="max-w-2xl">
          <p className="mb-2 text-sm text-cyan-300">Monday, March 2, 2026</p>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl font-semibold text-white">
              Welcome back, {givenName}
            </h1>
            {user?.provider === 'demo' && <Badge tone="amber">Demo session</Badge>}
          </div>
          <p className="mt-2 text-sm text-slate-300">
            Your portfolio gained <span className="font-medium text-cyan-300">+312 citations</span> this month.
            Two opportunities match your methodology within 94%.
          </p>
        </div>

        {/* Hero search */}
        <div className="mt-6 max-w-2xl rounded-2xl border border-white/20 bg-white/10 p-px backdrop-blur">
          <div className="flex items-center gap-3 rounded-[15px] bg-slate-950/40 px-4 py-3">
            <Search className="h-5 w-5 shrink-0 text-slate-400" />
            <input
              placeholder="Search papers, patents, grants, and researchers..."
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
            />
            <button className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-900 transition-colors hover:bg-cyan-100">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">Innovation Score</p>
            <p className="mt-1 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text font-serif text-2xl font-semibold text-transparent">78<span className="text-sm text-slate-400">/100</span></p>
          </div>
          <Sparkles className="h-6 w-6 text-cyan-500" />
        </Card>
        {portfolioSummary.map((s) => (
          <Card key={s.label} className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">{s.label}</p>
              <p className="mt-1 font-serif text-2xl font-semibold text-slate-900">{s.value}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-blue-600" />
          </Card>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* New trends */}
        <section className="space-y-4 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">New Trends</h2>
            <span className="text-sm text-cyan-400">View all</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {trends.map((trend) => (
              <Card key={trend.title}>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle>{trend.title}</CardTitle>
                  <Badge tone="emerald">{trend.growth}</Badge>
                </div>
                <p className="mt-3 text-sm text-slate-600">{trend.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {trend.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                  <span className="whitespace-nowrap text-xs text-slate-500">{trend.citations.toLocaleString()} cites</span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent activity */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          <Card>
            <div className="divide-y divide-slate-100">
              {activity.map((item) => (
                <div key={item.message} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <Avatar initials={item.type.slice(0, 1).toUpperCase()} />
                  <div className="min-w-0">
                    <p className={cn('text-sm leading-snug', item.type === 'system' ? 'text-slate-500' : 'text-slate-700')}>
                      {item.message}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
