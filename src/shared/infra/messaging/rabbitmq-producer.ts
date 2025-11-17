import { createRabbitMQConnection, EXCHANGE_NAME } from '@src/config/rabbitmq.config'

export class RabbitMQProducer {
  async publish(data: any) {
    const { connection, channel } = await createRabbitMQConnection()

    channel.publish(EXCHANGE_NAME, 'elasticsearch', Buffer.from(JSON.stringify(data)), { persistent: true })

    await channel.close()
    await connection.close()
  }
}
