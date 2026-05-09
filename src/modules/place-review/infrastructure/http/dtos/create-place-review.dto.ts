export interface CreatePlaceReviewDto {
  placeId: string
  placeName: string
  rating: 'crowded' | 'dead'
  placeImageUrl: string
  userLat: number
  userLng: number
  placeLat: number
  placeLng: number
  selfieUrl?: string
  selfieFriendsOnly?: boolean
  comment?: string
}
