import {
  CreateBrandWithPlace,
  GetBrand,
  ReindexPlaces
} from '@src/modules/brands/application/use-cases'
import type { CreateAllEntitiesDTO } from '../dtos/create-brand.dto'

export class BrandsController {
  constructor(
    private readonly createBrandWithPlace: CreateBrandWithPlace,
    private readonly getBrandService: GetBrand,
    private readonly reindexPlacesService: ReindexPlaces
  ) {}

  async create({ body }: { body: CreateAllEntitiesDTO }) {
    const result = await this.createBrandWithPlace.execute(body)
    return result
  }

  async getById({ params }: { params: { brandId: string } }) {
    const brand = await this.getBrandService.execute(params.brandId)
    return brand
  }

  async reindexPlaces() {
    const job = await this.reindexPlacesService.execute()
    return {
      message: 'Reindex job started',
      jobId: job.id,
      status: job.status
    }
  }

  async getReindexStatus({ params }: { params: { jobId: string } }) {
    const job = this.reindexPlacesService.getJobStatus(params.jobId)

    if (!job) {
      return {
        error: 'Job not found'
      }
    }

    return {
      jobId: job.id,
      status: job.status,
      progress: job.progress,
      error: job.error,
      startedAt: job.startedAt,
      completedAt: job.completedAt
    }
  }
}
