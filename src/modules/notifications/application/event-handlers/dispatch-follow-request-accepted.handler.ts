import { appLogger } from '@src/config/logger'
import {
  FOLLOW_REQUEST_ACCEPTED_EVENT,
  FollowRequestAcceptedEvent
} from '@src/modules/follow/application/events/follow-request-accepted.event'
import { ApplicationEventHandler } from '@src/shared/application/events'
import { followRequestAcceptedTemplate } from '../templates/follow-request-accepted.template'
import { DispatchNotification } from '../use-cases/dispatch-notification'

export class DispatchFollowRequestAcceptedHandler
  implements ApplicationEventHandler<FollowRequestAcceptedEvent>
{
  constructor(private readonly dispatchNotification: DispatchNotification) {}

  async handle(event: FollowRequestAcceptedEvent): Promise<void> {
    if (event.name !== FOLLOW_REQUEST_ACCEPTED_EVENT) {
      return
    }

    const { userIds, payload } = followRequestAcceptedTemplate(event)

    if (userIds.length === 0) {
      return
    }

    try {
      await this.dispatchNotification.execute({ userIds, payload })
    } catch (error) {
      appLogger.warn('Failed to dispatch follow request accepted notification', {
        error,
        requesterId: event.payload.requesterId,
        requestedId: event.payload.requestedId
      })
    }
  }
}
