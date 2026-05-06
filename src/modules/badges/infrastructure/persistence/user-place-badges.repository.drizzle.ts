import { and, eq, inArray } from 'drizzle-orm'

import { db } from '@src/infra/database/client'
import { brands, places } from '@src/infra/database/schema'
import { userPlaceBadges } from '../../application/schemas'
import { UserPlaceBadge } from '../../domain/mappers'
import {
  RemoveUserPlaceBadgeTiersInput,
  UpsertUserPlaceBadgeInput,
  UserPlaceBadgeWithPlace,
  UserPlaceBadgesRepository
} from '../../domain/repositories'

export class DrizzleUserPlaceBadgesRepository implements UserPlaceBadgesRepository {
  async upsertTier(input: UpsertUserPlaceBadgeInput): Promise<UserPlaceBadge> {
    const [result] = await db
      .insert(userPlaceBadges)
      .values({ userId: input.userId, placeId: input.placeId, tier: input.tier })
      .onConflictDoNothing({
        target: [userPlaceBadges.userId, userPlaceBadges.placeId, userPlaceBadges.tier]
      })
      .returning()

    if (result) return result

    const [existing] = await db
      .select()
      .from(userPlaceBadges)
      .where(
        and(
          eq(userPlaceBadges.userId, input.userId),
          eq(userPlaceBadges.placeId, input.placeId),
          eq(userPlaceBadges.tier, input.tier)
        )
      )
      .limit(1)

    return existing
  }

  async removeTiers(input: RemoveUserPlaceBadgeTiersInput): Promise<void> {
    if (input.tiers.length === 0) return

    await db
      .delete(userPlaceBadges)
      .where(
        and(
          eq(userPlaceBadges.userId, input.userId),
          eq(userPlaceBadges.placeId, input.placeId),
          inArray(userPlaceBadges.tier, input.tiers)
        )
      )
  }

  async getByUserAndPlace(userId: string, placeId: string): Promise<UserPlaceBadge[]> {
    return await db
      .select()
      .from(userPlaceBadges)
      .where(and(eq(userPlaceBadges.userId, userId), eq(userPlaceBadges.placeId, placeId)))
  }

  async listByUser(userId: string): Promise<UserPlaceBadgeWithPlace[]> {
    const rows = await db
      .select({
        id: userPlaceBadges.id,
        userId: userPlaceBadges.userId,
        placeId: userPlaceBadges.placeId,
        tier: userPlaceBadges.tier,
        achievedAt: userPlaceBadges.achievedAt,
        placeName: places.name,
        brandAvatar: brands.avatar
      })
      .from(userPlaceBadges)
      .leftJoin(places, eq(userPlaceBadges.placeId, places.id))
      .leftJoin(brands, eq(places.brandId, brands.id))
      .where(eq(userPlaceBadges.userId, userId))

    return rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      placeId: row.placeId,
      tier: row.tier,
      achievedAt: row.achievedAt,
      place: {
        id: row.placeId,
        name: row.placeName,
        brandAvatar: row.brandAvatar
      }
    }))
  }
}
