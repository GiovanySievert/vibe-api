import amqpManager, {
  type AmqpConnectionManager,
  type ChannelWrapper,
} from 'amqp-connection-manager'
import { RABBITMQ_URL, ensureExchange } from '@src/config/rabbitmq.config'

class RabbitMQConnection {
  private connection: AmqpConnectionManager | null = null
  private channel: ChannelWrapper | null = null

  getChannel(): ChannelWrapper {
    if (this.channel) return this.channel

    this.connection = amqpManager.connect([RABBITMQ_URL], {
      heartbeatIntervalInSeconds: 15,
      reconnectTimeInSeconds: 5,
    })

    this.connection.on('connect', () =>
      console.log('RabbitMQ connection established')
    )
    this.connection.on('disconnect', ({ err }) =>
      console.warn('RabbitMQ disconnected:', err?.message)
    )

    this.channel = this.connection.createChannel({
      json: false,
      confirm: true,
      setup: ensureExchange,
    })

    return this.channel
  }

  async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close().catch(() => {})
      this.channel = null
    }
    if (this.connection) {
      await this.connection.close().catch(() => {})
      this.connection = null
    }
  }
}

export const rabbitMQConnection = new RabbitMQConnection()
