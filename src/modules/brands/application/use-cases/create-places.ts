import { Place } from '../../domain/mappers'
import { BrandRepository } from '../../domain/repositories'
import { PlacesRepository } from '../../domain/repositories/places.repository'
import { BrandNotFoundException } from '../../domain/exceptions'
import { PlaceCreationData, PlaceCreationDataInput } from '../../domain/value-objects'

export type CreatePlaceData = PlaceCreationDataInput

export class CreatePlace {
  constructor(
    private readonly placeRepository: PlacesRepository,
    private readonly brandRepository: BrandRepository
  ) {}

  async execute(data: CreatePlaceData): Promise<Place> {
    const placeData = PlaceCreationData.create(data)

    const brand = await this.brandRepository.getById(placeData.value.brandId)

    if (!brand) {
      throw new BrandNotFoundException(placeData.value.brandId)
    }

    const place = await this.placeRepository.create(placeData.value)
    return place
  }
}
