import { EventParticipantStatus } from '../types'
import { Event } from '../mappers'

export interface CreateEventInput {
  ownerId: string
  name: string
  date: string
  time: string
  description?: string
  placeId?: string
  imageUrl?: string
  participantIds: string[]
}

export interface UpdateEventDetailsInput {
  description: string
  placeId: string | null
  imageUrl: string | null
}

export interface EventRepository {
  create(input: CreateEventInput): Promise<Event>
  listByOwner(ownerId: string): Promise<Event[]>
  listByParticipant(userId: string): Promise<Event[]>
  findById(id: string): Promise<Event | null>
  updateDetails(eventId: string, data: UpdateEventDetailsInput): Promise<Event>
  updateParticipantStatus(eventId: string, userId: string, status: EventParticipantStatus): Promise<void>
  delete(eventId: string): Promise<void>
}
