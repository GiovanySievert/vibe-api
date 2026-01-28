export interface PlaceReviewResponseDto {
  id: string
  userId: string
  placeId: string
  rating: number
  comment: string | null
  createdAt: Date
  updatedAt: Date
}
