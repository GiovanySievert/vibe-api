import { Elysia } from 'elysia'
import { randomUUID } from 'crypto'
import { appLogger } from '@src/config/logger'

export const getLogPath = (url: string): string => new URL(url).pathname

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
    const path = getLogPath(request.url)

    appLogger.info('HTTP Request', {
      requestId,
      method: request.method,
      path,
      event: 'request_started'
    })
  })
  .onAfterHandle(({ request, requestId, startTime }) => {
    const duration = Date.now() - startTime
    const path = getLogPath(request.url)

    appLogger.info('HTTP Response', {
      requestId,
      method: request.method,
      path,
      duration_ms: duration,
      event: 'request_completed',
      status: 'success'
    })
  })
  .onAfterResponse(({ request, set, requestId, startTime }) => {
    const duration = Date.now() - startTime
    const path = getLogPath(request.url)

    if (set.status && Number(set.status) >= 400) {
      appLogger.error('HTTP Error Response', {
        requestId,
        method: request.method,
        path,
        duration_ms: duration,
        status: set.status,
        event: 'request_failed'
      })
    }
  })
