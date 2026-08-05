import { createFileRoute } from '@tanstack/react-router'
import { Download, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { Badge, Button, Card, CardTitle, PageHeader, SectionLabel } from '../components/ui'
import { reports } from '../lib/data'
import type { Report } from '../lib/data'

export const Route = createFileRoute('/reports')({
  component: ReportsPage,
})

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function ReportCard({ report }: { report: Report }) {
  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600">
          <FileText className="h-5 w-5" />
        </div>
        <Badge tone={report.type === 'PDF' ? 'amber' : 'teal'}>{report.type}</Badge>
      </div>

      <h3 className="mt-4 text-base font-medium text-slate-900">{report.title}</h3>
      <p className="mt-1.5 text-sm text-slate-600">{report.snippet}</p>

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <span>Generated {report.date}</span>
        <span className="text-slate-300">·</span>
        <span>{report.size}</span>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <Button
          className="w-full"
          variant="outline"
          onClick={() => {
            downloadText(
              `${slugify(report.title)}.txt`,
              `Radial Report\n============\n\nTitle: ${report.title}\nType: ${report.type}\nGenerated: ${report.date}\nSize: ${report.size}\n\n${report.snippet}\n`,
            )
            toast.success(`Downloading ${report.title}`)
          }}
        >
          <Download className="h-4 w-4" /> Download
        </Button>
      </div>
    </Card>
  )
}

function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Research summaries, exportable insights, and generated intelligence packs."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((r) => (
          <ReportCard key={r.id} report={r} />
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
          <Button
            variant="secondary"
            onClick={() => {
              const brief = [
                'Radial — Innovation Brief',
                `Generated: ${new Date().toLocaleDateString()}`,
                '',
                'Portfolio Health: 78 / 100',
                'Innovation Score: 78 (top 12% of field)',
                'Active Portfolio Items: 42',
                'Trending Citations: +312 this month',
                '',
                'High-fit opportunities: 4',
                'Patents in pipeline: 5',
              ].join('\n')
              downloadText('innovation-brief.txt', brief)
              toast.success('Innovation brief generated')
            }}
          >
            <FileText className="h-4 w-4" /> Generate Innovation Brief
          </Button>
        </div>
      </Card>
    </div>
  )
}
