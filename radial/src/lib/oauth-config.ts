export type Provider = 'google' | 'github'

const exchangeUrl =
  (import.meta.env.VITE_OAUTH_EXCHANGE_URL as string | undefined) || '/api/oauth/exchange'

export const oauthConfig = {
  google: {
    clientId: (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) || '',
    clientName: 'Google',
  },
  github: {
    clientId: (import.meta.env.VITE_GITHUB_CLIENT_ID as string | undefined) || '',
    clientName: 'GitHub',
  },
  exchangeUrl,
  redirectUri: `${window.location.origin}/auth/callback`,
}

/** True when neither provider is configured — sign-in falls back to a demo session. */
export const demoMode = !oauthConfig.google.clientId && !oauthConfig.github.clientId

export function isProviderConfigured(provider: Provider): boolean {
  return Boolean(oauthConfig[provider].clientId)
}
