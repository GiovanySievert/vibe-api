import { UserFavoritesPlaces } from '../../domain/mappers'
import { UserFavoritesPlacesRepository } from '../../domain/repositories/user-favorites-places.repository'
import { GetUserFavoritesPlacesByIdDto } from '../../infrastructure/http/dtos'

export class MockUserFavoritesPlacesRepository implements UserFavoritesPlacesRepository {
  private favorites: UserFavoritesPlaces[] = []

  async create(data: Omit<UserFavoritesPlaces, 'id' | 'createdAt'>): Promise<UserFavoritesPlaces> {
    const newFavorite: UserFavoritesPlaces = {
      id: crypto.randomUUID(),
      userId: data.userId,
      placeId: data.placeId,
      createdAt: new Date()
    }
    this.favorites.push(newFavorite)
    return newFavorite
  }

  async delete(data: Pick<UserFavoritesPlaces, 'userId' | 'placeId'>): Promise<void> {
    this.favorites = this.favorites.filter((fav) => !(fav.userId === data.userId && fav.placeId === data.placeId))
  }

  async list(userId: string): Promise<GetUserFavoritesPlacesByIdDto[]> {
    return this.favorites
      .filter((fav) => fav.userId === userId)
      .map((fav) => ({
        id: fav.id,
        placeId: fav.placeId,
        name: 'Mock Place',
        createdAt: fav.createdAt,
        avatar: 'mock-avatar.png'
      }))
  }

  reset() {
    this.favorites = []
  }

  seed(data: UserFavoritesPlaces[]) {
    this.favorites = [...data]
  }

  getAll() {
    return [...this.favorites]
  }
}
