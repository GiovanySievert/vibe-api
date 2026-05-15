import { createEventCreatedEvent } from '../../events/event-created.event'
import { EventRepository, CreateEventInput } from '../../../domain/repositories'
import { Event } from '../../../domain/mappers'
import { ApplicationEventBus } from '@src/shared/application/events'
import { PlacesRepository } from '@src/modules/brands/domain/repositories'
import { PlaceNotFoundException } from '@src/modules/brands/domain/exceptions'

export class CreateEvent {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly placesRepository: PlacesRepository,
    private readonly applicationEventBus: ApplicationEventBus
  ) {}

  async execute(input: CreateEventInput & { ownerName: string }): Promise<Event> {
    if (input.placeId) {
      const place = await this.placesRepository.getById(input.placeId)
      if (!place || Array.isArray(place)) {
        throw new PlaceNotFoundException(input.placeId)
      }
    }

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
