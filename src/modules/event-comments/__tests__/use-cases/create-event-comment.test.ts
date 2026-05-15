import { describe, it, expect, beforeEach } from 'bun:test'
import { CreateEventComment } from '../../application/use-cases/create-event-comment'
import { EventComment } from '../../domain/mappers'
import { CreateEventCommentInput, EventCommentRepository, ListEventCommentsResult } from '../../domain/repositories'

function buildRepository(overrides: Partial<EventCommentRepository> = {}): {
  repo: EventCommentRepository
  store: EventComment[]
} {
  const store: EventComment[] = []
  const repo: EventCommentRepository = {
    async create(input: CreateEventCommentInput): Promise<EventComment> {
      const comment: EventComment = {
        id: crypto.randomUUID(),
        eventId: input.eventId,
        userId: input.userId,
        username: `user-${input.userId}`,
        avatar: null,
        content: input.content,
        createdAt: new Date()
      }
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
    async listByEvent(eventId: string): Promise<ListEventCommentsResult> {
      const data = store.filter((c) => c.eventId === eventId)
      return { data, total: data.length, hasMore: false }
    },
    ...overrides
  }
  return { repo, store }
}

describe('CreateEventComment', () => {
  let store: EventComment[]
  let repo: EventCommentRepository
  let useCase: CreateEventComment

  beforeEach(() => {
    const built = buildRepository()
    store = built.store
    repo = built.repo
    useCase = new CreateEventComment(repo)
  })

  it('creates a new event comment with the given input', async () => {
    const input = {
      eventId: 'event-1',
      userId: 'user-1',
      content: 'Looks great!'
    }

    const result = await useCase.execute(input)

    expect(result.id).toBeDefined()
    expect(result.eventId).toBe('event-1')
    expect(result.userId).toBe('user-1')
    expect(result.content).toBe('Looks great!')
    expect(result.createdAt).toBeInstanceOf(Date)
    expect(store).toHaveLength(1)
    expect(store[0].id).toBe(result.id)
  })

  it('persists empty content when repository accepts it', async () => {
    const result = await useCase.execute({
      eventId: 'event-1',
      userId: 'user-1',
      content: ''
    })

    expect(result.content).toBe('')
    expect(store).toHaveLength(1)
  })

  it('propagates repository errors', async () => {
    const failing = buildRepository({
      async create(): Promise<EventComment> {
        throw new Error('db down')
      }
    }).repo
    const failingUseCase = new CreateEventComment(failing)

    await expect(
      failingUseCase.execute({ eventId: 'event-1', userId: 'user-1', content: 'hi' })
    ).rejects.toThrow('db down')
  })
})
