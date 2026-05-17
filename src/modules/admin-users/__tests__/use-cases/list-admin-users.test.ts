import { beforeEach, describe, expect, it } from 'bun:test'
import { ListAdminUsers } from '../../application/use-cases'
import { makeAdminUser, MockAdminUsersRepository } from '../mocks/admin-users.repository.mock'

describe('ListAdminUsers', () => {
  let repository: MockAdminUsersRepository
  let useCase: ListAdminUsers

  beforeEach(() => {
    repository = new MockAdminUsersRepository()
    useCase = new ListAdminUsers(repository)
  })

  it('returns repository result with search and pagination input', async () => {
    repository.seed([
      makeAdminUser({ id: 'user-1', email: 'one@example.com' }),
      makeAdminUser({ id: 'user-2', email: 'two@example.com' })
    ])

    const result = await useCase.execute({
      searchValue: 'example',
      limit: 1,
      offset: 1
    })

    expect(repository.lastListInput).toEqual({
      searchValue: 'example',
      limit: 1,
      offset: 1
    })
    expect(result.users).toHaveLength(1)
    expect(result.users[0].id).toBe('user-2')
    expect(result.total).toBe(2)
    expect(result.limit).toBe(1)
    expect(result.offset).toBe(1)
  })
})
