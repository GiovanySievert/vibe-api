export interface EventQueryResult {
  events: {
    id: string
    ownerId: string
    name: string
    date: string
    time: string
    description: string | null
    shareToken: string
    createdAt: Date
    updatedAt: Date
  }
  participants: Array<{
    id: string
    userId: string
    username: string
    avatar: string | null
    status: string
  }>
}
