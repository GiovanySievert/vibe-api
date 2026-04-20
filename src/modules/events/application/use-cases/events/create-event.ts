import { EventRepository, CreateEventInput } from '../../../domain/repositories'
import { Event } from '../../../domain/mappers'

export class CreateEvent {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(input: CreateEventInput): Promise<Event> {
    return await this.eventRepository.create(input)
  }
}
