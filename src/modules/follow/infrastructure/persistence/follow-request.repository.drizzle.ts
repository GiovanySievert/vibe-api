import { followRequests } from '../../application/schemas'
import { db } from '@src/infra/database/client'
import { FollowRequests } from '../../domain/mappers'
import { and, eq } from 'drizzle-orm'
import { FollowRequestsRepository } from '../../domain/repositories'

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

  async list(userId: string): Promise<FollowRequests[]> {
    const result = await db
      .select()
      .from(followRequests)
      .where(and(eq(followRequests.requestedId, userId), eq(followRequests.status, 'pending')))

    return result
  }
}
