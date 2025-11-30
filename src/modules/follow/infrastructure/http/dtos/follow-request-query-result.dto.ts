export interface FollowRequestQueryResult {
  followRequests: {
    id: string
    requesterId: string
    requestedId: string
    status: string
    createdAt: Date
  }
  users: {
    username: string
  }
}
