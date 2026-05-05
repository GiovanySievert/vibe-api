import { DrizzleEventRepository } from '@src/modules/events/infrastructure/persistence/event.repository.drizzle'
import { applicationEventBus } from '@src/shared/application/events'

import { CreateEventComment, DeleteEventComment, ListEventComments } from './application/use-cases'
import { EventCommentController } from './infrastructure/http/controllers/event-comment.controller'
import { DrizzleEventCommentRepository } from './infrastructure/persistence/event-comment.repository.drizzle'

export class EventCommentsModule {
  public readonly eventCommentController: EventCommentController

  constructor() {
    const eventRepository = new DrizzleEventRepository()
    const eventCommentRepository = new DrizzleEventCommentRepository()

    const createEventCommentService = new CreateEventComment(eventCommentRepository)
    const deleteEventCommentService = new DeleteEventComment(eventCommentRepository)
    const listEventCommentsService = new ListEventComments(eventCommentRepository)

    this.eventCommentController = new EventCommentController(
      eventRepository,
      createEventCommentService,
      deleteEventCommentService,
      listEventCommentsService,
      applicationEventBus
    )
  }
}
