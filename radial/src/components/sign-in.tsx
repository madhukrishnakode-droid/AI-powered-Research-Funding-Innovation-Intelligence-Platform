import { useState, type FormEvent } from 'react'
import { Atom, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../lib/auth-context'
import type { Provider } from '../lib/oauth'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  )
}

export function SignInScreen() {
  const { signIn, signInWithCredentials, demoMode } = useAuth()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  const handleSignIn = (provider: Provider) => {
    try {
      signIn(provider)
    } catch {
      toast.error('Could not start sign-in')
    }
  }

  const handleCredentialSignIn = (event: FormEvent) => {
    event.preventDefault()
    signInWithCredentials(email, name)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-glow-blue">
            <Atom className="h-7 w-7" />
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-8 shadow-card">
          <h1 className="text-center font-serif text-2xl font-semibold text-slate-900">Welcome to Radial</h1>
          <p className="mt-2 text-center text-sm text-slate-500">
            Sign in with your email and name, or continue with an authentication provider.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleCredentialSignIn}>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                Email (Gmail)
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-cyan-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                autoComplete="name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-cyan-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-primary-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-glow-blue transition-all duration-300 hover:brightness-110"
            >
              Sign in
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">or continue with</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleSignIn('google')}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition-all duration-300 hover:bg-slate-50"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </div>

          {demoMode && (
            <p className="mt-6 rounded-lg border border-amber-400/40 bg-amber-50 p-3 text-center text-xs leading-relaxed text-amber-700">
              Demo mode — no OAuth credentials configured. Sign-in uses a demo profile.
              <br />
              See <code className="text-blue-700">.env.example</code> to enable Google or GitHub.
            </p>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          Radial &middot; Research Intelligence Workspace
        </p>
      </div>
    </div>
  )
}
