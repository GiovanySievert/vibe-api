import { InferSelectModel } from 'drizzle-orm'
import { brandMenus, brands, placeLocations, places } from '../../application/schemas'

export type PlaceWithRelations = InferSelectModel<typeof places> & {
  brand: InferSelectModel<typeof brands> & {
    menus: InferSelectModel<typeof brandMenus>[]
  }
  location: InferSelectModel<typeof placeLocations>
}
