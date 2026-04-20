import { EventRepository } from '../../../domain/repositories'
import { Event } from '../../../domain/mappers'

export class ListEventInvitations {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(userId: string): Promise<Event[]> {
    return await this.eventRepository.listByParticipant(userId)
  }
}
