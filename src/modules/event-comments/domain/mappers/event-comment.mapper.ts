export interface EventComment {
  id: string
  eventId: string
  userId: string
  username: string
  avatar: string | null
  content: string
  createdAt: Date
}
