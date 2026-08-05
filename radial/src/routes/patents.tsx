import { createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { Badge, Card, PageHeader, Tag } from '../components/ui'
import { patents } from '../lib/data'

export const Route = createFileRoute('/patents')({
  component: PatentsPage,
})

function PatentsPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All Statuses')

  const filtered = patents.filter((p) => {
    const matchesStatus = status === 'All Statuses' || p.status === (status === 'Granted' ? 'granted' : 'examination')
    if (!matchesStatus) return false
    if (!query.trim()) return true
    const q = query.trim().toLowerCase()
    return (
      p.title.toLowerCase().includes(q) ||
      p.number.toLowerCase().includes(q) ||
      p.inventors.some((i) => i.toLowerCase().includes(q))
    )
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patents"
        subtitle="Manage your patent portfolio — statuses, filings, and jurisdictions at a glance."
      />

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[260px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search filings, titles, or inventors..."
            className="w-full rounded-lg border border-white/10 bg-slate-800/60 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-white/10 bg-slate-800/60 px-3 py-2 text-sm text-white focus:border-cyan-400/60 focus:outline-none"
        >
          <option>All Statuses</option>
          <option>Granted</option>
          <option>Under Examination</option>
        </select>
      </div>

      {/* Patent list */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <Card className="py-10 text-center">
            <p className="text-sm text-slate-500">No patents match your filters.</p>
          </Card>
        )}
        {filtered.map((p) => (
          <Card key={p.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-medium text-slate-900">{p.title}</h3>
                  <Badge tone={p.status === 'granted' ? 'emerald' : 'amber'}>
                    {p.status === 'granted' ? 'Granted' : 'Under Examination'}
                  </Badge>
                </div>
                <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">
                  {p.number} · Filed {p.filingDate}
                </p>
                <p className="mt-2 text-sm text-slate-600">Inventors: {p.inventors.join(', ')}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.jurisdictions.map((j) => (
                    <Tag key={j}>{j}</Tag>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
