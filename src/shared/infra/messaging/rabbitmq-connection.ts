import amqpManager, {
  type AmqpConnectionManager,
  type ChannelWrapper,
} from 'amqp-connection-manager'
import { appLogger } from '@src/config/logger'
import { RABBITMQ_URL, ensureExchange } from '@src/config/rabbitmq.config'

class RabbitMQConnection {
  private connection: AmqpConnectionManager | null = null
  private channel: ChannelWrapper | null = null
  private connected = false

  peekChannel(): ChannelWrapper | null {
    return this.channel
  }

  isConnected(): boolean {
    return this.connected
  }

  getChannel(): ChannelWrapper {
    if (this.channel) return this.channel

    this.connection = amqpManager.connect([RABBITMQ_URL], {
      heartbeatIntervalInSeconds: 15,
      reconnectTimeInSeconds: 5,
    })

    this.connection.on('connect', () => {
      this.connected = true
      appLogger.info('RabbitMQ connection established')
    })
    this.connection.on('disconnect', ({ err }) => {
      this.connected = false
      appLogger.warn('RabbitMQ disconnected', { error: err })
    })

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
    this.connected = false
  }
}

export const rabbitMQConnection = new RabbitMQConnection()
