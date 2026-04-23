import { PlaceReview } from '../../domain/mappers'
import { PlaceReviewRepository } from '../../domain/repositories'

export class MockPlaceReviewRepository implements PlaceReviewRepository {
  private reviews: PlaceReview[] = []

  async create(data: Omit<PlaceReview, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlaceReview> {
    const review: PlaceReview = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.reviews.push(review)
    return review
  }

  async getById(reviewId: string): Promise<PlaceReview | null> {
    return this.reviews.find((r) => r.id === reviewId) ?? null
  }

  async getByUserAndPlace(userId: string, placeId: string): Promise<PlaceReview | null> {
    return this.reviews.find((r) => r.userId === userId && r.placeId === placeId) ?? null
  }

  async listByPlace(placeId: string, page?: number): Promise<PlaceReview[]> {
    const limit = 10
    const offset = ((page ?? 1) - 1) * limit
    return this.reviews.filter((r) => r.placeId === placeId).slice(offset, offset + limit)
  }

  async listByUser(userId: string, page?: number): Promise<PlaceReview[]> {
    const limit = 10
    const offset = ((page ?? 1) - 1) * limit
    return this.reviews.filter((r) => r.userId === userId).slice(offset, offset + limit)
  }

  async update(reviewId: string, data: Partial<Omit<PlaceReview, 'id' | 'createdAt' | 'updatedAt'>>): Promise<PlaceReview> {
    this.reviews = this.reviews.map((r) =>
      r.id === reviewId ? { ...r, ...data, updatedAt: new Date() } : r
    )
    return this.reviews.find((r) => r.id === reviewId) as PlaceReview
  }

  async delete(reviewId: string): Promise<void> {
    this.reviews = this.reviews.filter((r) => r.id !== reviewId)
  }

  reset() {
    this.reviews = []
  }

  seed(data: PlaceReview[]) {
    this.reviews = [...data]
  }

  getAll() {
    return [...this.reviews]
  }
}
