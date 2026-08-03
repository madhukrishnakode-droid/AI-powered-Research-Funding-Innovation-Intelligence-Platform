import { createFileRoute } from '@tanstack/react-router'
import { Link2 } from 'lucide-react'
import { toast } from 'sonner'
import { Badge, Button, Card, CardTitle, PageHeader, SectionLabel } from '../components/ui'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Configure your profile, notifications, connected accounts, and data sources."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* Profile settings */}
          <Card>
            <SectionLabel>Profile Settings</SectionLabel>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm text-slate-600">Display name</span>
                <input
                  defaultValue="Dr. Elena Vasquez"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm text-slate-600">Institutional email</span>
                <input
                  defaultValue="elena.vasquez@unige.ch"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm text-slate-600">Primary affiliation</span>
                <input
                  defaultValue="Center for Nanoscale Innovation, University of Geneva"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm text-slate-600">Time zone</span>
                <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500/60 focus:outline-none">
                  <option>Europe/Zurich (CET)</option>
                  <option>America/New_York</option>
                  <option>Asia/Tokyo</option>
                </select>
              </label>
            </div>
            <div className="mt-4">
              <Button onClick={() => toast.success('Profile settings saved')}>Save profile</Button>
            </div>
          </Card>

          {/* Notification preferences */}
          <Card>
            <SectionLabel>Notification Preferences</SectionLabel>
            <div className="mt-4 divide-y divide-slate-100">
              {[
                { label: 'Funding deadlines', desc: 'Reminders when matched opportunities approach deadline' },
                { label: 'Patent status changes', desc: 'Examination reports, grants, and office actions' },
                { label: 'Citation milestones', desc: 'When your work crosses citation thresholds' },
                { label: 'Report generation', desc: 'When new intelligence reports are ready' },
              ].map((n) => (
                <label key={n.label} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm text-slate-900">{n.label}</p>
                    <p className="text-xs text-slate-500">{n.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 accent-blue-600" />
                </label>
              ))}
            </div>
            <div className="mt-4">
              <Button onClick={() => toast.success('Notification preferences saved')}>Save preferences</Button>
            </div>
          </Card>

          {/* Data sources */}
          <Card>
            <SectionLabel>Data Sources</SectionLabel>
            <div className="mt-4 divide-y divide-slate-100">
              {[
                { name: 'ORCID', detail: 'Synchronized · 58 publications', linked: true },
                { name: 'Scopus', detail: 'Synchronized · citation metadata', linked: true },
                { name: 'USPTO / EPO', detail: 'Synchronized · 5 patents', linked: true },
                { name: 'Dimensions Analytics', detail: 'Not connected', linked: false },
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600">
                      <Link2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-900">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.detail}</p>
                    </div>
                  </div>
                  {s.linked ? <Badge tone="emerald">Connected</Badge> : <Button variant="outline">Connect</Button>}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Connected accounts */}
        <div className="space-y-6">
          <Card>
            <CardTitle>Connected Accounts</CardTitle>
            <div className="mt-4 space-y-3">
              {['Google Scholar', 'X / Twitter', 'LinkedIn'].map((a) => (
                <div key={a} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <p className="text-sm text-slate-900">{a}</p>
                  <Badge tone="teal">Linked</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-amber-400/50">
            <CardTitle>Danger Zone</CardTitle>
            <p className="mt-2 text-sm text-slate-600">
              Export or permanently delete your research profile and workspace data.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Button variant="outline" onClick={() => toast('Export requested — link sent to your email')}>
                Export data
              </Button>
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => toast.error('This action is not available in the demo')}
              >
                Delete workspace
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
