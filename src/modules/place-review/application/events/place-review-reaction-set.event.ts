import { ApplicationEvent } from '@src/shared/application/events'

export const PLACE_REVIEW_REACTION_SET_EVENT = 'place-review.reaction-set'

export interface PlaceReviewReactionSetPayload {
  reviewId: string
  reviewOwnerId: string
  reactorId: string
  reactorName: string
  reactionType: 'on' | 'off'
}

export type PlaceReviewReactionSetEvent = ApplicationEvent<
  typeof PLACE_REVIEW_REACTION_SET_EVENT,
  PlaceReviewReactionSetPayload
>

export function createPlaceReviewReactionSetEvent(
  payload: PlaceReviewReactionSetPayload
): PlaceReviewReactionSetEvent {
  return { name: PLACE_REVIEW_REACTION_SET_EVENT, payload }
}
