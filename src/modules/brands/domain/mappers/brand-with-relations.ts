import { brandMenus, brands, placeLocations, places } from '../../application/schemas'

export type BrandWithRelations = {
  brands: typeof brands.$inferSelect
  brand_menus: typeof brandMenus.$inferSelect | null
  places: typeof places.$inferSelect | null
  place_locations: typeof placeLocations.$inferSelect | null
}
