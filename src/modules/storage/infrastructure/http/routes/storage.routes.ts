import { authMiddleware } from '@src/shared/middlewares'
import { Elysia, t } from 'elysia'
import { StorageModule } from '../../../storage.module'

export const StorageRoutes = (app: Elysia) => {
  const { storageController } = new StorageModule()

  return app.use(authMiddleware).group('/storage', (app) =>
    app.post('/upload-url', (ctx) => storageController.getUploadUrl(ctx), {
      auth: true,
      body: t.Object({
        contentType: t.Union([t.Literal('image/jpeg'), t.Literal('image/png'), t.Literal('image/webp')]),
        folder: t.Optional(t.String({ minLength: 1, maxLength: 64 }))
      }),
      detail: {
        tags: ['Storage'],
        summary: 'Generate a pre-signed URL for direct image upload',
        security: [{ cookieAuth: [] }]
      }
    })
  )
}
