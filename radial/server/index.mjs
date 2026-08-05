import { pathToFileURL } from 'node:url'
import express from 'express'
import cors from 'cors'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || ''
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || ''

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

function decodeIdToken(idToken) {
  const payload = idToken.split('.')[1]
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
  const json = Buffer.from(base64, 'base64').toString('utf-8')
  return JSON.parse(json)
}

async function googleExchange(req, res) {
  try {
    const { code, code_verifier = '', redirect_uri } = req.body ?? {}
    if (!code) return res.status(400).json({ error: 'Missing authorization code' })
    if (!GOOGLE_CLIENT_ID) return res.status(500).json({ error: 'GOOGLE_CLIENT_ID is not configured' })

    const params = new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri,
      grant_type: 'authorization_code',
    })
    if (GOOGLE_CLIENT_SECRET) params.append('client_secret', GOOGLE_CLIENT_SECRET)
    if (code_verifier) params.append('code_verifier', code_verifier)

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: params,
    })

    const data = await response.json()
    if (!response.ok || data.error) {
      throw new Error(data.error_description || data.error || 'Google token exchange failed')
    }

    const claims = decodeIdToken(data.id_token)
    res.json({
      profile: {
        sub: claims.sub,
        name: claims.name || '',
        email: claims.email || '',
        picture: claims.picture || '',
      },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function githubExchange(req, res) {
  try {
    const { code, redirect_uri } = req.body ?? {}
    if (!code) return res.status(400).json({ error: 'Missing authorization code' })
    if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
      return res.status(500).json({ error: 'GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET are not configured' })
    }

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri,
      }),
    })

    const token = await tokenResponse.json()
    if (token.error) throw new Error(token.error_description || token.error)

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })
    const gh = await userResponse.json()
    if (!userResponse.ok) throw new Error(gh.message || 'Failed to fetch GitHub profile')

    res.json({
      profile: {
        sub: String(gh.id),
        name: gh.name || gh.login,
        email: gh.email || '',
        picture: gh.avatar_url || '',
      },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

app.post('/api/oauth/exchange/google', googleExchange)
app.post('/api/oauth/exchange/github', githubExchange)

export default app

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
if (isMain) {
  const port = Number(process.env.PORT) || 3001
  app.listen(port, () => {
    console.log(`Radial OAuth exchange server listening on http://localhost:${port}`)
  })
}
