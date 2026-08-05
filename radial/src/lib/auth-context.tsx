import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { demoMode, isProviderConfigured } from './oauth-config'
import { completeLogin, getAuthorizeUrl, type Provider } from './oauth'

export type AuthUser = {
  sub: string
  name: string
  email: string
  picture: string
  provider: Provider | 'demo' | 'email'
}

const STORAGE_KEY = 'radial.auth.user'

const demoUser: AuthUser = {
  sub: 'demo',
  name: 'Dr. Elena Vasquez',
  email: 'elena.vasquez@radial.demo',
  picture: '',
  provider: 'demo',
}

type AuthContextValue = {
  user: AuthUser | null
  demoMode: boolean
  signIn: (provider: Provider) => void
  signInWithCredentials: (email: string, name: string) => boolean
  signOut: () => void
  complete: (provider: Provider, code: string, state: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

function persistUser(user: AuthUser | null) {
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  else localStorage.removeItem(STORAGE_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(() => loadUser())

  const signIn = useCallback(
    (provider: Provider) => {
      if (demoMode) {
        setUser(demoUser)
        persistUser(demoUser)
        toast.success(`Signed in as ${demoUser.name} (demo)`)
        void router.navigate({ to: '/' })
        return
      }

      if (!isProviderConfigured(provider)) {
        toast.error(`${provider === 'google' ? 'Google' : 'GitHub'} sign-in is not configured`)
        return
      }

      getAuthorizeUrl(provider).catch(() => toast.error('Could not start sign-in'))
    },
    [router],
  )

  const signInWithCredentials = useCallback(
    (email: string, name: string): boolean => {
      const trimmedEmail = email.trim().toLowerCase()
      const trimmedName = name.trim()
      if (!trimmedEmail) {
        toast.error('Please enter your email address')
        return false
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        toast.error('Please enter a valid email address')
        return false
      }
      if (!trimmedName) {
        toast.error('Please enter your name')
        return false
      }

      const next: AuthUser = {
        sub: `email:${trimmedEmail}`,
        name: trimmedName,
        email: trimmedEmail,
        picture: '',
        provider: 'email',
      }
      setUser(next)
      persistUser(next)
      toast.success(`Welcome, ${next.name}`)
      void router.navigate({ to: '/' })
      return true
    },
    [router],
  )

  const signOut = useCallback(() => {
    setUser(null)
    persistUser(null)
    toast('Signed out')
    void router.navigate({ to: '/' })
  }, [router])

  const complete = useCallback(
    async (provider: Provider, code: string, state: string): Promise<boolean> => {
      try {
        const profile = await completeLogin(provider, code, state)
        const next: AuthUser = { ...profile, provider }
        setUser(next)
        persistUser(next)
        toast.success(`Signed in as ${next.name}`)
        return true
      } catch (err) {
        const detail = err instanceof Error ? err.message : 'could not complete the OAuth handshake'
        toast.error(`Sign-in failed: ${detail}`, { duration: 8000 })
        return false
      }
    },
    [],
  )

  const value = useMemo<AuthContextValue>(
    () => ({ user, demoMode, signIn, signInWithCredentials, signOut, complete }),
    [user, signIn, signInWithCredentials, signOut, complete],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
