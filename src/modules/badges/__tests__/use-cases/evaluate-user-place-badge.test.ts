import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { BADGE_EARNED_RK } from '@src/config/rabbitmq.config'
import { MockPlaceReviewRepository } from '@src/modules/place-review/__tests__/mocks/place-review.repository.mock'
import { PlaceReview } from '@src/modules/place-review/domain/mappers'
import { RabbitMQProducer } from '@src/shared/infra/messaging'

import { EvaluateUserPlaceBadge } from '../../application/use-cases'
import { PlaceReviewBadgeTier } from '../../domain/types'
import { MockUserPlaceBadgesRepository } from '../mocks/user-place-badges.repository.mock'
import { MockUserProfileBadgesRepository } from '../mocks/user-profile-badges.repository.mock'

const makeReview = (userId: string, placeId: string): PlaceReview => ({
  id: crypto.randomUUID(),
  userId,
  placeId,
  placeName: `place-${placeId}`,
  rating: 'crowded',
  placeImageUrl: null,
  selfieUrl: null,
  selfieFriendsOnly: false,
  comment: null,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01')
})

const seedReviews = (repo: MockPlaceReviewRepository, userId: string, placeId: string, count: number) => {
  repo.seed(Array.from({ length: count }, () => makeReview(userId, placeId)))
}

const makeProducer = () => {
  const publishedMessages: Array<{ data: unknown; routingKey: string }> = []
  const producer = {
    publish: mock(async (data: unknown, routingKey: string) => {
      publishedMessages.push({ data, routingKey })
    })
  } as unknown as RabbitMQProducer
  return { producer, publishedMessages }
}

