import { EventCreatedEvent } from '@src/modules/events/application/events/event-created.event'
import { ResolvedNotification } from '../notification-types'

export function eventInvitationTemplate(event: EventCreatedEvent): ResolvedNotification {
  const userIds = [...new Set(event.payload.participantUserIds.filter(Boolean))]

  return {
    userIds,
    payload: {
      type: 'event_invitation',
      title: 'Novo convite para evento',
      body: `${event.payload.ownerName} convidou voce para ${event.payload.eventName}.`,
      data: {
        type: 'event_invitation_received',
        url: `myapp://events/share/${event.payload.eventId}`,
        eventId: event.payload.eventId,
        ownerId: event.payload.ownerId
      }
    }
  }
}
