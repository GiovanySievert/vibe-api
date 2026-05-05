import { PlaceReviewCommentCreatedEvent } from '@src/modules/place-review/application/events/place-review-comment-created.event'
import { ResolvedNotification } from '../notification-types'

export function placeReviewCommentTemplate(event: PlaceReviewCommentCreatedEvent): ResolvedNotification {
  return {
    userIds: [event.payload.reviewOwnerId],
    payload: {
      type: 'place_review_comment',
      title: 'Novo comentario no seu post',
      body: `${event.payload.commenterName} comentou no seu post.`,
      data: {
        url: `myapp://reviews/${event.payload.reviewId}`,
        reviewId: event.payload.reviewId,
        commenterId: event.payload.commenterId
      }
    }
  }
}
