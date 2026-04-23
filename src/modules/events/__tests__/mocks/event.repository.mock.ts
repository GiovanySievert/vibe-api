import { Event } from '../../domain/mappers'
import { EventRepository, CreateEventInput } from '../../domain/repositories'
import { EventParticipantStatus } from '../../domain/types'

export class MockEventRepository implements EventRepository {
  private events: Event[] = []

  async create(input: CreateEventInput): Promise<Event> {
    const event: Event = {
      id: crypto.randomUUID(),
      ownerId: input.ownerId,
      name: input.name,
      date: input.date,
      time: input.time,
      description: input.description ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      participants: input.participantIds.map((userId) => ({
        id: crypto.randomUUID(),
        userId,
        username: `user-${userId}`,
        avatar: null,
        status: EventParticipantStatus.PENDING
      }))
    }
    this.events.push(event)
    return event
  }

  async listByOwner(ownerId: string): Promise<Event[]> {
    return this.events.filter((e) => e.ownerId === ownerId)
  }

  async listByParticipant(userId: string): Promise<Event[]> {
    return this.events.filter((e) => e.participants?.some((p) => p.userId === userId))
  }

  async findById(id: string): Promise<Event | null> {
    return this.events.find((e) => e.id === id) ?? null
  }

  async updateDescription(eventId: string, description: string): Promise<Event> {
    this.events = this.events.map((e) => (e.id === eventId ? { ...e, description } : e))
    return this.events.find((e) => e.id === eventId) as Event
  }

  async updateParticipantStatus(eventId: string, userId: string, status: EventParticipantStatus): Promise<void> {
    this.events = this.events.map((event) => {
      if (event.id !== eventId) return event
      return {
        ...event,
        participants: event.participants?.map((participant) =>
          participant.userId === userId ? { ...participant, status } : participant
        )
      }
    })
  }

  async delete(eventId: string): Promise<void> {
    this.events = this.events.filter((e) => e.id !== eventId)
  }

  reset() {
    this.events = []
  }

  seed(data: Event[]) {
    this.events = [...data]
  }

  getAll() {
    return [...this.events]
  }
}
