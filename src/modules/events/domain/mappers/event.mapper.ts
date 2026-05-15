import { users } from '@src/modules/auth/application/schemas'
import { EventParticipantStatus } from '../types'

export interface EventParticipant {
  id: string
  userId: string
  username: string
  avatar: string | null
  status: EventParticipantStatus
}

export interface EventPlaceSummary {
  id: string
  name: string
  type: string | null
  neighborhood: string | null
}

export interface Event {
  id: string
  ownerId: string
  name: string
  date: string
  time: string
  description: string | null
  place: EventPlaceSummary | null
  imageUrl: string | null
  createdAt: Date
  updatedAt: Date
  participants?: EventParticipant[]
}

export class EventMapper {
  static toEvent(row: any): Event {
    return {
      ...row,
      place: EventMapper.toPlaceSummary(row.place),
      participants: row.participants.map((p: any) => ({
        id: p.id,
        userId: p.userId,
        username: (p.user as typeof users.$inferSelect).username,
        avatar: (p.user as typeof users.$inferSelect).image,
        status: p.status
      }))
    }
  }

  static toPlaceSummary(place: any): EventPlaceSummary | null {
    if (!place) return null

    return {
      id: place.id,
      name: place.name,
      type: place.brand?.type ?? null,
      neighborhood: place.location?.neighborhood ?? null
    }
  }
}
