import { appLogger } from '@src/config/logger'
import {
  FOLLOW_REQUEST_CREATED_EVENT,
  FollowRequestCreatedEvent
} from '@src/modules/follow/application/events/follow-request-created.event'
import { ApplicationEventHandler } from '@src/shared/application/events'
import { followRequestTemplate } from '../templates/follow-request.template'
import { DispatchNotification } from '../use-cases/dispatch-notification'

export class DispatchFollowRequestHandler
  implements ApplicationEventHandler<FollowRequestCreatedEvent>
{
  constructor(private readonly dispatchNotification: DispatchNotification) {}

  async handle(event: FollowRequestCreatedEvent): Promise<void> {
    if (event.name !== FOLLOW_REQUEST_CREATED_EVENT) {
      return
    }

    const { userIds, payload } = followRequestTemplate(event)

    if (userIds.length === 0) {
      return
    }

    try {
      await this.dispatchNotification.execute({ userIds, payload })
    } catch (error) {
      appLogger.warn('Failed to dispatch follow request notification', {
        error,
        requesterId: event.payload.requesterId,
        requestedId: event.payload.requestedId,
        followRequestId: event.payload.followRequestId
      })
    }
  }
}
