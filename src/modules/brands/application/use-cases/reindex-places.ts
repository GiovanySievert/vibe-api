import { PlacesRepository } from '../../domain/repositories/places.repository'
import { ApplicationEventBus } from '@src/shared/application/events'
import { createPlaceIndexedEvent } from '../events/place-indexed.event'
import { jobManager, Job } from '@src/shared/infra/jobs/job-manager'

export class ReindexPlaces {
  private readonly BATCH_SIZE = 100

  constructor(
    private readonly placesRepository: PlacesRepository,
    private readonly applicationEventBus: ApplicationEventBus
  ) {}

  async execute(): Promise<Job> {
    const job = jobManager.createJob('reindex-places')

    this.processInBackground(job.id)

    return job
  }

  getJobStatus(jobId: string): Job | undefined {
    return jobManager.getJob(jobId)
  }

  private async processInBackground(jobId: string): Promise<void> {
    try {
      jobManager.updateJob(jobId, { status: 'running' })

      const total = await this.placesRepository.count()
      jobManager.updateProgress(jobId, { total })

      let processed = 0
      let batches = 0

      while (processed < total) {
        const places = await this.placesRepository.findAllPaginated(
          this.BATCH_SIZE,
          processed
        )

        for (const place of places) {
          if (place.location) {
            await this.applicationEventBus.publish(
              createPlaceIndexedEvent({
                id: place.id,
                name: place.name,
                type: place.type,
                neighborhood: place.location.neighborhood,
                location: {
                  lat: Number(place.location.lat),
                  lon: Number(place.location.lng)
                }
              })
            )
          }
          processed++
          jobManager.updateProgress(jobId, { processed })
        }

        batches++
        jobManager.updateProgress(jobId, { batches })
      }

      jobManager.completeJob(jobId)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      jobManager.failJob(jobId, message)
    }
  }
}
