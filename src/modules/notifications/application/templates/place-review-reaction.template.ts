import { PlaceReviewReactionSetEvent } from '@src/modules/place-review/application/events/place-review-reaction-set.event'
import { ResolvedNotification } from '../notification-types'

export function placeReviewReactionTemplate(event: PlaceReviewReactionSetEvent): ResolvedNotification | null {
  if (event.payload.reactionType !== 'on') return null

  return {
    userIds: [event.payload.reviewOwnerId],
    payload: {
      type: 'place_review_reaction',
      title: 'Reagiram no seu post',
      body: `${event.payload.reactorName} reagiu no seu post.`,
      data: {
        url: `myapp://reviews/${event.payload.reviewId}`,
        reviewId: event.payload.reviewId,
        reactorId: event.payload.reactorId
      }
    }
  }
}
