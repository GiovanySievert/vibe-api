export type PlaceReviewComment = {
  id: string
  reviewId: string
  userId: string
  content: string
  createdAt: Date
  user: {
    id: string
    username: string
    image: string | null
  }
}

export type ListPlaceReviewCommentsResult = {
  data: PlaceReviewComment[]
  total: number
  hasMore: boolean
}
