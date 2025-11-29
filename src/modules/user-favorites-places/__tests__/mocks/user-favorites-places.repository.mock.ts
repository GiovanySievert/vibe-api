import { UserFavoritesPlaces } from '../../domain/mappers'
import { UserFavoritesPlacesRepository } from '../../domain/repositories/user-favorites-places.repository'

export class MockUserFavoritesPlacesRepository implements UserFavoritesPlacesRepository {
  private favorites: UserFavoritesPlaces[] = []

  async create(data: UserFavoritesPlaces): Promise<UserFavoritesPlaces> {
    const newFavorite: UserFavoritesPlaces = {
      id: crypto.randomUUID(),
      userId: data.userId,
      placeId: data.placeId,
      createdAt: new Date()
    }
    this.favorites.push(newFavorite)
    return newFavorite
  }

  async delete(data: UserFavoritesPlaces): Promise<void> {
    this.favorites = this.favorites.filter((fav) => !(fav.userId === data.userId && fav.placeId === data.placeId))
  }

  async list(userId: string): Promise<UserFavoritesPlaces[]> {
    return this.favorites.filter((fav) => fav.userId === userId)
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
