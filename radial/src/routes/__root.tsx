import { createRootRoute, HeadContent, Outlet, Scripts, useRouterState } from '@tanstack/react-router'
import { useState } from 'react'
import { Toaster } from 'sonner'
import { AppSidebar } from '../components/app-sidebar'
import { SignInScreen } from '../components/sign-in'
import { TopBar } from '../components/top-bar'
import { AuthProvider, useAuth } from '../lib/auth-context'
import { cn } from '../lib/utils'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Radial — Research Intelligence Workspace' },
      { name: 'description', content: 'Track trends, patents, funding, and innovation across your research portfolio.' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap',
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <AuthProvider>
      <RootInner />
    </AuthProvider>
  )
}

function RootInner() {
  const { user } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isCallback = pathname === '/auth/callback'
  const signedIn = Boolean(user)

  return (
    <>
      <HeadContent />
      <div className="min-h-screen font-sans text-slate-100 antialiased">
        {!signedIn && !isCallback ? (
          <SignInScreen />
        ) : (
          <>
            <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
            <div className={cn('flex min-h-screen flex-col transition-all duration-300', collapsed ? 'ml-16' : 'ml-64')}>
              <TopBar />
              <main className="flex-1 p-6">
                <Outlet />
              </main>
            </div>
          </>
        )}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1E293B',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#F1F5F9',
            },
          }}
        />
      </div>
      <Scripts />
    </>
  )
}
