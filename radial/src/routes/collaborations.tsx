import { createFileRoute } from '@tanstack/react-router'
import { MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { Badge, Button, Card, CardTitle, PageHeader, Tag } from '../components/ui'
import { collaborators } from '../lib/data'

export const Route = createFileRoute('/collaborations')({
  component: CollaborationsPage,
})

function CollaborationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Collaborations"
        subtitle="Your research partner network, ranked by collaboration affinity."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {collaborators.map((c) => (
          <Card key={c.id} className="flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-medium text-slate-900">{c.name}</h3>
                <p className="mt-0.5 text-sm text-slate-500">{c.institution}</p>
              </div>
              <Badge tone={c.score >= 90 ? 'emerald' : 'amber'}>{c.score}% overlap</Badge>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {c.topics.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => toast(`Message sent to ${c.name}`)}
              >
                <MessageSquare className="h-4 w-4" /> Message
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardTitle>Recommendation Engine</CardTitle>
        <p className="mt-1 text-sm text-slate-600">
          Based on your recent activity, Radial suggests expanding collaborations toward
          membrane manufacturing and quantum sensing groups.
        </p>
      </Card>
    </div>
  )
}
