import { followRequests } from '../../application/schemas'
import { db } from '@src/infra/database/client'
import { FollowRequests } from '../../domain/mappers'
import { and, eq } from 'drizzle-orm'
import { FollowRequestsRepository } from '../../domain/repositories'
import { users } from '@src/infra/database/schema'
import { GetFollowRequestByUserDtoMapper } from '../../infrastructure/http/dtos'
import { FollowRequestListType, FollowRequestStatus } from '../../domain/types'

export class DrizzleFollowRequestRepository implements FollowRequestsRepository {
  async create(data: FollowRequests): Promise<FollowRequests> {
    const [result] = await db.insert(followRequests).values(data).returning()

    return result
  }

  async getById(requestFollowId: string): Promise<FollowRequests | null> {
    const [result] = await db.select().from(followRequests).where(eq(followRequests.id, requestFollowId)).limit(1)

    return result || null
  }

  async getPendingRequest(requesterId: string, requestedId: string): Promise<FollowRequests | null> {
    const [result] = await db
      .select()
      .from(followRequests)
      .where(
        and(
          eq(followRequests.requesterId, requesterId),
          eq(followRequests.requestedId, requestedId),
          eq(followRequests.status, FollowRequestStatus.PENDING)
        )
      )
      .limit(1)

    return result || null
  }

  async getByRequesterAndRequested(requesterId: string, requestedId: string): Promise<FollowRequests | null> {
    const [result] = await db
      .select()
      .from(followRequests)
      .where(and(eq(followRequests.requesterId, requesterId), eq(followRequests.requestedId, requestedId)))
      .limit(1)

    return result || null
  }

  async update(requestFollowId: string, status: string): Promise<FollowRequests> {
    const [result] = await db
      .update(followRequests)
      .set({ status: status })
      .where(eq(followRequests.id, requestFollowId))
      .returning()

    return result
  }

  async listByType(type: FollowRequestListType, userId: string): Promise<GetFollowRequestByUserDtoMapper[]> {
    const isReceived = type === FollowRequestListType.RECEIVED
    const whereField = isReceived ? followRequests.requestedId : followRequests.requesterId
    const joinField = isReceived ? followRequests.requesterId : followRequests.requestedId

    const result = await db
      .select({
        followRequests: {
          id: followRequests.id,
          requesterId: followRequests.requesterId,
          requestedId: followRequests.requestedId,
          status: followRequests.status,
          createdAt: followRequests.createdAt
        },
        users: {
          id: users.id,
          username: users.username,
          avatar: users.image
        }
      })
      .from(followRequests)
      .innerJoin(users, eq(joinField, users.id))
      .where(and(eq(whereField, userId), eq(followRequests.status, FollowRequestStatus.PENDING)))

    return GetFollowRequestByUserDtoMapper.fromArray(result)
  }
}
