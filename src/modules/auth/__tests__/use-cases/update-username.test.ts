import { describe, it, expect, beforeEach } from 'bun:test'
import { UpdateUsername } from '../../application/use-cases/update-username'
import { UsernameAlreadyTakenException } from '../../domain/exceptions'
import { MockUserRepository } from '../mocks/user.repository.mock'

describe('UpdateUsername', () => {
  let repository: MockUserRepository
  let useCase: UpdateUsername

  beforeEach(() => {
    repository = new MockUserRepository()
    useCase = new UpdateUsername(repository)
  })

  it('should update username when target is free', async () => {
    const userId = crypto.randomUUID()
    repository.seed([{ id: userId, username: 'oldname' }])

    const result = await useCase.execute(userId, 'newname')

    expect(result.username).toBe('newname')
    const stored = repository.getAll().find((record) => record.id === userId)
    expect(stored?.username).toBe('newname')
  })

  it('should be idempotent when new username equals current username', async () => {
    const userId = crypto.randomUUID()
    repository.seed([{ id: userId, username: 'same' }])

    const result = await useCase.execute(userId, 'same')

    expect(result.username).toBe('same')
    expect(repository.getAll()).toHaveLength(1)
  })

  it('should throw UsernameAlreadyTakenException when username belongs to another user', async () => {
    const userId = crypto.randomUUID()
    const otherUserId = crypto.randomUUID()
    repository.seed([
      { id: userId, username: 'me' },
      { id: otherUserId, username: 'taken' }
    ])

    await expect(useCase.execute(userId, 'taken')).rejects.toThrow(UsernameAlreadyTakenException)

    const target = repository.getAll().find((record) => record.id === userId)
    expect(target?.username).toBe('me')
  })

  it('should persist update when user has no previous record yet', async () => {
    const userId = crypto.randomUUID()

    const result = await useCase.execute(userId, 'firsttime')

    expect(result.username).toBe('firsttime')
    expect(repository.getAll()).toHaveLength(1)
  })
})
