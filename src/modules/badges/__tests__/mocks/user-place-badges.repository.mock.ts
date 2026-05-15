import { UserPlaceBadge } from '../../domain/mappers'
import {
  RemoveUserPlaceBadgeTiersInput,
  UpsertUserPlaceBadgeInput,
  UserPlaceBadgeWithPlace,
  UserPlaceBadgesRepository
} from '../../domain/repositories'

export class MockUserPlaceBadgesRepository implements UserPlaceBadgesRepository {
  private earnedBadgeRecords: UserPlaceBadgeWithPlace[] = []
  public listByUserCalls = 0

  async upsertTier(input: UpsertUserPlaceBadgeInput): Promise<UserPlaceBadge> {
    const existingBadgeRecord = this.earnedBadgeRecords.find(
      (badgeRecord) =>
        badgeRecord.userId === input.userId &&
        badgeRecord.placeId === input.placeId &&
        badgeRecord.tier === input.tier
    )

    if (existingBadgeRecord) return { ...existingBadgeRecord }

    const badgeRecord: UserPlaceBadgeWithPlace = {
      id: crypto.randomUUID(),
      userId: input.userId,
      placeId: input.placeId,
      tier: input.tier,
      achievedAt: new Date(),
      place: {
        id: input.placeId,
        name: `place-${input.placeId}`,
        brandAvatar: null
      }
    }
    this.earnedBadgeRecords.push(badgeRecord)
    return { ...badgeRecord }
  }

  async removeTiers(input: RemoveUserPlaceBadgeTiersInput): Promise<void> {
    this.earnedBadgeRecords = this.earnedBadgeRecords.filter(
      (badgeRecord) =>
        badgeRecord.userId !== input.userId ||
        badgeRecord.placeId !== input.placeId ||
        !input.tiers.includes(badgeRecord.tier)
    )
  }

  async getByUserAndPlace(userId: string, placeId: string): Promise<UserPlaceBadge[]> {
    return this.earnedBadgeRecords
      .filter((badgeRecord) => badgeRecord.userId === userId && badgeRecord.placeId === placeId)
      .map((badgeRecord) => ({ ...badgeRecord }))
  }

  async listByUser(userId: string): Promise<UserPlaceBadgeWithPlace[]> {
    this.listByUserCalls += 1
    return this.earnedBadgeRecords
      .filter((badgeRecord) => badgeRecord.userId === userId)
      .map((badgeRecord) => ({ ...badgeRecord, place: { ...badgeRecord.place } }))
  }

  seed(badgeRecords: UserPlaceBadgeWithPlace[]) {
    this.earnedBadgeRecords = badgeRecords.map((badgeRecord) => ({
      ...badgeRecord,
      place: { ...badgeRecord.place }
    }))
  }
}
