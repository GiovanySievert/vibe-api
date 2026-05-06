import { PlaceReviewNotFoundException } from '@src/modules/place-review/domain/exceptions'
import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'
import { PlaceReviewComment } from '@src/modules/place-review/domain/types'

type CreatePlaceReviewCommentInput = {
  reviewId: string
  userId: string
  content: string
}

export class CreatePlaceReviewComment {
  constructor(private readonly placeReviewRepo: PlaceReviewRepository) {}

  async execute(input: CreatePlaceReviewCommentInput): Promise<PlaceReviewComment> {
    const review = await this.placeReviewRepo.getById(input.reviewId)

    if (!review) {
      throw new PlaceReviewNotFoundException(input.reviewId)
    }

    return this.placeReviewRepo.createComment(input)
  }
}
