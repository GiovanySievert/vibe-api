export { users, accounts, sessions, verifications } from '@src/modules/auth/application/schemas'
export {
  brands,
  places,
  brandMenus,
  placeLocations,
  placesRelations,
  brandsRelations,
  brandMenusRelations
} from '@src/modules/brands/application/schemas'

export { userFavoritesPlaces } from '@src/modules/user-favorites-places/application/schemas'

export {
  followRequests,
  followers,
  followRequestsRelations,
  followersRelations,
  followStats
} from '@src/modules/follow/application/schemas'

export { userBlocks } from '@src/modules/blocks/application/schemas'

export { placeReviews, placeReviewsRelations } from '@src/modules/place-review/application/schemas'
