import { ApplicationEvent, ApplicationEventBus, ApplicationEventHandler } from '@src/shared/application/events'
import { RabbitMQProducer } from '@src/shared/infra/messaging'
import { logger } from '@src/config/logger'
import { getExternalEventDescriptor } from './external-events.registry'

export interface PublishContext {
  correlationId?: string
}

export class RabbitMQApplicationEventBridge implements ApplicationEventBus {
  constructor(private readonly producer: RabbitMQProducer) {}

  async publish<TEvent extends ApplicationEvent>(event: TEvent, context: PublishContext = {}): Promise<void> {
    const descriptor = getExternalEventDescriptor(event.name)

    if (!descriptor) {
      return
    }

    const parsed = descriptor.schema.safeParse(event.payload)

    if (!parsed.success) {
      logger.error('external event payload rejected by schema', {
        eventName: event.name,
        routingKey: descriptor.routingKey,
        issues: parsed.error.issues,
        correlationId: context.correlationId
      })
      return
    }

    try {
      await this.producer.publish(parsed.data, descriptor.routingKey, {
        correlationId: context.correlationId
      })
    } catch (err) {
      logger.error('failed to publish external event', {
        eventName: event.name,
        routingKey: descriptor.routingKey,
        correlationId: context.correlationId,
        err: err instanceof Error ? { message: err.message, stack: err.stack } : err
      })
    }
  }

  subscribe<TEvent extends ApplicationEvent>(
    _eventName: TEvent['name'],
    _handler: ApplicationEventHandler<TEvent>,
    _subscriberId?: string
  ): void {
    void _eventName
    void _handler
    void _subscriberId
  }
}
