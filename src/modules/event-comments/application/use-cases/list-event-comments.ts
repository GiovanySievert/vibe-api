import { EventCommentRepository, ListEventCommentsResult } from '../../domain/repositories'

interface ListEventCommentsInput {
  eventId: string
  page: number
  limit: number
}

export class ListEventComments {
  constructor(private readonly eventCommentRepository: EventCommentRepository) {}

  async execute({ eventId, page, limit }: ListEventCommentsInput): Promise<ListEventCommentsResult> {
    return this.eventCommentRepository.listByEvent(eventId, page, limit)
  }
}
