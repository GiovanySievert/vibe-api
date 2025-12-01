import { Elysia } from 'elysia'
import { randomUUID } from 'crypto'
import { appLogger } from '@src/config/logger'

export const loggingMiddleware = new Elysia({ name: 'logging' })
  .derive(() => {
    const requestId = randomUUID()
    const startTime = Date.now()

    return {
      requestId,
      startTime
    }
  })
  .onBeforeHandle(({ request, requestId }) => {
    appLogger.info('HTTP Request', {
      requestId,
      method: request.method,
      url: request.url,
      event: 'request_started'
    })
  })
  .onAfterHandle(({ request, requestId, startTime }) => {
    const duration = Date.now() - startTime

    appLogger.info('HTTP Response', {
      requestId,
      method: request.method,
      url: request.url,
      duration_ms: duration,
      event: 'request_completed',
      status: 'success'
    })
  })
  .onAfterResponse(({ request, set, requestId, startTime }) => {
    const duration = Date.now() - startTime

    if (set.status && Number(set.status) >= 400) {
      appLogger.error('HTTP Error Response', {
        requestId,
        method: request.method,
        url: request.url,
        duration_ms: duration,
        status: set.status,
        event: 'request_failed'
      })
    }
  })
