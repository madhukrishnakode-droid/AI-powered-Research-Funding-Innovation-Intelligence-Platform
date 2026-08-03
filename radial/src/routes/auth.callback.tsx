import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { useAuth } from '../lib/auth-context'
import type { Provider } from '../lib/oauth'

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallbackPage,
})

function AuthCallbackPage() {
  const router = useRouter()
  const { complete } = useAuth()
  const processed = useRef(false)

  useEffect(() => {
    if (processed.current) return
    processed.current = true

    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state')
    const provider =
      (sessionStorage.getItem('radial.oauth.pending.provider') as Provider | null) ?? 'google'

    const run = async () => {
      if (!code || !state) {
        await router.navigate({ to: '/' })
        return
      }
      await complete(provider, code, state)
      await router.navigate({ to: '/' })
    }

    void run()
  }, [complete, router])

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400" />
        <p className="mt-4 text-sm text-slate-400">Completing sign-in...</p>
      </div>
    </div>
  )
}
