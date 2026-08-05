import { createFileRoute } from '@tanstack/react-router'
import { BadgeDollarSign, BellRing, BookOpenCheck, CheckCheck, FlaskConical, Users } from 'lucide-react'
import { useState } from 'react'
import { Button, Card, PageHeader } from '../components/ui'
import { alerts as initialAlerts } from '../lib/data'
import type { AlertItem } from '../lib/data'

export const Route = createFileRoute('/alerts')({
  component: AlertsPage,
})

const typeMeta: Record<AlertItem['type'], { icon: typeof BellRing; label: string }> = {
  patent: { icon: FlaskConical, label: 'Patent' },
  grant: { icon: BadgeDollarSign, label: 'Grant' },
  citation: { icon: BookOpenCheck, label: 'Citation' },
  system: { icon: BellRing, label: 'System' },
  collab: { icon: Users, label: 'Collaboration' },
}

function AlertList({
  items,
  title,
  onMarkRead,
  canMarkRead,
}: {
  items: AlertItem[]
  title: string
  onMarkRead: (id: string) => void
  canMarkRead: boolean
}) {
  if (items.length === 0) return null
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <Card className="space-y-0 divide-y divide-slate-100">
        {items.map((alert) => {
          const meta = typeMeta[alert.type]
          const Icon = meta.icon
          return (
            <div key={alert.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600/10 to-purple-500/10 text-purple-600">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-600">{alert.message}</p>
                <p className="mt-0.5 text-xs text-slate-500">{meta.label} · {alert.time}</p>
              </div>
              {canMarkRead && (
                <Button
                  variant="ghost"
                  aria-label="Mark as read"
                  onClick={() => onMarkRead(alert.id)}
                >
                  <CheckCheck className="h-4 w-4" />
                </Button>
              )}
            </div>
          )
        })}
      </Card>
    </section>
  )
}

function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts)

  const unread = alerts.filter((a) => !a.read)
  const read = alerts.filter((a) => a.read)

  const markRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)))
  }

  const markAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alerts"
        subtitle="Patent updates, grant deadlines, citation milestones, and system notifications."
      />

      <AlertList items={unread} title="New" onMarkRead={markRead} canMarkRead />
      <AlertList items={read} title="Earlier" onMarkRead={markRead} canMarkRead={false} />

      {unread.length > 0 && (
        <Button variant="outline" onClick={markAllRead}>
          <CheckCheck className="h-4 w-4" /> Mark all as read
        </Button>
      )}
    </div>
  )
}
