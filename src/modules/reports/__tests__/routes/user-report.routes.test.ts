import { beforeAll, describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'

import { UserReportRoutes } from '../../infrastructure/http/routes'

describe('UserReportRoutes', () => {
  let app: Elysia

  beforeAll(() => {
    app = new Elysia().use(UserReportRoutes)
  })

  it('requires authentication for global report listing', async () => {
    const response = await app.handle(new Request('http://localhost/reports/'))

    expect(response.status).toBe(401)
  })
})
