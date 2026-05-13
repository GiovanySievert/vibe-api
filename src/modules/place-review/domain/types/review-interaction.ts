export type ReviewInteractionCount = {
  reviewId: string
  onCount: number
  offCount: number
  total: number
}

export type ReviewInteractionUser = {
  id: string
  username: string
  image: string | null
}
