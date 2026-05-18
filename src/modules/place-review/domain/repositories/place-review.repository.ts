import { PlaceReview } from '../mappers'
import {
  FeedReviewItem,
  ListPlaceReviewCommentsResult,
  ListPlaceReviewFriendsResult,
  PlaceReviewComment,
  PlaceReviewReactionType,
  ReviewCounts,
  ReviewInteractionCount,
  ReviewInteractionUser
} from '../types'

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

export interface PlaceReviewCountByPlace {
  placeId: string
  placeName: string | null
  brandAvatar: string | null
  reviewCount: number
  latestReviewAt: Date
}

export interface SelectedPlaceReviewCountByPlace extends PlaceReviewCountByPlace {
  profilePosition: number
}

export interface PlaceReviewRepository {
  create(data: Omit<PlaceReview, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlaceReview>
  getById(reviewId: string): Promise<PlaceReview | null>
  getByUserAndPlace(userId: string, placeId: string): Promise<PlaceReview | null>
  getLastReviewByUserAndPlace(userId: string, placeId: string): Promise<PlaceReview | null>
  countReviewsByUserAndPlace(userId: string, placeId: string): Promise<number>
  listReviewCountsByUserGroupedByPlace(userId: string): Promise<PlaceReviewCountByPlace[]>
  listSelectedReviewCountsByUserGroupedByPlace(
    userId: string
  ): Promise<SelectedPlaceReviewCountByPlace[]>
  listByPlace(placeId: string, since: Date, page?: number): Promise<FeedReviewItem[]>
  listPopularByPlace(placeId: string, since: Date, limit: number): Promise<FeedReviewItem[]>
  listFriendsByPlace(
    placeId: string,
    viewerId: string,
    since: Date,
    page: number,
    limit: number
  ): Promise<ListPlaceReviewFriendsResult>
  listByUser(userId: string, page?: number): Promise<FeedReviewItem[]>
  listFollowingFeed(userId: string, since: Date, page?: number): Promise<FeedReviewItem[]>
  listCountsByReviewIds(reviewIds: string[], viewerId?: string): Promise<ReviewCounts[]>
  createComment(input: CreatePlaceReviewCommentInput): Promise<PlaceReviewComment>
  getCommentById(commentId: string): Promise<PlaceReviewComment | null>
  listComments(
    reviewId: string,
    page: number,
    limit: number
  ): Promise<ListPlaceReviewCommentsResult>
  deleteComment(commentId: string): Promise<void>
  countReactions(reviewId: string): Promise<ReviewInteractionCount>
  listReactionUsers(
    reviewId: string,
    type: 'on' | 'off',
    page: number
  ): Promise<ReviewInteractionUser[]>
  setReaction(input: SetPlaceReviewReactionInput): Promise<void>
  removeReaction(reviewId: string, userId: string): Promise<void>
  favoriteReview(userId: string, reviewId: string): Promise<void>
  unfavoriteReview(userId: string, reviewId: string): Promise<void>
  update(
    reviewId: string,
    data: Partial<Omit<PlaceReview, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<PlaceReview>
  delete(reviewId: string): Promise<void>
}
