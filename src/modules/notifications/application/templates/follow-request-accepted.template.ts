import { FollowRequestAcceptedEvent } from '@src/modules/follow/application/events/follow-request-accepted.event'
import { ResolvedNotification } from '../notification-types'

export function followRequestAcceptedTemplate(event: FollowRequestAcceptedEvent): ResolvedNotification {
  return {
    userIds: [event.payload.requesterId],
    payload: {
      type: 'follow_request_accepted',
      title: 'Solicitacao aceita',
      body: `${event.payload.requestedName} comecou a te seguir.`,
      data: {
        url: `myapp://social/profile/${event.payload.requestedId}`,
        userId: event.payload.requestedId
      }
    }
  }
}
