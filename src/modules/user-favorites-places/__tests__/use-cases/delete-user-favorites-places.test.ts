import { describe, it, expect, beforeEach } from 'bun:test'
import { DeleteUserFavoritesPlaces } from '../../application/queries/delete-user-favorites-places'
import { MockUserFavoritesPlacesRepository } from '../mocks/user-favorites-places.repository.mock'
import { UserFavoritesPlaces } from '../../domain/mappers'

describe('DeleteUserFavoritesPlaces', () => {
  let repository: MockUserFavoritesPlacesRepository
  let useCase: DeleteUserFavoritesPlaces

  beforeEach(() => {
    repository = new MockUserFavoritesPlacesRepository()
    useCase = new DeleteUserFavoritesPlaces(repository)
  })

  it('should delete a favorite place', async () => {
    const favorite: UserFavoritesPlaces = {
      id: crypto.randomUUID(),
      userId: 'user-123',
      placeId: 'place-456',
      createdAt: new Date()
    }

    repository.seed([favorite])

    await useCase.execute({ userId: favorite.userId, placeId: favorite.placeId })

    const favorites = repository.getAll()
    expect(favorites).toHaveLength(0)
  })

  it('should only delete the specific favorite', async () => {
    const favorites: UserFavoritesPlaces[] = [
      { id: crypto.randomUUID(), userId: 'user-123', placeId: 'place-1', createdAt: new Date() },
      { id: crypto.randomUUID(), userId: 'user-123', placeId: 'place-2', createdAt: new Date() },
      { id: crypto.randomUUID(), userId: 'user-123', placeId: 'place-3', createdAt: new Date() }
    ]

    repository.seed(favorites)

    await useCase.execute({ userId: 'user-123', placeId: 'place-2' })

    const remaining = repository.getAll()
    expect(remaining).toHaveLength(2)
    expect(remaining.find((fav) => fav.placeId === 'place-2')).toBeUndefined()
    expect(remaining.find((fav) => fav.placeId === 'place-1')).toBeDefined()
    expect(remaining.find((fav) => fav.placeId === 'place-3')).toBeDefined()
  })

  it('should not affect other users favorites', async () => {
    const favorites: UserFavoritesPlaces[] = [
      { id: crypto.randomUUID(), userId: 'user-1', placeId: 'place-1', createdAt: new Date() },
      { id: crypto.randomUUID(), userId: 'user-2', placeId: 'place-1', createdAt: new Date() }
    ]

    repository.seed(favorites)

    await useCase.execute({ userId: 'user-1', placeId: 'place-1' })

    const remaining = repository.getAll()
    expect(remaining).toHaveLength(1)
    expect(remaining[0].userId).toBe('user-2')
  })

  it('should handle deleting non-existent favorite gracefully', async () => {
    // Should not throw an error when deleting non-existent favorite
    await useCase.execute({ userId: 'user-123', placeId: 'place-999' })

    const favorites = repository.getAll()
    expect(favorites).toHaveLength(0)
  })
})
