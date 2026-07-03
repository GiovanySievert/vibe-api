import { and, desc, eq, ilike, or } from 'drizzle-orm'

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
import { noUserBlockBetween } from '@src/modules/blocks/infrastructure/persistence/user-block.conditions'

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

  async listFollowers(userId: string, page?: number, limit?: number, viewerId?: string): Promise<ListUserFollowResponseDto[]> {
    const pageSize = limit ?? 10
    const currentPage = page ?? 1
    const offset = (currentPage - 1) * pageSize

    const result = await db
      .select({
        id: followers.id,
        userId: followers.followerId,
        username: users.username,
        name: users.name,
        image: users.image
      })
      .from(followers)
      .innerJoin(users, eq(followers.followerId, users.id))
      .where(
        viewerId
          ? and(eq(followers.followingId, userId), noUserBlockBetween(viewerId, users.id))
          : eq(followers.followingId, userId)
      )
      .limit(pageSize)
      .offset(offset)

    return ListUserFollowResponseDto.fromArray(result)
  }

  async listFollowings(userId: string, page?: number, limit?: number, viewerId?: string): Promise<ListUserFollowResponseDto[]> {
    const pageSize = limit ?? 10
    const currentPage = page ?? 1
    const offset = (currentPage - 1) * pageSize

    const result = await db
      .select({
        id: followers.id,
        userId: followers.followingId,
        username: users.username,
        name: users.name,
        image: users.image
      })
      .from(followers)
      .innerJoin(users, eq(followers.followingId, users.id))
      .where(
        viewerId
          ? and(eq(followers.followerId, userId), noUserBlockBetween(viewerId, users.id))
          : eq(followers.followerId, userId)
      )
      .limit(pageSize)
      .offset(offset)

    return ListUserFollowResponseDto.fromArray(result)
  }

  async searchFollowers(userId: string, q: string, page?: number, limit?: number, viewerId?: string): Promise<ListUserFollowResponseDto[]> {
    const pageSize = limit ?? 10
    const currentPage = page ?? 1
    const offset = (currentPage - 1) * pageSize
    const pattern = `%${q}%`

    const result = await db
      .select({
        id: followers.id,
        userId: followers.followerId,
        username: users.username,
        name: users.name,
        image: users.image
      })
      .from(followers)
      .innerJoin(users, eq(followers.followerId, users.id))
      .where(
        and(
          eq(followers.followingId, userId),
          or(ilike(users.username, pattern), ilike(users.name, pattern)),
          viewerId ? noUserBlockBetween(viewerId, users.id) : undefined
        )
      )
      .limit(pageSize)
      .offset(offset)

    return ListUserFollowResponseDto.fromArray(result)
  }

  async searchFollowings(userId: string, q: string, page?: number, limit?: number, viewerId?: string): Promise<ListUserFollowResponseDto[]> {
    const pageSize = limit ?? 10
    const currentPage = page ?? 1
    const offset = (currentPage - 1) * pageSize
    const pattern = `%${q}%`

    const result = await db
      .select({
        id: followers.id,
        userId: followers.followingId,
        username: users.username,
        name: users.name,
        image: users.image
      })
      .from(followers)
      .innerJoin(users, eq(followers.followingId, users.id))
      .where(
        and(
          eq(followers.followerId, userId),
          or(ilike(users.username, pattern), ilike(users.name, pattern)),
          viewerId ? noUserBlockBetween(viewerId, users.id) : undefined
        )
      )
      .limit(pageSize)
      .offset(offset)

    return ListUserFollowResponseDto.fromArray(result)
  }

  async getFollowStatus(followerId: string, followingId: string): Promise<FollowStatusResponseDto> {
    const [follow] = await db
      .select()
      .from(followers)
      .where(and(eq(followers.followerId, followerId), eq(followers.followingId, followingId), noUserBlockBetween(followerId, followingId)))
      .limit(1)

    if (follow) {
      return FollowStatusResponseDtoMapper.create(FollowStatus.FOLLOWING, follow.id)
    }

    const [request] = await db
      .select()
      .from(followRequests)
      .where(and(eq(followRequests.requesterId, followerId), eq(followRequests.requestedId, followingId), noUserBlockBetween(followerId, followingId)))
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
