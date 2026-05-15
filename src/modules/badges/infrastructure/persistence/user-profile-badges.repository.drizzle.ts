import { asc, eq } from 'drizzle-orm'

import { db } from '@src/infra/database/client'

import { userProfileBadges } from '../../application/schemas'
import { UserProfileBadge } from '../../domain/mappers'
import { ReplaceUserProfileBadgesInput, UserProfileBadgesRepository } from '../../domain/repositories'

export class DrizzleUserProfileBadgesRepository implements UserProfileBadgesRepository {
  async listByUser(userId: string): Promise<UserProfileBadge[]> {
    return await db
      .select()
      .from(userProfileBadges)
      .where(eq(userProfileBadges.userId, userId))
      .orderBy(asc(userProfileBadges.position))
  }

  async replaceForUser(input: ReplaceUserProfileBadgesInput): Promise<UserProfileBadge[]> {
    return await db.transaction(async (tx) => {
      await tx.delete(userProfileBadges).where(eq(userProfileBadges.userId, input.userId))

      if (input.placeIds.length === 0) return []

      return await tx
        .insert(userProfileBadges)
        .values(
          input.placeIds.map((placeId, index) => ({
            userId: input.userId,
            placeId,
            position: index + 1
          }))
        )
        .returning()
    })
  }

  async removeByUserAndPlace(userId: string, placeId: string): Promise<void> {
    const currentProfileBadgeSelections = await this.listByUser(userId)
    const remainingPlaceIds = currentProfileBadgeSelections
      .filter((profileBadgeSelection) => profileBadgeSelection.placeId !== placeId)
      .map((profileBadgeSelection) => profileBadgeSelection.placeId)

    if (remainingPlaceIds.length === currentProfileBadgeSelections.length) return

    await this.replaceForUser({ userId, placeIds: remainingPlaceIds })
  }
}
