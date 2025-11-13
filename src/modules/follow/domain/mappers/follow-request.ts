import { followRequests } from '@src/infra/database/schema'

export type FollowRequests = typeof followRequests.$inferInsert
