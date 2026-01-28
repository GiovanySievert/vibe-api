import { authMiddleware } from '@src/shared/middlewares'
import { Elysia, t } from 'elysia'
import { PlaceReviewModule } from '../../../place-review.module'

export const PlaceReviewRoutes = (app: Elysia) => {
  const { placeReviewController } = new PlaceReviewModule()

  return app.use(authMiddleware).group('/place-reviews', (app) =>
    app
      .post('/', (ctx) => placeReviewController.create(ctx), {
        auth: true,
        body: t.Object({
          placeId: t.String(),
          rating: t.Number({ minimum: 1, maximum: 5 }),
          comment: t.Optional(t.String())
        }),
        detail: {
          tags: ['Place Reviews'],
          summary: 'Create a place review',
          security: [{ cookieAuth: [] }]
        }
      })
      .get('/:reviewId', (ctx) => placeReviewController.getById(ctx), {
        auth: true,
        params: t.Object({
          reviewId: t.String()
        }),
        detail: {
          tags: ['Place Reviews'],
          summary: 'Get a place review by ID',
          security: [{ cookieAuth: [] }]
        }
      })
      .get('/place/:placeId', (ctx) => placeReviewController.listByPlace(ctx), {
        auth: true,
        params: t.Object({
          placeId: t.String()
        }),
        query: t.Object({
          page: t.Optional(t.Numeric({ minimum: 1 }))
        }),
        detail: {
          tags: ['Place Reviews'],
          summary: 'List reviews for a place',
          security: [{ cookieAuth: [] }]
        }
      })
      .get('/user/:userId', (ctx) => placeReviewController.listByUser(ctx), {
        auth: true,
        params: t.Object({
          userId: t.String()
        }),
        query: t.Object({
          page: t.Optional(t.Numeric({ minimum: 1 }))
        }),
        detail: {
          tags: ['Place Reviews'],
          summary: 'List reviews by a user',
          security: [{ cookieAuth: [] }]
        }
      })
      .patch('/:reviewId', (ctx) => placeReviewController.update(ctx), {
        auth: true,
        params: t.Object({
          reviewId: t.String()
        }),
        body: t.Object({
          rating: t.Optional(t.Number({ minimum: 1, maximum: 5 })),
          comment: t.Optional(t.String())
        }),
        detail: {
          tags: ['Place Reviews'],
          summary: 'Update a place review',
          security: [{ cookieAuth: [] }]
        }
      })
      .delete('/:reviewId', (ctx) => placeReviewController.delete(ctx), {
        auth: true,
        params: t.Object({
          reviewId: t.String()
        }),
        detail: {
          tags: ['Place Reviews'],
          summary: 'Delete a place review',
          security: [{ cookieAuth: [] }]
        }
      })
  )
}
