import { EventParticipantStatus } from '../types'

export interface EventParticipant {
  id: string
  userId: string
  username: string
  avatar: string | null
  status: EventParticipantStatus
}

export interface Event {
  id: string
  ownerId: string
  name: string
  date: string
  time: string
  description: string | null
  createdAt: Date
  updatedAt: Date
  participants?: EventParticipant[]
}
