import { createFileRoute } from '@tanstack/react-router'
import { ArrowUpRight, FileText, TrendingUp } from 'lucide-react'
import { Badge, Card, CardTitle, PageHeader, ProgressBar, ScoreRing, SectionLabel, Tag } from '../components/ui'
import { activity, funding, patents, scoreBreakdown, trends } from '../lib/data'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="A high-level overview of your research portfolio, momentum, and pipeline."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Portfolio health */}
        <Card>
          <SectionLabel>Portfolio Health</SectionLabel>
          <div className="mt-4 flex items-center gap-6">
            <ScoreRing value={78} />
            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Active Items</p>
                <p className="font-serif text-xl font-semibold text-slate-900">42</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">At Risk</p>
                <p className="font-serif text-xl font-semibold text-amber-500">6</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Healthy</p>
                <p className="font-serif text-xl font-semibold text-emerald-600">36</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Research momentum */}
        <Card className="xl:col-span-2">
          <SectionLabel>Research Momentum</SectionLabel>
          <div className="mt-4 grid gap-5 sm:grid-cols-3">
            {scoreBreakdown.slice(0, 3).map((m) => (
              <div key={m.label}>
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="text-sm text-slate-600">{m.label}</p>
                  <p className="text-sm font-semibold text-slate-900">{m.value}%</p>
                </div>
                <ProgressBar value={m.value} />
                <p className="mt-1.5 text-xs text-slate-500">{m.hint}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Activity log */}
        <Card>
          <CardTitle>Activity Log</CardTitle>
          <div className="mt-4 space-y-0 divide-y divide-slate-100">
            {activity.map((item) => (
              <div key={item.message} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" />
                <div>
                  <p className="text-sm text-slate-600">{item.message}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Opportunity pipeline */}
        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Opportunity Pipeline</CardTitle>
            <Badge tone="teal">4 high-fit</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {funding.slice(0, 4).map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">{f.title}</p>
                  <p className="text-xs text-slate-500">{f.funder} · {f.amount}</p>
                </div>
                <Badge tone={f.fit >= 85 ? 'emerald' : f.fit >= 75 ? 'amber' : 'slate'}>{f.fit}% fit</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Trend radar */}
        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Trend Radar</CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div className="mt-4 space-y-3">
            {trends.slice(0, 4).map((t) => (
              <div key={t.title} className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm text-slate-900">{t.title}</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {t.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </div>
                <div className="ml-3 shrink-0 text-right">
                  <p className="text-sm font-semibold text-emerald-600">{t.growth}</p>
                  <p className="text-xs text-slate-500">{t.citations.toLocaleString()} cites</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Patent pipeline */}
        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Patent Pipeline</CardTitle>
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div className="mt-4 space-y-3">
            {patents.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">{p.title}</p>
                  <p className="text-xs text-slate-500">{p.number}</p>
                </div>
                <div className="ml-3 flex shrink-0 items-center gap-2">
                  <Badge tone={p.status === 'granted' ? 'emerald' : 'amber'}>
                    {p.status === 'granted' ? 'Granted' : 'Under Examination'}
                  </Badge>
                  <ArrowUpRight className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
