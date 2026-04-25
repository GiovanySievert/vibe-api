import { appLogger } from '@src/config/logger'
import {
  FOLLOW_REQUEST_CREATED_EVENT,
  FollowRequestCreatedEvent
} from '@src/modules/follow/application/events/follow-request-created.event'
import { ApplicationEventHandler } from '@src/shared/application/events'
import { SendPushNotification } from '../use-cases/send-push-notification'

export class SendFollowRequestPushHandler implements ApplicationEventHandler<FollowRequestCreatedEvent> {
  constructor(private readonly sendPushNotification: SendPushNotification) {}

  async handle(event: FollowRequestCreatedEvent): Promise<void> {
    if (event.name !== FOLLOW_REQUEST_CREATED_EVENT) {
      return
    }

    try {
      await this.sendPushNotification.execute({
        userIds: [event.payload.requestedId],
        title: 'Nova solicitacao de follow',
        body: `${event.payload.requesterName} quer seguir voce.`,
        data: {
          type: 'follow_request_received',
          url: 'myapp://social/follow-requests/received'
        }
      })
    } catch (error) {
      appLogger.warn('Failed to send follow request push notification', {
        error,
        requesterId: event.payload.requesterId,
        requestedId: event.payload.requestedId,
        followRequestId: event.payload.followRequestId
      })
    }
  }
}
