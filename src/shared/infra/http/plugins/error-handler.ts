import type { Elysia } from 'elysia'
import { appLogger } from '@src/config/logger'

enum HttpStatus {
  BAD_REQUEST = 400,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500
}

enum ErrorCode {
  VALIDATION = 'VALIDATION_ERROR',
  PARSE = 'PARSE_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',
  INTERNAL = 'INTERNAL_SERVER_ERROR'
}

const DOMAIN_ERRORS: Record<string, { status: number; code: string }> = {
  CannotReportYourselfException: { status: HttpStatus.BAD_REQUEST, code: ErrorCode.VALIDATION },
  UserAlreadyReportedException: { status: HttpStatus.CONFLICT, code: ErrorCode.CONFLICT },
  EventNotFoundException: { status: HttpStatus.NOT_FOUND, code: ErrorCode.NOT_FOUND },
  EventParticipantNotFoundException: { status: HttpStatus.NOT_FOUND, code: ErrorCode.NOT_FOUND },
  EventNotOwnerException: { status: HttpStatus.FORBIDDEN, code: ErrorCode.FORBIDDEN },
  EventInvitationAlreadyRespondedException: { status: HttpStatus.CONFLICT, code: ErrorCode.CONFLICT },
  PlaceReviewNotFoundException: { status: HttpStatus.NOT_FOUND, code: ErrorCode.NOT_FOUND },
  UnauthorizedPlaceReviewActionException: { status: HttpStatus.FORBIDDEN, code: ErrorCode.FORBIDDEN },
  PlaceReviewAlreadyExistsException: { status: HttpStatus.CONFLICT, code: ErrorCode.CONFLICT }
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

    // if (process.env.NODE_ENV === 'development') {
    console.error('ERROR:', errorDetails)
    // } else {
    // appLogger.error('Request failed', errorDetails)
    // }

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

    if (error instanceof Error && error.name in DOMAIN_ERRORS) {
      const response = DOMAIN_ERRORS[error.name]
      set.status = response.status
      return { code: response.code, message: error.message }
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
