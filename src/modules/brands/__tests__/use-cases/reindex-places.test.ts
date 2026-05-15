import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { InMemoryApplicationEventBus } from '@src/shared/application/events'
import { jobManager } from '@src/shared/infra/jobs/job-manager'

import {
  PLACE_INDEXED_EVENT,
  type PlaceIndexedEvent
} from '../../application/events/place-indexed.event'
import { ReindexPlaces } from '../../application/use-cases/reindex-places'
import { PlaceWithLocation, PlacesRepository } from '../../domain/repositories/places.repository'

const makePlace = (id: string, overrides: Partial<PlaceWithLocation> = {}): PlaceWithLocation => ({
  id,
  name: `place-${id}`,
  type: 'Restaurant',
  location: {
    lat: '-23.5505',
    lng: '-46.6333',
    neighborhood: 'Downtown'
  },
  ...overrides
})

const waitForJobCompletion = async (jobId: string): Promise<void> => {
  while (true) {
    const job = jobManager.getJob(jobId)
    if (job && (job.status === 'completed' || job.status === 'failed')) return
    await new Promise((resolve) => setTimeout(resolve, 5))
  }
}

describe('ReindexPlaces', () => {
  let placesRepository: PlacesRepository
  let eventBus: InMemoryApplicationEventBus
  let capturedEvents: PlaceIndexedEvent[]
  let useCase: ReindexPlaces

  beforeEach(() => {
    capturedEvents = []
    eventBus = new InMemoryApplicationEventBus()
    eventBus.subscribe<PlaceIndexedEvent>(PLACE_INDEXED_EVENT, {
      handle: async (event) => {
        capturedEvents.push(event)
      }
    })
  })

  it('iterates through every place and publishes a place.indexed event for each', async () => {
    const placeRecords = [makePlace('place-1'), makePlace('place-2'), makePlace('place-3')]
    placesRepository = {
      count: mock(async () => placeRecords.length),
      findAllPaginated: mock(async (limit: number, offset: number) => placeRecords.slice(offset, offset + limit)),
      create: mock(async () => {
        throw new Error('not used')
      }),
      getById: mock(async () => [])
    } as unknown as PlacesRepository
    useCase = new ReindexPlaces(placesRepository, eventBus)

    const job = await useCase.execute()
    await waitForJobCompletion(job.id)

    expect(capturedEvents.map((event) => event.payload.id)).toEqual(['place-1', 'place-2', 'place-3'])
    expect(capturedEvents[0].payload).toEqual({
      id: 'place-1',
      name: 'place-place-1',
      type: 'Restaurant',
      neighborhood: 'Downtown',
      location: { lat: -23.5505, lon: -46.6333 }
    })

    const finalJob = jobManager.getJob(job.id)
    expect(finalJob?.status).toBe('completed')
    expect(finalJob?.progress.total).toBe(3)
    expect(finalJob?.progress.processed).toBe(3)
  })

  it('skips places without a location but still counts them as processed', async () => {
    const placeRecords = [
      makePlace('place-1'),
      makePlace('place-2', { location: null }),
      makePlace('place-3')
    ]
    placesRepository = {
      count: mock(async () => placeRecords.length),
      findAllPaginated: mock(async (limit: number, offset: number) => placeRecords.slice(offset, offset + limit)),
      create: mock(async () => {
        throw new Error('not used')
      }),
      getById: mock(async () => [])
    } as unknown as PlacesRepository
    useCase = new ReindexPlaces(placesRepository, eventBus)

    const job = await useCase.execute()
    await waitForJobCompletion(job.id)

    expect(capturedEvents.map((event) => event.payload.id)).toEqual(['place-1', 'place-3'])
    const finalJob = jobManager.getJob(job.id)
    expect(finalJob?.status).toBe('completed')
    expect(finalJob?.progress.processed).toBe(3)
  })

  it('handles an empty places repository without publishing events', async () => {
    placesRepository = {
      count: mock(async () => 0),
      findAllPaginated: mock(async () => []),
      create: mock(async () => {
        throw new Error('not used')
      }),
      getById: mock(async () => [])
    } as unknown as PlacesRepository
    useCase = new ReindexPlaces(placesRepository, eventBus)

    const job = await useCase.execute()
    await waitForJobCompletion(job.id)

    expect(capturedEvents).toEqual([])
    const finalJob = jobManager.getJob(job.id)
    expect(finalJob?.status).toBe('completed')
    expect(finalJob?.progress.total).toBe(0)
    expect(finalJob?.progress.processed).toBe(0)
  })

  it('marks the job as failed when the repository throws and stops publishing further events', async () => {
    const placeRecords = [makePlace('place-1'), makePlace('place-2')]
    placesRepository = {
      count: mock(async () => placeRecords.length),
      findAllPaginated: mock(async () => {
        throw new Error('elastic unreachable')
      }),
      create: mock(async () => {
        throw new Error('not used')
      }),
      getById: mock(async () => [])
    } as unknown as PlacesRepository
    useCase = new ReindexPlaces(placesRepository, eventBus)

    const job = await useCase.execute()
    await waitForJobCompletion(job.id)

    expect(capturedEvents).toEqual([])
    const finalJob = jobManager.getJob(job.id)
    expect(finalJob?.status).toBe('failed')
    expect(finalJob?.error).toBe('elastic unreachable')
  })

  it('returns a pending job from execute before background processing finishes', async () => {
    placesRepository = {
      count: mock(async () => 0),
      findAllPaginated: mock(async () => []),
      create: mock(async () => {
        throw new Error('not used')
      }),
      getById: mock(async () => [])
    } as unknown as PlacesRepository
    useCase = new ReindexPlaces(placesRepository, eventBus)

    const job = await useCase.execute()

    expect(job.id).toBeDefined()
    expect(job.type).toBe('reindex-places')
    expect(['pending', 'running', 'completed']).toContain(job.status)

    await waitForJobCompletion(job.id)
  })

  it('exposes the job status through getJobStatus', async () => {
    placesRepository = {
      count: mock(async () => 0),
      findAllPaginated: mock(async () => []),
      create: mock(async () => {
        throw new Error('not used')
      }),
      getById: mock(async () => [])
    } as unknown as PlacesRepository
    useCase = new ReindexPlaces(placesRepository, eventBus)

    const job = await useCase.execute()
    await waitForJobCompletion(job.id)

    const status = useCase.getJobStatus(job.id)
    expect(status?.id).toBe(job.id)
    expect(status?.status).toBe('completed')

    expect(useCase.getJobStatus('non-existent-id')).toBeUndefined()
  })
})
