import { createFileRoute } from '@tanstack/react-router'
import { Bookmark, BookmarkPlus } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import { Badge, Button, Card, PageHeader, Tag } from '../components/ui'
import { funding } from '../lib/data'

export const Route = createFileRoute('/funding')({
  component: FundingPage,
})

function FundingPage() {
  const [saved, setSaved] = useState<Record<string, boolean>>({})

  const toggleSaved = (id: string, title: string) => {
    setSaved((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      toast(next[id] ? `Saved "${title}" to portfolio` : `Removed "${title}" from portfolio`)
      return next
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Funding Recommendations"
        subtitle="Grants ranked by semantic fit to your research profile and active pipeline."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {funding.map((f) => {
          const isSaved = Boolean(saved[f.id])
          return (
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

              <div className="mt-5 border-t border-slate-100 pt-4">
                <Button
                  variant={isSaved ? 'primary' : 'outline'}
                  className="w-full"
                  aria-pressed={isSaved}
                  aria-label={isSaved ? 'Remove from portfolio' : 'Save to portfolio'}
                  onClick={() => toggleSaved(f.id, f.title)}
                >
                  {isSaved ? <Bookmark className="h-4 w-4 fill-current" /> : <BookmarkPlus className="h-4 w-4" />}
                  {isSaved ? 'Saved to portfolio' : 'Save opportunity'}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