describe('EvaluateUserPlaceBadge', () => {
  let placeReviewRepo: MockPlaceReviewRepository
  let userPlaceBadgesRepo: MockUserPlaceBadgesRepository
  let userProfileBadgesRepo: MockUserProfileBadgesRepository
  let producer: RabbitMQProducer
  let publishedMessages: Array<{ data: unknown; routingKey: string }>
  let useCase: EvaluateUserPlaceBadge
  const userId = 'user-1'
  const placeId = 'place-1'

  beforeEach(() => {
    placeReviewRepo = new MockPlaceReviewRepository()
    userPlaceBadgesRepo = new MockUserPlaceBadgesRepository()
    userProfileBadgesRepo = new MockUserProfileBadgesRepository()
    const producerHarness = makeProducer()
    producer = producerHarness.producer
    publishedMessages = producerHarness.publishedMessages
    useCase = new EvaluateUserPlaceBadge(placeReviewRepo, userPlaceBadgesRepo, userProfileBadgesRepo, producer)
  })

  it('awards regular tier exactly at the threshold of 3 reviews', async () => {
    seedReviews(placeReviewRepo, userId, placeId, 3)

    await useCase.execute({ userId, placeId })

    const stored = await userPlaceBadgesRepo.getByUserAndPlace(userId, placeId)
    expect(stored.map((badgeRecord) => badgeRecord.tier)).toEqual(['regular'])
    expect(publishedMessages).toHaveLength(1)
    expect(publishedMessages[0].routingKey).toBe(BADGE_EARNED_RK)
    expect(publishedMessages[0].data).toMatchObject({
      userId,
      placeId,
      tier: 'regular',
      label: 'cliente'
    })
  })

  it('awards no tiers when the review count is one below the regular threshold', async () => {
    seedReviews(placeReviewRepo, userId, placeId, 2)

    await useCase.execute({ userId, placeId })

    const stored = await userPlaceBadgesRepo.getByUserAndPlace(userId, placeId)
    expect(stored).toEqual([])
    expect(publishedMessages).toHaveLength(0)
  })

  it('awards every tier up to king when at exactly 20 reviews', async () => {
    seedReviews(placeReviewRepo, userId, placeId, 20)

    await useCase.execute({ userId, placeId })

    const stored = await userPlaceBadgesRepo.getByUserAndPlace(userId, placeId)
    expect(stored.map((badgeRecord) => badgeRecord.tier).sort()).toEqual(
      ['fan', 'frequent', 'king', 'legend', 'regular'].sort()
    )
    expect(publishedMessages).toHaveLength(5)
  })

  it('skips fifteenth tier when only 19 reviews and legend is highest', async () => {
    seedReviews(placeReviewRepo, userId, placeId, 19)

    await useCase.execute({ userId, placeId })

    const stored = await userPlaceBadgesRepo.getByUserAndPlace(userId, placeId)
    const tiers = stored.map((badgeRecord) => badgeRecord.tier)
    expect(tiers).toContain('legend')
    expect(tiers).not.toContain('king')
  })

  it('does not republish badges that were already earned', async () => {
    seedReviews(placeReviewRepo, userId, placeId, 5)
    userPlaceBadgesRepo.seed([
      {
        id: crypto.randomUUID(),
        userId,
        placeId,
        tier: 'regular',
        achievedAt: new Date('2025-12-01'),
        place: { id: placeId, name: `place-${placeId}`, brandAvatar: null }
      }
    ])

    await useCase.execute({ userId, placeId })

    expect(publishedMessages.map((message) => (message.data as { tier: PlaceReviewBadgeTier }).tier)).toEqual(['fan'])
    const stored = await userPlaceBadgesRepo.getByUserAndPlace(userId, placeId)
    expect(stored.map((badgeRecord) => badgeRecord.tier).sort()).toEqual(['fan', 'regular'])
  })

  it('removes existing tiers that are no longer achieved after review deletions', async () => {
    seedReviews(placeReviewRepo, userId, placeId, 2)
    userPlaceBadgesRepo.seed([
      {
        id: crypto.randomUUID(),
        userId,
        placeId,
        tier: 'regular',
        achievedAt: new Date('2025-12-01'),
        place: { id: placeId, name: `place-${placeId}`, brandAvatar: null }
      },
      {
        id: crypto.randomUUID(),
        userId,
        placeId,
        tier: 'fan',
        achievedAt: new Date('2025-12-02'),
        place: { id: placeId, name: `place-${placeId}`, brandAvatar: null }
      }
    ])
    await userProfileBadgesRepo.replaceForUser({ userId, placeIds: [placeId] })

    await useCase.execute({ userId, placeId })

    const stored = await userPlaceBadgesRepo.getByUserAndPlace(userId, placeId)
    expect(stored).toEqual([])
    const profileSelections = await userProfileBadgesRepo.listByUser(userId)
    expect(profileSelections).toEqual([])
    expect(publishedMessages).toHaveLength(0)
  })

  it('continues without throwing when the producer fails to publish', async () => {
    const failingProducer = {
      publish: mock(async () => {
        throw new Error('rabbitmq down')
      })
    } as unknown as RabbitMQProducer
    const failingUseCase = new EvaluateUserPlaceBadge(
      placeReviewRepo,
      userPlaceBadgesRepo,
      userProfileBadgesRepo,
      failingProducer
    )
    seedReviews(placeReviewRepo, userId, placeId, 3)

    await expect(failingUseCase.execute({ userId, placeId })).resolves.toBeUndefined()

    const stored = await userPlaceBadgesRepo.getByUserAndPlace(userId, placeId)
    expect(stored.map((badgeRecord) => badgeRecord.tier)).toEqual(['regular'])
  })

  it('propagates repository errors from the review counter', async () => {
    const brokenReviewRepo = {
      countReviewsByUserAndPlace: mock(async () => {
        throw new Error('db connection lost')
      })
    } as unknown as MockPlaceReviewRepository
    const brokenUseCase = new EvaluateUserPlaceBadge(
      brokenReviewRepo,
      userPlaceBadgesRepo,
      userProfileBadgesRepo,
      producer
    )

    await expect(brokenUseCase.execute({ userId, placeId })).rejects.toThrow('db connection lost')
  })
})
