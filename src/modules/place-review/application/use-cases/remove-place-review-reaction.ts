import { PlaceReviewNotFoundException } from '@src/modules/place-review/domain/exceptions'
import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'

type RemovePlaceReviewReactionInput = {
  reviewId: string
  userId: string
}

export class RemovePlaceReviewReaction {
  constructor(private readonly placeReviewRepo: PlaceReviewRepository) {}

  async execute(input: RemovePlaceReviewReactionInput): Promise<void> {
    const review = await this.placeReviewRepo.getById(input.reviewId)

    if (!review) {
      throw new PlaceReviewNotFoundException(input.reviewId)
    }

    await this.placeReviewRepo.removeReaction(input.reviewId, input.userId)
  }
}
