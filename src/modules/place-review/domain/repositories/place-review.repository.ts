import { PlaceReview } from '../mappers'

export interface PlaceReviewRepository {
  create(data: Omit<PlaceReview, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlaceReview>
  getById(reviewId: string): Promise<PlaceReview | null>
  getByUserAndPlace(userId: string, placeId: string): Promise<PlaceReview | null>
  listByPlace(placeId: string, page?: number): Promise<PlaceReview[]>
  listByUser(userId: string, page?: number): Promise<PlaceReview[]>
  update(reviewId: string, data: Partial<Omit<PlaceReview, 'id' | 'createdAt' | 'updatedAt'>>): Promise<PlaceReview>
  delete(reviewId: string): Promise<void>
}
