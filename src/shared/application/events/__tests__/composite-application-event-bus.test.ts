import { describe, it, expect, mock } from 'bun:test'
import { CompositeApplicationEventBus } from '../composite-application-event-bus'
import { InMemoryApplicationEventBus } from '../in-memory-application-event-bus'
import { ApplicationEvent, ApplicationEventHandler } from '../application-event'
import { ApplicationEventBus } from '../application-event-bus'

type TestEvent = ApplicationEvent<'test.event', { value: number }>

const TEST_EVENT: TestEvent = { name: 'test.event', payload: { value: 42 } }

function makeStubBus(publishImpl: (event: any) => Promise<void> = async () => {}): ApplicationEventBus {
  return {
    publish: mock(publishImpl),
    subscribe: mock(() => {})
  } as unknown as ApplicationEventBus
}

describe('CompositeApplicationEventBus', () => {
  it('delivers events to local bus and all bridges', async () => {
    const local = new InMemoryApplicationEventBus()
    const bridgeA = makeStubBus()
    const bridgeB = makeStubBus()
    const handler = mock(async () => {})

    local.subscribe<TestEvent>('test.event', { handle: handler })

    const composite = new CompositeApplicationEventBus(local, [bridgeA, bridgeB])
    await composite.publish(TEST_EVENT)

    expect(handler).toHaveBeenCalledTimes(1)
    expect(bridgeA.publish).toHaveBeenCalledWith(TEST_EVENT)
    expect(bridgeB.publish).toHaveBeenCalledWith(TEST_EVENT)
  })

  it('subscribes only on the local bus', () => {
    const local = makeStubBus()
    const bridge = makeStubBus()
    const composite = new CompositeApplicationEventBus(local, [bridge])

    const handler: ApplicationEventHandler<TestEvent> = { handle: async () => {} }
    composite.subscribe<TestEvent>('test.event', handler, 'sub-1')

    expect(local.subscribe).toHaveBeenCalledWith('test.event', handler, 'sub-1')
    expect(bridge.subscribe).not.toHaveBeenCalled()
  })

  it('runs local subscribers before bridges so local failures fail fast', async () => {
    const order: string[] = []
    const local: ApplicationEventBus = {
      publish: mock(async () => {
        order.push('local')
      }),
      subscribe: mock(() => {})
    } as unknown as ApplicationEventBus
    const bridge: ApplicationEventBus = {
      publish: mock(async () => {
        order.push('bridge')
      }),
      subscribe: mock(() => {})
    } as unknown as ApplicationEventBus

    const composite = new CompositeApplicationEventBus(local, [bridge])
    await composite.publish(TEST_EVENT)

    expect(order).toEqual(['local', 'bridge'])
  })
})
