export interface CreatePlaceReviewDto {
  placeId: string
  placeName: string
  rating: 'crowded' | 'dead'
  placeImageUrl?: string
  selfieUrl?: string
  selfieFriendsOnly?: boolean
  comment?: string
}
