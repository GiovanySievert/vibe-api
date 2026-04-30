import { appLogger } from '@src/config/logger'
import { EVENT_CREATED_EVENT, EventCreatedEvent } from '@src/modules/events/application/events/event-created.event'
import { ApplicationEventHandler } from '@src/shared/application/events'
import { eventInvitationTemplate } from '../templates/event-invitation.template'
import { DispatchNotification } from '../use-cases/dispatch-notification'

export class DispatchEventInvitationHandler implements ApplicationEventHandler<EventCreatedEvent> {
  constructor(private readonly dispatchNotification: DispatchNotification) {}

  async handle(event: EventCreatedEvent): Promise<void> {
    if (event.name !== EVENT_CREATED_EVENT) {
      return
    }

    const { userIds, payload } = eventInvitationTemplate(event)

    if (userIds.length === 0) {
      return
    }

    try {
      await this.dispatchNotification.execute({ userIds, payload })
    } catch (error) {
      appLogger.warn('Failed to dispatch event invitation notification', {
        error,
        ownerId: event.payload.ownerId,
        eventId: event.payload.eventId
      })
    }
  }
}
