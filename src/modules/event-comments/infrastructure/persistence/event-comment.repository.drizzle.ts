import { and, count, desc, eq, lt } from 'drizzle-orm'

import { db } from '@src/infra/database/client'
import { users } from '@src/modules/auth/application/schemas'

import { eventComments } from '../../application/schemas'
import { EventComment } from '../../domain/mappers'
import { CreateEventCommentInput, EventCommentRepository, ListEventCommentsResult } from '../../domain/repositories'

export class DrizzleEventCommentRepository implements EventCommentRepository {
  async create(input: CreateEventCommentInput): Promise<EventComment> {
    const [comment] = await db
      .insert(eventComments)
      .values({
        eventId: input.eventId,
        userId: input.userId,
        content: input.content
      })
      .returning()

    return this.findById(comment.id) as Promise<EventComment>
  }

  async findById(commentId: string): Promise<EventComment | null> {
    const rows = await db
      .select({
        id: eventComments.id,
        eventId: eventComments.eventId,
        userId: eventComments.userId,
        content: eventComments.content,
        createdAt: eventComments.createdAt,
        username: users.username,
        avatar: users.image
      })
      .from(eventComments)
      .innerJoin(users, eq(eventComments.userId, users.id))
      .where(eq(eventComments.id, commentId))
      .limit(1)

    if (!rows[0]) return null

    return rows[0]
  }

  async delete(commentId: string): Promise<void> {
    await db.delete(eventComments).where(eq(eventComments.id, commentId))
  }

  async listByEvent(eventId: string, page: number, limit: number): Promise<ListEventCommentsResult> {
    const offset = (page - 1) * limit

    const [rows, [{ value: total }]] = await Promise.all([
      db
        .select({
          id: eventComments.id,
          eventId: eventComments.eventId,
          userId: eventComments.userId,
          content: eventComments.content,
          createdAt: eventComments.createdAt,
          username: users.username,
          avatar: users.image
        })
        .from(eventComments)
        .innerJoin(users, eq(eventComments.userId, users.id))
        .where(eq(eventComments.eventId, eventId))
        .orderBy(desc(eventComments.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ value: count() })
        .from(eventComments)
        .where(eq(eventComments.eventId, eventId))
    ])

    return {
      data: rows,
      total: Number(total),
      hasMore: offset + rows.length < Number(total)
    }
  }
}
