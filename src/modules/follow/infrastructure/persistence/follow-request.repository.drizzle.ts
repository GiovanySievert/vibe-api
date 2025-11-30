import { followRequests } from '../../application/schemas'
import { db } from '@src/infra/database/client'
import { FollowRequests } from '../../domain/mappers'
import { and, eq } from 'drizzle-orm'
import { FollowRequestsRepository } from '../../domain/repositories'
import { users } from '@src/infra/database/schema'
import { GetFollowRequestByUserDto, GetFollowRequestByUserDtoMapper } from '../../infrastructure/http/dtos'

export class DrizzleFollowRequestRepository implements FollowRequestsRepository {
  async create(data: FollowRequests): Promise<FollowRequests> {
    const [result] = await db.insert(followRequests).values(data).returning()

    return result
  }

  async update(requestFollowId: string, status: string): Promise<FollowRequests> {
    const [result] = await db
      .update(followRequests)
      .set({ status: status })
      .where(eq(followRequests.id, requestFollowId))
      .returning()

    return result
  }

  async list(userId: string): Promise<GetFollowRequestByUserDtoMapper[]> {
    const result = await db
      .select({
        followRequests: {
          id: followRequests.id,
          requesterId: followRequests.requesterId,
          requestedId: followRequests.requestedId,
          status: followRequests.status
        },
        users: {
          username: users.username
          // avatar: users.avatar
        }
      })
      .from(followRequests)
      .leftJoin(users, eq(followRequests.requesterId, users.id))
      .where(and(eq(followRequests.requestedId, userId), eq(followRequests.status, 'pending')))

    return GetFollowRequestByUserDtoMapper.fromArray(result)
  }
}
