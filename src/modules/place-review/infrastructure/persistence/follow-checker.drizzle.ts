import { and, eq, inArray } from 'drizzle-orm'
import { db } from '@src/infra/database/client'
import { followers } from '@src/modules/follow/application/schemas'
import { FollowChecker } from '../../domain/repositories'

export class DrizzleFollowChecker implements FollowChecker {
  async getFollowedUserIds(followerId: string, candidateIds: string[]): Promise<Set<string>> {
    if (candidateIds.length === 0) return new Set()

    const rows = await db
      .select({ userId: followers.followingId })
      .from(followers)
      .where(and(eq(followers.followerId, followerId), inArray(followers.followingId, candidateIds)))

    return new Set(rows.map((r) => r.userId))
  }
}
