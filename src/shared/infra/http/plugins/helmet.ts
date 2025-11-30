import { Elysia } from 'elysia'
import helmet from 'helmet'

export const helmetPlugin = new Elysia({ name: 'helmet' }).onAfterHandle(({ set }) => {
  const helmetMiddleware = helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"]
      }
    },
    crossOriginEmbedderPolicy: false
  })

  const mockReq: any = {
    headers: {},
    method: 'GET',
    url: '/'
  }

  const mockRes: any = {
    getHeaderNames: () => [],
    getHeader: () => undefined,
    setHeader: (name: string, value: string | string[]) => {
      set.headers[name] = Array.isArray(value) ? value.join(', ') : value
    },
    removeHeader: () => {}
  }

  helmetMiddleware(mockReq, mockRes, () => {})
})
