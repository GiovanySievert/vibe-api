import { EventRepository } from '../../../domain/repositories'
import { Event } from '../../../domain/mappers'

export class ListUserEvents {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(ownerId: string): Promise<Event[]> {
    return await this.eventRepository.listByOwner(ownerId)
  }
}
