import { PlaceReview } from '../../domain/mappers'
import {
  CreatePlaceReviewCommentInput,
  PlaceReviewCountByPlace,
  PlaceReviewRepository,
  SelectedPlaceReviewCountByPlace,
  SetPlaceReviewReactionInput
} from '../../domain/repositories'
import {
  FeedReviewItem,
  ListPlaceReviewCommentsResult,
  ListPlaceReviewFriendsResult,
  PlaceReviewComment,
  PlaceReviewReactionType,
  ReviewCounts,
  ReviewInteractionCount,
  ReviewInteractionUser
} from '../../domain/types'

export class MockPlaceReviewRepository implements PlaceReviewRepository {
  private reviews: PlaceReview[] = []
  private comments: PlaceReviewComment[] = []
  private reactions: Array<{
    reviewId: string
    userId: string
    type: PlaceReviewReactionType
  }> = []
  private follows: Array<{ followerId: string; followingId: string }> = []
  private favoriteReviews = new Map<string, string>()
  private profileBadgeSelections = new Map<string, Array<{ placeId: string; position: number }>>()

  async create(data: Omit<PlaceReview, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlaceReview> {
    const review: PlaceReview = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.reviews.push(review)
    return review
  }

  async getById(reviewId: string): Promise<PlaceReview | null> {
    return this.reviews.find((r) => r.id === reviewId) ?? null
  }

  async getByUserAndPlace(userId: string, placeId: string): Promise<PlaceReview | null> {
    return this.reviews.find((r) => r.userId === userId && r.placeId === placeId) ?? null
  }

  async getLastReviewByUserAndPlace(userId: string, placeId: string): Promise<PlaceReview | null> {
    const matches = this.reviews.filter((r) => r.userId === userId && r.placeId === placeId)
    if (matches.length === 0) return null
    return matches.reduce((latest, r) => (r.createdAt > latest.createdAt ? r : latest))
  }

  async countReviewsByUserAndPlace(userId: string, placeId: string): Promise<number> {
    return this.reviews.filter((r) => r.userId === userId && r.placeId === placeId).length
  }

  async listReviewCountsByUserGroupedByPlace(userId: string): Promise<PlaceReviewCountByPlace[]> {
    const reviewCountByPlaceId = new Map<string, PlaceReviewCountByPlace>()

    for (const placeReview of this.reviews.filter((review) => review.userId === userId)) {
      const placeReviewCount = reviewCountByPlaceId.get(placeReview.placeId)
      if (placeReviewCount) {
        placeReviewCount.reviewCount += 1
        if (placeReview.createdAt > placeReviewCount.latestReviewAt) {
          placeReviewCount.latestReviewAt = placeReview.createdAt
        }
        continue
      }

      reviewCountByPlaceId.set(placeReview.placeId, {
        placeId: placeReview.placeId,
        placeName: placeReview.placeName,
        brandAvatar: null,
        reviewCount: 1,
        latestReviewAt: placeReview.createdAt
      })
    }

    return [...reviewCountByPlaceId.values()].sort((a, b) => b.reviewCount - a.reviewCount)
  }

  async listSelectedReviewCountsByUserGroupedByPlace(
    userId: string
  ): Promise<SelectedPlaceReviewCountByPlace[]> {
    const profileBadgeSelections = this.profileBadgeSelections.get(userId) ?? []
    const profilePositionByPlaceId = new Map(
      profileBadgeSelections.map((profileBadgeSelection) => [
        profileBadgeSelection.placeId,
        profileBadgeSelection.position
      ])
    )
    const placeReviewCounts = await this.listReviewCountsByUserGroupedByPlace(userId)

    return placeReviewCounts
      .filter((placeReviewCount) => profilePositionByPlaceId.has(placeReviewCount.placeId))
      .map((placeReviewCount) => ({
        ...placeReviewCount,
        profilePosition: profilePositionByPlaceId.get(placeReviewCount.placeId) as number
      }))
      .sort((a, b) => a.profilePosition - b.profilePosition)
  }

  async listByPlace(placeId: string, _since: Date, page?: number): Promise<FeedReviewItem[]> {
    const limit = 10
    const offset = ((page ?? 1) - 1) * limit
    return this.toFeedItems(
      this.reviews.filter((r) => r.placeId === placeId).slice(offset, offset + limit)
    )
  }

  async listPopularByPlace(placeId: string, since: Date, limit: number): Promise<FeedReviewItem[]> {
    const reactionCountFor = (reviewId: string) =>
      this.reactions.filter((r) => r.reviewId === reviewId).length
    return this.toFeedItems(
      this.reviews
        .filter((r) => r.placeId === placeId && r.createdAt >= since)
        .sort((a, b) => reactionCountFor(b.id) - reactionCountFor(a.id))
        .slice(0, limit)
    )
  }

  async listFriendsByPlace(
    placeId: string,
    viewerId: string,
    since: Date,
    page: number,
    limit: number
  ): Promise<ListPlaceReviewFriendsResult> {
    const offset = (page - 1) * limit
    const followingIds = new Set(
      this.follows
        .filter((follow) => follow.followerId === viewerId)
        .map((follow) => follow.followingId)
    )
    const latestReviewAtByUserId = new Map<string, Date>()

    for (const review of this.reviews) {
      if (review.placeId !== placeId) continue
      if (review.createdAt < since) continue
      if (review.userId === viewerId) continue
      if (!followingIds.has(review.userId)) continue

      const current = latestReviewAtByUserId.get(review.userId)
      if (!current || review.createdAt > current)
        latestReviewAtByUserId.set(review.userId, review.createdAt)
    }

    const data = [...latestReviewAtByUserId.entries()]
      .map(([userId, latestReviewAt]) => ({
        id: userId,
        name: `Name ${userId}`,
        username: `user-${userId}`,
        image: null,
        latestReviewAt
      }))
      .sort((a, b) => b.latestReviewAt.getTime() - a.latestReviewAt.getTime())

    return {
      data: data.slice(offset, offset + limit),
      total: data.length,
      hasMore: offset + limit < data.length,
      page,
      limit
    }
  }

  async listByUser(userId: string, page?: number): Promise<FeedReviewItem[]> {
    const limit = 10
    const offset = ((page ?? 1) - 1) * limit
    const favoriteReviewId = this.favoriteReviews.get(userId)
    return this.toFeedItems(
      this.reviews
        .filter((r) => r.userId === userId)
        .sort((a, b) => {
          if (a.id === favoriteReviewId && b.id !== favoriteReviewId) return -1
          if (b.id === favoriteReviewId && a.id !== favoriteReviewId) return 1
          return b.createdAt.getTime() - a.createdAt.getTime()
        })
        .slice(offset, offset + limit)
    )
  }

  async listFollowingFeed(_userId: string, since: Date, page?: number): Promise<FeedReviewItem[]> {
    const limit = 20
    const offset = ((page ?? 1) - 1) * limit
    return this.toFeedItems(
      this.reviews.filter((r) => r.createdAt >= since).slice(offset, offset + limit),
      _userId
    )
  }

  async listCountsByReviewIds(reviewIds: string[], viewerId?: string): Promise<ReviewCounts[]> {
    return reviewIds.map((reviewId) => {
      const reviewComments = this.comments.filter((c) => c.reviewId === reviewId)
      const reviewReactions = this.reactions.filter((r) => r.reviewId === reviewId)
      const viewerReaction = viewerId
        ? (reviewReactions.find((r) => r.userId === viewerId)?.type ?? null)
        : null
      return {
        reviewId,
        commentsCount: reviewComments.length,
        onCount: reviewReactions.filter((r) => r.type === 'on').length,
        offCount: reviewReactions.filter((r) => r.type === 'off').length,
        viewerReaction
      }
    })
  }

  async createComment(input: CreatePlaceReviewCommentInput): Promise<PlaceReviewComment> {
    const comment: PlaceReviewComment = {
      id: `comment-${this.comments.length + 1}`,
      reviewId: input.reviewId,
      userId: input.userId,
      content: input.content,
      createdAt: new Date(),
      user: {
        id: input.userId,
        username: `user-${input.userId}`,
        image: null
      }
    }

    this.comments.unshift(comment)
    return comment
  }

  async listComments(
    reviewId: string,
    page: number,
    limit: number
  ): Promise<ListPlaceReviewCommentsResult> {
    const offset = (page - 1) * limit
    const data = this.comments.filter((comment) => comment.reviewId === reviewId)

    return {
      data: data.slice(offset, offset + limit),
      total: data.length,
      hasMore: offset + limit < data.length
    }
  }

  async setReaction(input: SetPlaceReviewReactionInput): Promise<void> {
    const index = this.reactions.findIndex(
      (reaction) => reaction.reviewId === input.reviewId && reaction.userId === input.userId
    )

    if (index >= 0) {
      this.reactions[index] = input
      return
    }

    this.reactions.push(input)
  }

  async removeReaction(reviewId: string, userId: string): Promise<void> {
    this.reactions = this.reactions.filter(
      (reaction) => !(reaction.reviewId === reviewId && reaction.userId === userId)
    )
  }

  async favoriteReview(userId: string, reviewId: string): Promise<void> {
    this.favoriteReviews.set(userId, reviewId)
  }

  async unfavoriteReview(userId: string, reviewId: string): Promise<void> {
    if (this.favoriteReviews.get(userId) === reviewId) this.favoriteReviews.delete(userId)
  }

  async update(
    reviewId: string,
    data: Partial<Omit<PlaceReview, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<PlaceReview> {
    this.reviews = this.reviews.map((r) =>
      r.id === reviewId ? { ...r, ...data, updatedAt: new Date() } : r
    )
    return this.reviews.find((r) => r.id === reviewId) as PlaceReview
  }

  async getCommentById(commentId: string): Promise<PlaceReviewComment | null> {
    return this.comments.find((c) => c.id === commentId) ?? null
  }

  async deleteComment(commentId: string): Promise<void> {
    this.comments = this.comments.filter((c) => c.id !== commentId)
  }

  async countReactions(reviewId: string): Promise<ReviewInteractionCount> {
    const reviewReactions = this.reactions.filter((r) => r.reviewId === reviewId)
    return {
      reviewId,
      onCount: reviewReactions.filter((r) => r.type === 'on').length,
      offCount: reviewReactions.filter((r) => r.type === 'off').length,
      total: reviewReactions.length
    }
  }

  async listReactionUsers(
    reviewId: string,
    type: 'on' | 'off',
    page: number
  ): Promise<ReviewInteractionUser[]> {
    const limit = 20
    const offset = (page - 1) * limit
    return this.reactions
      .filter((r) => r.reviewId === reviewId && r.type === type)
      .slice(offset, offset + limit)
      .map((r) => ({
        id: r.userId,
        username: `user-${r.userId}`,
        image: null
      }))
  }

  async delete(reviewId: string): Promise<void> {
    this.reviews = this.reviews.filter((r) => r.id !== reviewId)
  }

  reset() {
    this.reviews = []
    this.comments = []
    this.reactions = []
    this.follows = []
    this.favoriteReviews.clear()
    this.profileBadgeSelections.clear()
  }

  seed(data: PlaceReview[]) {
    this.reviews = [...data]
  }

  seedProfileBadgeSelections(
    userId: string,
    profileBadgeSelections: Array<{ placeId: string; position: number }>
  ) {
    this.profileBadgeSelections.set(userId, [...profileBadgeSelections])
  }

  seedFollows(follows: Array<{ followerId: string; followingId: string }>) {
    this.follows = [...follows]
  }

  getAll() {
    return [...this.reviews]
  }

  private toFeedItems(reviews: PlaceReview[], viewerId?: string): FeedReviewItem[] {
    return reviews.map((review) => {
      const reviewReactions = this.reactions.filter((reaction) => reaction.reviewId === review.id)

      return {
        ...review,
        user: {
          id: review.userId,
          username: `user-${review.userId}`,
          image: null
        },
        place: { id: review.placeId, name: `place-${review.placeId}` },
        viewerReaction: viewerId
          ? (reviewReactions.find((reaction) => reaction.userId === viewerId)?.type ?? null)
          : null,
        isFavorite: this.favoriteReviews.get(review.userId) === review.id
      }
    })
  }
}
