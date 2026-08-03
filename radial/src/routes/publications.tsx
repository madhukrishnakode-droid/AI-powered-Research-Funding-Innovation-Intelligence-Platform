import { createFileRoute } from '@tanstack/react-router'
import { ExternalLink, Search } from 'lucide-react'
import { Card, PageHeader } from '../components/ui'
import { pubStats, publications } from '../lib/data'

export const Route = createFileRoute('/publications')({
  component: PublicationsPage,
})

function PublicationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Publications"
        subtitle="Track citations, h-index, and your full publication record."
      />

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-xs uppercase tracking-wider text-slate-500">Total Citations</p>
          <p className="mt-1 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text font-serif text-2xl font-semibold text-transparent">{pubStats.citations.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-slate-500">h-index</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-slate-900">{pubStats.hIndex}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-slate-500">Publications</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-slate-900">{pubStats.count}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-slate-500">Recent Citations</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-emerald-600">{pubStats.recent}</p>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          placeholder="Search your publications..."
          className="w-full rounded-lg border border-white/10 bg-slate-800/60 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
        />
      </div>

      {/* Publication list */}
      <div className="space-y-4">
        {publications.map((pub) => (
          <Card key={pub.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 max-w-2xl">
                <h3 className="text-base font-medium text-slate-900">{pub.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{pub.authors.join(', ')}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {pub.venue} · {pub.year}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{pub.citations}</p>
                  <p className="text-xs text-slate-500">citations</p>
                </div>
                <a
                  href={`https://doi.org/${pub.doi}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  DOI <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
