import { CommentNotAuthorizedException, CommentNotFoundException } from '../../domain/exceptions'
import { EventCommentRepository } from '../../domain/repositories'

interface DeleteEventCommentInput {
  commentId: string
  userId: string
  eventOwnerId: string
}

export class DeleteEventComment {
  constructor(private readonly eventCommentRepository: EventCommentRepository) {}

  async execute({ commentId, userId, eventOwnerId }: DeleteEventCommentInput): Promise<void> {
    const comment = await this.eventCommentRepository.findById(commentId)

    if (!comment) throw new CommentNotFoundException()

    const isAuthor = comment.userId === userId
    const isEventOwner = userId === eventOwnerId

    if (!isAuthor && !isEventOwner) throw new CommentNotAuthorizedException()

    await this.eventCommentRepository.delete(commentId)
  }
}
