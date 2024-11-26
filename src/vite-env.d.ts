/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_POKEMON_TCG_API_KEY: string
  readonly VITE_STRIPE_PUBLIC_KEY: string
  readonly VITE_PAYPAL_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
