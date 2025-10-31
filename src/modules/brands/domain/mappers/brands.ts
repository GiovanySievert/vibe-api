import { brands } from '@src/infra/database/schema'

export type Brand = typeof brands.$inferSelect
