import {
  CreateEvent,
  GetEventById,
  ListEventInvitations,
  ListUserEvents,
  RespondToEventInvitation,
  UpdateEventDescription
} from './application/use-cases/events'
import { DrizzleEventRepository } from './infrastructure/persistence/event.repository.drizzle'
import { EventController } from './infrastructure/http/controllers/event.controller'

export class EventsModule {
  public readonly eventController: EventController

  constructor() {
    const eventRepository = new DrizzleEventRepository()

    const createEventService = new CreateEvent(eventRepository)
    const listUserEventsService = new ListUserEvents(eventRepository)
    const listEventInvitationsService = new ListEventInvitations(eventRepository)
    const getEventByIdService = new GetEventById(eventRepository)
    const respondToEventInvitationService = new RespondToEventInvitation(eventRepository)
    const updateEventDescriptionService = new UpdateEventDescription(eventRepository)

    this.eventController = new EventController(
      createEventService,
      listUserEventsService,
      listEventInvitationsService,
      getEventByIdService,
      respondToEventInvitationService,
      updateEventDescriptionService
    )
  }
}
