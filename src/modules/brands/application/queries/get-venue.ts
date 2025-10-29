import { Venues } from '../../domain/mappers'
import { VenuesRepository } from '../../domain/repositories'

export class GetVenue {
  constructor(private readonly venuesRepo: VenuesRepository) {}

  async execute(venueId: number): Promise<Venues> {
    const venue = await this.venuesRepo.getById(venueId)
    return venue
  }
}
