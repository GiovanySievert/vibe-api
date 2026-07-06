import type { Elysia } from 'elysia'
import { appLogger } from '@src/config/logger'

enum HttpStatus {
  BAD_REQUEST = 400,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500
}

enum ErrorCode {
  VALIDATION = 'VALIDATION_ERROR',
  PARSE = 'PARSE_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',
  INTERNAL = 'INTERNAL_SERVER_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',
  OUT_OF_RANGE = 'OUT_OF_RANGE',
  PHOTO_REQUIRED = 'PHOTO_REQUIRED'
}

const DOMAIN_ERRORS: Record<string, { status: number; code: string }> = {
  CannotReportYourselfException: { status: HttpStatus.BAD_REQUEST, code: ErrorCode.VALIDATION },
  UserAlreadyReportedException: { status: HttpStatus.CONFLICT, code: ErrorCode.CONFLICT },
  EventNotFoundException: { status: HttpStatus.NOT_FOUND, code: ErrorCode.NOT_FOUND },
  EventParticipantNotFoundException: { status: HttpStatus.NOT_FOUND, code: ErrorCode.NOT_FOUND },
  EventNotOwnerException: { status: HttpStatus.FORBIDDEN, code: ErrorCode.FORBIDDEN },
  EventInvitationAlreadyRespondedException: { status: HttpStatus.CONFLICT, code: ErrorCode.CONFLICT },
  PlaceNotFoundException: { status: HttpStatus.NOT_FOUND, code: ErrorCode.NOT_FOUND },
  PlaceReviewNotFoundException: { status: HttpStatus.NOT_FOUND, code: ErrorCode.NOT_FOUND },
  UnauthorizedPlaceReviewActionException: { status: HttpStatus.FORBIDDEN, code: ErrorCode.FORBIDDEN },
  PlaceReviewAlreadyExistsException: { status: HttpStatus.CONFLICT, code: ErrorCode.CONFLICT },
  PlaceReviewCooldownException: { status: HttpStatus.TOO_MANY_REQUESTS, code: ErrorCode.RATE_LIMITED },
  PlaceReviewOutOfRangeException: { status: HttpStatus.UNPROCESSABLE_ENTITY, code: ErrorCode.OUT_OF_RANGE },
  PlaceReviewPhotoRequiredException: { status: HttpStatus.UNPROCESSABLE_ENTITY, code: ErrorCode.PHOTO_REQUIRED },
  AnonymousReviewWithSelfieException: { status: HttpStatus.UNPROCESSABLE_ENTITY, code: ErrorCode.VALIDATION },
  InvalidStorageFolderException: { status: HttpStatus.BAD_REQUEST, code: ErrorCode.VALIDATION },
  ProfileBadgeSelectionLimitException: { status: HttpStatus.BAD_REQUEST, code: ErrorCode.VALIDATION },
  InvalidProfileBadgeSelectionException: { status: HttpStatus.BAD_REQUEST, code: ErrorCode.VALIDATION },
  DuplicateProfileBadgeSelectionException: { status: HttpStatus.BAD_REQUEST, code: ErrorCode.VALIDATION },
  UnsupportedContentTypeException: { status: HttpStatus.BAD_REQUEST, code: ErrorCode.VALIDATION }
}

const RESERVED_ERROR_FIELDS = new Set(['name', 'message', 'stack', 'cause'])

const extractDomainErrorDetails = (error: Error): Record<string, unknown> => {
  const details: Record<string, unknown> = {}
  for (const key of Object.keys(error)) {
    if (RESERVED_ERROR_FIELDS.has(key)) continue
    details[key] = (error as unknown as Record<string, unknown>)[key]
  }
  return details
}

export const errorHandler = (app: Elysia) =>
  app.onError(({ code, error, set, request, path, params }) => {
    const isProduction = process.env.NODE_ENV === 'production'
    const errorDetails = {
      code,
      method: request.method,
      path,
      params,
      name: error instanceof Error ? error.name : undefined,
      ...(!isProduction && {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      })
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

    if (error instanceof Error && error.name in DOMAIN_ERRORS) {
      const response = DOMAIN_ERRORS[error.name]
      set.status = response.status
      return { code: response.code, message: error.message, ...extractDomainErrorDetails(error) }
    }

    set.status = HttpStatus.INTERNAL_SERVER_ERROR
    return {
      code: ErrorCode.INTERNAL,
      message: isProduction
        ? 'An unexpected error occurred'
        : error instanceof Error
          ? error.message
          : 'An unexpected error occurred',
      ...(!isProduction && {
        details: error instanceof Error ? error.stack : error
      })
    }
  })
