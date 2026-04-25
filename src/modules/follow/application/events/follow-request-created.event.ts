import { ApplicationEvent } from '@src/shared/application/events'

export const FOLLOW_REQUEST_CREATED_EVENT = 'follow.follow-request-created'

export interface FollowRequestCreatedPayload {
  followRequestId: string
  requesterId: string
  requesterName: string
  requestedId: string
}

export type FollowRequestCreatedEvent = ApplicationEvent<typeof FOLLOW_REQUEST_CREATED_EVENT, FollowRequestCreatedPayload>

export function createFollowRequestCreatedEvent(payload: FollowRequestCreatedPayload): FollowRequestCreatedEvent {
  return {
    name: FOLLOW_REQUEST_CREATED_EVENT,
    payload
  }
}
