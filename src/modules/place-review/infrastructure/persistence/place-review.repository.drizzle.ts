import { and, asc, count, desc, eq, gte, inArray, isNotNull, ne, or, sql } from 'drizzle-orm'

import {
  placeReviewComments,
  placeReviewReactions,
  placeReviews,
  userFavoriteReviews
} from '../../application/schemas'
import { db } from '@src/infra/database/client'
import { PlaceReview } from '../../domain/mappers'
import {
  CreatePlaceReviewCommentInput,
  PlaceReviewCountByPlace,
  PlaceReviewRepository,
  CreatePlaceReviewRecord,
  SelectedPlaceReviewCountByPlace,
  SetPlaceReviewReactionInput
} from '../../domain/repositories'
import {
  FeedReviewItem,
  ListPlaceReviewCommentsResult,
  ListPlaceReviewFriendsResult,
  PlaceReviewComment,
  ReviewCounts,
  ReviewInteractionCount,
  ReviewInteractionUser
} from '../../domain/types'
import { brands, places, userProfileBadges, users } from '@src/infra/database/schema'
import { followers } from '@src/modules/follow/application/schemas'
import { noUserBlockBetween } from '@src/modules/blocks/infrastructure/persistence/user-block.conditions'

export class DrizzlePlaceReviewRepository implements PlaceReviewRepository {
  async create(data: CreatePlaceReviewRecord): Promise<PlaceReview> {
    const [result] = await db
      .insert(placeReviews)
      .values({
        ...data,
        placeImageThumbnailUrl: data.placeImageThumbnailUrl ?? null,
        selfieThumbnailUrl: data.selfieThumbnailUrl ?? null
      })
      .returning()
    return result
  }

