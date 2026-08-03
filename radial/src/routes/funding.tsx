import { createFileRoute } from '@tanstack/react-router'
import { BookmarkPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Badge, Button, Card, PageHeader, Tag } from '../components/ui'
import { funding } from '../lib/data'

export const Route = createFileRoute('/funding')({
  component: FundingPage,
})

function FundingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Funding Recommendations"
        subtitle="Grants ranked by semantic fit to your research profile and active pipeline."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {funding.map((f) => (
          <Card key={f.id} className="flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">{f.funder}</p>
                <h3 className="mt-1 text-base font-medium text-slate-900">{f.title}</h3>
              </div>
              <Badge tone={f.fit >= 85 ? 'emerald' : f.fit >= 75 ? 'amber' : 'slate'}>{f.fit}% fit</Badge>
            </div>

            <div className="mt-4 space-y-1 text-sm text-slate-600">
              <p><span className="text-slate-400">Amount:</span> {f.amount}</p>
              <p><span className="text-slate-400">Deadline:</span> {f.deadline}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {f.badges.map((b) => (
                <Tag key={b}>{b}</Tag>
              ))}
            </div>

            <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
              <Button
                className="flex-1"
                onClick={() => toast.success(`Application started: ${f.title}`)}
              >
                Apply
              </Button>
              <Button
                variant="outline"
                aria-label="Save opportunity"
                onClick={() => toast('Saved to portfolio')}
              >
                <BookmarkPlus className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
