import { describe, it, expect, beforeEach } from 'bun:test'
import { GetUserSuggestions } from '../../application/use-cases/get-user-suggestions'
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

describe('GetUserSuggestions', () => {
  let repository: MockPublicUserRepository
  let useCase: GetUserSuggestions

  beforeEach(() => {
    repository = new MockPublicUserRepository()
    useCase = new GetUserSuggestions(repository)
  })

  it('should return empty list when user has no followings', async () => {
    const me = makeUser('me', 'me')
    const other = makeUser('other', 'other')
    repository.seed([me, other])

    const result = await useCase.execute('me')

    expect(result).toEqual([])
  })

  it('should suggest friends of friends', async () => {
    // me → alice → bob
    const me = makeUser('me', 'me')
    const alice = makeUser('alice', 'alice')
    const bob = makeUser('bob', 'bob')
    repository.seed([me, alice, bob])
    repository.addFollow('me', 'alice')
    repository.addFollow('alice', 'bob')

    const result = await useCase.execute('me')

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('bob')
    expect(result[0].mutualCount).toBe(1)
  })

  it('should not suggest users already followed', async () => {
    // me → alice, me → bob, alice → bob
    const me = makeUser('me', 'me')
    const alice = makeUser('alice', 'alice')
    const bob = makeUser('bob', 'bob')
    repository.seed([me, alice, bob])
    repository.addFollow('me', 'alice')
    repository.addFollow('me', 'bob')
    repository.addFollow('alice', 'bob')

    const result = await useCase.execute('me')

    expect(result.find((u) => u.id === 'bob')).toBeUndefined()
  })

  it('should not suggest the user themselves', async () => {
    // alice follows me, me follows alice
    const me = makeUser('me', 'me')
    const alice = makeUser('alice', 'alice')
    repository.seed([me, alice])
    repository.addFollow('me', 'alice')
    repository.addFollow('alice', 'me')

    const result = await useCase.execute('me')

    expect(result.find((u) => u.id === 'me')).toBeUndefined()
  })

  it('should rank suggestions by mutual count descending', async () => {
    // me → alice, me → carol
    // alice → bob, carol → bob (bob has 2 mutual)
    // alice → dave (dave has 1 mutual)
    const me = makeUser('me', 'me')
    const alice = makeUser('alice', 'alice')
    const carol = makeUser('carol', 'carol')
    const bob = makeUser('bob', 'bob')
    const dave = makeUser('dave', 'dave')
    repository.seed([me, alice, carol, bob, dave])
    repository.addFollow('me', 'alice')
    repository.addFollow('me', 'carol')
    repository.addFollow('alice', 'bob')
    repository.addFollow('carol', 'bob')
    repository.addFollow('alice', 'dave')

    const result = await useCase.execute('me')

    expect(result[0].id).toBe('bob')
    expect(result[0].mutualCount).toBe(2)
    expect(result[1].id).toBe('dave')
    expect(result[1].mutualCount).toBe(1)
  })

  it('should not suggest users who blocked the logged user', async () => {
    const me = makeUser('me', 'me')
    const alice = makeUser('alice', 'alice')
    const bob = makeUser('bob', 'bob')
    repository.seed([me, alice, bob])
    repository.addFollow('me', 'alice')
    repository.addFollow('alice', 'bob')
    repository.addBlock('bob', 'me')

    const result = await useCase.execute('me')

    expect(result.find((u) => u.id === 'bob')).toBeUndefined()
  })

  it('should not suggest users blocked by the logged user', async () => {
    const me = makeUser('me', 'me')
    const alice = makeUser('alice', 'alice')
    const bob = makeUser('bob', 'bob')
    repository.seed([me, alice, bob])
    repository.addFollow('me', 'alice')
    repository.addFollow('alice', 'bob')
    repository.addBlock('me', 'bob')

    const result = await useCase.execute('me')

    expect(result.find((u) => u.id === 'bob')).toBeUndefined()
  })

  it('should return correct username and image on suggestions', async () => {
    const me = makeUser('me', 'me')
    const alice: Users = { ...makeUser('alice', 'alice'), image: 'https://example.com/alice.jpg' }
    const bob = makeUser('bob', 'bob')
    repository.seed([me, alice, bob])
    repository.addFollow('me', 'alice')
    repository.addFollow('alice', 'bob')

    const result = await useCase.execute('me')

    expect(result[0].username).toBe('bob')
    expect(result[0].image).toBeNull()
  })
})
