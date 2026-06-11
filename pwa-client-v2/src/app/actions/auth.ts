'use server'

import { cookies } from 'next/headers'
import { z } from 'zod'
import { AuthResponseSchema } from '@/schemas/auth'
import type { User } from '@/types/auth'

// Private env var (not exposed to client bundle) — falls back to NEXT_PUBLIC for local dev
function getApiUrl(): string {
  const base = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
  const normalized = base.replace(/\/$/, '')
  return normalized.endsWith('/api') ? normalized : `${normalized}/api`
}

const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 30, // 30 days
}

// ─── Schemas (server-side validation — input never reaches the API if invalid) ─
//
// `.trim().toLowerCase()` sur l'email : iOS Safari (autofill / autocapitalisation)
// peut injecter une majuscule ou un espace. La base Postgres étant sensible à la
// casse, "Ltiollier30@…" ≠ "ltiollier30@…" → 401. On normalise pour éviter ça.

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Minimum 2 caractères').max(100),
    email: z.string().trim().toLowerCase().email('Email invalide'),
    password: z.string().min(8, 'Minimum 8 caractères'),
    password_confirmation: z.string(),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['password_confirmation'],
  })

// ─── Return type ────────────────────────────────────────────────────────────────
//
// IMPORTANT : on RETOURNE les erreurs attendues au lieu de les `throw`.
// En build production, toute erreur levée dans une Server Action est masquée par
// React ("An error occurred in the Server Components render…" + digest), donc un
// `throw new Error('Email ou mot de passe incorrect')` n'arrive jamais au client
// avec son vrai message. Un résultat structuré contourne cette redaction.

type AuthField = 'email' | 'password' | 'name' | 'password_confirmation'

export type AuthActionResult =
  | { ok: true; user: User; token: string }
  | { ok: false; error: string; field?: AuthField }

// ─── Shared fetch helper ───────────────────────────────────────────────────────

async function callAuthApi(
  endpoint: string,
  payload: Record<string, string>,
): Promise<AuthActionResult> {
  let res: Response
  try {
    res = await fetch(`${getApiUrl()}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })
  } catch (err) {
    console.error('[auth] échec réseau vers', getApiUrl() + endpoint, err)
    return { ok: false, error: 'Impossible de joindre le serveur. Réessayez.' }
  }

  const body = await res.json().catch(() => ({} as Record<string, unknown>))

  if (!res.ok) {
    const message = typeof body.message === 'string' ? body.message : undefined
    if (res.status === 401 || res.status === 422) {
      return { ok: false, error: message ?? 'Email ou mot de passe incorrect', field: 'password' }
    }
    console.error('[auth] réponse API', res.status, body)
    return { ok: false, error: message ?? 'Erreur de connexion' }
  }

  const validated = AuthResponseSchema.safeParse(body)
  if (!validated.success) {
    console.error('[auth] réponse inattendue', validated.error)
    return { ok: false, error: 'Réponse serveur inattendue' }
  }

  // HTTP-only server cookie — lets settings Server Actions call the API
  // without the client needing to pass the token as a parameter
  const cookieStore = await cookies()
  cookieStore.set('auth_token', validated.data.token, AUTH_COOKIE_OPTIONS)

  return { ok: true, user: validated.data.user, token: validated.data.token }
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function loginAction(email: string, password: string): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse({ email, password })
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return { ok: false, error: issue.message, field: issue.path[0] as AuthField }
  }
  return callAuthApi('/auth/login', parsed.data)
}

export async function registerAction(
  name: string,
  email: string,
  password: string,
  password_confirmation: string,
): Promise<AuthActionResult> {
  const parsed = registerSchema.safeParse({ name, email, password, password_confirmation })
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return { ok: false, error: issue.message, field: issue.path[0] as AuthField }
  }
  return callAuthApi('/auth/register', parsed.data as Record<string, string>)
}

export async function clearAuthCookieAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
}
