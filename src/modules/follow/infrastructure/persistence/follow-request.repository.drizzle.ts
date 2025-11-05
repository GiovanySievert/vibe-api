import { followRequests } from '../../application/schemas'
import { db } from '@src/infra/database/client'
import { FollowRequests } from '../../domain/mappers'
import { eq } from 'drizzle-orm'
import { GetFollowRequestByUser } from '../../http/dtos'
import { FollowRequestsRepository } from '../../domain/repositories'

export class DrizzleFollowRequestRepository implements FollowRequestsRepository {
  async create(data: FollowRequests): Promise<FollowRequests> {
    const [result] = await db.insert(followRequests).values(data).returning()

    return result
  }

  async getByUser(userId: string): Promise<GetFollowRequestByUser[]> {
    const result = await db.select().from(followRequests).where(eq(followRequests.requestedId, userId))

    return GetFollowRequestByUser.fromArray(result)
  }

  // async update(data: any): Promise<void> {}
  // async delete(data: any): Promise<void> {}
}
