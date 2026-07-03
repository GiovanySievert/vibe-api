export interface CreatePlaceReviewDto {
  placeId: string
  placeName: string
  rating: 'crowded' | 'dead'
  placeImageUrl: string
  placeImageThumbnailUrl?: string
  userLat: number
  userLng: number
  placeLat: number
  placeLng: number
  selfieUrl?: string
  selfieThumbnailUrl?: string
  selfieFriendsOnly?: boolean
  comment?: string
}
