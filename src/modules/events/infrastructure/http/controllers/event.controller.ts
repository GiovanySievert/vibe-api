import { User } from 'better-auth/types'
import {
  CreateEvent,
  DeleteEvent,
  GetEventById,
  ListEventInvitations,
  ListUserEvents,
  RespondToEventInvitation,
  UpdateEventDescription
} from '../../../application/use-cases/events'
import { GetEventDtoMapper } from '../dtos'
import { EventParticipantStatus } from '../../../domain/types'

export class EventController {
  constructor(
    private readonly createEvent: CreateEvent,
    private readonly listUserEvents: ListUserEvents,
    private readonly listEventInvitations: ListEventInvitations,
    private readonly getEventById: GetEventById,
    private readonly respondToEventInvitation: RespondToEventInvitation,
    private readonly updateEventDescription: UpdateEventDescription,
    private readonly deleteEventUseCase: DeleteEvent
  ) {}

  async create({
    body,
    user
  }: {
    body: { name: string; date: string; time: string; description?: string; participantIds: string[] }
    user: User
  }) {
    const event = await this.createEvent.execute({
      ownerId: user.id,
      ownerName: user.name,
      name: body.name,
      date: body.date,
      time: body.time,
      description: body.description,
      participantIds: body.participantIds
    })

    return GetEventDtoMapper.from(event)
  }

  async list({ user }: { user: User }) {
    const events = await this.listUserEvents.execute(user.id)
    return GetEventDtoMapper.fromArray(events)
  }

  async listInvitations({ user }: { user: User }) {
    const events = await this.listEventInvitations.execute(user.id)
    return GetEventDtoMapper.fromArray(events)
  }

  async getById({ params }: { params: { id: string } }) {
    const event = await this.getEventById.execute(params.id)
    return GetEventDtoMapper.from(event)
  }

  async updateDescription({
    params,
    body,
    user
  }: {
    params: { id: string }
    body: { description: string }
    user: User
  }) {
    const event = await this.updateEventDescription.execute({
      eventId: params.id,
      userId: user.id,
      description: body.description
    })

    return GetEventDtoMapper.from(event)
  }

  async respondToInvitation({
    params,
    body,
    user
  }: {
    params: { id: string }
    body: { status: 'accepted' | 'declined' }
    user: User
  }) {
    const event = await this.respondToEventInvitation.execute({
      eventId: params.id,
      userId: user.id,
      status: body.status
    })

    return GetEventDtoMapper.from(event)
  }

  async delete({ params, user }: { params: { id: string }; user: User }) {
    await this.deleteEventUseCase.execute({ eventId: params.id, userId: user.id })
  }
}
