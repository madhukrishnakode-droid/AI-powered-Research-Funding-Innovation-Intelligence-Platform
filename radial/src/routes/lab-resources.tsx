import { createFileRoute } from '@tanstack/react-router'
import { CalendarPlus, Cpu, FlaskConical, Gauge, MapPin, Microscope } from 'lucide-react'
import { toast } from 'sonner'
import { Badge, Button, Card, CardTitle, PageHeader } from '../components/ui'
import { resources } from '../lib/data'
import type { Resource } from '../lib/data'

export const Route = createFileRoute('/lab-resources')({
  component: LabResourcesPage,
})

const typeIcons: Record<string, typeof FlaskConical> = {
  Imaging: Microscope,
  Computing: Cpu,
  Fabrication: FlaskConical,
  Measurement: Gauge,
  'Lab Space': FlaskConical,
}

function ResourceCard({ resource }: { resource: Resource }) {
  const Icon = typeIcons[resource.type] ?? FlaskConical
  const statusTone =
    resource.status === 'available' ? 'emerald' : resource.status === 'in-use' ? 'amber' : 'slate'
  const statusLabel =
    resource.status === 'available' ? 'Available' : resource.status === 'in-use' ? 'In Use' : 'Maintenance'

  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>
        <Badge tone={statusTone as 'emerald' | 'amber' | 'slate'}>{statusLabel}</Badge>
      </div>

      <h3 className="mt-4 text-base font-medium text-slate-900">{resource.name}</h3>
      <p className="mt-0.5 text-sm text-slate-600">{resource.type}</p>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
        <MapPin className="h-3.5 w-3.5" /> {resource.location}
      </p>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <Button
          className="w-full"
          variant="outline"
          disabled={resource.status !== 'available'}
          onClick={() => toast(`Booking requested: ${resource.name}`)}
        >
          <CalendarPlus className="h-4 w-4" /> Book
        </Button>
      </div>
    </Card>
  )
}

function LabResourcesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Lab Resources"
        subtitle="Equipment, computing, and lab space availability across your facilities."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {resources.map((r) => (
          <ResourceCard key={r.id} resource={r} />
        ))}
      </div>
    </div>
  )
}
