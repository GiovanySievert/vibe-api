import {
  CreatePlace,
  CreatePlaceLocation,
  CreateBrand,
  CreateBrandMenus,
  GetBrand,
  GetPlace,
  CreateBrandWithPlace,
  ReindexPlaces
} from './application/use-cases'
import {
  DrizzleBrandMenusRepository,
  DrizzlePlaceLocationsRepository,
  DrizzlePlacesRepository,
  DrizzleBrandRepository
} from './infrastructure/persistence'
import { applicationEventBus } from '@src/shared/application/events'
import { BrandsController } from './infrastructure/http/controllers/brands.controller'

export class BrandsModule {
  public readonly controller: BrandsController
  public readonly getPlaceService: GetPlace

  constructor() {
    const brandRepo = new DrizzleBrandRepository()
    const placeRepo = new DrizzlePlacesRepository()
    const placeLocationRepo = new DrizzlePlaceLocationsRepository()
    const brandMenusRepo = new DrizzleBrandMenusRepository()

    const createBrandService = new CreateBrand(brandRepo)
    const createBrandMenusService = new CreateBrandMenus(brandMenusRepo)
    const createPlaceService = new CreatePlace(placeRepo, brandRepo)
    const createPlaceLocationService = new CreatePlaceLocation(placeLocationRepo)
    const getBrandService = new GetBrand(brandRepo)
    const getPlaceService = new GetPlace(placeRepo)
    const reindexPlacesService = new ReindexPlaces(placeRepo, applicationEventBus)

    const createBrandWithPlace = new CreateBrandWithPlace(
      createBrandService,
      createBrandMenusService,
      createPlaceService,
      createPlaceLocationService,
      applicationEventBus
    )

    this.controller = new BrandsController(
      createBrandWithPlace,
      getBrandService,
      reindexPlacesService
    )
    this.getPlaceService = getPlaceService
  }
}
