import { PlaceReview } from '../../domain/mappers'
import {
  CreatePlaceReviewCommentInput,
  PlaceReviewRepository,
  SetPlaceReviewReactionInput
} from '../../domain/repositories'
import { FeedReviewItem, ListPlaceReviewCommentsResult, PlaceReviewComment, PlaceReviewReactionType, ReviewCounts } from '../../domain/types'

export class MockPlaceReviewRepository implements PlaceReviewRepository {
  private reviews: PlaceReview[] = []
  private comments: PlaceReviewComment[] = []
  private reactions: Array<{ reviewId: string; userId: string; type: PlaceReviewReactionType }> = []

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

  async countReviewsByUserAndPlace(userId: string, placeId: string): Promise<number> {
    return this.reviews.filter((r) => r.userId === userId && r.placeId === placeId).length
  }

  async listByPlace(placeId: string, _since: Date, page?: number): Promise<FeedReviewItem[]> {
    const limit = 10
    const offset = ((page ?? 1) - 1) * limit
    return this.toFeedItems(this.reviews.filter((r) => r.placeId === placeId).slice(offset, offset + limit))
  }

  async listByUser(userId: string, page?: number): Promise<FeedReviewItem[]> {
    const limit = 10
    const offset = ((page ?? 1) - 1) * limit
    return this.toFeedItems(this.reviews.filter((r) => r.userId === userId).slice(offset, offset + limit))
  }

  async listFollowingFeed(_userId: string, since: Date, page?: number): Promise<FeedReviewItem[]> {
    const limit = 20
    const offset = ((page ?? 1) - 1) * limit
    return this.toFeedItems(this.reviews.filter((r) => r.createdAt >= since).slice(offset, offset + limit), _userId)
  }

  async listCountsByReviewIds(reviewIds: string[], viewerId?: string): Promise<ReviewCounts[]> {
    return reviewIds.map((reviewId) => {
      const reviewComments = this.comments.filter((c) => c.reviewId === reviewId)
      const reviewReactions = this.reactions.filter((r) => r.reviewId === reviewId)
      const viewerReaction = viewerId
        ? reviewReactions.find((r) => r.userId === viewerId)?.type ?? null
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

  async listComments(reviewId: string, page: number, limit: number): Promise<ListPlaceReviewCommentsResult> {
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
    this.reactions = this.reactions.filter((reaction) => !(reaction.reviewId === reviewId && reaction.userId === userId))
  }

  async update(reviewId: string, data: Partial<Omit<PlaceReview, 'id' | 'createdAt' | 'updatedAt'>>): Promise<PlaceReview> {
    this.reviews = this.reviews.map((r) =>
      r.id === reviewId ? { ...r, ...data, updatedAt: new Date() } : r
    )
    return this.reviews.find((r) => r.id === reviewId) as PlaceReview
  }

  async delete(reviewId: string): Promise<void> {
    this.reviews = this.reviews.filter((r) => r.id !== reviewId)
  }

  reset() {
    this.reviews = []
    this.comments = []
    this.reactions = []
  }

  seed(data: PlaceReview[]) {
    this.reviews = [...data]
  }

  getAll() {
    return [...this.reviews]
  }

  private toFeedItems(reviews: PlaceReview[], viewerId?: string): FeedReviewItem[] {
    return reviews.map((review) => {
      const reviewReactions = this.reactions.filter((reaction) => reaction.reviewId === review.id)

      return {
        ...review,
        user: { id: review.userId, username: `user-${review.userId}`, image: null },
        place: { id: review.placeId, name: `place-${review.placeId}` },
        viewerReaction: viewerId ? reviewReactions.find((reaction) => reaction.userId === viewerId)?.type ?? null : null
      }
    })
  }
}
