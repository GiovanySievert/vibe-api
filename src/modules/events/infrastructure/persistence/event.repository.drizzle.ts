import { db } from '@src/infra/database/client'
import { and, eq, ne } from 'drizzle-orm'
import { events, eventParticipants } from '../../application/schemas'
import { EventRepository, CreateEventInput, UpdateEventDetailsInput } from '../../domain/repositories'
import { Event, EventMapper } from '../../domain/mappers'
import { EventParticipantStatus } from '../../domain/types'

export class DrizzleEventRepository implements EventRepository {
  async create(input: CreateEventInput): Promise<Event> {
    const [event] = await db
      .insert(events)
      .values({
        ownerId: input.ownerId,
        name: input.name,
        date: input.date,
        time: input.time,
        description: input.description,
        placeId: input.placeId,
        imageUrl: input.imageUrl
      })
      .returning()

    if (input.participantIds.length > 0) {
      await db.insert(eventParticipants).values(
        input.participantIds.map((userId) => ({
          eventId: event.id,
          userId,
          status: EventParticipantStatus.PENDING
        }))
      )
    }

    return this.findById(event.id) as Promise<Event>
  }

  async listByOwner(ownerId: string): Promise<Event[]> {
    const rows = await db.query.events.findMany({
      where: eq(events.ownerId, ownerId),
      with: {
        place: {
          with: {
            brand: true,
            location: true
          }
        },
        participants: {
          with: { user: true }
        }
      },
      orderBy: (events, { desc }) => [desc(events.createdAt)]
    })

    return rows.map((row) => EventMapper.toEvent(row))
  }

  async listByParticipant(userId: string): Promise<Event[]> {
    const myParticipations = await db.query.eventParticipants.findMany({
      where: and(eq(eventParticipants.userId, userId), ne(eventParticipants.status, EventParticipantStatus.DECLINED)),
      with: {
        event: {
          with: {
            place: {
              with: {
                brand: true,
                location: true
              }
            },
            participants: {
              with: { user: true }
            }
          }
        }
      }
    })

    return myParticipations.map(({ event: row }) => EventMapper.toEvent(row))
  }

  async findById(id: string): Promise<Event | null> {
    const row = await db.query.events.findFirst({
      where: eq(events.id, id),
      with: {
        place: {
          with: {
            brand: true,
            location: true
          }
        },
        participants: {
          with: { user: true }
        }
      }
    })

    if (!row) return null

    return EventMapper.toEvent(row)
  }

  async updateDetails(eventId: string, data: UpdateEventDetailsInput): Promise<Event> {
    await db
      .update(events)
      .set({ description: data.description, placeId: data.placeId, imageUrl: data.imageUrl, updatedAt: new Date() })
      .where(eq(events.id, eventId))

    return this.findById(eventId) as Promise<Event>
  }

  async updateParticipantStatus(eventId: string, userId: string, status: EventParticipantStatus): Promise<void> {
    await db
      .update(eventParticipants)
      .set({ status })
      .where(and(eq(eventParticipants.eventId, eventId), eq(eventParticipants.userId, userId)))
  }

  async delete(eventId: string): Promise<void> {
    await db.delete(events).where(eq(events.id, eventId))
  }
}
