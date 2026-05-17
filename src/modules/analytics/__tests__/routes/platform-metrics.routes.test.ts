import { beforeAll, describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { PlatformMetricsRoutes } from '../../infrastructure/http/routes'

describe('PlatformMetricsRoutes', () => {
  let app: Elysia

  beforeAll(() => {
    app = new Elysia().use(PlatformMetricsRoutes)
  })

  it.each([
    '/admin/metrics/growth',
    '/admin/metrics/content',
    '/admin/metrics/trust-safety',
    '/admin/metrics/support'
  ])('requires authentication for %s', async (path) => {
    const response = await app.handle(new Request(`http://localhost${path}`))

    expect(response.status).toBe(401)
  })

  it.each([
    '/admin/metrics/growth',
    '/admin/metrics/content',
    '/admin/metrics/trust-safety',
    '/admin/metrics/support'
  ])('validates invalid period for %s', async (path) => {
    const response = await app.handle(new Request(`http://localhost${path}?period=month`))

    expect(response.status).toBe(422)
  })
})
