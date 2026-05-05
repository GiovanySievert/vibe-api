import { ApplicationEvent } from '@src/shared/application/events'

export const EVENT_COMMENT_CREATED_EVENT = 'events.event-comment-created'

export interface EventCommentCreatedPayload {
  commentId: string
  eventId: string
  eventName: string
  eventOwnerId: string
  commenterId: string
  commenterName: string
}

export type EventCommentCreatedEvent = ApplicationEvent<
  typeof EVENT_COMMENT_CREATED_EVENT,
  EventCommentCreatedPayload
>

export function createEventCommentCreatedEvent(
  payload: EventCommentCreatedPayload
): EventCommentCreatedEvent {
  return { name: EVENT_COMMENT_CREATED_EVENT, payload }
}
