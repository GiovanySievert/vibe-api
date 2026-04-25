import { ApplicationEvent } from '@src/shared/application/events'

export const EVENT_CREATED_EVENT = 'events.event-created'

export interface EventCreatedPayload {
  eventId: string
  eventName: string
  ownerId: string
  ownerName: string
  participantUserIds: string[]
}

export type EventCreatedEvent = ApplicationEvent<typeof EVENT_CREATED_EVENT, EventCreatedPayload>

export function createEventCreatedEvent(payload: EventCreatedPayload): EventCreatedEvent {
  return {
    name: EVENT_CREATED_EVENT,
    payload
  }
}
