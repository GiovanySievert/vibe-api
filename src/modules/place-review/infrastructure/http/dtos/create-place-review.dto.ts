export interface CreatePlaceReviewDto {
  placeId: string
  rating: 'crowded' | 'dead'
  imageUrl?: string
  comment?: string
}
