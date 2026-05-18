export type PlaceReviewFriend = {
  id: string
  name: string
  username: string
  image: string | null
  latestReviewAt: Date
}

export type ListPlaceReviewFriendsResult = {
  data: PlaceReviewFriend[]
  total: number
  hasMore: boolean
  page: number
  limit: number
}
