import { beforeEach, describe, expect, it } from 'bun:test'
import { BanAdminUser } from '../../application/use-cases'
import { makeAdminUser, MockAdminUsersRepository } from '../mocks/admin-users.repository.mock'

describe('BanAdminUser', () => {
  let repository: MockAdminUsersRepository
  let useCase: BanAdminUser

  beforeEach(() => {
    repository = new MockAdminUsersRepository()
    useCase = new BanAdminUser(repository)
  })

  it('bans a regular user and deletes sessions', async () => {
    repository.seed([makeAdminUser({ id: 'user-1', role: 'user' })])

    const result = await useCase.execute('user-1', 'abuse')

    expect(result && result !== 'admin-user' ? result.banned : null).toBe(true)
    expect(result && result !== 'admin-user' ? result.banReason : null).toBe('abuse')
    expect(repository.bannedUserIds).toEqual(['user-1'])
    expect(repository.deletedSessionUserIds).toEqual(['user-1'])
  })

  it('returns null when user does not exist', async () => {
    const result = await useCase.execute('missing-user', 'abuse')

    expect(result).toBeNull()
    expect(repository.bannedUserIds).toEqual([])
    expect(repository.deletedSessionUserIds).toEqual([])
  })

  it('refuses users whose comma-split role contains admin', async () => {
    repository.seed([makeAdminUser({ id: 'admin-1', role: 'user, admin' })])

    const result = await useCase.execute('admin-1', 'abuse')

    expect(result).toBe('admin-user')
    expect(repository.bannedUserIds).toEqual([])
    expect(repository.deletedSessionUserIds).toEqual([])
  })
})
