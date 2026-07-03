import { and, eq, like, ne, isNull, notInArray, inArray, sql } from 'drizzle-orm'
import { db } from '@src/infra/database/client'
import { PublicUserProfile, PublicUserRepository, UserSuggestion, TrendingUser, WeekRef } from '../../domain/repositories'
import { users, userBlocks, userWeeklyActivity } from '@src/infra/database/schema'
import { followers } from '@src/modules/follow/application/schemas'
import { noUserBlockBetween } from '@src/modules/blocks/infrastructure/persistence/user-block.conditions'

export class DrizzlePublicUserRepository implements PublicUserRepository {
  async getSuggestions(userId: string, limit = 20): Promise<UserSuggestion[]> {
    const followingRows = await db
      .select({ id: followers.followingId })
      .from(followers)
      .where(eq(followers.followerId, userId))

    const followingIds = followingRows.map((r) => r.id)

    if (followingIds.length === 0) return []

    const alreadyFollowing = db
      .select({ id: followers.followingId })
      .from(followers)
      .where(eq(followers.followerId, userId))

    const blocked = db.select({ id: userBlocks.blockedId }).from(userBlocks).where(eq(userBlocks.blockerId, userId))

    const blockedBy = db.select({ id: userBlocks.blockerId }).from(userBlocks).where(eq(userBlocks.blockedId, userId))

    const result = await db
      .select({
        id: users.id,
        username: users.username,
        image: users.image,
        imageThumbnail: users.imageThumbnail,
        mutualCount: sql<number>`count(*)::int`
      })
      .from(followers)
      .innerJoin(users, eq(users.id, followers.followingId))
      .where(
        and(
          inArray(followers.followerId, followingIds),
          ne(followers.followingId, userId),
          notInArray(followers.followingId, alreadyFollowing),
          notInArray(followers.followingId, blocked),
          notInArray(followers.followingId, blockedBy)
        )
      )
      .groupBy(users.id, users.username, users.image, users.imageThumbnail)
      .orderBy(sql`count(*) desc`)
      .limit(limit)

    return result
  }

  async getTrending(userId: string, weeks: WeekRef[], limit = 20): Promise<TrendingUser[]> {
    const blocked = db.select({ id: userBlocks.blockedId }).from(userBlocks).where(eq(userBlocks.blockerId, userId))
    const blockedBy = db.select({ id: userBlocks.blockerId }).from(userBlocks).where(eq(userBlocks.blockedId, userId))
    const alreadyFollowing = db
      .select({ id: followers.followingId })
      .from(followers)
      .where(eq(followers.followerId, userId))

    const weekConditions = weeks.map(
      (w) => sql`(${userWeeklyActivity.isoYear} = ${w.isoYear} AND ${userWeeklyActivity.isoWeek} = ${w.isoWeek})`
    )
    const weekFilter = sql.join(weekConditions, sql` OR `)

    const result = await db
      .select({
        id: users.id,
        username: users.username,
        image: users.image,
        imageThumbnail: users.imageThumbnail,
        reviewsCount: sql<number>`sum(${userWeeklyActivity.reviewCount})::int`
      })
      .from(userWeeklyActivity)
      .innerJoin(users, eq(users.id, userWeeklyActivity.userId))
      .where(
        and(
          sql`(${weekFilter})`,
          ne(userWeeklyActivity.userId, userId),
          notInArray(userWeeklyActivity.userId, blocked),
          notInArray(userWeeklyActivity.userId, blockedBy),
          notInArray(userWeeklyActivity.userId, alreadyFollowing)
        )
      )
      .groupBy(users.id, users.username, users.image, users.imageThumbnail)
      .orderBy(sql`sum(${userWeeklyActivity.reviewCount}) desc`)
      .limit(limit)

    return result
  }

  async getUserById(userId: string, loggedUserId: string): Promise<PublicUserProfile | null> {
    const [result] = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        image: users.image,
        imageThumbnail: users.imageThumbnail,
        bio: users.bio,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      })
      .from(users)
      .where(and(eq(users.id, userId), noUserBlockBetween(loggedUserId, users.id)))
      .limit(1)

    return result || null
  }

  async getUserByUsername(username: string, userIdToExclude: string): Promise<PublicUserProfile[]> {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        image: users.image,
        imageThumbnail: users.imageThumbnail,
        bio: users.bio,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      })
      .from(users)
      .where(and(like(users.username, `%${username}%`), ne(users.id, userIdToExclude), noUserBlockBetween(userIdToExclude, users.id)))
      .limit(10)

    return result
  }
}