  async getById(reviewId: string, viewerId?: string): Promise<PlaceReview | null> {
    const [result] = await db
      .select()
      .from(placeReviews)
      .where(
        viewerId
          ? and(eq(placeReviews.id, reviewId), noUserBlockBetween(viewerId, placeReviews.userId))
          : eq(placeReviews.id, reviewId)
      )
      .limit(1)
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

  async getLastReviewByUserAndPlace(userId: string, placeId: string): Promise<PlaceReview | null> {
    const [result] = await db
      .select()
      .from(placeReviews)
      .where(and(eq(placeReviews.userId, userId), eq(placeReviews.placeId, placeId)))
      .orderBy(desc(placeReviews.createdAt))
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

  async listReviewCountsByUserGroupedByPlace(userId: string): Promise<PlaceReviewCountByPlace[]> {
    const placeReviewCountRecords = await db
      .select({
        placeId: placeReviews.placeId,
        placeName: places.name,
        brandAvatar: brands.avatar,
        reviewCount: count(placeReviews.id),
        latestReviewAt: sql<Date>`max(${placeReviews.createdAt})`
      })
      .from(placeReviews)
      .leftJoin(places, eq(placeReviews.placeId, places.id))
      .leftJoin(brands, eq(places.brandId, brands.id))
      .where(eq(placeReviews.userId, userId))
      .groupBy(placeReviews.placeId, places.name, brands.avatar)
      .orderBy(desc(count(placeReviews.id)))

    return placeReviewCountRecords.map((placeReviewCountRecord) => ({
      placeId: placeReviewCountRecord.placeId,
      placeName: placeReviewCountRecord.placeName,
      brandAvatar: placeReviewCountRecord.brandAvatar,
      reviewCount: Number(placeReviewCountRecord.reviewCount),
      latestReviewAt: placeReviewCountRecord.latestReviewAt
    }))
  }

  async listSelectedReviewCountsByUserGroupedByPlace(
    userId: string
  ): Promise<SelectedPlaceReviewCountByPlace[]> {
    const selectedPlaceReviewCountRecords = await db
      .select({
        placeId: placeReviews.placeId,
        placeName: places.name,
        brandAvatar: brands.avatar,
        reviewCount: count(placeReviews.id),
        latestReviewAt: sql<Date>`max(${placeReviews.createdAt})`,
        profilePosition: userProfileBadges.position
      })
      .from(userProfileBadges)
      .innerJoin(
        placeReviews,
        and(
          eq(userProfileBadges.userId, placeReviews.userId),
          eq(userProfileBadges.placeId, placeReviews.placeId)
        )
      )
      .leftJoin(places, eq(placeReviews.placeId, places.id))
      .leftJoin(brands, eq(places.brandId, brands.id))
      .where(eq(userProfileBadges.userId, userId))
      .groupBy(placeReviews.placeId, places.name, brands.avatar, userProfileBadges.position)
      .orderBy(asc(userProfileBadges.position))

    return selectedPlaceReviewCountRecords.map((selectedPlaceReviewCountRecord) => ({
      placeId: selectedPlaceReviewCountRecord.placeId,
      placeName: selectedPlaceReviewCountRecord.placeName,
      brandAvatar: selectedPlaceReviewCountRecord.brandAvatar,
      reviewCount: Number(selectedPlaceReviewCountRecord.reviewCount),
      latestReviewAt: selectedPlaceReviewCountRecord.latestReviewAt,
      profilePosition: selectedPlaceReviewCountRecord.profilePosition
    }))
  }

  async listByPlace(placeId: string, since: Date, page?: number, viewerId?: string): Promise<FeedReviewItem[]> {
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
        placeImageThumbnailUrl: placeReviews.placeImageThumbnailUrl,
        selfieUrl: placeReviews.selfieUrl,
        selfieThumbnailUrl: placeReviews.selfieThumbnailUrl,
        selfieFriendsOnly: placeReviews.selfieFriendsOnly,
        comment: placeReviews.comment,
        createdAt: placeReviews.createdAt,
        updatedAt: placeReviews.updatedAt,
        isFavorite: sql<boolean>`false`,
        user: {
          id: users.id,
          username: users.username,
          image: users.image,
          imageThumbnail: users.imageThumbnail
        }
      })
      .from(placeReviews)
      .innerJoin(users, eq(placeReviews.userId, users.id))
      .where(and(eq(placeReviews.placeId, placeId), gte(placeReviews.createdAt, since), viewerId ? noUserBlockBetween(viewerId, placeReviews.userId) : undefined))
      .orderBy(desc(placeReviews.createdAt))
      .limit(limit)
      .offset(offset)

    return rows.map((row) => ({ ...row, viewerReaction: null }))
  }

