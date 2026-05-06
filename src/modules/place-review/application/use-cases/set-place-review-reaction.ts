import { PlaceReviewNotFoundException } from '@src/modules/place-review/domain/exceptions'
import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'
import { PlaceReviewReactionType } from '@src/modules/place-review/domain/types'

type SetPlaceReviewReactionInput = {
  reviewId: string
  userId: string
  type: PlaceReviewReactionType
}

export class SetPlaceReviewReaction {
  constructor(private readonly placeReviewRepo: PlaceReviewRepository) {}

  async execute(input: SetPlaceReviewReactionInput): Promise<void> {
    const review = await this.placeReviewRepo.getById(input.reviewId)

    if (!review) {
      throw new PlaceReviewNotFoundException(input.reviewId)
    }

    await this.placeReviewRepo.setReaction(input)
  }
}
