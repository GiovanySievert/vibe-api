export interface UserReport {
  id: string
  reporterId: string
  reportedId: string
  reason: string
  description: string | null
  createdAt: Date
}
