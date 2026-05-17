import { beforeEach, describe, expect, it } from 'bun:test'
import { User } from 'better-auth/types'

import { ApplicationEvent, ApplicationEventBus } from '@src/shared/application/events'
import { PLACE_REVIEW_COMMENT_CREATED_EVENT } from '../../application/events/place-review-comment-created.event'
import { PLACE_REVIEW_REACTION_SET_EVENT } from '../../application/events/place-review-reaction-set.event'

import { PlaceReviewController } from '../../infrastructure/http/controllers/place-review.controller'
import { PlaceReview } from '../../domain/mappers'

const makeUser = (id: string): User => ({ id, name: `user-${id}`, email: `${id}@example.com` }) as User

const makeReview = (overrides: Partial<PlaceReview> = {}): PlaceReview => ({
  id: 'review-1',
  userId: 'owner-1',
  placeId: 'place-1',
  placeName: 'Bar',
  rating: 'crowded',
  placeImageUrl: null,
  selfieUrl: null,
  selfieFriendsOnly: false,
  comment: null,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
  ...overrides
})

describe('PlaceReviewController', () => {
  let createCalls: any[]
  let eligibilityCalls: any[]
  let getCalls: string[]
  let countsCalls: any[]
  let listByPlaceCalls: any[]
  let listByUserCalls: any[]
  let feedCalls: any[]
  let listCommentsCalls: any[]
  let createCommentCalls: any[]
  let listInteractionsCalls: any[]
  let getInteractionCountCalls: string[]
  let reactCalls: any[]
  let removeReactCalls: any[]
  let updateCalls: any[]
  let deleteCalls: any[]
  let deleteCommentCalls: any[]
  let favoriteCalls: any[]
  let unfavoriteCalls: any[]
  let publishedEvents: ApplicationEvent[]
  let getReviewResult: PlaceReview | null
  let controller: PlaceReviewController

  beforeEach(() => {
    createCalls = []
    eligibilityCalls = []
    getCalls = []
    countsCalls = []
    listByPlaceCalls = []
    listByUserCalls = []
    feedCalls = []
    listCommentsCalls = []
    createCommentCalls = []
    listInteractionsCalls = []
    getInteractionCountCalls = []
    reactCalls = []
    removeReactCalls = []
    updateCalls = []
    deleteCalls = []
    deleteCommentCalls = []
    favoriteCalls = []
    unfavoriteCalls = []
    publishedEvents = []
    getReviewResult = makeReview()

    controller = new PlaceReviewController(
      {
        async execute(input: any) {
          createCalls.push(input)
          return makeReview({ id: 'created-review' })
        }
      } as never,
      {
        async execute(input: any) {
          createCommentCalls.push(input)
          return { id: 'comment-1', reviewId: input.reviewId, userId: input.userId, content: input.content }
        }
      } as never,
      {
        async execute(...args: any[]) {
          deleteCommentCalls.push(args)
        }
      } as never,
      {
        async execute(reviewId: string) {
          getCalls.push(reviewId)
          return getReviewResult
        }
      } as never,
      {
        async execute(ids: string[], userId: string) {
          countsCalls.push({ ids, userId })
          return ids.map((id) => ({ reviewId: id, on: 1, off: 0, comments: 0 }))
        }
      } as never,
      {
        async execute(input: any) {
          eligibilityCalls.push(input)
          return { eligible: true }
        }
      } as never,
      {
        async execute(reviewId: string) {
          getInteractionCountCalls.push(reviewId)
          return { on: 3, off: 1 }
        }
      } as never,
      {
        async executeByPlace(...args: any[]) {
          listByPlaceCalls.push(args)
          return { data: [], hasMore: false }
        },
        async executeByUser(...args: any[]) {
          listByUserCalls.push(args)
          return { data: [], hasMore: false }
        },
        async executePopularByPlace(...args: any[]) {
          listByPlaceCalls.push({ popular: true, args })
          return { data: [], hasMore: false }
        }
      } as never,
      {
        async execute(...args: any[]) {
          feedCalls.push(args)
          return { data: [], hasMore: false }
        }
      } as never,
      {
        async execute(input: any) {
          listCommentsCalls.push(input)
          return { data: [], hasMore: false }
        }
      } as never,
      {
        async execute(...args: any[]) {
          listInteractionsCalls.push(args)
          return { data: [], hasMore: false }
        }
      } as never,
      {
        async execute(input: any) {
          reactCalls.push(input)
        }
      } as never,
      {
        async execute(input: any) {
          removeReactCalls.push(input)
        }
      } as never,
      {
        async execute(reviewId: string, body: any) {
          updateCalls.push({ reviewId, body })
          return makeReview({ id: reviewId })
        }
      } as never,
      {
        async execute(reviewId: string, userId: string) {
          deleteCalls.push({ reviewId, userId })
        }
      } as never,
      {
        async execute(reviewId: string, userId: string) {
          favoriteCalls.push({ reviewId, userId })
        }
      } as never,
      {
        async execute(reviewId: string, userId: string) {
          unfavoriteCalls.push({ reviewId, userId })
        }
      } as never,
      {
        async publish(event: ApplicationEvent) {
          publishedEvents.push(event)
        },
        subscribe() {}
      } as ApplicationEventBus
    )
  })

  it('forwards full body to CreatePlaceReview with defaults for optional fields', async () => {
    await controller.create({
      body: {
        placeId: 'p-1',
        placeName: 'Bar',
        rating: 'crowded',
        placeImageUrl: 'http://img',
        userLat: 1,
        userLng: 2,
        placeLat: 3,
        placeLng: 4
      },
      user: makeUser('u-1')
    })

    expect(createCalls[0]).toEqual({
      userId: 'u-1',
      placeId: 'p-1',
      placeName: 'Bar',
      rating: 'crowded',
      placeImageUrl: 'http://img',
      userLat: 1,
      userLng: 2,
      placeLat: 3,
      placeLng: 4,
      selfieUrl: null,
      selfieFriendsOnly: false,
      comment: null
    })
  })

  it('preserves optional selfieUrl, selfieFriendsOnly, comment when provided', async () => {
    await controller.create({
      body: {
        placeId: 'p-1',
        placeName: 'Bar',
        rating: 'dead',
        placeImageUrl: 'http://img',
        userLat: 1,
        userLng: 2,
        placeLat: 3,
        placeLng: 4,
        selfieUrl: 'http://selfie',
        selfieFriendsOnly: true,
        comment: 'great'
      },
      user: makeUser('u-1')
    })

    expect(createCalls[0]).toMatchObject({
      selfieUrl: 'http://selfie',
      selfieFriendsOnly: true,
      comment: 'great'
    })
  })

  it('uses default since=now-24h when query.since is absent on listByPlace', async () => {
    const before = Date.now()
    await controller.listByPlace({
      params: { placeId: 'p-1' },
      query: {},
      user: makeUser('u-1')
    })
    const after = Date.now()

    const [placeId, since, page, userId] = listByPlaceCalls[0]
    expect(placeId).toBe('p-1')
    expect(page).toBeUndefined()
    expect(userId).toBe('u-1')
    expect(since).toBeInstanceOf(Date)
    const sinceMs = (since as Date).getTime()
    expect(sinceMs).toBeGreaterThanOrEqual(before - 24 * 60 * 60 * 1000 - 5)
    expect(sinceMs).toBeLessThanOrEqual(after - 24 * 60 * 60 * 1000 + 5)
  })

  it('uses the provided query.since when set', async () => {
    await controller.listByPlace({
      params: { placeId: 'p-1' },
      query: { since: '2025-05-01T00:00:00Z', page: 2 },
      user: makeUser('u-9')
    })

    const [, since, page] = listByPlaceCalls[0]
    expect((since as Date).toISOString()).toBe('2025-05-01T00:00:00.000Z')
    expect(page).toBe(2)
  })

  it('uses since=now-90d when listing popular by place', async () => {
    const before = Date.now()
    await controller.listPopularByPlace({
      params: { placeId: 'p-1' },
      user: makeUser('u-1')
    })
    const after = Date.now()

    const call = listByPlaceCalls[0]
    expect(call.popular).toBe(true)
    const [placeId, since, limit, userId] = call.args
    expect(placeId).toBe('p-1')
    expect(limit).toBe(10)
    expect(userId).toBe('u-1')
    const sinceMs = (since as Date).getTime()
    expect(sinceMs).toBeGreaterThanOrEqual(before - 90 * 24 * 60 * 60 * 1000 - 5)
    expect(sinceMs).toBeLessThanOrEqual(after - 90 * 24 * 60 * 60 * 1000 + 5)
  })

  it('returns the first element of GetPlaceReviewCounts for a single review', async () => {
    const result = await controller.getCounts({
      params: { reviewId: 'review-1' },
      user: makeUser('u-1')
    })

    expect(countsCalls[0]).toEqual({ ids: ['review-1'], userId: 'u-1' })
    expect(result).toEqual({ reviewId: 'review-1', on: 1, off: 0, comments: 0 })
  })

  it('publishes comment-created event when commenter is not review owner', async () => {
    getReviewResult = makeReview({ userId: 'owner-1' })

    const result = await controller.createComment({
      params: { reviewId: 'review-1' },
      body: { content: 'nice' },
      user: makeUser('commenter-1')
    })

    expect(createCommentCalls).toHaveLength(1)
    expect(publishedEvents).toHaveLength(1)
    expect(publishedEvents[0].name).toBe(PLACE_REVIEW_COMMENT_CREATED_EVENT)
    expect(publishedEvents[0].payload).toEqual({
      commentId: 'comment-1',
      reviewId: 'review-1',
      reviewOwnerId: 'owner-1',
      commenterId: 'commenter-1',
      commenterName: 'user-commenter-1'
    })
    expect(result.id).toBe('comment-1')
  })

  it('does NOT publish event when commenter is the review owner', async () => {
    getReviewResult = makeReview({ userId: 'owner-1' })

    await controller.createComment({
      params: { reviewId: 'review-1' },
      body: { content: 'self note' },
      user: makeUser('owner-1')
    })

    expect(createCommentCalls).toHaveLength(1)
    expect(publishedEvents).toHaveLength(0)
  })

  it('throws when review is missing on createComment', async () => {
    getReviewResult = null

    await expect(
      controller.createComment({
        params: { reviewId: 'missing' },
        body: { content: 'x' },
        user: makeUser('u-1')
      })
    ).rejects.toThrow('Place review not found')
    expect(createCommentCalls).toHaveLength(0)
    expect(publishedEvents).toHaveLength(0)
  })

  it('publishes reaction-set event only when type=on AND reactor != owner', async () => {
    getReviewResult = makeReview({ userId: 'owner-1' })

    const result = await controller.react({
      params: { reviewId: 'review-1' },
      body: { type: 'on' },
      user: makeUser('reactor-1')
    })

    expect(reactCalls[0]).toEqual({ reviewId: 'review-1', userId: 'reactor-1', type: 'on' })
    expect(publishedEvents).toHaveLength(1)
    expect(publishedEvents[0].name).toBe(PLACE_REVIEW_REACTION_SET_EVENT)
    expect(result).toEqual({ success: true })
  })

  it('does NOT publish reaction event when type=off', async () => {
    getReviewResult = makeReview({ userId: 'owner-1' })

    await controller.react({
      params: { reviewId: 'review-1' },
      body: { type: 'off' },
      user: makeUser('reactor-1')
    })

    expect(reactCalls).toHaveLength(1)
    expect(publishedEvents).toHaveLength(0)
  })

  it('does NOT publish reaction event when reactor is the review owner', async () => {
    getReviewResult = makeReview({ userId: 'owner-1' })

    await controller.react({
      params: { reviewId: 'review-1' },
      body: { type: 'on' },
      user: makeUser('owner-1')
    })

    expect(reactCalls).toHaveLength(1)
    expect(publishedEvents).toHaveLength(0)
  })

  it('throws when review is missing on react', async () => {
    getReviewResult = null

    await expect(
      controller.react({
        params: { reviewId: 'missing' },
        body: { type: 'on' },
        user: makeUser('u-1')
      })
    ).rejects.toThrow('Place review not found')
    expect(reactCalls).toHaveLength(0)
  })

  it('returns {success: true} on removeReaction', async () => {
    const result = await controller.removeReaction({
      params: { reviewId: 'review-1' },
      user: makeUser('u-1')
    })

    expect(removeReactCalls[0]).toEqual({ reviewId: 'review-1', userId: 'u-1' })
    expect(result).toEqual({ success: true })
  })

  it('defaults page to 1 when listing comments without query.page', async () => {
    await controller.listComments({
      params: { reviewId: 'review-1' },
      query: {}
    })

    expect(listCommentsCalls[0]).toEqual({ reviewId: 'review-1', page: 1, limit: 20 })
  })

  it('passes provided page when listing comments', async () => {
    await controller.listComments({
      params: { reviewId: 'review-1' },
      query: { page: 3 }
    })

    expect(listCommentsCalls[0].page).toBe(3)
  })

  it('defaults interactions page to 1', async () => {
    await controller.listInteractions({
      params: { reviewId: 'review-1' },
      query: { type: 'on' },
      user: makeUser('u-1')
    })

    expect(listInteractionsCalls[0]).toEqual(['review-1', 'on', 1])
  })

  it('forwards eligibility request with user and place', async () => {
    const result = await controller.eligibility({
      params: { placeId: 'p-1' },
      user: makeUser('u-1')
    })
    expect(eligibilityCalls[0]).toEqual({ userId: 'u-1', placeId: 'p-1' })
    expect(result).toEqual({ eligible: true })
  })

  it('forwards feed call with user and page', async () => {
    await controller.feed({ user: makeUser('u-1'), query: { page: 2 } })
    expect(feedCalls[0]).toEqual(['u-1', 2])
  })

  it('forwards getInteractionCount', async () => {
    const result = await controller.getInteractionCount({
      params: { reviewId: 'review-1' },
      user: makeUser('u-1')
    })
    expect(getInteractionCountCalls).toEqual(['review-1'])
    expect(result).toEqual({ on: 3, off: 1 })
  })

  it('forwards update body to UpdatePlaceReview', async () => {
    const result = await controller.update({
      params: { reviewId: 'review-1' },
      body: { comment: 'changed' } as any
    })

    expect(updateCalls[0]).toEqual({ reviewId: 'review-1', body: { comment: 'changed' } })
    expect(result.id).toBe('review-1')
  })

  it('forwards delete with reviewId and user.id', async () => {
    await controller.delete({
      params: { reviewId: 'review-1' },
      user: makeUser('owner-1')
    })

    expect(deleteCalls[0]).toEqual({ reviewId: 'review-1', userId: 'owner-1' })
  })

  it('forwards deleteComment with commentId, reviewId and user.id', async () => {
    await controller.deleteComment({
      params: { reviewId: 'review-1', commentId: 'comment-9' },
      user: makeUser('u-1')
    })

    expect(deleteCommentCalls[0]).toEqual(['comment-9', 'review-1', 'u-1'])
  })

  it('favorites review with reviewId and user.id', async () => {
    const result = await controller.favorite({
      params: { reviewId: 'review-1' },
      user: makeUser('owner-1')
    })

    expect(favoriteCalls[0]).toEqual({ reviewId: 'review-1', userId: 'owner-1' })
    expect(result).toEqual({ success: true })
  })

  it('unfavorites review with reviewId and user.id', async () => {
    const result = await controller.unfavorite({
      params: { reviewId: 'review-1' },
      user: makeUser('owner-1')
    })

    expect(unfavoriteCalls[0]).toEqual({ reviewId: 'review-1', userId: 'owner-1' })
    expect(result).toEqual({ success: true })
  })

  it('listByUser forwards userId, page and viewer id', async () => {
    await controller.listByUser({
      params: { userId: 'target-1' },
      query: { page: 4 },
      user: makeUser('viewer-1')
    })

    expect(listByUserCalls[0]).toEqual(['target-1', 4, 'viewer-1'])
  })
})
