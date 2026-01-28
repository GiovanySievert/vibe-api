import { and, eq, desc } from 'drizzle-orm'

import { placeReviews } from '../../application/schemas'
import { db } from '@src/infra/database/client'
import { PlaceReview } from '../../domain/mappers'
import { PlaceReviewRepository } from '../../domain/repositories'

export class DrizzlePlaceReviewRepository implements PlaceReviewRepository {
  async create(data: Omit<PlaceReview, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlaceReview> {
    const [result] = await db.insert(placeReviews).values(data).returning()
    return result
  }

  async getById(reviewId: string): Promise<PlaceReview | null> {
    const [result] = await db.select().from(placeReviews).where(eq(placeReviews.id, reviewId)).limit(1)
    return result || null
  }

  async getByUserAndPlace(userId: string, placeId: string): Promise<PlaceReview | null> {
    const [result] = await db
      .select()
      .from(placeReviews)
      .where(and(eq(placeReviews.userId, userId), eq(placeReviews.placeId, placeId)))
      .limit(1)
    return result || null
  }

  async listByPlace(placeId: string, page?: number): Promise<PlaceReview[]> {
    const limit = 10
    const currentPage = page || 1
    const offset = (currentPage - 1) * limit

    return await db
      .select()
      .from(placeReviews)
      .where(eq(placeReviews.placeId, placeId))
      .orderBy(desc(placeReviews.createdAt))
      .limit(limit)
      .offset(offset)
  }

  async listByUser(userId: string, page?: number): Promise<PlaceReview[]> {
    const limit = 10
    const currentPage = page || 1
    const offset = (currentPage - 1) * limit

    return await db
      .select()
      .from(placeReviews)
      .where(eq(placeReviews.userId, userId))
      .orderBy(desc(placeReviews.createdAt))
      .limit(limit)
      .offset(offset)
  }

  async update(
    reviewId: string,
    data: Partial<Omit<PlaceReview, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<PlaceReview> {
    const [result] = await db
      .update(placeReviews)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(placeReviews.id, reviewId))
      .returning()
    return result
  }

  async delete(reviewId: string): Promise<void> {
    await db.delete(placeReviews).where(eq(placeReviews.id, reviewId))
  }
}
