import { EventComment } from '../mappers'

export interface CreateEventCommentInput {
  eventId: string
  userId: string
  content: string
}

export interface ListEventCommentsResult {
  data: EventComment[]
  total: number
  hasMore: boolean
}

export interface EventCommentRepository {
  create(input: CreateEventCommentInput): Promise<EventComment>
  findById(commentId: string): Promise<EventComment | null>
  delete(commentId: string): Promise<void>
  listByEvent(eventId: string, page: number, limit: number): Promise<ListEventCommentsResult>
}
