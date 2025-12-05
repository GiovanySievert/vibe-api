import { and, desc, eq } from 'drizzle-orm'

import { followers, followRequests } from '../../application/schemas'
import { db } from '@src/infra/database/client'
import { Followers } from '../../domain/mappers'
import {
  ListUserFollowResponseDto,
  FollowStatusResponseDto,
  FollowStatusResponseDtoMapper
} from '../../infrastructure/http/dtos'
import { FollowersRepository } from '../../domain/repositories'
import { users } from '@src/infra/database/schema'
import { FollowStatus, FollowRequestStatus } from '../../domain/types'

export class DrizzleFollowRepository implements FollowersRepository {
  async create(data: Omit<Followers, 'id' | 'createdAt'>): Promise<Followers> {
    const [result] = await db.insert(followers).values(data).returning()

    return result
  }

  async getById(followId: string): Promise<Followers | null> {
    const [result] = await db.select().from(followers).where(eq(followers.id, followId)).limit(1)

    return result || null
  }

  async delete(followId: string): Promise<void> {
    const [follow] = await db.select().from(followers).where(eq(followers.id, followId)).limit(1)

    if (follow) {
      await db.delete(followers).where(eq(followers.id, followId))

      await db
        .delete(followRequests)
        .where(
          and(eq(followRequests.requesterId, follow.followerId), eq(followRequests.requestedId, follow.followingId))
        )
    }
  }

  async getByFollowerAndFollowing(followerId: string, followingId: string): Promise<Followers | null> {
    const [result] = await db
      .select()
      .from(followers)
      .where(and(eq(followers.followerId, followerId), eq(followers.followingId, followingId)))
      .limit(1)

    return result || null
  }

  async listFollowers(userId: string, page?: number): Promise<ListUserFollowResponseDto[]> {
    const limit = 5
    const currentPage = page || 1
    const offset = (currentPage - 1) * limit

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

  async listFollowings(userId: string, page?: number): Promise<ListUserFollowResponseDto[]> {
    const limit = 5
    const currentPage = page || 1
    const offset = (currentPage - 1) * limit
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

  async getFollowStatus(followerId: string, followingId: string): Promise<FollowStatusResponseDto> {
    const [request] = await db
      .select()
      .from(followRequests)
      .where(and(eq(followRequests.requesterId, followerId), eq(followRequests.requestedId, followingId)))
      .orderBy(desc(followRequests.createdAt))
      .limit(1)

    if (!request) {
      return FollowStatusResponseDtoMapper.create(FollowStatus.NONE)
    }

    if (request.status === FollowRequestStatus.ACCEPTED) {
      return FollowStatusResponseDtoMapper.create(FollowStatus.FOLLOWING, request.id)
    }

    if (request.status === FollowRequestStatus.PENDING) {
      return FollowStatusResponseDtoMapper.create(FollowStatus.PENDING, request.id)
    }

    return FollowStatusResponseDtoMapper.create(FollowStatus.NONE)
  }
}
