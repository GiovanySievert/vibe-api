import { PlaceReview } from '../mappers'
import { FeedReviewItem, ListPlaceReviewCommentsResult, PlaceReviewComment, PlaceReviewReactionType, ReviewCounts } from '../types'

export interface CreatePlaceReviewCommentInput {
  reviewId: string
  userId: string
  content: string
}

export interface SetPlaceReviewReactionInput {
  reviewId: string
  userId: string
  type: PlaceReviewReactionType
}

export interface PlaceReviewRepository {
  create(data: Omit<PlaceReview, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlaceReview>
  getById(reviewId: string): Promise<PlaceReview | null>
  getByUserAndPlace(userId: string, placeId: string): Promise<PlaceReview | null>
  countReviewsByUserAndPlace(userId: string, placeId: string): Promise<number>
  listByPlace(placeId: string, since: Date, page?: number): Promise<FeedReviewItem[]>
  listByUser(userId: string, page?: number): Promise<FeedReviewItem[]>
  listFollowingFeed(userId: string, since: Date, page?: number): Promise<FeedReviewItem[]>
  listCountsByReviewIds(reviewIds: string[], viewerId?: string): Promise<ReviewCounts[]>
  createComment(input: CreatePlaceReviewCommentInput): Promise<PlaceReviewComment>
  listComments(reviewId: string, page: number, limit: number): Promise<ListPlaceReviewCommentsResult>
  setReaction(input: SetPlaceReviewReactionInput): Promise<void>
  removeReaction(reviewId: string, userId: string): Promise<void>
  update(reviewId: string, data: Partial<Omit<PlaceReview, 'id' | 'createdAt' | 'updatedAt'>>): Promise<PlaceReview>
  delete(reviewId: string): Promise<void>
}
