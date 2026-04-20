import { EventNotFoundException, EventNotOwnerException } from '../../../domain/exceptions'
import { Event } from '../../../domain/mappers'
import { EventRepository } from '../../../domain/repositories'

interface UpdateEventDescriptionInput {
  eventId: string
  userId: string
  description: string
}

export class UpdateEventDescription {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute({ eventId, userId, description }: UpdateEventDescriptionInput): Promise<Event> {
    const event = await this.eventRepository.findById(eventId)

    if (!event) throw new EventNotFoundException()
    if (event.ownerId !== userId) throw new EventNotOwnerException()

    return this.eventRepository.updateDescription(eventId, description)
  }
}
