import { describe, it, expect, mock } from 'bun:test'
import { RabbitMQApplicationEventBridge } from '../rabbitmq-application-event-bridge'
import { RabbitMQProducer } from '@src/shared/infra/messaging'
import { PLACE_INDEXED_RK } from '@src/config/rabbitmq.config'
import { PLACE_INDEXED_EVENT, createPlaceIndexedEvent } from '@src/modules/brands/application/events/place-indexed.event'
import type { ApplicationEvent } from '@src/shared/application/events'

function makeProducer(publishImpl: (...args: any[]) => Promise<void> = async () => {}): RabbitMQProducer {
  return {
    publish: mock(publishImpl)
  } as unknown as RabbitMQProducer
}

const VALID_EVENT = createPlaceIndexedEvent({
  id: 'place-1',
  name: 'Test Place',
  type: 'Restaurant',
  neighborhood: 'Centro',
  location: { lat: -23.5, lon: -46.6 }
})

describe('RabbitMQApplicationEventBridge', () => {
  it('publishes registered events with the configured routing key', async () => {
    const producer = makeProducer()
    const bridge = new RabbitMQApplicationEventBridge(producer)

    await bridge.publish(VALID_EVENT, { correlationId: 'corr-1' })

    expect(producer.publish).toHaveBeenCalledTimes(1)
    expect(producer.publish).toHaveBeenCalledWith(
      VALID_EVENT.payload,
      PLACE_INDEXED_RK,
      { correlationId: 'corr-1' }
    )
  })

  it('skips events that are not in the external registry', async () => {
    const producer = makeProducer()
    const bridge = new RabbitMQApplicationEventBridge(producer)

    const localEvent: ApplicationEvent<'internal.only', { foo: string }> = {
      name: 'internal.only',
      payload: { foo: 'bar' }
    }

    await bridge.publish(localEvent)

    expect(producer.publish).not.toHaveBeenCalled()
  })

  it('does not publish when the payload fails schema validation', async () => {
    const producer = makeProducer()
    const bridge = new RabbitMQApplicationEventBridge(producer)

    const invalid = {
      name: PLACE_INDEXED_EVENT,
      payload: { id: '', name: 'x', location: { lat: 'nope' as unknown as number, lon: 1 } }
    }

    await bridge.publish(invalid)

    expect(producer.publish).not.toHaveBeenCalled()
  })

  it('does not propagate producer failures', async () => {
    const producer = makeProducer(async () => {
      throw new Error('broker down')
    })
    const bridge = new RabbitMQApplicationEventBridge(producer)

    await expect(bridge.publish(VALID_EVENT)).resolves.toBeUndefined()
    expect(producer.publish).toHaveBeenCalledTimes(1)
  })

  it('subscribe is a no-op', () => {
    const producer = makeProducer()
    const bridge = new RabbitMQApplicationEventBridge(producer)

    expect(() =>
      bridge.subscribe(PLACE_INDEXED_EVENT, { handle: async () => {} })
    ).not.toThrow()
  })
})
