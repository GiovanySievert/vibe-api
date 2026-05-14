import { Elysia } from 'elysia'
import { sql } from 'drizzle-orm'
import { db } from '@src/infra/database/client'
import { rabbitMQConnection } from '@src/shared/infra/messaging/rabbitmq-connection'

type DependencyStatus = 'ok' | 'error'

const checkDatabase = async (): Promise<{ status: DependencyStatus; error?: string }> => {
  try {
    await db.execute(sql`SELECT 1`)
    return { status: 'ok' }
  } catch (error) {
    return { status: 'error', error: (error as Error).message }
  }
}

const checkRabbitMQ = (): { status: DependencyStatus; error?: string } => {
  const channel = rabbitMQConnection.peekChannel()
  if (!channel) return { status: 'error', error: 'channel not initialized' }
  return rabbitMQConnection.isConnected()
    ? { status: 'ok' }
    : { status: 'error', error: 'not connected' }
}

export const healthRoutes = new Elysia({ prefix: '/health' })
  .get('/', () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  }))
  .get('/ready', async ({ set }) => {
    const [database, rabbitmq] = [await checkDatabase(), checkRabbitMQ()]
    const ready = database.status === 'ok' && rabbitmq.status === 'ok'

    if (!ready) set.status = 503

    return {
      status: ready ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      checks: { database, rabbitmq }
    }
  })
