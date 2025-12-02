import winston from 'winston'
import LokiTransport from 'winston-loki'

const isProduction = process.env.NODE_ENV === 'production'
const lokiEnabled = process.env.LOKI_ENABLED === 'true'

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}] ${message}`
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`
    }
    return msg
  })
)

const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: consoleFormat
  })
]

if (lokiEnabled && process.env.LOKI_HOST && process.env.LOKI_USERNAME && process.env.LOKI_PASSWORD) {
  transports.push(
    new LokiTransport({
      host: process.env.LOKI_HOST,
      labels: {
        app: 'vibe-api',
        environment: process.env.NODE_ENV || 'development'
      },
      basicAuth: `${process.env.LOKI_USERNAME}:${process.env.LOKI_PASSWORD}`,
      json: true,
      batching: true,
      interval: 5,
      format: jsonFormat,
      replaceTimestamp: true,
      onConnectionError: (err) => {
        console.error('Loki connection error:', err)
      }
    })
  )
}

export const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  format: jsonFormat,
  transports,
  exceptionHandlers: [new winston.transports.Console({ format: consoleFormat })],
  rejectionHandlers: [new winston.transports.Console({ format: consoleFormat })]
})

const logError = (message: string, metadata?: Record<string, any>) => {
  if (!metadata) {
    logger.error(message)
    return
  }

  const hasStack = metadata.stack !== undefined
  const hasMessage = metadata.message !== undefined
  const hasName = metadata.name !== undefined

  if (hasStack && hasMessage) {
    logger.error(message, metadata)
  } else if (metadata.error instanceof Error) {
    const { error, ...rest } = metadata
    logger.error(message, {
      message: error.message,
      stack: error.stack,
      name: error.name,
      ...rest
    })
  } else {
    logger.error(message, metadata)
  }
}

const logInfo = (message: string, metadata?: Record<string, any>) => {
  logger.info(message, metadata)
}

const logDebug = (message: string, metadata?: Record<string, any>) => {
  logger.debug(message, metadata)
}

const logWarn = (message: string, metadata?: Record<string, any>) => {
  logger.warn(message, metadata)
}

export const appLogger = {
  info: logInfo,
  debug: logDebug,
  warn: logWarn,
  error: logError
}

logger.info('Logger initialized', {
  environment: process.env.NODE_ENV,
  lokiEnabled,
  logLevel: logger.level
})
