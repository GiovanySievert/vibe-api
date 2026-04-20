import { EventComment } from '../../domain/mappers'
import { EventCommentRepository } from '../../domain/repositories'

interface CreateEventCommentInput {
  eventId: string
  userId: string
  content: string
}

export class CreateEventComment {
  constructor(private readonly eventCommentRepository: EventCommentRepository) {}

  async execute(input: CreateEventCommentInput): Promise<EventComment> {
    return this.eventCommentRepository.create(input)
  }
}
