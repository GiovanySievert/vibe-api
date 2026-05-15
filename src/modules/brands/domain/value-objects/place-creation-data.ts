import { Place } from '../mappers'
import { InvalidPlaceDataException } from '../exceptions'

export type PlaceCreationDataInput = Omit<Place, 'id' | 'createdAt' | 'updatedAt'>

export class PlaceCreationData {
  private constructor(public readonly value: PlaceCreationDataInput) {}

  static create(data: PlaceCreationDataInput): PlaceCreationData {
    if (!data.brandId) {
      throw new InvalidPlaceDataException('brandId is required')
    }

    if (!data.name.trim()) {
      throw new InvalidPlaceDataException('name is required')
    }

    if (!data.status.trim()) {
      throw new InvalidPlaceDataException('status is required')
    }

    return new PlaceCreationData(data)
  }
}
