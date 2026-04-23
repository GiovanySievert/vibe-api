import { EventParticipantStatus } from '../types'
import { Event } from '../mappers'

export interface CreateEventInput {
  ownerId: string
  name: string
  date: string
  time: string
  description?: string
  participantIds: string[]
}

export interface EventRepository {
  create(input: CreateEventInput): Promise<Event>
  listByOwner(ownerId: string): Promise<Event[]>
  listByParticipant(userId: string): Promise<Event[]>
  findById(id: string): Promise<Event | null>
  updateDescription(eventId: string, description: string): Promise<Event>
  updateParticipantStatus(eventId: string, userId: string, status: EventParticipantStatus): Promise<void>
  delete(eventId: string): Promise<void>
}
