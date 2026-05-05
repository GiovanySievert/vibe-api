import { ApplicationEvent } from '@src/shared/application/events'

export const FOLLOW_REQUEST_ACCEPTED_EVENT = 'follow.follow-request-accepted'

export interface FollowRequestAcceptedPayload {
  followRequestId: string
  requesterId: string
  requestedId: string
  requestedName: string
}

export type FollowRequestAcceptedEvent = ApplicationEvent<
  typeof FOLLOW_REQUEST_ACCEPTED_EVENT,
  FollowRequestAcceptedPayload
>

export function createFollowRequestAcceptedEvent(
  payload: FollowRequestAcceptedPayload
): FollowRequestAcceptedEvent {
  return { name: FOLLOW_REQUEST_ACCEPTED_EVENT, payload }
}
