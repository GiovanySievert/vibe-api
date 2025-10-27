import { VenueLocation } from '../../domain/mappers'
import { VenuesLocationRepository } from '../../domain/repositories/venues-location.repository'

export class CreateVenueLocation {
  constructor(private readonly venueLocationRepository: VenuesLocationRepository) {}

  async execute(data: any): Promise<VenueLocation> {
    const venueLocation = await this.venueLocationRepository.create(data)
    return venueLocation
  }
}
