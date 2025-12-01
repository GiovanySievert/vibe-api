import amqp from 'amqplib'

export const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'
export const ELASTICSEARCH_QUEUE = 'elasticsearch_queue'
export const EXCHANGE_NAME = 'elasticsearch_exchange'

export async function createRabbitMQConnection() {
  const connection = await amqp.connect(RABBITMQ_URL)
  const channel = await connection.createChannel()

  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true })
  await channel.assertQueue(ELASTICSEARCH_QUEUE, { durable: true })
  await channel.bindQueue(ELASTICSEARCH_QUEUE, EXCHANGE_NAME, 'elasticsearch')

  return { connection, channel }
}
