import { PlaceNotFoundException } from '@src/modules/brands/domain/exceptions'
import { PlacesRepository } from '@src/modules/brands/domain/repositories'
import { EventNotFoundException, EventNotOwnerException } from '../../../domain/exceptions'
import { Event } from '../../../domain/mappers'
import { EventRepository } from '../../../domain/repositories'

interface UpdateEventDetailsInput {
  eventId: string
  userId: string
  description: string
  placeId: string | null
  imageUrl: string | null
}

export class UpdateEventDetails {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly placesRepository: PlacesRepository
  ) {}

  async execute({ eventId, userId, description, placeId, imageUrl }: UpdateEventDetailsInput): Promise<Event> {
    const event = await this.eventRepository.findById(eventId)

    if (!event) throw new EventNotFoundException()
    if (event.ownerId !== userId) throw new EventNotOwnerException()

    if (placeId) {
      const place = await this.placesRepository.getById(placeId)
      if (!place || Array.isArray(place)) {
        throw new PlaceNotFoundException(placeId)
      }
    }

    return this.eventRepository.updateDetails(eventId, { description, placeId, imageUrl })
  }
}
