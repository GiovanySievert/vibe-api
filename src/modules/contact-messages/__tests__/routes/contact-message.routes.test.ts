import { beforeAll, describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'

import { ContactMessageRoutes } from '../../infrastructure/http/routes'

describe('ContactMessageRoutes', () => {
  let app: Elysia

  beforeAll(() => {
    app = new Elysia().use(ContactMessageRoutes)
  })

  it('requires authentication for global contact message listing', async () => {
    const response = await app.handle(new Request('http://localhost/contact-messages/'))

    expect(response.status).toBe(401)
  })
})
