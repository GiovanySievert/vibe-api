import { describe, it, expect, beforeEach } from 'bun:test'
import { GetUserFavoritesPlace } from '../../application/use-cases/get-user-favorites-places'
import { MockUserFavoritesPlacesRepository } from '../mocks/user-favorites-places.repository.mock'
import { UserFavoritesPlaces } from '../../domain/mappers'

describe('GetUserFavoritesPlace', () => {
  let repository: MockUserFavoritesPlacesRepository
  let useCase: GetUserFavoritesPlace

  beforeEach(() => {
    repository = new MockUserFavoritesPlacesRepository()
    useCase = new GetUserFavoritesPlace(repository)
  })

  it('should return empty array when user has no favorites', async () => {
    const result = await useCase.execute('user-123')

    expect(result).toEqual([])
  })

  it('should return all favorites for a user', async () => {
    const userId = 'user-123'
    const favorites: UserFavoritesPlaces[] = [
      { id: crypto.randomUUID(), userId, placeId: 'place-1', createdAt: new Date() },
      { id: crypto.randomUUID(), userId, placeId: 'place-2', createdAt: new Date() },
      { id: crypto.randomUUID(), userId, placeId: 'place-3', createdAt: new Date() }
    ]

    repository.seed(favorites)

    const result = await useCase.execute(userId)

    expect(result).toHaveLength(3)
    expect(result[0].placeId).toBe('place-1')
    expect(result[1].placeId).toBe('place-2')
    expect(result[2].placeId).toBe('place-3')
  })

  it('should only return favorites for the specified user', async () => {
    const favorites: UserFavoritesPlaces[] = [
      { id: crypto.randomUUID(), userId: 'user-1', placeId: 'place-1', createdAt: new Date() },
      { id: crypto.randomUUID(), userId: 'user-2', placeId: 'place-2', createdAt: new Date() },
      { id: crypto.randomUUID(), userId: 'user-1', placeId: 'place-3', createdAt: new Date() }
    ]

    repository.seed(favorites)

    const result = await useCase.execute('user-1')

    expect(result).toHaveLength(2)
    expect(result[0].placeId).toBe('place-1')
    expect(result[1].placeId).toBe('place-3')
  })
})
