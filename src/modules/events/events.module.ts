import {
  CreateEvent,
  DeleteEvent,
  GetEventById,
  ListEventInvitations,
  ListUserEvents,
  RespondToEventInvitation,
  UpdateEventDetails
} from './application/use-cases/events'
import { applicationEventBus } from '@src/shared/application/events'
import { DrizzleEventRepository } from './infrastructure/persistence/event.repository.drizzle'
import { EventController } from './infrastructure/http/controllers/event.controller'
import { DrizzlePlacesRepository } from '@src/modules/brands/infrastructure/persistence'

export class EventsModule {
  public readonly eventController: EventController

  constructor() {
    const eventRepository = new DrizzleEventRepository()
    const placesRepository = new DrizzlePlacesRepository()

    const createEventService = new CreateEvent(eventRepository, placesRepository, applicationEventBus)
    const listUserEventsService = new ListUserEvents(eventRepository)
    const listEventInvitationsService = new ListEventInvitations(eventRepository)
    const getEventByIdService = new GetEventById(eventRepository)
    const respondToEventInvitationService = new RespondToEventInvitation(eventRepository)
    const updateEventDetailsService = new UpdateEventDetails(eventRepository, placesRepository)
    const deleteEventService = new DeleteEvent(eventRepository)

    this.eventController = new EventController(
      createEventService,
      listUserEventsService,
      listEventInvitationsService,
      getEventByIdService,
      respondToEventInvitationService,
      updateEventDetailsService,
      deleteEventService
    )
  }
}
