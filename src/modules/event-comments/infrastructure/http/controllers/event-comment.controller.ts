import { User } from 'better-auth/types'

import { EventNotFoundException } from '@src/modules/events/domain/exceptions'
import { EventRepository } from '@src/modules/events/domain/repositories'

import { CreateEventComment, DeleteEventComment, ListEventComments } from '../../../application/use-cases'
import { EventCommentDtoMapper } from '../dtos'

export class EventCommentController {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly createEventComment: CreateEventComment,
    private readonly deleteEventComment: DeleteEventComment,
    private readonly listEventComments: ListEventComments
  ) {}

  async list({ params, query }: { params: { eventId: string }; query: { page?: string } }) {
    const page = Math.max(1, Number(query.page) || 1)
    const result = await this.listEventComments.execute({ eventId: params.eventId, page, limit: 20 })
    return EventCommentDtoMapper.fromList(result)
  }

  async create({ params, body, user }: { params: { eventId: string }; body: { content: string }; user: User }) {
    const comment = await this.createEventComment.execute({
      eventId: params.eventId,
      userId: user.id,
      content: body.content
    })
    return EventCommentDtoMapper.from(comment)
  }

  async delete({
    params,
    user
  }: {
    params: { eventId: string; commentId: string }
    user: User
  }) {
    const event = await this.eventRepository.findById(params.eventId)
    if (!event) throw new EventNotFoundException()

    await this.deleteEventComment.execute({
      commentId: params.commentId,
      userId: user.id,
      eventOwnerId: event.ownerId
    })

    return { success: true }
  }
}
