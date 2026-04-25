import { createEventCreatedEvent } from '../../events/event-created.event'
import { EventRepository, CreateEventInput } from '../../../domain/repositories'
import { Event } from '../../../domain/mappers'
import { ApplicationEventBus } from '@src/shared/application/events'

export class CreateEvent {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly applicationEventBus: ApplicationEventBus
  ) {}

  async execute(input: CreateEventInput & { ownerName: string }): Promise<Event> {
    const event = await this.eventRepository.create(input)

    await this.applicationEventBus.publish(
      createEventCreatedEvent({
        eventId: event.id,
        eventName: event.name,
        ownerId: input.ownerId,
        ownerName: input.ownerName,
        participantUserIds: (event.participants ?? []).map((participant) => participant.userId)
      })
    )

    return event
  }
}
