import { FollowRequestCreatedEvent } from '@src/modules/follow/application/events/follow-request-created.event'
import { ResolvedNotification } from '../notification-types'

export function followRequestTemplate(event: FollowRequestCreatedEvent): ResolvedNotification {
  return {
    userIds: [event.payload.requestedId],
    payload: {
      type: 'follow_request_created',
      title: 'Nova solicitacao de follow',
      body: `${event.payload.requesterName} quer seguir voce.`,
      data: {
        type: 'follow_request_received',
        url: 'myapp://social/follow-requests/received',
        requesterId: event.payload.requesterId,
        followRequestId: event.payload.followRequestId
      }
    }
  }
}
