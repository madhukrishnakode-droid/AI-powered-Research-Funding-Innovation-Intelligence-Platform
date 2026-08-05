import { createFileRoute } from '@tanstack/react-router'
import { Sparkles } from 'lucide-react'
import { Avatar, Badge, Card, CardTitle, Tag } from '../components/ui'
import { useAuth } from '../lib/auth-context'
import { activity, portfolioSummary, trends } from '../lib/data'
import { cn } from '../lib/utils'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { user } = useAuth()
  const givenName = user?.name?.replace(/^Dr\.\s*/i, '').split(' ')[0] ?? 'Researcher'

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="overflow-hidden rounded-2xl border border-white/10 bg-hero-gradient px-6 py-10 shadow-card sm:px-10 sm:py-12">
        <div className="mx-auto flex min-h-[160px] max-w-2xl flex-col justify-center">
          <p className="mb-3 text-sm font-medium text-cyan-300">Monday, March 2, 2026</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h1 className="break-words font-serif text-2xl font-semibold leading-tight text-white sm:text-3xl">
              Welcome back, {givenName}
            </h1>
            {user?.provider === 'demo' && <Badge tone="amber">Demo session</Badge>}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Your portfolio gained <span className="font-medium text-cyan-300">+312 citations</span> this month.
            Two opportunities match your methodology within 94%.
          </p>
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
          </Card>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* New trends */}
        <section className="space-y-4 xl:col-span-2">
          <h2 className="text-lg font-semibold text-white">New Trends</h2>

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
