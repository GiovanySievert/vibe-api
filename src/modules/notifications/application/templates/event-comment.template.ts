import { EventCommentCreatedEvent } from '@src/modules/event-comments/application/events/event-comment-created.event'
import { ResolvedNotification } from '../notification-types'

export function eventCommentTemplate(event: EventCommentCreatedEvent): ResolvedNotification {
  return {
    userIds: [event.payload.eventOwnerId],
    payload: {
      type: 'event_comment_created',
      title: 'Novo comentario no seu evento',
      body: `${event.payload.commenterName} comentou em ${event.payload.eventName}.`,
      data: {
        url: `myapp://events/share/${event.payload.eventId}`,
        eventId: event.payload.eventId,
        commenterId: event.payload.commenterId
      }
    }
  }
}
