import { authMiddleware } from '@src/shared/middlewares'
import { Elysia, t } from 'elysia'
import { ReportsModule } from '../../../reports.module'

export const UserReportRoutes = (app: Elysia) => {
  const { userReportController } = new ReportsModule()

  return app.use(authMiddleware).group('/reports', (app) =>
    app
      .post('/:userId', (ctx) => userReportController.report(ctx), {
        auth: true,
        params: t.Object({
          userId: t.String()
        }),
        body: t.Object({
          reason: t.Union([
            t.Literal('spam'),
            t.Literal('inappropriate_content'),
            t.Literal('harassment'),
            t.Literal('fake_account'),
            t.Literal('other')
          ]),
          description: t.Optional(t.String())
        }),
        detail: {
          tags: ['User Reports'],
          summary: 'Report a user',
          security: [{ cookieAuth: [] }]
        }
      })
      .get('/', (ctx) => userReportController.list(ctx), {
        auth: true,
        detail: {
          tags: ['User Reports'],
          summary: 'List all reports',
          security: [{ cookieAuth: [] }]
        }
      })
  )
}
