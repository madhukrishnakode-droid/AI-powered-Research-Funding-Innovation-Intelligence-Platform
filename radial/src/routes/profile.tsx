import { createFileRoute } from '@tanstack/react-router'
import { Avatar, Badge, Card, CardTitle, PageHeader, SectionLabel, Tag } from '../components/ui'
import { useAuth } from '../lib/auth-context'
import { profile } from '../lib/data'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { user } = useAuth()
  const displayName = user?.name || profile.name
  const givenInitial = displayName.charAt(0).toUpperCase() || 'E'
  const email = user?.email || 'elena.vasquez@unige.ch'
  return (
    <div className="space-y-6">
      <PageHeader
        title="Research Profile"
        subtitle="Your academic identity, metrics, and affiliations."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Identity card */}
        <Card className="text-center">
          {user?.picture ? (
            <img src={user.picture} alt="" className="mx-auto h-16 w-16 rounded-full object-cover" />
          ) : (
            <Avatar initials={givenInitial} size="lg" />
          )}
          <h2 className="mt-4 font-serif text-xl font-semibold text-slate-900">{displayName}</h2>
          <p className="mt-1 text-sm text-blue-600">{profile.title}</p>
          <p className="mt-1 text-sm text-slate-500">{profile.affiliation}</p>
          <Badge tone="teal" className="mt-3">Verified Researcher</Badge>
          <p className="mt-4 text-left text-sm text-slate-600">{email}</p>
          <p className="mt-3 text-left text-sm text-slate-600">{profile.bio}</p>
          <div className="mt-4 border-t border-slate-100 pt-4 text-left">
            <SectionLabel>Research Interests</SectionLabel>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {profile.interests.map((i) => (
                <Tag key={i}>{i}</Tag>
              ))}
            </div>
          </div>
        </Card>

        {/* Metrics + activity */}
        <div className="space-y-6 xl:col-span-2">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {profile.metrics.map((m) => (
              <Card key={m.label} className="text-center">
                <p className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text font-serif text-xl font-semibold text-transparent">{m.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">{m.label}</p>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardTitle>Recent Activity</CardTitle>
              <div className="mt-3 divide-y divide-slate-100">
                {profile.recentActivity.map((a) => (
                  <div key={a.detail} className="py-3 first:pt-0 last:pb-0">
                    <Badge tone="teal">{a.type}</Badge>
                    <p className="mt-1.5 text-sm text-slate-600">{a.detail}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{a.time}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardTitle>Affiliations</CardTitle>
              <div className="mt-3 divide-y divide-slate-100">
                {profile.affiliations.map((a) => (
                  <div key={a} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" />
                    <p className="text-sm text-slate-600">{a}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
