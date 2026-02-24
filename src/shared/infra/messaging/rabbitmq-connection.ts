import amqp from 'amqplib'
import {
  RABBITMQ_URL,
  EXCHANGE_NAME,
  ELASTICSEARCH_QUEUE
} from '@src/config/rabbitmq.config'

type AMQPConnection = Awaited<ReturnType<typeof amqp.connect>>
type AMQPChannel = Awaited<ReturnType<AMQPConnection['createChannel']>>

class RabbitMQConnection {
  private connection: AMQPConnection | null = null
  private channel: AMQPChannel | null = null
  private connecting: Promise<void> | null = null

  async getChannel(): Promise<AMQPChannel> {
    if (this.channel) {
      return this.channel
    }

    if (this.connecting) {
      await this.connecting
      return this.channel!
    }

    this.connecting = this.connect()
    await this.connecting
    this.connecting = null

    return this.channel!
  }

  private async connect(): Promise<void> {
    this.connection = await amqp.connect(RABBITMQ_URL)

    this.connection.on('error', (err: Error) => {
      console.error('RabbitMQ connection error:', err)
      this.channel = null
      this.connection = null
    })

    this.connection.on('close', () => {
      console.log('RabbitMQ connection closed')
      this.channel = null
      this.connection = null
    })

    this.channel = await this.connection.createChannel()

    await this.channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true })
    await this.channel.assertQueue(ELASTICSEARCH_QUEUE, { durable: true })
    await this.channel.bindQueue(ELASTICSEARCH_QUEUE, EXCHANGE_NAME, 'elasticsearch')

    console.log('RabbitMQ connection established')
  }

  async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close()
      this.channel = null
    }
    if (this.connection) {
      await this.connection.close()
      this.connection = null
    }
  }
}

export const rabbitMQConnection = new RabbitMQConnection()
