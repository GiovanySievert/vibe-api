import { EventRepository } from '../../../domain/repositories'
import { Event } from '../../../domain/mappers'
import { EventNotFoundException } from '../../../domain/exceptions'

export class GetEventById {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(id: string, userId: string): Promise<Event> {
    const event = await this.eventRepository.findById(id)
    if (!event) throw new EventNotFoundException()
    if (event.ownerId !== userId && !event.participants?.some((participant) => participant.userId === userId)) {
      throw new EventNotFoundException()
    }
    return event
  }
}
