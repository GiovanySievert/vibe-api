import { Venues } from '../../domain/mappers'
import { VenuesRepository } from '../../domain/repositories/venues.repository'

export class CreateVenue {
  constructor(private readonly venueRepository: VenuesRepository) {}

  async execute(data: any): Promise<Venues> {
    const venue = await this.venueRepository.create(data)
    return venue
  }
}
