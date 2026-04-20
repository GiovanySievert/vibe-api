import { EventComment } from '../../../domain/mappers'
import { ListEventCommentsResult } from '../../../domain/repositories'

export interface EventCommentDto {
  id: string
  eventId: string
  userId: string
  username: string
  avatar: string | null
  content: string
  createdAt: string
}

export interface ListEventCommentsDto {
  data: EventCommentDto[]
  total: number
  hasMore: boolean
}

export class EventCommentDtoMapper {
  static from(comment: EventComment): EventCommentDto {
    return {
      id: comment.id,
      eventId: comment.eventId,
      userId: comment.userId,
      username: comment.username,
      avatar: comment.avatar,
      content: comment.content,
      createdAt: comment.createdAt.toISOString()
    }
  }

  static fromList(result: ListEventCommentsResult): ListEventCommentsDto {
    return {
      data: result.data.map(this.from),
      total: result.total,
      hasMore: result.hasMore
    }
  }
}
