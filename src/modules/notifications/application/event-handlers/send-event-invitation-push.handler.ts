import { appLogger } from '@src/config/logger'
import { EVENT_CREATED_EVENT, EventCreatedEvent } from '@src/modules/events/application/events/event-created.event'
import { ApplicationEventHandler } from '@src/shared/application/events'
import { SendPushNotification } from '../use-cases/send-push-notification'

export class SendEventInvitationPushHandler implements ApplicationEventHandler<EventCreatedEvent> {
  constructor(private readonly sendPushNotification: SendPushNotification) {}

  async handle(event: EventCreatedEvent): Promise<void> {
    if (event.name !== EVENT_CREATED_EVENT) {
      return
    }

    const participantUserIds = [...new Set(event.payload.participantUserIds.filter(Boolean))]

    if (participantUserIds.length === 0) {
      return
    }

    try {
      await this.sendPushNotification.execute({
        userIds: participantUserIds,
        title: 'Novo convite para evento',
        body: `${event.payload.ownerName} convidou voce para ${event.payload.eventName}.`,
        data: {
          type: 'event_invitation_received',
          url: `myapp://events/share/${event.payload.eventId}`
        }
      })
    } catch (error) {
      appLogger.warn('Failed to send event invitation push notification', {
        error,
        ownerId: event.payload.ownerId,
        eventId: event.payload.eventId
      })
    }
  }
}
