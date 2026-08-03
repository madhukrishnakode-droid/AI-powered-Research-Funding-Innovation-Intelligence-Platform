import { createFileRoute } from '@tanstack/react-router'
import { Download, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { Badge, Button, Card, CardTitle, PageHeader, SectionLabel } from '../components/ui'
import { reports } from '../lib/data'

export const Route = createFileRoute('/reports')({
  component: ReportsPage,
})

function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Research summaries, exportable insights, and generated intelligence packs."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.id} className="flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600">
                <FileText className="h-5 w-5" />
              </div>
              <Badge tone={r.type === 'PDF' ? 'amber' : 'teal'}>{r.type}</Badge>
            </div>

            <h3 className="mt-4 text-base font-medium text-slate-900">{r.title}</h3>
            <p className="mt-1.5 text-sm text-slate-600">{r.snippet}</p>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <span>Generated {r.date}</span>
              <span className="text-slate-300">·</span>
              <span>{r.size}</span>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => toast(`Downloading ${r.title} (${r.size})`)}
              >
                <Download className="h-4 w-4" /> Download
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Export center */}
      <Card>
        <SectionLabel>Export Center</SectionLabel>
        <CardTitle className="mt-2">Generate a new report</CardTitle>
        <p className="mt-1 text-sm text-slate-600">
          Compile portfolio health, trend radar, funding pipeline, and patent landscape into a single document.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => toast('Report generation queued — you will be notified')}>
            Generate Innovation Brief
          </Button>
          <Button variant="outline" onClick={() => toast('Export options coming soon')}>
            Customize scope
          </Button>
        </div>
      </Card>
    </div>
  )
}
