import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'
import { ListPlaceReviewFriendsResult } from '@src/modules/place-review/domain/types'

type ListPlaceReviewFriendsInput = {
  placeId: string
  viewerId: string
  since: Date
  page: number
  limit: number
}

export class ListPlaceReviewFriends {
  constructor(private readonly placeReviewRepo: PlaceReviewRepository) {}

  async execute(input: ListPlaceReviewFriendsInput): Promise<ListPlaceReviewFriendsResult> {
    return this.placeReviewRepo.listFriendsByPlace(
      input.placeId,
      input.viewerId,
      input.since,
      input.page,
      input.limit
    )
  }
}
