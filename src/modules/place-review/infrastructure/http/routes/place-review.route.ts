import { authMiddleware } from '@src/shared/middlewares'
import { Elysia, t } from 'elysia'
import { PlaceReviewModule } from '../../../place-review.module'

export const PlaceReviewRoutes = (app: Elysia) => {
  const { placeReviewController } = new PlaceReviewModule()

  return app.use(authMiddleware).group('/place-reviews', (app) =>
    app
      .get('/feed', (ctx) => placeReviewController.feed(ctx), {
        auth: true,
        query: t.Object({
          page: t.Optional(t.Numeric({ minimum: 1 }))
        }),
        detail: {
          tags: ['Place Reviews'],
          summary: 'List reviews from followed users in the last 24h',
          security: [{ cookieAuth: [] }]
        }
      })
      .post('/', (ctx) => placeReviewController.create(ctx), {
        auth: true,
        body: t.Object({
          placeId: t.String(),
          placeName: t.String({ minLength: 1 }),
          rating: t.Union([t.Literal('crowded'), t.Literal('dead')]),
          placeImageUrl: t.Optional(t.String()),
          selfieUrl: t.Optional(t.String()),
          selfieFriendsOnly: t.Optional(t.Boolean()),
          comment: t.Optional(t.String())
        }),
        detail: {
          tags: ['Place Reviews'],
          summary: 'Create a place review',
          security: [{ cookieAuth: [] }]
        }
      })
      .get('/:reviewId/counts', (ctx) => placeReviewController.getCounts(ctx), {
        auth: true,
        params: t.Object({
          reviewId: t.String()
        }),
        detail: {
          tags: ['Place Reviews'],
          summary: 'Get comment and reaction counts for a place review',
          security: [{ cookieAuth: [] }]
        }
      })
      .get('/:reviewId/comments', (ctx) => placeReviewController.listComments(ctx), {
        auth: true,
        params: t.Object({
          reviewId: t.String()
        }),
        query: t.Object({
          page: t.Optional(t.Numeric({ minimum: 1 }))
        }),
        detail: {
          tags: ['Place Reviews'],
          summary: 'List comments for a place review',
          security: [{ cookieAuth: [] }]
        }
      })
      .post('/:reviewId/comments', (ctx) => placeReviewController.createComment(ctx), {
        auth: true,
        params: t.Object({
          reviewId: t.String()
        }),
        body: t.Object({
          content: t.String({ minLength: 1, maxLength: 500 })
        }),
        detail: {
          tags: ['Place Reviews'],
          summary: 'Create a comment for a place review',
          security: [{ cookieAuth: [] }]
        }
      })
      .put('/:reviewId/reaction', (ctx) => placeReviewController.react(ctx), {
        auth: true,
        params: t.Object({
          reviewId: t.String()
        }),
        body: t.Object({
          type: t.Union([t.Literal('on'), t.Literal('off')])
        }),
        detail: {
          tags: ['Place Reviews'],
          summary: 'Set or update the current user reaction for a place review',
          security: [{ cookieAuth: [] }]
        }
      })
      .delete('/:reviewId/reaction', (ctx) => placeReviewController.removeReaction(ctx), {
        auth: true,
        params: t.Object({
          reviewId: t.String()
        }),
        detail: {
          tags: ['Place Reviews'],
          summary: 'Remove the current user reaction for a place review',
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
          page: t.Optional(t.Numeric({ minimum: 1 })),
          since: t.Optional(t.String())
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
          rating: t.Optional(t.Union([t.Literal('crowded'), t.Literal('dead')])),
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
