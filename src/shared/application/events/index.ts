import { InMemoryApplicationEventBus } from './in-memory-application-event-bus'
import { CompositeApplicationEventBus } from './composite-application-event-bus'
import { RabbitMQProducer } from '@src/shared/infra/messaging'
import { RabbitMQApplicationEventBridge } from '@src/shared/infrastructure/messaging/rabbitmq-application-event-bridge'

export * from './application-event'
export * from './application-event-bus'
export * from './in-memory-application-event-bus'
export * from './composite-application-event-bus'

const inMemoryBus = new InMemoryApplicationEventBus()
const rabbitBridge = new RabbitMQApplicationEventBridge(new RabbitMQProducer())

export const applicationEventBus = new CompositeApplicationEventBus(inMemoryBus, [rabbitBridge])
