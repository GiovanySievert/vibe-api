import { describe, it, expect, beforeEach } from 'bun:test'
import { CreateUserFavoritesPlaces } from '../../application/queries/create-user-favorites-places'
import { MockUserFavoritesPlacesRepository } from '../mocks/user-favorites-places.repository.mock'

describe('CreateUserFavoritesPlaces', () => {
  let repository: MockUserFavoritesPlacesRepository
  let useCase: CreateUserFavoritesPlaces

  beforeEach(() => {
    repository = new MockUserFavoritesPlacesRepository()
    useCase = new CreateUserFavoritesPlaces(repository)
  })

  it('should create a new favorite place', async () => {
    const data = {
      userId: 'user-123',
      placeId: 'place-456'
    }

    const result = await useCase.execute(data)

    expect(result).toBeDefined()
    expect(result.userId).toBe(data.userId)
    expect(result.placeId).toBe(data.placeId)
    expect(result.createdAt).toBeInstanceOf(Date)
  })

  it('should add favorite to repository', async () => {
    const data = {
      userId: 'user-123',
      placeId: 'place-456'
    }

    await useCase.execute(data)

    const favorites = repository.getAll()
    expect(favorites).toHaveLength(1)
    expect(favorites[0].userId).toBe(data.userId)
    expect(favorites[0].placeId).toBe(data.placeId)
  })

  it('should allow multiple favorites for same user', async () => {
    const user = 'user-123'

    await useCase.execute({ userId: user, placeId: 'place-1' })
    await useCase.execute({ userId: user, placeId: 'place-2' })
    await useCase.execute({ userId: user, placeId: 'place-3' })

    const favorites = await repository.list(user)
    expect(favorites).toHaveLength(3)
  })
})
