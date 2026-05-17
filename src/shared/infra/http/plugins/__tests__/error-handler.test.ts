import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'

import { appLogger } from '@src/config/logger'
import { errorHandler } from '../error-handler'

const originalNodeEnv = process.env.NODE_ENV
const originalError = appLogger.error

describe('errorHandler', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'production'
    appLogger.error = () => {}
  })

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv
    appLogger.error = originalError
  })

  it('returns a generic internal error message in production', async () => {
    const app = new Elysia().use(errorHandler).get('/boom', () => {
      throw new Error('database url includes secret')
    })

    const response = await app.handle(new Request('http://localhost/boom'))
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.message).toBe('An unexpected error occurred')
    expect(body.details).toBeUndefined()
  })
})
