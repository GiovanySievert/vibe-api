import { adminMiddleware, authMiddleware } from '@src/shared/middlewares'
import { Elysia, t } from 'elysia'
import { AnalyticsModule } from '../../../analytics.module'

const metricsPeriodQuery = t.Object({
  period: t.Optional(t.Union([t.Literal('day'), t.Literal('week')]))
})

export const PlatformMetricsRoutes = (app: Elysia) => {
  const { platformMetricsController } = new AnalyticsModule()

  return app.use(authMiddleware).use(adminMiddleware).group('/admin/metrics', (app) =>
    app
      .get('/growth', (ctx) => platformMetricsController.growth(ctx), {
        admin: true,
        query: metricsPeriodQuery,
        detail: {
          tags: ['Metrics'],
          summary: 'Growth metrics',
          security: [{ cookieAuth: [] }]
        }
      })
      .get('/content', (ctx) => platformMetricsController.content(ctx), {
        admin: true,
        query: metricsPeriodQuery,
        detail: {
          tags: ['Metrics'],
          summary: 'Content metrics',
          security: [{ cookieAuth: [] }]
        }
      })
      .get('/trust-safety', (ctx) => platformMetricsController.trustSafety(ctx), {
        admin: true,
        query: metricsPeriodQuery,
        detail: {
          tags: ['Metrics'],
          summary: 'Trust and safety metrics',
          security: [{ cookieAuth: [] }]
        }
      })
      .get('/support', (ctx) => platformMetricsController.support(ctx), {
        admin: true,
        query: metricsPeriodQuery,
        detail: {
          tags: ['Metrics'],
          summary: 'Support metrics',
          security: [{ cookieAuth: [] }]
        }
      })
  )
}
