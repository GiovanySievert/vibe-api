import { eq } from 'drizzle-orm'

import { followStats } from '../../application/schemas'
import { db } from '@src/infra/database/client'
import { FollowStats } from '../../domain/mappers'
import { GetFollowRequestByUser } from '../../http/dtos'
import { FollowStatsRepository } from '../../domain/repositories'

export class DrizzleFollowStatsRepository implements FollowStatsRepository {
  async create(data: FollowStats): Promise<FollowStats> {
    const [result] = await db.insert(followStats).values(data).returning()

    return result
  }

  async getByUser(userId: string): Promise<GetFollowRequestByUser[]> {
    const result = await db.select().from(followStats).where(eq(followStats.userId, userId))

    return GetFollowRequestByUser.fromArray(result)
  }

  // async update(data: any): Promise<void> {}
  // async delete(data: any): Promise<void> {}
}
