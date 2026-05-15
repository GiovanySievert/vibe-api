import { describe, it, expect } from 'bun:test'
import { ListEventComments } from '../../application/use-cases/list-event-comments'
import { EventComment } from '../../domain/mappers'
import { CreateEventCommentInput, EventCommentRepository, ListEventCommentsResult } from '../../domain/repositories'

function buildComment(overrides: Partial<EventComment> = {}): EventComment {
  return {
    id: crypto.randomUUID(),
    eventId: 'event-1',
    userId: 'user-1',
    username: 'user',
    avatar: null,
    content: 'content',
    createdAt: new Date(),
    ...overrides
  }
}

function buildRepository(seed: EventComment[] = [], overrides: Partial<EventCommentRepository> = {}): EventCommentRepository {
  const store: EventComment[] = [...seed]
  return {
    async create(input: CreateEventCommentInput): Promise<EventComment> {
      const comment = buildComment({ eventId: input.eventId, userId: input.userId, content: input.content })
      store.push(comment)
      return comment
    },
    async findById(commentId: string): Promise<EventComment | null> {
      return store.find((c) => c.id === commentId) ?? null
    },
    async delete(commentId: string): Promise<void> {
      const idx = store.findIndex((c) => c.id === commentId)
      if (idx >= 0) store.splice(idx, 1)
    },
    async listByEvent(eventId: string, page: number, limit: number): Promise<ListEventCommentsResult> {
      const filtered = store.filter((c) => c.eventId === eventId)
      const offset = (page - 1) * limit
      const data = filtered.slice(offset, offset + limit)
      return {
        data,
        total: filtered.length,
        hasMore: offset + data.length < filtered.length
      }
    },
    ...overrides
  }
}

describe('ListEventComments', () => {
  it('returns the comments for the given event with pagination metadata', async () => {
    const repo = buildRepository([
      buildComment({ id: 'c1', eventId: 'event-1' }),
      buildComment({ id: 'c2', eventId: 'event-1' }),
      buildComment({ id: 'c3', eventId: 'event-1' })
    ])
    const useCase = new ListEventComments(repo)

    const result = await useCase.execute({ eventId: 'event-1', page: 1, limit: 10 })

    expect(result.data).toHaveLength(3)
    expect(result.total).toBe(3)
    expect(result.hasMore).toBe(false)
  })

  it('returns hasMore=true and respects limit on the first page', async () => {
    const seed: EventComment[] = []
    for (let i = 0; i < 5; i++) {
      seed.push(buildComment({ id: `c${i}`, eventId: 'event-1' }))
    }
    const repo = buildRepository(seed)
    const useCase = new ListEventComments(repo)

    const result = await useCase.execute({ eventId: 'event-1', page: 1, limit: 2 })

    expect(result.data).toHaveLength(2)
    expect(result.data[0].id).toBe('c0')
    expect(result.data[1].id).toBe('c1')
    expect(result.total).toBe(5)
    expect(result.hasMore).toBe(true)
  })

  it('returns an empty page when page index is beyond the last page', async () => {
    const repo = buildRepository([
      buildComment({ id: 'c1', eventId: 'event-1' }),
      buildComment({ id: 'c2', eventId: 'event-1' })
    ])
    const useCase = new ListEventComments(repo)

    const result = await useCase.execute({ eventId: 'event-1', page: 5, limit: 10 })

    expect(result.data).toHaveLength(0)
    expect(result.total).toBe(2)
    expect(result.hasMore).toBe(false)
  })

  it('returns an empty result when the event has no comments', async () => {
    const repo = buildRepository([buildComment({ eventId: 'other-event' })])
    const useCase = new ListEventComments(repo)

    const result = await useCase.execute({ eventId: 'event-1', page: 1, limit: 10 })

    expect(result.data).toEqual([])
    expect(result.total).toBe(0)
    expect(result.hasMore).toBe(false)
  })

  it('propagates repository errors', async () => {
    const repo = buildRepository([], {
      async listByEvent(): Promise<ListEventCommentsResult> {
        throw new Error('elastic timeout')
      }
    })
    const useCase = new ListEventComments(repo)

    await expect(useCase.execute({ eventId: 'event-1', page: 1, limit: 10 })).rejects.toThrow('elastic timeout')
  })
})
