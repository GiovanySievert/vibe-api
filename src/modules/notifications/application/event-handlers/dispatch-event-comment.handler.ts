import { appLogger } from '@src/config/logger'
import {
  EVENT_COMMENT_CREATED_EVENT,
  EventCommentCreatedEvent
} from '@src/modules/event-comments/application/events/event-comment-created.event'
import { ApplicationEventHandler } from '@src/shared/application/events'
import { eventCommentTemplate } from '../templates/event-comment.template'
import { DispatchNotification } from '../use-cases/dispatch-notification'

export class DispatchEventCommentHandler
  implements ApplicationEventHandler<EventCommentCreatedEvent>
{
  constructor(private readonly dispatchNotification: DispatchNotification) {}

  async handle(event: EventCommentCreatedEvent): Promise<void> {
    if (event.name !== EVENT_COMMENT_CREATED_EVENT) {
      return
    }

    const { userIds, payload } = eventCommentTemplate(event)

    if (userIds.length === 0) {
      return
    }

    try {
      await this.dispatchNotification.execute({ userIds, payload })
    } catch (error) {
      appLogger.warn('Failed to dispatch event comment notification', {
        error,
        eventId: event.payload.eventId,
        commenterId: event.payload.commenterId
      })
    }
  }
}
