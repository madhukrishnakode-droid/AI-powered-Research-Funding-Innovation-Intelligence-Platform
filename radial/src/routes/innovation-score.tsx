import { createFileRoute } from '@tanstack/react-router'
import { Lightbulb } from 'lucide-react'
import { Badge, Card, CardTitle, PageHeader, ProgressBar, ScoreRing, SectionLabel } from '../components/ui'
import { benchmarks, improvements, scoreBreakdown } from '../lib/data'

export const Route = createFileRoute('/innovation-score')({
  component: InnovationScorePage,
})

function InnovationScorePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Innovation Score"
        subtitle="A detailed breakdown of your innovation health against global benchmarks."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Main score */}
        <Card className="flex flex-col items-center justify-center text-center">
          <SectionLabel>Overall Innovation Score</SectionLabel>
          <div className="my-6">
            <ScoreRing value={78} size={180} stroke={12} />
          </div>
          <p className="max-w-xs text-sm text-slate-600">
            Top 12% of researchers in your field across novelty, translation, velocity, collaboration, and funding.
          </p>
        </Card>

        {/* Breakdown */}
        <Card className="xl:col-span-2">
          <CardTitle>Metric Breakdown</CardTitle>
          <div className="mt-5 space-y-5">
            {scoreBreakdown.map((m) => {
              const above = m.value >= m.target
              return (
                <div key={m.label}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-slate-600">{m.label}</p>
                      <Badge tone={above ? 'emerald' : 'amber'}>
                        {above ? 'On track' : 'Below target'}
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{m.value}</p>
                  </div>
                  <ProgressBar value={m.value} />
                  <p className="mt-1.5 text-xs text-slate-500">
                    Target {m.target} · {m.hint}
                  </p>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Benchmarks */}
        <Card>
          <CardTitle>Comparative Benchmarks</CardTitle>
          <div className="mt-4 space-y-3">
            {benchmarks.map((b) => (
              <div key={b.label} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3">
                <p className="text-sm text-slate-600">{b.label}</p>
                <p className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text font-serif text-lg font-semibold text-transparent">{b.value}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Improvements */}
        <Card className="xl:col-span-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <CardTitle>Suggested Improvements</CardTitle>
          </div>
          <ul className="mt-4 space-y-3">
            {improvements.map((imp, i) => (
              <li key={imp} className="flex items-start gap-3 text-sm text-slate-600">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-xs font-semibold text-white">
                  {i + 1}
                </span>
                {imp}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
