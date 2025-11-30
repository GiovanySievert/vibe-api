import { describe, it, expect, beforeEach } from 'bun:test'
import { UserFavoritesController } from '../../infrastructure/http/controllers/user-favorites-places.controller'
import { CreateUserFavoritesPlaces } from '../../application/use-cases/create-user-favorites-places'
import { GetUserFavoritesPlace } from '../../application/use-cases/get-user-favorites-places'
import { DeleteUserFavoritesPlaces } from '../../application/use-cases/delete-user-favorites-places'
import { MockUserFavoritesPlacesRepository } from '../mocks/user-favorites-places.repository.mock'
import { UserFavoritesPlaces } from '../../domain/mappers'

describe('UserFavoritesController', () => {
  let controller: UserFavoritesController
  let repository: MockUserFavoritesPlacesRepository

  beforeEach(() => {
    repository = new MockUserFavoritesPlacesRepository()

    const getUserFavoritesPlaces = new GetUserFavoritesPlace(repository)
    const createUserFavoritesPlaces = new CreateUserFavoritesPlaces(repository)
    const deleteUserFavoritesPlaces = new DeleteUserFavoritesPlaces(repository)

    controller = new UserFavoritesController(
      getUserFavoritesPlaces,
      createUserFavoritesPlaces,
      deleteUserFavoritesPlaces
    )
  })

  describe('list', () => {
    it('should return empty array when user has no favorites', async () => {
      const user = { id: 'user-123', email: 'test@example.com' } as any

      const result = await controller.list({ user })

      expect(result).toHaveLength(0)
    })

    it('should return user favorites', async () => {
      const user = { id: 'user-123', email: 'test@example.com' } as any
      const favorites: UserFavoritesPlaces[] = [
        { id: crypto.randomUUID(), userId: user.id, placeId: 'place-1', createdAt: new Date() },
        { id: crypto.randomUUID(), userId: user.id, placeId: 'place-2', createdAt: new Date() }
      ]

      repository.seed(favorites)

      const result = await controller.list({ user })

      expect(result).toHaveLength(2)
      expect(result[0].userId).toBe(user.id)
      expect(result[1].userId).toBe(user.id)
    })
  })

  describe('create', () => {
    it('should create a new favorite place', async () => {
      const user = { id: 'user-123', email: 'test@example.com' } as any
      const params = { placeId: 'place-456' }

      const result = await controller.create({ params, user })

      expect(result).toBeDefined()
      expect(result.userId).toBe(user.id)
      expect(result.placeId).toBe(params.placeId)
    })

    it('should add favorite to the repository', async () => {
      const user = { id: 'user-123', email: 'test@example.com' } as any
      const params = { placeId: 'place-456' }

      await controller.create({ params, user })

      const favorites = await repository.list(user.id)
      expect(favorites).toHaveLength(1)
      expect(favorites[0].placeId).toBe(params.placeId)
    })
  })

  describe('delete', () => {
    it('should delete a favorite place', async () => {
      const user = { id: 'user-123', email: 'test@example.com' } as any
      const favorite: UserFavoritesPlaces = {
        id: crypto.randomUUID(),
        userId: user.id,
        placeId: 'place-456',
        createdAt: new Date()
      }

      repository.seed([favorite])

      const params = { placeId: 'place-456' }
      await controller.delete({ params, user })

      const favorites = await repository.list(user.id)
      expect(favorites).toHaveLength(0)
    })

    it('should only delete the specified favorite', async () => {
      const user = { id: 'user-123', email: 'test@example.com' } as any
      const favorites: UserFavoritesPlaces[] = [
        { id: crypto.randomUUID(), userId: user.id, placeId: 'place-1', createdAt: new Date() },
        { id: crypto.randomUUID(), userId: user.id, placeId: 'place-2', createdAt: new Date() },
        { id: crypto.randomUUID(), userId: user.id, placeId: 'place-3', createdAt: new Date() }
      ]

      repository.seed(favorites)

      const params = { placeId: 'place-2' }
      await controller.delete({ params, user })

      const remaining = await repository.list(user.id)
      expect(remaining).toHaveLength(2)
      expect(remaining.find((fav) => fav.placeId === 'place-2')).toBeUndefined()
    })
  })
})
