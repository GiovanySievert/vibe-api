import { PlaceReviewNotFoundException } from '@src/modules/place-review/domain/exceptions'
import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'
import { ListPlaceReviewCommentsResult } from '@src/modules/place-review/domain/types'

type ListPlaceReviewCommentsInput = {
  reviewId: string
  page: number
  limit: number
}

export class ListPlaceReviewComments {
  constructor(private readonly placeReviewRepo: PlaceReviewRepository) {}

  async execute(input: ListPlaceReviewCommentsInput): Promise<ListPlaceReviewCommentsResult> {
    const review = await this.placeReviewRepo.getById(input.reviewId)

    if (!review) {
      throw new PlaceReviewNotFoundException(input.reviewId)
    }

    return this.placeReviewRepo.listComments(input.reviewId, input.page, input.limit)
  }
}
