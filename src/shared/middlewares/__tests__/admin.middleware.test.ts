import { afterEach, describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'

import { auth } from '@src/config/auth'
import { adminMiddleware, hasAdminAccess } from '../admin.middleware'

const originalGetSession = auth.api.getSession

describe('adminMiddleware', () => {
  afterEach(() => {
    auth.api.getSession = originalGetSession
  })

  it('accepts users with the admin role', async () => {
    expect(await hasAdminAccess({ id: 'user-1', role: 'admin', emailVerified: true })).toBe(true)
  })

  it('rejects regular users', async () => {
    expect(await hasAdminAccess({ id: 'user-1', role: 'user', emailVerified: true })).toBe(false)
  })

  it('rejects unverified admins', async () => {
    expect(await hasAdminAccess({ id: 'admin-1', role: 'admin', emailVerified: false })).toBe(false)
  })

  it('returns 403 for authenticated non-admin users on admin routes', async () => {
    auth.api.getSession = async () =>
      ({
        user: {
          id: 'user-1',
          email: 'user@example.com',
          emailVerified: true,
          role: 'user'
        },
        session: { id: 'session-1' }
      }) as never

    const app = new Elysia().use(adminMiddleware).get('/internal', () => ({ ok: true }), { admin: true })
    const response = await app.handle(new Request('http://localhost/internal'))

    expect(response.status).toBe(403)
  })

  it('allows verified admins on admin routes', async () => {
    auth.api.getSession = async () =>
      ({
        user: {
          id: 'admin-1',
          email: 'admin@example.com',
          emailVerified: true,
          role: 'admin'
        },
        session: { id: 'session-1' }
      }) as never

    const app = new Elysia().use(adminMiddleware).get('/internal', () => ({ ok: true }), { admin: true })
    const response = await app.handle(new Request('http://localhost/internal'))

    expect(response.status).toBe(200)
  })
})
