import { describe, it, expect, beforeEach } from 'bun:test'

import { PlaceNotFoundException } from '@src/modules/brands/domain/exceptions'
import { CreateEvent } from '../../application/use-cases/events'
import { EventParticipantStatus } from '../../domain/types'
import { MockEventRepository } from '../mocks/event.repository.mock'
import { MockPlacesRepository } from '../mocks/place.repository.mock'
import { InMemoryApplicationEventBus } from '@src/shared/application/events'

describe('CreateEvent', () => {
  let createEvent: CreateEvent
  let mockEventRepo: MockEventRepository
  let mockPlacesRepo: MockPlacesRepository
  let eventBus: InMemoryApplicationEventBus

  beforeEach(() => {
    mockEventRepo = new MockEventRepository()
    mockPlacesRepo = new MockPlacesRepository()
    eventBus = new InMemoryApplicationEventBus()
    createEvent = new CreateEvent(mockEventRepo, mockPlacesRepo, eventBus)
  })

  it('should create an event successfully', async () => {
    const input = {
      ownerId: 'user-1',
      ownerName: 'User One',
      name: 'Meu Aniversário',
      date: '25/12/2025',
      time: '18:00',
      description: 'Festa de aniversário',
      participantIds: ['user-2', 'user-3']
    }

    const result = await createEvent.execute(input)

    expect(result).toBeDefined()
    expect(result.id).toBeDefined()
    expect(result.name).toBe(input.name)
    expect(result.date).toBe(input.date)
    expect(result.time).toBe(input.time)
    expect(result.description).toBe(input.description)
    expect(result.ownerId).toBe(input.ownerId)
  })

  it('should create an event with participants', async () => {
    const input = {
      ownerId: 'user-1',
      ownerName: 'User One',
      name: 'Churrasco',
      date: '01/01/2026',
      time: '12:00',
      participantIds: ['user-2', 'user-3']
    }

    const result = await createEvent.execute(input)

    expect(result.participants).toHaveLength(2)
    expect(result.participants![0].userId).toBe('user-2')
    expect(result.participants![1].userId).toBe('user-3')
    expect(result.participants![0].status).toBe(EventParticipantStatus.PENDING)
  })

  it('should create an event with no participants', async () => {
    const input = {
      ownerId: 'user-1',
      ownerName: 'User One',
      name: 'Evento Solo',
      date: '15/06/2025',
      time: '20:00',
      participantIds: []
    }

    const result = await createEvent.execute(input)

    expect(result.participants).toHaveLength(0)
  })

  it('should create an event without description', async () => {
    const input = {
      ownerId: 'user-1',
      ownerName: 'User One',
      name: 'Rolê',
      date: '10/10/2025',
      time: '22:00',
      participantIds: []
    }

    const result = await createEvent.execute(input)

    expect(result.description).toBeNull()
  })

  it('should create an event with place when placeId exists', async () => {
    mockPlacesRepo.seed(['place-1'])

    const result = await createEvent.execute({
      ownerId: 'user-1',
      ownerName: 'User One',
      name: 'Happy hour',
      date: '12/12/2026',
      time: '19:00',
      placeId: 'place-1',
      participantIds: []
    })

    expect(result.place).not.toBeNull()
    expect(result.place?.id).toBe('place-1')
  })

  it('should create an event with image when imageUrl is provided', async () => {
    const result = await createEvent.execute({
      ownerId: 'user-1',
      ownerName: 'User One',
      name: 'Happy hour',
      date: '12/12/2026',
      time: '19:00',
      imageUrl: 'https://cdn.vibes.app/events/happy-hour.jpg',
      participantIds: []
    })

    expect(result.imageUrl).toBe('https://cdn.vibes.app/events/happy-hour.jpg')
  })

  it('should throw when placeId does not exist', async () => {
    await expect(
      createEvent.execute({
        ownerId: 'user-1',
        ownerName: 'User One',
        name: 'Happy hour',
        date: '12/12/2026',
        time: '19:00',
        placeId: 'missing-place',
        participantIds: []
      })
    ).rejects.toThrow(PlaceNotFoundException)
  })
})
