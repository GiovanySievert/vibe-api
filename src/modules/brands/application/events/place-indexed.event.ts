import { ApplicationEvent } from '@src/shared/application/events'

export const PLACE_INDEXED_EVENT = 'place.indexed'

export interface PlaceIndexedPayload {
  id: string
  name: string
  type: string | null
  neighborhood: string | null
  location: {
    lat: number
    lon: number
  }
}

export type PlaceIndexedEvent = ApplicationEvent<typeof PLACE_INDEXED_EVENT, PlaceIndexedPayload>

export function createPlaceIndexedEvent(payload: PlaceIndexedPayload): PlaceIndexedEvent {
  return {
    name: PLACE_INDEXED_EVENT,
    payload
  }
}
