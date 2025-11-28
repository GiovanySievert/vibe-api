import { EventBus } from '@src/shared/domain/event-bus'
import { RabbitMQProducer } from '../infra/messaging/rabbitmq-producer'

export class RabbitMQEventBus implements EventBus {
  constructor(private readonly producer: RabbitMQProducer) {}

  async publish(eventName: string, data: any): Promise<void> {
    await this.producer.publish(data)
    console.log(`📨 Event published: ${eventName}`)
  }
}
