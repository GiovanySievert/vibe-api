export interface BlockedUserQueryResult {
  userBlocks: {
    id: string
    blockerId: string
    blockedId: string
    createdAt: Date
  }
  users: {
    id: string
    username: string
    avatar: string | null
  }
}
