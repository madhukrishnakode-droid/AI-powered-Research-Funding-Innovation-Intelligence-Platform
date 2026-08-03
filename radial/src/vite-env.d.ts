/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID?: string
  readonly VITE_GITHUB_CLIENT_ID?: string
  readonly VITE_OAUTH_EXCHANGE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
