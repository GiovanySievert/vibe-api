import type { Elysia } from 'elysia'
import { appLogger } from '@src/config/logger'

enum HttpStatus {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}

enum ErrorCode {
  VALIDATION = 'VALIDATION_ERROR',
  PARSE = 'PARSE_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL = 'INTERNAL_SERVER_ERROR'
}

export const errorHandler = (app: Elysia) =>
  app.onError(({ code, error, set, request, path, params }) => {
    const errorDetails = {
      code,
      method: request.method,
      path,
      params,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    }

    appLogger.error('Request failed', errorDetails)

    if (code === 'VALIDATION') {
      set.status = HttpStatus.BAD_REQUEST
      return {
        code: ErrorCode.VALIDATION,
        message: error.message,
        details: error.all
      }
    }

    if (code === 'PARSE') {
      set.status = HttpStatus.BAD_REQUEST
      return {
        code: ErrorCode.PARSE,
        message: error.message
      }
    }

    if (code === 'NOT_FOUND') {
      set.status = HttpStatus.NOT_FOUND
      return {
        code: ErrorCode.NOT_FOUND,
        message: error.message
      }
    }

    set.status = HttpStatus.INTERNAL_SERVER_ERROR
    return {
      code: ErrorCode.INTERNAL,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      ...(process.env.NODE_ENV === 'development' && {
        details: error instanceof Error ? error.stack : error
      })
    }
  })
