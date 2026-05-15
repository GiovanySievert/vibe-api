import { describe, expect, it } from 'bun:test'

import { buildUserBadgeListFromBadgeRecords, BadgeAchievementRecord } from '../../application/use-cases/build-user-badge-list'
import { PlaceReviewBadgeTier } from '../../domain/types'

const makeBadgeRecord = (overrides: Partial<BadgeAchievementRecord> & { placeId: string; tier: PlaceReviewBadgeTier }): BadgeAchievementRecord => ({
  userId: overrides.userId ?? 'user-1',
  placeId: overrides.placeId,
  tier: overrides.tier,
  achievedAt: overrides.achievedAt ?? new Date('2026-01-01'),
  reviewCount: overrides.reviewCount ?? 5,
  profilePosition: overrides.profilePosition ?? null,
  place: overrides.place ?? {
    id: overrides.placeId,
    name: `place-${overrides.placeId}`,
    brandAvatar: null
  }
})

describe('buildUserBadgeListFromBadgeRecords', () => {
  it('aggregates multiple tiers per place and sorts tiers by canonical order', async () => {
    const badgeRecords: BadgeAchievementRecord[] = [
      makeBadgeRecord({ placeId: 'place-1', tier: 'fan', achievedAt: new Date('2026-01-02'), reviewCount: 5 }),
      makeBadgeRecord({ placeId: 'place-1', tier: 'regular', achievedAt: new Date('2026-01-01'), reviewCount: 5 }),
      makeBadgeRecord({ placeId: 'place-2', tier: 'regular', achievedAt: new Date('2026-01-03'), reviewCount: 3, profilePosition: 1 })
    ]

    const result = await buildUserBadgeListFromBadgeRecords(badgeRecords)

    expect(result).toHaveLength(2)
    const placeOneSummary = result.find((badgeSummary) => badgeSummary.placeId === 'place-1')
    expect(placeOneSummary?.tiers.map((tier) => tier.tier)).toEqual(['regular', 'fan'])
    expect(placeOneSummary?.tiers.map((tier) => tier.label)).toEqual(['cliente', 'fã'])
    expect(placeOneSummary?.visibleOnProfile).toBe(false)
    expect(placeOneSummary?.profilePosition).toBeNull()

    const placeTwoSummary = result.find((badgeSummary) => badgeSummary.placeId === 'place-2')
    expect(placeTwoSummary?.visibleOnProfile).toBe(true)
    expect(placeTwoSummary?.profilePosition).toBe(1)
    expect(placeTwoSummary?.reviewCount).toBe(3)
  })

  it('returns an empty array when no badge records are provided', async () => {
    const result = await buildUserBadgeListFromBadgeRecords([])

    expect(result).toEqual([])
  })

  it('preserves place metadata and aggregates higher tiers across mixed inputs', async () => {
    const badgeRecords: BadgeAchievementRecord[] = [
      makeBadgeRecord({
        placeId: 'place-king',
        tier: 'king',
        reviewCount: 20,
        achievedAt: new Date('2026-03-01'),
        place: { id: 'place-king', name: 'Kings Bar', brandAvatar: 'https://cdn/king.png' }
      }),
      makeBadgeRecord({
        placeId: 'place-king',
        tier: 'legend',
        reviewCount: 20,
        achievedAt: new Date('2026-02-01'),
        place: { id: 'place-king', name: 'Kings Bar', brandAvatar: 'https://cdn/king.png' }
      }),
      makeBadgeRecord({
        placeId: 'place-king',
        tier: 'regular',
        reviewCount: 20,
        achievedAt: new Date('2026-01-01'),
        place: { id: 'place-king', name: 'Kings Bar', brandAvatar: 'https://cdn/king.png' }
      })
    ]

    const result = await buildUserBadgeListFromBadgeRecords(badgeRecords)

    expect(result).toHaveLength(1)
    expect(result[0].placeName).toBe('Kings Bar')
    expect(result[0].brandAvatar).toBe('https://cdn/king.png')
    expect(result[0].tiers.map((tier) => tier.tier)).toEqual(['regular', 'legend', 'king'])
  })

  it('falls back to null profile position when undefined is supplied', async () => {
    const badgeRecords: BadgeAchievementRecord[] = [
      {
        userId: 'user-1',
        placeId: 'place-x',
        tier: 'regular',
        achievedAt: new Date('2026-01-01'),
        reviewCount: 3,
        place: { id: 'place-x', name: null, brandAvatar: null }
      } as BadgeAchievementRecord
    ]

    const result = await buildUserBadgeListFromBadgeRecords(badgeRecords)

    expect(result[0].profilePosition).toBeNull()
    expect(result[0].visibleOnProfile).toBe(false)
    expect(result[0].placeName).toBeNull()
  })
})
