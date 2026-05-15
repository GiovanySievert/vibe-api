import { beforeEach, describe, expect, it } from 'bun:test'

import { PlaceNotFoundException } from '@src/modules/brands/domain/exceptions'
import { EventNotFoundException, EventNotOwnerException } from '../../domain/exceptions'
import { UpdateEventDetails } from '../../application/use-cases/events'
import { MockEventRepository } from '../mocks/event.repository.mock'
import { MockPlacesRepository } from '../mocks/place.repository.mock'

describe('UpdateEventDetails', () => {
  let updateEventDetails: UpdateEventDetails
  let mockEventRepo: MockEventRepository
  let mockPlacesRepo: MockPlacesRepository

  beforeEach(() => {
    mockEventRepo = new MockEventRepository()
    mockPlacesRepo = new MockPlacesRepository()
    updateEventDetails = new UpdateEventDetails(mockEventRepo, mockPlacesRepo)
  })

  it('should preserve the current place when only description changes', async () => {
    mockPlacesRepo.seed(['place-1'])

    const created = await mockEventRepo.create({
      ownerId: 'user-1',
      name: 'Festa',
      date: '10/10/2026',
      time: '20:00',
      description: 'Antes',
      placeId: 'place-1',
      imageUrl: 'https://cdn.vibes.app/events/festa.jpg',
      participantIds: []
    })

    const updated = await updateEventDetails.execute({
      eventId: created.id,
      userId: 'user-1',
      description: 'Depois',
      placeId: 'place-1',
      imageUrl: created.imageUrl
    })

    expect(updated.description).toBe('Depois')
    expect(updated.place?.id).toBe('place-1')
    expect(updated.imageUrl).toBe('https://cdn.vibes.app/events/festa.jpg')
  })

  it('should add a place to an event without one', async () => {
    mockPlacesRepo.seed(['place-1'])

    const created = await mockEventRepo.create({
      ownerId: 'user-1',
      name: 'Festa',
      date: '10/10/2026',
      time: '20:00',
      participantIds: []
    })

    const updated = await updateEventDetails.execute({
      eventId: created.id,
      userId: 'user-1',
      description: created.description ?? '',
      placeId: 'place-1',
      imageUrl: created.imageUrl
    })

    expect(updated.place?.id).toBe('place-1')
  })

  it('should change the place of an event', async () => {
    mockPlacesRepo.seed(['place-1', 'place-2'])

    const created = await mockEventRepo.create({
      ownerId: 'user-1',
      name: 'Festa',
      date: '10/10/2026',
      time: '20:00',
      placeId: 'place-1',
      participantIds: []
    })

    const updated = await updateEventDetails.execute({
      eventId: created.id,
      userId: 'user-1',
      description: created.description ?? '',
      placeId: 'place-2',
      imageUrl: created.imageUrl
    })

    expect(updated.place?.id).toBe('place-2')
  })

  it('should remove the place when placeId is null', async () => {
    mockPlacesRepo.seed(['place-1'])

    const created = await mockEventRepo.create({
      ownerId: 'user-1',
      name: 'Festa',
      date: '10/10/2026',
      time: '20:00',
      placeId: 'place-1',
      participantIds: []
    })

    const updated = await updateEventDetails.execute({
      eventId: created.id,
      userId: 'user-1',
      description: created.description ?? '',
      placeId: null,
      imageUrl: created.imageUrl
    })

    expect(updated.place).toBeNull()
  })

  it('should update the event image', async () => {
    const created = await mockEventRepo.create({
      ownerId: 'user-1',
      name: 'Festa',
      date: '10/10/2026',
      time: '20:00',
      participantIds: []
    })

    const updated = await updateEventDetails.execute({
      eventId: created.id,
      userId: 'user-1',
      description: created.description ?? '',
      placeId: null,
      imageUrl: 'https://cdn.vibes.app/events/festa-2.jpg'
    })

    expect(updated.imageUrl).toBe('https://cdn.vibes.app/events/festa-2.jpg')
  })

  it('should remove the event image when imageUrl is null', async () => {
    const created = await mockEventRepo.create({
      ownerId: 'user-1',
      name: 'Festa',
      date: '10/10/2026',
      time: '20:00',
      imageUrl: 'https://cdn.vibes.app/events/festa.jpg',
      participantIds: []
    })

    const updated = await updateEventDetails.execute({
      eventId: created.id,
      userId: 'user-1',
      description: created.description ?? '',
      placeId: null,
      imageUrl: null
    })

    expect(updated.imageUrl).toBeNull()
  })

  it('should throw when placeId does not exist', async () => {
    const created = await mockEventRepo.create({
      ownerId: 'user-1',
      name: 'Festa',
      date: '10/10/2026',
      time: '20:00',
      participantIds: []
    })

    await expect(
      updateEventDetails.execute({
        eventId: created.id,
        userId: 'user-1',
        description: created.description ?? '',
        placeId: 'missing-place',
        imageUrl: created.imageUrl
      })
    ).rejects.toThrow(PlaceNotFoundException)
  })

  it('should throw when the event does not exist', async () => {
    await expect(
      updateEventDetails.execute({
        eventId: 'missing-event',
        userId: 'user-1',
        description: '',
        placeId: null,
        imageUrl: null
      })
    ).rejects.toThrow(EventNotFoundException)
  })

  it('should throw when the user is not the owner', async () => {
    const created = await mockEventRepo.create({
      ownerId: 'user-1',
      name: 'Festa',
      date: '10/10/2026',
      time: '20:00',
      participantIds: []
    })

    await expect(
      updateEventDetails.execute({
        eventId: created.id,
        userId: 'user-2',
        description: '',
        placeId: null,
        imageUrl: null
      })
    ).rejects.toThrow(EventNotOwnerException)
  })
})
