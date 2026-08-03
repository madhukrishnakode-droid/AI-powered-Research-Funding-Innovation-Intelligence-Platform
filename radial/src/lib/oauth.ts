import { oauthConfig, type Provider } from './oauth-config'

export type { Provider }

export type OAuthProfile = {
  sub: string
  name: string
  email: string
  picture: string
}

const stateKey = (provider: Provider) => `radial.oauth.state.${provider}`
const verifierKey = (provider: Provider) => `radial.oauth.verifier.${provider}`
const pendingProviderKey = 'radial.oauth.pending.provider'

function randomString(): string {
  const bytes = new Uint8Array(24)
  crypto.getRandomValues(bytes)
  return base64UrlEncode(bytes)
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = ''
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function createPkcePair() {
  const verifier = randomString()
  const data = new TextEncoder().encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return { verifier, challenge: base64UrlEncode(new Uint8Array(digest)) }
}

function buildRedirectSearch(params: Record<string, string>): string {
  return new URLSearchParams(params).toString()
}

/** Start an OAuth 2.0 Authorization Code flow by redirecting to the provider. */
export async function getAuthorizeUrl(provider: Provider): Promise<void> {
  const state = randomString()
  sessionStorage.setItem(stateKey(provider), state)
  sessionStorage.setItem(pendingProviderKey, provider)

  let url: string
  if (provider === 'google') {
    const { verifier, challenge } = await createPkcePair()
    sessionStorage.setItem(verifierKey(provider), verifier)
    url = `https://accounts.google.com/o/oauth2/v2/auth?${buildRedirectSearch({
      client_id: oauthConfig.google.clientId,
      redirect_uri: oauthConfig.redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      prompt: 'select_account',
      code_challenge: challenge,
      code_challenge_method: 'S256',
    })}`
  } else {
    url = `https://github.com/login/oauth/authorize?${buildRedirectSearch({
      client_id: oauthConfig.github.clientId,
      redirect_uri: oauthConfig.redirectUri,
      scope: 'read:user user:email',
      state,
    })}`
  }

  window.location.assign(url)
}

/** Exchange the authorization code for a profile via the configured exchange server. */
export async function completeLogin(
  provider: Provider,
  code: string,
  state: string,
): Promise<OAuthProfile> {
  const expectedState = sessionStorage.getItem(stateKey(provider))
  if (!expectedState || expectedState !== state) {
    throw new Error('OAuth state mismatch — please try signing in again')
  }

  const codeVerifier =
    provider === 'google' ? sessionStorage.getItem(verifierKey(provider)) || undefined : undefined

  const response = await fetch(`${oauthConfig.exchangeUrl}/${provider}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      redirect_uri: oauthConfig.redirectUri,
      code_verifier: codeVerifier,
    }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok || !data.profile) {
    throw new Error(data.error || 'OAuth exchange failed')
  }

  sessionStorage.removeItem(stateKey(provider))
  sessionStorage.removeItem(verifierKey(provider))
  sessionStorage.removeItem(pendingProviderKey)

  return data.profile as OAuthProfile
}
