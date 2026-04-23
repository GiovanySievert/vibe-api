import {
  EventInvitationAlreadyRespondedException,
  EventNotFoundException,
  EventParticipantNotFoundException
} from '../../../domain/exceptions'
import { EventParticipantStatus } from '../../../domain/types'
import { EventRepository } from '../../../domain/repositories'
import { Event } from '../../../domain/mappers'

interface RespondToEventInvitationInput {
  eventId: string
  userId: string
  status: EventParticipantStatus
}

export class RespondToEventInvitation {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute({ eventId, userId, status }: RespondToEventInvitationInput): Promise<Event> {
    const event = await this.eventRepository.findById(eventId)

    if (!event) {
      throw new EventNotFoundException()
    }

    const participant = event.participants?.find((item) => item.userId === userId)

    if (!participant) {
      throw new EventParticipantNotFoundException()
    }

    if (participant.status === status) {
      throw new EventInvitationAlreadyRespondedException()
    }

    await this.eventRepository.updateParticipantStatus(eventId, userId, status)

    return (await this.eventRepository.findById(eventId)) as Event
  }
}
