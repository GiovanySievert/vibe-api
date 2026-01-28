import {
  CreatePlaceReview,
  GetPlaceReview,
  ListPlaceReviews,
  UpdatePlaceReview,
  DeletePlaceReview
} from '../../../application/use-cases'
import { User } from 'better-auth/types'
import { CreatePlaceReviewDto, UpdatePlaceReviewDto } from '../dtos'

export class PlaceReviewController {
  constructor(
    private readonly createPlaceReview: CreatePlaceReview,
    private readonly getPlaceReview: GetPlaceReview,
    private readonly listPlaceReviews: ListPlaceReviews,
    private readonly updatePlaceReview: UpdatePlaceReview,
    private readonly deletePlaceReview: DeletePlaceReview
  ) {}

  async create({ body, user }: { body: CreatePlaceReviewDto; user: User }) {
    return await this.createPlaceReview.execute({
      userId: user.id,
      placeId: body.placeId,
      rating: body.rating,
      comment: body.comment ?? null
    })
  }

  async getById({ params }: { params: { reviewId: string } }) {
    return await this.getPlaceReview.execute(params.reviewId)
  }

  async listByPlace({ params, query }: { params: { placeId: string }; query: { page?: number } }) {
    return await this.listPlaceReviews.executeByPlace(params.placeId, query.page)
  }

  async listByUser({ params, query }: { params: { userId: string }; query: { page?: number } }) {
    return await this.listPlaceReviews.executeByUser(params.userId, query.page)
  }

  async update({ params, body }: { params: { reviewId: string }; body: UpdatePlaceReviewDto }) {
    return await this.updatePlaceReview.execute(params.reviewId, body)
  }

  async delete({ params }: { params: { reviewId: string } }) {
    await this.deletePlaceReview.execute(params.reviewId)
  }
}
