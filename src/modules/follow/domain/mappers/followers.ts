import { followers } from '@src/infra/database/schema'

export type Followers = typeof followers.$inferSelect