  async listByUser(userId: string, page?: number, viewerId?: string): Promise<FeedReviewItem[]> {
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
        placeImageThumbnailUrl: placeReviews.placeImageThumbnailUrl,
        selfieUrl: placeReviews.selfieUrl,
        selfieThumbnailUrl: placeReviews.selfieThumbnailUrl,
        selfieFriendsOnly: placeReviews.selfieFriendsOnly,
        comment: placeReviews.comment,
        createdAt: placeReviews.createdAt,
        updatedAt: placeReviews.updatedAt,
        isFavorite: sql<boolean>`${userFavoriteReviews.reviewId} is not null`,
        user: {
          id: users.id,
          username: users.username,
          image: users.image,
          imageThumbnail: users.imageThumbnail
        }
      })
      .from(placeReviews)
      .innerJoin(users, eq(placeReviews.userId, users.id))
      .leftJoin(
        userFavoriteReviews,
        and(
          eq(userFavoriteReviews.userId, userId),
          eq(userFavoriteReviews.reviewId, placeReviews.id)
        )
      )
      .where(and(eq(placeReviews.userId, userId), viewerId ? noUserBlockBetween(viewerId, placeReviews.userId) : undefined))
      .orderBy(
        desc(sql<number>`case when ${userFavoriteReviews.reviewId} is null then 0 else 1 end`),
        desc(placeReviews.createdAt)
      )
      .limit(limit)
      .offset(offset)

    return rows.map((row) => ({ ...row, viewerReaction: null }))
  }

  async listPopularByPlace(placeId: string, since: Date, limit: number, viewerId?: string): Promise<FeedReviewItem[]> {
    const rows = await db
      .select({
        id: placeReviews.id,
        userId: placeReviews.userId,
        placeId: placeReviews.placeId,
        placeName: placeReviews.placeName,
        rating: placeReviews.rating,
        placeImageUrl: placeReviews.placeImageUrl,
        placeImageThumbnailUrl: placeReviews.placeImageThumbnailUrl,
        selfieUrl: placeReviews.selfieUrl,
        selfieThumbnailUrl: placeReviews.selfieThumbnailUrl,
        selfieFriendsOnly: placeReviews.selfieFriendsOnly,
        comment: placeReviews.comment,
        createdAt: placeReviews.createdAt,
        updatedAt: placeReviews.updatedAt,
        isFavorite: sql<boolean>`false`,
        user: { id: users.id, username: users.username, image: users.image, imageThumbnail: users.imageThumbnail },
        interactionCount: count(placeReviewReactions.id)
      })
      .from(placeReviews)
      .innerJoin(users, eq(placeReviews.userId, users.id))
      .leftJoin(
        placeReviewReactions,
        and(eq(placeReviewReactions.reviewId, placeReviews.id), viewerId ? noUserBlockBetween(viewerId, placeReviewReactions.userId) : undefined)
      )
      .where(and(eq(placeReviews.placeId, placeId), gte(placeReviews.createdAt, since), viewerId ? noUserBlockBetween(viewerId, placeReviews.userId) : undefined))
      .groupBy(placeReviews.id, users.id, users.username, users.image, users.imageThumbnail)
      .orderBy(desc(count(placeReviewReactions.id)), desc(placeReviews.createdAt))
      .limit(limit)

    return rows.map(({ interactionCount: _, ...row }) => ({
      ...row,
      viewerReaction: null
    }))
  }

  async listFriendsByPlace(
    placeId: string,
    viewerId: string,
    since: Date,
    page: number,
    limit: number
  ): Promise<ListPlaceReviewFriendsResult> {
    const offset = (page - 1) * limit
    const latestReviewAt = sql<Date>`max(${placeReviews.createdAt})`
    const where = and(
      eq(placeReviews.placeId, placeId),
      gte(placeReviews.createdAt, since),
      eq(followers.followerId, viewerId),
      ne(placeReviews.userId, viewerId),
      noUserBlockBetween(viewerId, placeReviews.userId)
    )

    const [rows, totalRows] = await Promise.all([
      db
        .select({
          id: users.id,
          name: users.name,
          username: users.username,
          image: users.image,
          latestReviewAt
        })
        .from(placeReviews)
        .innerJoin(
          followers,
          and(eq(followers.followingId, placeReviews.userId), eq(followers.followerId, viewerId))
        )
        .innerJoin(users, eq(users.id, placeReviews.userId))
        .where(where)
        .groupBy(users.id, users.name, users.username, users.image)
        .orderBy(desc(latestReviewAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ value: sql<number>`count(distinct ${placeReviews.userId})` })
        .from(placeReviews)
        .innerJoin(
          followers,
          and(eq(followers.followingId, placeReviews.userId), eq(followers.followerId, viewerId))
        )
        .where(where)
    ])

    const total = Number(totalRows[0]?.value ?? 0)

    return {
      data: rows,
      total,
      hasMore: offset + rows.length < total,
      page,
      limit
    }
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
        placeImageThumbnailUrl: placeReviews.placeImageThumbnailUrl,
        selfieUrl: placeReviews.selfieUrl,
        selfieThumbnailUrl: placeReviews.selfieThumbnailUrl,
        selfieFriendsOnly: placeReviews.selfieFriendsOnly,
        comment: placeReviews.comment,
        createdAt: placeReviews.createdAt,
        updatedAt: placeReviews.updatedAt,
        isFavorite: sql<boolean>`false`,
        user: { id: users.id, username: users.username, image: users.image, imageThumbnail: users.imageThumbnail }
      })
      .from(placeReviews)
      .innerJoin(users, eq(placeReviews.userId, users.id))
      .leftJoin(
        followers,
        and(eq(followers.followingId, placeReviews.userId), eq(followers.followerId, userId))
      )
      .where(
        and(
          gte(placeReviews.createdAt, since),
          or(eq(placeReviews.userId, userId), isNotNull(followers.id)),
          noUserBlockBetween(userId, placeReviews.userId)
        )
      )
      .orderBy(
        sql`CASE WHEN ${placeReviews.userId} = ${userId} THEN 0 ELSE 1 END`,
        desc(placeReviews.createdAt)
      )
      .limit(limit)
      .offset(offset)

    return rows.map((row) => ({ ...row, viewerReaction: null }))
  }

  async listCountsByReviewIds(reviewIds: string[], viewerId?: string): Promise<ReviewCounts[]> {
    if (reviewIds.length === 0) return []

    const viewerReactionQuery = viewerId
      ? db
          .select({
            reviewId: placeReviewReactions.reviewId,
            type: placeReviewReactions.type
          })
          .from(placeReviewReactions)
          .innerJoin(placeReviews, eq(placeReviewReactions.reviewId, placeReviews.id))
          .where(
            and(
              eq(placeReviewReactions.userId, viewerId),
              inArray(placeReviewReactions.reviewId, reviewIds),
              noUserBlockBetween(viewerId, placeReviews.userId)
            )
          )
      : Promise.resolve([] as { reviewId: string; type: 'on' | 'off' }[])

    const [commentCountRows, reactionCountRows, viewerReactionRows] = await Promise.all([
      db
        .select({ reviewId: placeReviewComments.reviewId, value: count() })
        .from(placeReviewComments)
        .innerJoin(placeReviews, eq(placeReviewComments.reviewId, placeReviews.id))
        .where(
          viewerId
            ? and(
                inArray(placeReviewComments.reviewId, reviewIds),
                noUserBlockBetween(viewerId, placeReviews.userId),
                noUserBlockBetween(viewerId, placeReviewComments.userId)
              )
            : inArray(placeReviewComments.reviewId, reviewIds)
        )
        .groupBy(placeReviewComments.reviewId),
      db
        .select({
          reviewId: placeReviewReactions.reviewId,
          type: placeReviewReactions.type,
          value: count()
        })
        .from(placeReviewReactions)
        .innerJoin(placeReviews, eq(placeReviewReactions.reviewId, placeReviews.id))
        .where(
          viewerId
            ? and(
                inArray(placeReviewReactions.reviewId, reviewIds),
                noUserBlockBetween(viewerId, placeReviews.userId),
                noUserBlockBetween(viewerId, placeReviewReactions.userId)
              )
            : inArray(placeReviewReactions.reviewId, reviewIds)
        )
        .groupBy(placeReviewReactions.reviewId, placeReviewReactions.type),
      viewerReactionQuery
    ])

    const commentsCountByReviewId = new Map(
      commentCountRows.map((row) => [row.reviewId, Number(row.value)])
    )
    const reactionCountsByReviewId = new Map<string, { onCount: number; offCount: number }>()
    const viewerReactionByReviewId = new Map(
      viewerReactionRows.map((row) => [row.reviewId, row.type as 'on' | 'off'])
    )

    for (const row of reactionCountRows) {
      const current = reactionCountsByReviewId.get(row.reviewId) ?? {
        onCount: 0,
        offCount: 0
      }
      if (row.type === 'on') current.onCount = Number(row.value)
      else current.offCount = Number(row.value)
      reactionCountsByReviewId.set(row.reviewId, current)
    }

    return reviewIds.map((reviewId) => {
      const reactions = reactionCountsByReviewId.get(reviewId) ?? {
        onCount: 0,
        offCount: 0
      }
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

  async listComments(
    reviewId: string,
    page: number,
    limit: number,
    viewerId?: string
  ): Promise<ListPlaceReviewCommentsResult> {
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
        .innerJoin(placeReviews, eq(placeReviewComments.reviewId, placeReviews.id))
        .innerJoin(users, eq(placeReviewComments.userId, users.id))
        .where(
          and(
            eq(placeReviewComments.reviewId, reviewId),
            viewerId ? noUserBlockBetween(viewerId, placeReviews.userId) : undefined,
            viewerId ? noUserBlockBetween(viewerId, placeReviewComments.userId) : undefined
          )
        )
        .orderBy(desc(placeReviewComments.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ value: count() })
        .from(placeReviewComments)
        .innerJoin(placeReviews, eq(placeReviewComments.reviewId, placeReviews.id))
        .where(
          and(
            eq(placeReviewComments.reviewId, reviewId),
            viewerId ? noUserBlockBetween(viewerId, placeReviews.userId) : undefined,
            viewerId ? noUserBlockBetween(viewerId, placeReviewComments.userId) : undefined
          )
        )
    ])

    return {
      data: rows,
      total: Number(total),
      hasMore: offset + rows.length < Number(total)
    }
  }

  async countReactions(reviewId: string, viewerId?: string): Promise<ReviewInteractionCount> {
    const rows = await db
      .select({ type: placeReviewReactions.type, value: count() })
      .from(placeReviewReactions)
      .innerJoin(placeReviews, eq(placeReviewReactions.reviewId, placeReviews.id))
      .where(
        and(
          eq(placeReviewReactions.reviewId, reviewId),
          viewerId ? noUserBlockBetween(viewerId, placeReviews.userId) : undefined,
          viewerId ? noUserBlockBetween(viewerId, placeReviewReactions.userId) : undefined
        )
      )
      .groupBy(placeReviewReactions.type)

    let onCount = 0
    let offCount = 0
    for (const row of rows) {
      if (row.type === 'on') onCount = Number(row.value)
      else offCount = Number(row.value)
    }

    return { reviewId, onCount, offCount, total: onCount + offCount }
  }

  async listReactionUsers(
    reviewId: string,
    type: 'on' | 'off',
    page: number,
    viewerId?: string
  ): Promise<ReviewInteractionUser[]> {
    const limit = 20
    const offset = (page - 1) * limit

    return db
      .select({ id: users.id, username: users.username, image: users.image })
      .from(placeReviewReactions)
      .innerJoin(placeReviews, eq(placeReviewReactions.reviewId, placeReviews.id))
      .innerJoin(users, eq(placeReviewReactions.userId, users.id))
      .where(
        and(
          eq(placeReviewReactions.reviewId, reviewId),
          eq(placeReviewReactions.type, type),
          viewerId ? noUserBlockBetween(viewerId, placeReviews.userId) : undefined,
          viewerId ? noUserBlockBetween(viewerId, placeReviewReactions.userId) : undefined
        )
      )
      .orderBy(desc(placeReviewReactions.createdAt))
      .limit(limit)
      .offset(offset)
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
      .where(
        and(eq(placeReviewReactions.reviewId, reviewId), eq(placeReviewReactions.userId, userId))
      )
  }

  async favoriteReview(userId: string, reviewId: string): Promise<void> {
    await db
      .insert(userFavoriteReviews)
      .values({ userId, reviewId })
      .onConflictDoUpdate({
        target: userFavoriteReviews.userId,
        set: {
          reviewId,
          createdAt: new Date()
        }
      })
  }

  async unfavoriteReview(userId: string, reviewId: string): Promise<void> {
    await db
      .delete(userFavoriteReviews)
      .where(
        and(eq(userFavoriteReviews.userId, userId), eq(userFavoriteReviews.reviewId, reviewId))
      )
  }

  async delete(reviewId: string): Promise<void> {
    await db.delete(placeReviews).where(eq(placeReviews.id, reviewId))
  }

  async getCommentById(commentId: string): Promise<PlaceReviewComment | null> {
    return this.findCommentById(commentId)
  }

  async deleteComment(commentId: string): Promise<void> {
    await db.delete(placeReviewComments).where(eq(placeReviewComments.id, commentId))
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
