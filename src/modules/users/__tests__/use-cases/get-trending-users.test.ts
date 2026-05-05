import { describe, it, expect, beforeEach } from 'bun:test'
import { GetTrendingUsers } from '../../application/use-cases/get-trending-users'
import { MockPublicUserRepository } from '../mocks/public-user.repository.mock'
import { Users } from '@src/modules/auth/domain/mappers/user.mapper'

const makeUser = (id: string, username: string): Users => ({
  id,
  name: username,
  username,
  email: `${username}@example.com`,
  emailVerified: true,
  image: null,
  bio: null,
  createdAt: new Date(),
  updatedAt: new Date()
})

// semana ISO atual (mock usa todas as atividades sem filtro de janela)
const THIS_YEAR = 2026
const THIS_WEEK = 19

describe('GetTrendingUsers', () => {
  let repository: MockPublicUserRepository
  let useCase: GetTrendingUsers

  beforeEach(() => {
    repository = new MockPublicUserRepository()
    useCase = new GetTrendingUsers(repository)
  })

  it('should return empty list when no user has weekly activity', async () => {
    const me = makeUser('me', 'me')
    const alice = makeUser('alice', 'alice')
    repository.seed([me, alice])

    const result = await useCase.execute('me')

    expect(result).toEqual([])
  })

  it('should return users ordered by reviewsCount DESC', async () => {
    const me = makeUser('me', 'me')
    const alice = makeUser('alice', 'alice')
    const bob = makeUser('bob', 'bob')
    repository.seed([me, alice, bob])
    repository.addWeeklyActivity('alice', THIS_YEAR, THIS_WEEK, 3)
    repository.addWeeklyActivity('bob', THIS_YEAR, THIS_WEEK, 7)

    const result = await useCase.execute('me')

    expect(result[0].id).toBe('bob')
    expect(result[0].reviewsCount).toBe(7)
    expect(result[1].id).toBe('alice')
    expect(result[1].reviewsCount).toBe(3)
  })

  it('should sum reviewCount across multiple weeks for the same user', async () => {
    const me = makeUser('me', 'me')
    const alice = makeUser('alice', 'alice')
    repository.seed([me, alice])
    repository.addWeeklyActivity('alice', THIS_YEAR, THIS_WEEK, 4)
    repository.addWeeklyActivity('alice', THIS_YEAR, THIS_WEEK - 1, 2)
    repository.addWeeklyActivity('alice', THIS_YEAR, THIS_WEEK - 2, 1)

    const result = await useCase.execute('me')

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('alice')
    expect(result[0].reviewsCount).toBe(7)
  })

  it('should not include the logged user themselves', async () => {
    const me = makeUser('me', 'me')
    repository.seed([me])
    repository.addWeeklyActivity('me', THIS_YEAR, THIS_WEEK, 10)

    const result = await useCase.execute('me')

    expect(result.find((u) => u.id === 'me')).toBeUndefined()
  })

  it('should not include users already followed', async () => {
    const me = makeUser('me', 'me')
    const alice = makeUser('alice', 'alice')
    repository.seed([me, alice])
    repository.addFollow('me', 'alice')
    repository.addWeeklyActivity('alice', THIS_YEAR, THIS_WEEK, 5)

    const result = await useCase.execute('me')

    expect(result.find((u) => u.id === 'alice')).toBeUndefined()
  })

  it('should not include users who blocked the logged user', async () => {
    const me = makeUser('me', 'me')
    const alice = makeUser('alice', 'alice')
    repository.seed([me, alice])
    repository.addBlock('alice', 'me')
    repository.addWeeklyActivity('alice', THIS_YEAR, THIS_WEEK, 5)

    const result = await useCase.execute('me')

    expect(result.find((u) => u.id === 'alice')).toBeUndefined()
  })

  it('should not include users blocked by the logged user', async () => {
    const me = makeUser('me', 'me')
    const alice = makeUser('alice', 'alice')
    repository.seed([me, alice])
    repository.addBlock('me', 'alice')
    repository.addWeeklyActivity('alice', THIS_YEAR, THIS_WEEK, 5)

    const result = await useCase.execute('me')

    expect(result.find((u) => u.id === 'alice')).toBeUndefined()
  })

  it('should return correct username and image', async () => {
    const me = makeUser('me', 'me')
    const alice: Users = { ...makeUser('alice', 'alice'), image: 'https://example.com/alice.jpg' }
    repository.seed([me, alice])
    repository.addWeeklyActivity('alice', THIS_YEAR, THIS_WEEK, 3)

    const result = await useCase.execute('me')

    expect(result[0].username).toBe('alice')
    expect(result[0].image).toBe('https://example.com/alice.jpg')
  })

  it('should respect the limit parameter', async () => {
    const me = makeUser('me', 'me')
    const users = Array.from({ length: 5 }, (_, i) => makeUser(`user${i}`, `user${i}`))
    repository.seed([me, ...users])
    for (const u of users) {
      repository.addWeeklyActivity(u.id, THIS_YEAR, THIS_WEEK, 1)
    }

    const result = await useCase.execute('me', 3)

    expect(result).toHaveLength(3)
  })
})
