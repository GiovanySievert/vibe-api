export interface FollowRequestQueryResult {
  followRequests: {
    id: string
    requesterId: string
    requestedId: string
    status: 'pending' | 'accepted' | 'rejected'
    createdAt: string
  }
  users: {
    username: string
    avatar: string
  }
}
