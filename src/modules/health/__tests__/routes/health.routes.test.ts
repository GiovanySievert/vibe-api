import { describe, it, expect, beforeAll } from 'bun:test'
import { Elysia } from 'elysia'
import { healthRoutes } from '../../infrastructure/http/routes/health.routes'

describe('Health Routes', () => {
  let app: Elysia

  beforeAll(() => {
    app = new Elysia().use(healthRoutes)
  })

  it('should return health status with ok', async () => {
    const response = await app.handle(new Request('http://localhost/health'))

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.status).toBe('ok')
  })

  it('should return timestamp in ISO format', async () => {
    const response = await app.handle(new Request('http://localhost/health'))
    const data = await response.json()

    expect(data.timestamp).toBeDefined()
    expect(() => new Date(data.timestamp)).not.toThrow()
    expect(new Date(data.timestamp).toISOString()).toBe(data.timestamp)
  })

  it('should return uptime as a number', async () => {
    const response = await app.handle(new Request('http://localhost/health'))
    const data = await response.json()

    expect(data.uptime).toBeDefined()
    expect(typeof data.uptime).toBe('number')
    expect(data.uptime).toBeGreaterThan(0)
  })

  it('should return environment', async () => {
    const response = await app.handle(new Request('http://localhost/health'))
    const data = await response.json()

    expect(data.environment).toBeDefined()
    expect(typeof data.environment).toBe('string')
  })

  it('should return all required fields', async () => {
    const response = await app.handle(new Request('http://localhost/health'))
    const data = await response.json()

    expect(data).toHaveProperty('status')
    expect(data).toHaveProperty('timestamp')
    expect(data).toHaveProperty('uptime')
    expect(data).toHaveProperty('environment')
  })
})
