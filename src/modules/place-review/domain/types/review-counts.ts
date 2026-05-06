import { PlaceReviewReactionType } from './place-review-reaction'

export type ReviewCounts = {
  reviewId: string
  commentsCount: number
  onCount: number
  offCount: number
  viewerReaction: PlaceReviewReactionType | null
}
