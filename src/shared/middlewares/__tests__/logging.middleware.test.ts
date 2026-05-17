import { describe, expect, it } from 'bun:test'

import { getLogPath } from '../logging.middleware'

describe('loggingMiddleware', () => {
  it('extracts paths without query strings', () => {
    const path = getLogPath('http://localhost/hello?token=secret&email=user@example.com')

    expect(path).toBe('/hello')
    expect(path).not.toContain('secret')
    expect(path).not.toContain('user@example.com')
  })
})
