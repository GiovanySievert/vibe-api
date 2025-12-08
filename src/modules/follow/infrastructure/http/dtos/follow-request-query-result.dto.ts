export interface FollowRequestQueryResult {
  followRequests: {
    id: string
    requesterId: string
    requestedId: string
    status: string
    createdAt: Date
  }
  users: {
    id: string
    username: string
    avatar?: string | null
  }
}
