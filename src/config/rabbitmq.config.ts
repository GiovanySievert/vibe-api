import type { ConfirmChannel } from 'amqplib'

export const RABBITMQ_URL =
  process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'

export const EXCHANGE = 'vibes.events'

export const PLACE_INDEXED_RK = 'place.indexed'
export const PLACE_REVIEW_CREATED_RK = 'place.review.created'
export const BADGE_EARNED_RK = 'badge.earned'

export async function ensureExchange(channel: ConfirmChannel): Promise<void> {
  await channel.assertExchange(EXCHANGE, 'topic', { durable: true })
}
