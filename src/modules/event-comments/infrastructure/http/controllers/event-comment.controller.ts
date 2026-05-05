import { User } from 'better-auth/types'

import { EventNotFoundException } from '@src/modules/events/domain/exceptions'
import { EventRepository } from '@src/modules/events/domain/repositories'
import { ApplicationEventBus } from '@src/shared/application/events'
import { createEventCommentCreatedEvent } from '../../../application/events/event-comment-created.event'

import { CreateEventComment, DeleteEventComment, ListEventComments } from '../../../application/use-cases'
import { EventCommentDtoMapper } from '../dtos'

export class EventCommentController {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly createEventComment: CreateEventComment,
    private readonly deleteEventComment: DeleteEventComment,
    private readonly listEventComments: ListEventComments,
    private readonly applicationEventBus: ApplicationEventBus
  ) {}

  async list({ params, query }: { params: { id: string }; query: { page?: string } }) {
    const page = Math.max(1, Number(query.page) || 1)
    const result = await this.listEventComments.execute({ eventId: params.id, page, limit: 20 })
    return EventCommentDtoMapper.fromList(result)
  }

  async create({ params, body, user }: { params: { id: string }; body: { content: string }; user: User }) {
    const event = await this.eventRepository.findById(params.id)
    if (!event) throw new EventNotFoundException()

    const comment = await this.createEventComment.execute({
      eventId: params.id,
      userId: user.id,
      content: body.content
    })

    if (event.ownerId !== user.id) {
      await this.applicationEventBus.publish(
        createEventCommentCreatedEvent({
          commentId: comment.id,
          eventId: event.id,
          eventName: event.name,
          eventOwnerId: event.ownerId,
          commenterId: user.id,
          commenterName: user.name
        })
      )
    }

    return EventCommentDtoMapper.from(comment)
  }

  async delete({
    params,
    user
  }: {
    params: { id: string; commentId: string }
    user: User
  }) {
    const event = await this.eventRepository.findById(params.id)
    if (!event) throw new EventNotFoundException()

    await this.deleteEventComment.execute({
      commentId: params.commentId,
      userId: user.id,
      eventOwnerId: event.ownerId
    })

    return { success: true }
  }
}
