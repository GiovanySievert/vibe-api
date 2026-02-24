import { EXCHANGE_NAME } from '@src/config/rabbitmq.config'
import { rabbitMQConnection } from './rabbitmq-connection'

export class RabbitMQProducer {
  async publish(data: any): Promise<void> {
    const channel = await rabbitMQConnection.getChannel()

    channel.publish(
      EXCHANGE_NAME,
      'elasticsearch',
      Buffer.from(JSON.stringify(data)),
      { persistent: true }
    )
  }
}
