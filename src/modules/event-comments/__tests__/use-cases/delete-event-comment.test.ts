import { describe, it, expect, beforeEach } from 'bun:test'
import { DeleteEventComment } from '../../application/use-cases/delete-event-comment'
import { CommentNotAuthorizedException, CommentNotFoundException } from '../../domain/exceptions'
import { EventComment } from '../../domain/mappers'
import { CreateEventCommentInput, EventCommentRepository, ListEventCommentsResult } from '../../domain/repositories'

function buildRepository(seed: EventComment[] = []): {
  repo: EventCommentRepository
  store: EventComment[]
} {
  const store: EventComment[] = [...seed]
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
    }
  }
  return { repo, store }
}

function buildComment(overrides: Partial<EventComment> = {}): EventComment {
  return {
    id: 'comment-1',
    eventId: 'event-1',
    userId: 'author-1',
    username: 'author',
    avatar: null,
    content: 'hello',
    createdAt: new Date(),
    ...overrides
  }
}

describe('DeleteEventComment', () => {
  let store: EventComment[]
  let repo: EventCommentRepository
  let useCase: DeleteEventComment

  beforeEach(() => {
    const built = buildRepository([buildComment()])
    store = built.store
    repo = built.repo
    useCase = new DeleteEventComment(repo)
  })

  it('allows the comment author to delete their own comment', async () => {
    await useCase.execute({
      commentId: 'comment-1',
      userId: 'author-1',
      eventOwnerId: 'event-owner'
    })

    expect(store).toHaveLength(0)
  })

  it('allows the event owner to delete a comment they did not author', async () => {
    await useCase.execute({
      commentId: 'comment-1',
      userId: 'event-owner',
      eventOwnerId: 'event-owner'
    })

    expect(store).toHaveLength(0)
  })

  it('throws CommentNotFoundException when the comment does not exist', async () => {
    await expect(
      useCase.execute({
        commentId: 'missing-comment',
        userId: 'author-1',
        eventOwnerId: 'event-owner'
      })
    ).rejects.toBeInstanceOf(CommentNotFoundException)
    expect(store).toHaveLength(1)
  })

  it('throws CommentNotAuthorizedException when the caller is neither author nor event owner', async () => {
    await expect(
      useCase.execute({
        commentId: 'comment-1',
        userId: 'random-user',
        eventOwnerId: 'event-owner'
      })
    ).rejects.toBeInstanceOf(CommentNotAuthorizedException)
    expect(store).toHaveLength(1)
  })

  it('does not delete unrelated comments when authorized deletion runs', async () => {
    const built = buildRepository([
      buildComment({ id: 'comment-a', userId: 'author-1' }),
      buildComment({ id: 'comment-b', userId: 'author-2' }),
      buildComment({ id: 'comment-c', userId: 'author-1' })
    ])
    const localUseCase = new DeleteEventComment(built.repo)

    await localUseCase.execute({
      commentId: 'comment-b',
      userId: 'author-2',
      eventOwnerId: 'event-owner'
    })

    expect(built.store).toHaveLength(2)
    expect(built.store.find((c) => c.id === 'comment-b')).toBeUndefined()
    expect(built.store.find((c) => c.id === 'comment-a')).toBeDefined()
    expect(built.store.find((c) => c.id === 'comment-c')).toBeDefined()
  })
})
