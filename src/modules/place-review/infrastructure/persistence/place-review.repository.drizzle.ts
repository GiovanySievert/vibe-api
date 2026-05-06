import { and, count, desc, eq, gte, inArray } from 'drizzle-orm'

import { placeReviewComments, placeReviewReactions, placeReviews } from '../../application/schemas'
import { db } from '@src/infra/database/client'
import { PlaceReview } from '../../domain/mappers'
import {
  CreatePlaceReviewCommentInput,
  PlaceReviewRepository,
  SetPlaceReviewReactionInput
} from '../../domain/repositories'
import { FeedReviewItem, ListPlaceReviewCommentsResult, PlaceReviewComment, ReviewCounts } from '../../domain/types'
import { users } from '@src/infra/database/schema'
import { followers } from '@src/modules/follow/application/schemas'

export class DrizzlePlaceReviewRepository implements PlaceReviewRepository {
  async create(data: Omit<PlaceReview, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlaceReview> {
    const [result] = await db.insert(placeReviews).values(data).returning()
    return result
  }

  async getById(reviewId: string): Promise<PlaceReview | null> {
    const [result] = await db.select().from(placeReviews).where(eq(placeReviews.id, reviewId)).limit(1)
    return result ?? null
  }

  async getByUserAndPlace(userId: string, placeId: string): Promise<PlaceReview | null> {
    const [result] = await db
      .select()
      .from(placeReviews)
      .where(and(eq(placeReviews.userId, userId), eq(placeReviews.placeId, placeId)))
      .limit(1)

    return result || null
  }

  async countReviewsByUserAndPlace(userId: string, placeId: string): Promise<number> {
    const [row] = await db
      .select({ value: count() })
      .from(placeReviews)
      .where(and(eq(placeReviews.userId, userId), eq(placeReviews.placeId, placeId)))

    return Number(row?.value ?? 0)
  }

  async listByPlace(placeId: string, since: Date, page?: number): Promise<FeedReviewItem[]> {
    const limit = 20
    const offset = ((page || 1) - 1) * limit

    const rows = await db
      .select({
        id: placeReviews.id,
        userId: placeReviews.userId,
        placeId: placeReviews.placeId,
        placeName: placeReviews.placeName,
        rating: placeReviews.rating,
        placeImageUrl: placeReviews.placeImageUrl,
        selfieUrl: placeReviews.selfieUrl,
        selfieFriendsOnly: placeReviews.selfieFriendsOnly,
        comment: placeReviews.comment,
        createdAt: placeReviews.createdAt,
        updatedAt: placeReviews.updatedAt,
        user: {
          id: users.id,
          username: users.username,
          image: users.image
        }
      })
      .from(placeReviews)
      .innerJoin(users, eq(placeReviews.userId, users.id))
      .where(and(eq(placeReviews.placeId, placeId), gte(placeReviews.createdAt, since)))
      .orderBy(desc(placeReviews.createdAt))
      .limit(limit)
      .offset(offset)

    return rows.map((row) => ({ ...row, viewerReaction: null }))
  }

  async listByUser(userId: string, page?: number): Promise<FeedReviewItem[]> {
    const limit = 20
    const offset = ((page || 1) - 1) * limit

    const rows = await db
      .select({
        id: placeReviews.id,
        userId: placeReviews.userId,
        placeId: placeReviews.placeId,
        placeName: placeReviews.placeName,
        rating: placeReviews.rating,
        placeImageUrl: placeReviews.placeImageUrl,
        selfieUrl: placeReviews.selfieUrl,
        selfieFriendsOnly: placeReviews.selfieFriendsOnly,
        comment: placeReviews.comment,
        createdAt: placeReviews.createdAt,
        updatedAt: placeReviews.updatedAt,
        user: {
          id: users.id,
          username: users.username,
          image: users.image
        }
      })
      .from(placeReviews)
      .innerJoin(users, eq(placeReviews.userId, users.id))
      .where(eq(placeReviews.userId, userId))
      .orderBy(desc(placeReviews.createdAt))
      .limit(limit)
      .offset(offset)

    return rows.map((row) => ({ ...row, viewerReaction: null }))
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

  async listFollowingFeed(userId: string, since: Date, page?: number): Promise<FeedReviewItem[]> {
    const limit = 20
    const offset = ((page || 1) - 1) * limit

    const rows = await db
      .select({
        id: placeReviews.id,
        userId: placeReviews.userId,
        placeId: placeReviews.placeId,
        placeName: placeReviews.placeName,
        rating: placeReviews.rating,
        placeImageUrl: placeReviews.placeImageUrl,
        selfieUrl: placeReviews.selfieUrl,
        selfieFriendsOnly: placeReviews.selfieFriendsOnly,
        comment: placeReviews.comment,
        createdAt: placeReviews.createdAt,
        updatedAt: placeReviews.updatedAt,
        user: {
          id: users.id,
          username: users.username,
          image: users.image
        }
      })
      .from(placeReviews)
      .innerJoin(users, eq(placeReviews.userId, users.id))
      .innerJoin(followers, and(eq(followers.followingId, placeReviews.userId), eq(followers.followerId, userId)))
      .where(gte(placeReviews.createdAt, since))
      .orderBy(desc(placeReviews.createdAt))
      .limit(limit)
      .offset(offset)

    return rows.map((row) => ({ ...row, viewerReaction: null }))
  }

  async listCountsByReviewIds(reviewIds: string[], viewerId?: string): Promise<ReviewCounts[]> {
    if (reviewIds.length === 0) return []

    const viewerReactionQuery = viewerId
      ? db
          .select({ reviewId: placeReviewReactions.reviewId, type: placeReviewReactions.type })
          .from(placeReviewReactions)
          .where(and(eq(placeReviewReactions.userId, viewerId), inArray(placeReviewReactions.reviewId, reviewIds)))
      : Promise.resolve([] as { reviewId: string; type: 'on' | 'off' }[])

    const [commentCountRows, reactionCountRows, viewerReactionRows] = await Promise.all([
      db
        .select({ reviewId: placeReviewComments.reviewId, value: count() })
        .from(placeReviewComments)
        .where(inArray(placeReviewComments.reviewId, reviewIds))
        .groupBy(placeReviewComments.reviewId),
      db
        .select({ reviewId: placeReviewReactions.reviewId, type: placeReviewReactions.type, value: count() })
        .from(placeReviewReactions)
        .where(inArray(placeReviewReactions.reviewId, reviewIds))
        .groupBy(placeReviewReactions.reviewId, placeReviewReactions.type),
      viewerReactionQuery
    ])

    const commentsCountByReviewId = new Map(commentCountRows.map((row) => [row.reviewId, Number(row.value)]))
    const reactionCountsByReviewId = new Map<string, { onCount: number; offCount: number }>()
    const viewerReactionByReviewId = new Map(viewerReactionRows.map((row) => [row.reviewId, row.type as 'on' | 'off']))

    for (const row of reactionCountRows) {
      const current = reactionCountsByReviewId.get(row.reviewId) ?? { onCount: 0, offCount: 0 }
      if (row.type === 'on') current.onCount = Number(row.value)
      else current.offCount = Number(row.value)
      reactionCountsByReviewId.set(row.reviewId, current)
    }

    return reviewIds.map((reviewId) => {
      const reactions = reactionCountsByReviewId.get(reviewId) ?? { onCount: 0, offCount: 0 }
      return {
        reviewId,
        commentsCount: commentsCountByReviewId.get(reviewId) ?? 0,
        onCount: reactions.onCount,
        offCount: reactions.offCount,
        viewerReaction: viewerReactionByReviewId.get(reviewId) ?? null
      }
    })
  }

  async createComment(input: CreatePlaceReviewCommentInput): Promise<PlaceReviewComment> {
    const [comment] = await db
      .insert(placeReviewComments)
      .values({
        reviewId: input.reviewId,
        userId: input.userId,
        content: input.content
      })
      .returning()

    return this.findCommentById(comment.id) as Promise<PlaceReviewComment>
  }

  async listComments(reviewId: string, page: number, limit: number): Promise<ListPlaceReviewCommentsResult> {
    const offset = (page - 1) * limit

    const [rows, [{ value: total }]] = await Promise.all([
      db
        .select({
          id: placeReviewComments.id,
          reviewId: placeReviewComments.reviewId,
          userId: placeReviewComments.userId,
          content: placeReviewComments.content,
          createdAt: placeReviewComments.createdAt,
          user: {
            id: users.id,
            username: users.username,
            image: users.image
          }
        })
        .from(placeReviewComments)
        .innerJoin(users, eq(placeReviewComments.userId, users.id))
        .where(eq(placeReviewComments.reviewId, reviewId))
        .orderBy(desc(placeReviewComments.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(placeReviewComments).where(eq(placeReviewComments.reviewId, reviewId))
    ])

    return {
      data: rows,
      total: Number(total),
      hasMore: offset + rows.length < Number(total)
    }
  }

  async setReaction(input: SetPlaceReviewReactionInput): Promise<void> {
    await db
      .insert(placeReviewReactions)
      .values({
        reviewId: input.reviewId,
        userId: input.userId,
        type: input.type
      })
      .onConflictDoUpdate({
        target: [placeReviewReactions.reviewId, placeReviewReactions.userId],
        set: {
          type: input.type,
          updatedAt: new Date()
        }
      })
  }

  async removeReaction(reviewId: string, userId: string): Promise<void> {
    await db
      .delete(placeReviewReactions)
      .where(and(eq(placeReviewReactions.reviewId, reviewId), eq(placeReviewReactions.userId, userId)))
  }

  async delete(reviewId: string): Promise<void> {
    await db.delete(placeReviews).where(eq(placeReviews.id, reviewId))
  }

  private async findCommentById(commentId: string): Promise<PlaceReviewComment | null> {
    const [row] = await db
      .select({
        id: placeReviewComments.id,
        reviewId: placeReviewComments.reviewId,
        userId: placeReviewComments.userId,
        content: placeReviewComments.content,
        createdAt: placeReviewComments.createdAt,
        user: {
          id: users.id,
          username: users.username,
          image: users.image
        }
      })
      .from(placeReviewComments)
      .innerJoin(users, eq(placeReviewComments.userId, users.id))
      .where(eq(placeReviewComments.id, commentId))
      .limit(1)

    return row ?? null
  }
}
