import { z } from 'zod'
import { PLACE_INDEXED_RK } from '@src/config/rabbitmq.config'
import { PLACE_INDEXED_EVENT } from '@src/modules/brands/application/events/place-indexed.event'
import { PlaceIndexedPayloadSchema } from './external-events.schemas'

export interface ExternalEventDescriptor<TPayload = unknown> {
  routingKey: string
  schema: z.ZodType<TPayload>
}

export const EXTERNAL_EVENTS: Record<string, ExternalEventDescriptor> = {
  [PLACE_INDEXED_EVENT]: {
    routingKey: PLACE_INDEXED_RK,
    schema: PlaceIndexedPayloadSchema
  }
}

export function getExternalEventDescriptor(eventName: string): ExternalEventDescriptor | undefined {
  return EXTERNAL_EVENTS[eventName]
}
