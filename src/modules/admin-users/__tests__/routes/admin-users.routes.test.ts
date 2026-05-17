import { beforeAll, describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { AdminUsersRoutes } from '../../infrastructure/http/routes'

describe('AdminUsersRoutes', () => {
  let app: Elysia

  beforeAll(() => {
    app = new Elysia().use(AdminUsersRoutes)
  })

  it('requires authentication for user listing', async () => {
    const response = await app.handle(new Request('http://localhost/admin/users/'))

    expect(response.status).toBe(401)
  })

  it('requires authentication for banning a user', async () => {
    const response = await app.handle(
      new Request('http://localhost/admin/users/user-1/ban', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ banReason: 'abuse' })
      })
    )

    expect(response.status).toBe(401)
  })

  it('requires authentication for unbanning a user', async () => {
    const response = await app.handle(
      new Request('http://localhost/admin/users/user-1/ban', {
        method: 'DELETE'
      })
    )

    expect(response.status).toBe(401)
  })

  it('validates invalid limit query', async () => {
    const response = await app.handle(new Request('http://localhost/admin/users/?limit=0'))

    expect(response.status).toBe(422)
  })

  it('validates invalid offset query', async () => {
    const response = await app.handle(new Request('http://localhost/admin/users/?offset=-1'))

    expect(response.status).toBe(422)
  })

  it('validates ban request body', async () => {
    const response = await app.handle(
      new Request('http://localhost/admin/users/user-1/ban', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ banReason: 1 })
      })
    )

    expect(response.status).toBe(422)
  })
})
