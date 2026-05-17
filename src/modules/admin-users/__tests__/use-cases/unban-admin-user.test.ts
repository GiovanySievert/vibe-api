import { beforeEach, describe, expect, it } from 'bun:test'
import { UnbanAdminUser } from '../../application/use-cases'
import { makeAdminUser, MockAdminUsersRepository } from '../mocks/admin-users.repository.mock'

describe('UnbanAdminUser', () => {
  let repository: MockAdminUsersRepository
  let useCase: UnbanAdminUser

  beforeEach(() => {
    repository = new MockAdminUsersRepository()
    useCase = new UnbanAdminUser(repository)
  })

  it('returns unbanned user', async () => {
    repository.seed([makeAdminUser({ id: 'user-1', banned: true, banReason: 'abuse' })])

    const result = await useCase.execute('user-1')

    expect(result?.banned).toBe(false)
    expect(result?.banReason).toBeNull()
    expect(repository.unbannedUserIds).toEqual(['user-1'])
  })

  it('returns null when user does not exist', async () => {
    const result = await useCase.execute('missing-user')

    expect(result).toBeNull()
    expect(repository.unbannedUserIds).toEqual(['missing-user'])
  })
})
