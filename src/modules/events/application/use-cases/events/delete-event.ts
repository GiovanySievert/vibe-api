import { EventNotFoundException, EventNotOwnerException } from '../../../domain/exceptions'
import { EventRepository } from '../../../domain/repositories'

interface DeleteEventInput {
  eventId: string
  userId: string
}

export class DeleteEvent {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute({ eventId, userId }: DeleteEventInput): Promise<void> {
    const event = await this.eventRepository.findById(eventId)

    if (!event) throw new EventNotFoundException()
    if (event.ownerId !== userId) throw new EventNotOwnerException()

    await this.eventRepository.delete(eventId)
  }
}
