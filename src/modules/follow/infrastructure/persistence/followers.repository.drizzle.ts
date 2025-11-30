import { and, eq } from 'drizzle-orm'

import { followers } from '../../application/schemas'
import { db } from '@src/infra/database/client'
import { Followers } from '../../domain/mappers'
import { ListUserFollowResponseDto } from '../../infrastructure/http/dtos'
import { FollowersRepository } from '../../domain/repositories'
import { users } from '@src/infra/database/schema'

export class DrizzleFollowRepository implements FollowersRepository {
  async create(data: Omit<Followers, 'id' | 'createdAt'>): Promise<Followers> {
    const [result] = await db.insert(followers).values(data).returning()

    return result
  }

  async listFollowers(userId: string, page: number = 1): Promise<ListUserFollowResponseDto[]> {
    const limit = 10
    const offset = (page - 1) * limit

    const result = await db
      .select({
        id: followers.id,
        userId: followers.followerId,
        username: users.username,
        image: users.image
      })
      .from(followers)
      .innerJoin(users, eq(followers.followerId, users.id))
      .where(eq(followers.followingId, userId))
      .limit(limit)
      .offset(offset)

    return ListUserFollowResponseDto.fromArray(result)
  }

  async listFollowings(userId: string, page: number = 1): Promise<ListUserFollowResponseDto[]> {
    const limit = 10
    const offset = (page - 1) * limit

    const result = await db
      .select({
        id: followers.id,
        userId: followers.followingId,
        username: users.username,
        image: users.image
      })
      .from(followers)
      .innerJoin(users, eq(followers.followingId, users.id))
      .where(eq(followers.followerId, userId))
      .limit(limit)
      .offset(offset)

    return ListUserFollowResponseDto.fromArray(result)
  }

  async delete(followId: string): Promise<void> {
    await db.delete(followers).where(eq(followers.id, followId))
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const [follow] = await db
      .select()
      .from(followers)
      .where(and(eq(followers.followerId, followerId), eq(followers.followingId, followingId)))
      .limit(1)

    const result = !!follow

    return result
  }
}
