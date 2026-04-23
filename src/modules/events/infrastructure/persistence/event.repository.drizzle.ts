import { db } from '@src/infra/database/client'
import { and, eq, ne } from 'drizzle-orm'
import { users } from '@src/modules/auth/application/schemas'
import { events, eventParticipants } from '../../application/schemas'
import { EventRepository, CreateEventInput } from '../../domain/repositories'
import { Event } from '../../domain/mappers'
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
        description: input.description
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
        participants: {
          with: { user: true }
        }
      },
      orderBy: (events, { desc }) => [desc(events.createdAt)]
    })

    return rows.map((row) => ({
      ...row,
      participants: row.participants.map((p) => ({
        id: p.id,
        userId: p.userId,
        username: (p.user as typeof users.$inferSelect).username,
        avatar: (p.user as typeof users.$inferSelect).image,
        status: p.status
      }))
    }))
  }

  async listByParticipant(userId: string): Promise<Event[]> {
    const myParticipations = await db.query.eventParticipants.findMany({
      where: and(eq(eventParticipants.userId, userId), ne(eventParticipants.status, EventParticipantStatus.DECLINED)),
      with: {
        event: {
          with: {
            participants: {
              with: { user: true }
            }
          }
        }
      }
    })

    return myParticipations.map(({ event: row }) => ({
      ...row,
      participants: row.participants.map((p) => ({
        id: p.id,
        userId: p.userId,
        username: (p.user as typeof users.$inferSelect).username,
        avatar: (p.user as typeof users.$inferSelect).image,
        status: p.status
      }))
    }))
  }

  async findById(id: string): Promise<Event | null> {
    const row = await db.query.events.findFirst({
      where: eq(events.id, id),
      with: {
        participants: {
          with: { user: true }
        }
      }
    })

    if (!row) return null

    return {
      ...row,
      participants: row.participants.map((p) => ({
        id: p.id,
        userId: p.userId,
        username: (p.user as typeof users.$inferSelect).username,
        avatar: (p.user as typeof users.$inferSelect).image,
        status: p.status
      }))
    }
  }

  async updateDescription(eventId: string, description: string): Promise<Event> {
    await db
      .update(events)
      .set({ description, updatedAt: new Date() })
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
