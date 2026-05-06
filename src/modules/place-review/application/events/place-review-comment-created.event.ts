import { ApplicationEvent } from '@src/shared/application/events'

export const PLACE_REVIEW_COMMENT_CREATED_EVENT = 'place-review.comment-created'

export interface PlaceReviewCommentCreatedPayload {
  commentId: string
  reviewId: string
  reviewOwnerId: string
  commenterId: string
  commenterName: string
}

export type PlaceReviewCommentCreatedEvent = ApplicationEvent<
  typeof PLACE_REVIEW_COMMENT_CREATED_EVENT,
  PlaceReviewCommentCreatedPayload
>

export function createPlaceReviewCommentCreatedEvent(
  payload: PlaceReviewCommentCreatedPayload
): PlaceReviewCommentCreatedEvent {
  return { name: PLACE_REVIEW_COMMENT_CREATED_EVENT, payload }
}
