import { randomUUID } from 'node:crypto'
import { EXCHANGE, PLACE_INDEXED_RK } from '@src/config/rabbitmq.config'
import { rabbitMQConnection } from './rabbitmq-connection'

export type PublishOptions = {
  correlationId?: string
}

export class RabbitMQProducer {
  async publish(
    data: unknown,
    routingKey: string = PLACE_INDEXED_RK,
    options: PublishOptions = {}
  ): Promise<void> {
    const channel = rabbitMQConnection.getChannel()

    await channel.publish(
      EXCHANGE,
      routingKey,
      Buffer.from(JSON.stringify(data)),
      {
        persistent: true,
        contentType: 'application/json',
        correlationId: options.correlationId ?? randomUUID(),
      }
    )
  }
}
